#!/usr/bin/env node
/**
 * Vercel build helper: run `prisma migrate deploy` only for Production.
 *
 * Preview and Development builds skip migrations so an unreachable Preview DB
 * cannot fail `next build`. Production always migrates.
 *
 * Fail-safe: if we are on Vercel but VERCEL_ENV is missing or unrecognized
 * (not preview/development), migrate anyway so a mis-detected production
 * deploy never ships against an unmigrated schema.
 *
 * Production migrate goes through `scripts/prisma-migrate-deploy.sh` so
 * DIRECT_URL falls back to DATABASE_URL when unset (Prisma schema requires it).
 *
 * Usage: npm run db:migrate:deploy:vercel
 * Manual Preview migrate (when the Preview DB is reachable):
 *   DATABASE_URL=... npm run db:migrate:deploy
 */

import { spawnSync } from "node:child_process"
import process from "node:process"
import { pathToFileURL } from "node:url"

/**
 * @typedef {Record<string, string | undefined>} EnvLike
 */

/**
 * Prisma schema requires DIRECT_URL. When only DATABASE_URL is set (common on
 * Production before a dedicated direct/session URL is configured), reuse it.
 *
 * @param {EnvLike} [env]
 * @returns {EnvLike}
 */
export function ensureDirectUrlEnv(env = process.env) {
  const next = { ...env }
  if (!next.DIRECT_URL && next.DATABASE_URL) {
    next.DIRECT_URL = next.DATABASE_URL
  }
  return next
}

/**
 * @param {EnvLike} [env]
 * @returns {{ run: boolean, reason: string }}
 */
export function decideMigrateDeploy(env = process.env) {
  const vercelEnv = (env.VERCEL_ENV || "").toLowerCase().trim()
  const onVercel = env.VERCEL === "1" || env.VERCEL === "true"

  if (vercelEnv === "preview") {
    return {
      run: false,
      reason:
        "VERCEL_ENV=preview — skipping prisma migrate deploy (Preview schema is applied manually)",
    }
  }

  if (vercelEnv === "development") {
    return {
      run: false,
      reason: "VERCEL_ENV=development — skipping prisma migrate deploy",
    }
  }

  if (vercelEnv === "production") {
    return {
      run: true,
      reason: "VERCEL_ENV=production — running prisma migrate deploy",
    }
  }

  // Fail-safe: on Vercel without an explicit non-prod env, prefer migrate.
  if (onVercel) {
    return {
      run: true,
      reason: `VERCEL is set but VERCEL_ENV=${vercelEnv || "(unset)"} — running prisma migrate deploy as a production fail-safe`,
    }
  }

  return {
    run: false,
    reason:
      "Not on Vercel (VERCEL unset) and VERCEL_ENV is not production — skipping prisma migrate deploy",
  }
}

/**
 * Default migrate implementation: bash wrapper with DIRECT_URL fallback.
 * @param {EnvLike} [env]
 * @returns {number}
 */
export function runPrismaMigrateDeploy(env = process.env) {
  const migrateEnv = ensureDirectUrlEnv(env)
  const result = spawnSync("bash", ["scripts/prisma-migrate-deploy.sh"], {
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

/**
 * @param {{ run: boolean, reason: string }} decision
 * @param {{ log?: (msg: string) => void, migrate?: () => number }} [deps]
 * @returns {number} process exit code
 */
export function runMigrateIfNeeded(decision, deps = {}) {
  const log = deps.log ?? ((msg) => process.stdout.write(`${msg}\n`))
  const migrate = deps.migrate ?? (() => runPrismaMigrateDeploy(process.env))

  if (decision.run) {
    log(`[migrate-on-production] Running migrations: ${decision.reason}`)
    return migrate()
  }

  log(`[migrate-on-production] Skipping migrations: ${decision.reason}`)
  return 0
}

function main() {
  const decision = decideMigrateDeploy(process.env)
  const code = runMigrateIfNeeded(decision)
  process.exit(code)
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  main()
}
