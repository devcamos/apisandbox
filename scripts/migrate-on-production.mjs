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
 * Usage: npm run db:migrate:deploy:vercel
 * Manual Preview migrate (when the Preview DB is reachable):
 *   DATABASE_URL=... npx prisma migrate deploy
 */

import { spawnSync } from "node:child_process"
import process from "node:process"
import { pathToFileURL } from "node:url"

/**
 * @param {NodeJS.ProcessEnv} [env]
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
 * @param {{ run: boolean, reason: string }} decision
 * @param {{ log?: (msg: string) => void, migrate?: () => number }} [deps]
 * @returns {number} process exit code
 */
export function runMigrateIfNeeded(decision, deps = {}) {
  const log = deps.log ?? ((msg) => process.stdout.write(`${msg}\n`))
  const migrate =
    deps.migrate ??
    (() => {
      const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
        stdio: "inherit",
        env: process.env,
        shell: false,
      })
      if (result.error) {
        process.stderr.write(`${result.error.message}\n`)
        return 1
      }
      return result.status ?? 1
    })

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
