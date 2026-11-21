#!/usr/bin/env node
/**
 * Explicit Preview-only `prisma migrate deploy`.
 *
 * Never called from Vercel builds (`migrate-on-production.mjs` still skips Preview).
 * Use for the isolated Preview database (Supabase `apisandbox-preview-db`) only.
 *
 * Safety gates (all required):
 * - CONFIRM_PREVIEW_MIGRATE=YES
 * - VERCEL_ENV / ENVIRONMENT must not be production
 * - DATABASE_URL (and DIRECT_URL when set) host must pass allow/deny checks
 *
 * Defaults match this repository's topology: Preview is Supabase; Production is Neon.
 * Override with PREVIEW_DB_HOST_ALLOWLIST / PREVIEW_DB_HOST_DENYLIST (comma-separated
 * hostname suffixes). Localhost is denied unless ALLOW_LOCAL_PREVIEW_MIGRATE=1.
 *
 * Usage:
 *   CONFIRM_PREVIEW_MIGRATE=YES DATABASE_URL=... DIRECT_URL=... npm run db:migrate:preview
 *
 * Never prints connection strings or secrets.
 */

import { spawnSync } from "node:child_process"
import process from "node:process"
import { pathToFileURL } from "node:url"

import { ensureDirectUrlEnv, runPrismaMigrateDeploy } from "./migrate-on-production.mjs"

/**
 * @typedef {Record<string, string | undefined>} EnvLike
 */

/**
 * @param {string | undefined} raw
 * @returns {string[]}
 */
export function parseHostList(raw) {
  if (!raw || !String(raw).trim()) return []
  return String(raw)
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * @param {string | undefined} connectionString
 * @returns {string | null} hostname lowercased, or null when unset/unparseable
 */
export function hostnameFromDatabaseUrl(connectionString) {
  if (!connectionString || !String(connectionString).trim()) return null
  try {
    const normalized = String(connectionString).replace(/^postgres(ql)?:/i, "http:")
    const host = new URL(normalized).hostname
    return host ? host.toLowerCase() : null
  } catch {
    return null
  }
}

/**
 * @param {string} hostname
 * @param {string[]} suffixes
 */
export function hostMatchesSuffix(hostname, suffixes) {
  const host = hostname.toLowerCase()
  return suffixes.some((suffix) => {
    const needle = suffix.toLowerCase().replace(/^\./, "")
    return host === needle || host.endsWith(`.${needle}`)
  })
}

/**
 * @param {EnvLike} [env]
 * @returns {{ allow: string[], deny: string[], allowLocal: boolean }}
 */
export function previewHostPolicy(env = process.env) {
  const allow = parseHostList(env.PREVIEW_DB_HOST_ALLOWLIST)
  const deny = parseHostList(env.PREVIEW_DB_HOST_DENYLIST)
  return {
    allow: allow.length > 0 ? allow : ["supabase.co", "supabase.com"],
    deny: deny.length > 0 ? deny : ["neon.tech"],
    allowLocal: env.ALLOW_LOCAL_PREVIEW_MIGRATE === "1",
  }
}

/**
 * @param {string | null} hostname
 * @param {{ allow: string[], deny: string[], allowLocal: boolean }} policy
 * @returns {{ ok: boolean, reason: string }}
 */
export function evaluatePreviewHostname(hostname, policy) {
  if (!hostname) {
    return { ok: false, reason: "DATABASE_URL host is missing or unparseable" }
  }

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    if (policy.allowLocal) {
      return { ok: true, reason: `localhost allowed via ALLOW_LOCAL_PREVIEW_MIGRATE=1 (${hostname})` }
    }
    return {
      ok: false,
      reason: `refusing localhost host ${hostname} (set ALLOW_LOCAL_PREVIEW_MIGRATE=1 for disposable local fixtures only)`,
    }
  }

  if (hostMatchesSuffix(hostname, policy.deny)) {
    return {
      ok: false,
      reason: `host ${hostname} matches Preview deny list (${policy.deny.join(", ")}) — refusing Production-like target`,
    }
  }

  if (!hostMatchesSuffix(hostname, policy.allow)) {
    return {
      ok: false,
      reason: `host ${hostname} is not on Preview allow list (${policy.allow.join(", ")})`,
    }
  }

  return { ok: true, reason: `host ${hostname} matches Preview allow list` }
}

/**
 * Decide whether Preview migrate is allowed. Never returns connection secrets.
 *
 * @param {EnvLike} [env]
 * @returns {{ run: boolean, reason: string, hostnames: string[] }}
 */
export function decidePreviewMigrateDeploy(env = process.env) {
  const confirm = (env.CONFIRM_PREVIEW_MIGRATE || "").trim()
  if (confirm !== "YES") {
    return {
      run: false,
      reason:
        'CONFIRM_PREVIEW_MIGRATE must be exactly "YES" (explicit operator step; refuses silent migrate)',
      hostnames: [],
    }
  }

  const vercelEnv = (env.VERCEL_ENV || "").toLowerCase().trim()
  const environment = (env.ENVIRONMENT || "").toLowerCase().trim()
  if (vercelEnv === "production" || environment === "production") {
    return {
      run: false,
      reason: "refusing migrate: VERCEL_ENV/ENVIRONMENT indicates production",
      hostnames: [],
    }
  }

  if (!env.DATABASE_URL || !String(env.DATABASE_URL).trim()) {
    return {
      run: false,
      reason: "DATABASE_URL is required for Preview migrate",
      hostnames: [],
    }
  }

  const policy = previewHostPolicy(env)
  const hosts = []
  const databaseHost = hostnameFromDatabaseUrl(env.DATABASE_URL)
  hosts.push(databaseHost || "(unparseable DATABASE_URL)")
  const databaseCheck = evaluatePreviewHostname(databaseHost, policy)
  if (!databaseCheck.ok) {
    return { run: false, reason: databaseCheck.reason, hostnames: hosts }
  }

  if (env.DIRECT_URL && String(env.DIRECT_URL).trim()) {
    const directHost = hostnameFromDatabaseUrl(env.DIRECT_URL)
    hosts.push(directHost || "(unparseable DIRECT_URL)")
    const directCheck = evaluatePreviewHostname(directHost, policy)
    if (!directCheck.ok) {
      return {
        run: false,
        reason: `DIRECT_URL rejected: ${directCheck.reason}`,
        hostnames: hosts,
      }
    }
  }

  return {
    run: true,
    reason: `Preview migrate approved (${databaseCheck.reason})`,
    hostnames: hosts.filter((h) => !h.startsWith("(")),
  }
}

/**
 * @param {{ run: boolean, reason: string, hostnames?: string[] }} decision
 * @param {{ log?: (msg: string) => void, migrate?: () => number, env?: EnvLike }} [deps]
 * @returns {number}
 */
export function runPreviewMigrateIfAllowed(decision, deps = {}) {
  const log = deps.log ?? ((msg) => process.stdout.write(`${msg}\n`))
  const env = ensureDirectUrlEnv(deps.env ?? process.env)
  const migrate =
    deps.migrate ?? (() => runPrismaMigrateDeploy(env))

  if (!decision.run) {
    log(`[migrate-on-preview] Refusing Preview migrate: ${decision.reason}`)
    return 1
  }

  const hostNote =
    decision.hostnames && decision.hostnames.length > 0
      ? ` hosts=${decision.hostnames.join(",")}`
      : ""
  log(`[migrate-on-preview] Running prisma migrate deploy:${hostNote} — ${decision.reason}`)
  return migrate()
}

/**
 * Optional status probe (does not print secrets).
 * @param {EnvLike} [env]
 * @returns {number}
 */
export function runPreviewMigrateStatus(env = process.env) {
  const migrateEnv = ensureDirectUrlEnv(env)
  const result = spawnSync("npx", ["prisma", "migrate", "status"], {
    stdio: "inherit",
    env: migrateEnv,
    shell: false,
  })
  if (result.error) {
    process.stderr.write(`${result.error.message}\n`)
    return 1
  }
  return result.status ?? 1
}

function main() {
  const decision = decidePreviewMigrateDeploy(process.env)
  if (process.argv.includes("--status-only")) {
    if (!decision.run) {
      process.stderr.write(`[migrate-on-preview] ${decision.reason}\n`)
      process.exit(1)
    }
    process.exit(runPreviewMigrateStatus(process.env))
  }
  process.exit(runPreviewMigrateIfAllowed(decision))
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  main()
}
