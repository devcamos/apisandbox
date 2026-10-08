#!/usr/bin/env node
/**
 * Guardrail: every ordinary table in schema `public` must have RLS enabled.
 *
 * Modes:
 *   --static   (default) Assert the hardening migration SQL is present and complete.
 *   --database Query Postgres (DATABASE_URL or DIRECT_URL) and fail if any public
 *              table has relrowsecurity = false. Used after db push / migrate in CI.
 *
 * Does not print connection strings or other secrets.
 */

import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath, pathToFileURL } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const HARDENING_MIGRATION_DIR = "prisma/migrations/20261008120000_enable_public_rls"
export const HARDENING_MIGRATION_SQL = path.join(
  HARDENING_MIGRATION_DIR,
  "migration.sql"
)

/** @returns {string} */
export function resolveHardeningMigrationPath(root = ROOT) {
  return path.join(root, HARDENING_MIGRATION_SQL)
}

/**
 * @param {string} sql
 * @returns {string[]}
 */
export function findHardeningMigrationGaps(sql) {
  const gaps = []
  const required = [
    {
      label: "ENABLE ROW LEVEL SECURITY loop over public tables",
      pattern: /ENABLE ROW LEVEL SECURITY/i,
    },
    {
      label: "pg_class / public schema table discovery",
      pattern: /pg_class[\s\S]*nspname\s*=\s*'public'|schemaname\s*=\s*'public'/i,
    },
    {
      label: "REVOKE from anon",
      pattern: /REVOKE ALL[\s\S]*FROM anon/i,
    },
    {
      label: "REVOKE from authenticated",
      pattern: /REVOKE ALL[\s\S]*FROM authenticated/i,
    },
    {
      label: "ALTER DEFAULT PRIVILEGES for anon",
      pattern: /ALTER DEFAULT PRIVILEGES[\s\S]*FROM anon/i,
    },
    {
      label: "ALTER DEFAULT PRIVILEGES for authenticated",
      pattern: /ALTER DEFAULT PRIVILEGES[\s\S]*FROM authenticated/i,
    },
    {
      label: "idempotent role existence check for anon",
      pattern: /pg_roles[\s\S]*rolname\s*=\s*'anon'/i,
    },
    {
      label: "idempotent role existence check for authenticated",
      pattern: /pg_roles[\s\S]*rolname\s*=\s*'authenticated'/i,
    },
  ]

  for (const item of required) {
    if (!item.pattern.test(sql)) {
      gaps.push(item.label)
    }
  }
  return gaps
}

/**
 * @param {string} [root]
 * @returns {{ ok: boolean, path: string, gaps: string[], error?: string }}
 */
export function checkHardeningMigrationStatic(root = ROOT) {
  const migrationPath = resolveHardeningMigrationPath(root)
  if (!fs.existsSync(migrationPath)) {
    return {
      ok: false,
      path: migrationPath,
      gaps: [],
      error: `Missing hardening migration at ${HARDENING_MIGRATION_SQL}`,
    }
  }

  const sql = fs.readFileSync(migrationPath, "utf8")
  const gaps = findHardeningMigrationGaps(sql)
  return {
    ok: gaps.length === 0,
    path: migrationPath,
    gaps,
  }
}

/**
 * @param {import("pg").Client} client
 * @returns {Promise<string[]>}
 */
export async function listPublicTablesWithoutRls(client) {
  const result = await client.query(`
    SELECT c.relname AS tablename
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND NOT c.relrowsecurity
    ORDER BY c.relname
  `)
  return result.rows.map((row) => String(row.tablename))
}

/**
 * Apply the hardening migration SQL, then assert every public table has RLS.
 *
 * @param {{ connectionString: string, root?: string, Client?: typeof import("pg").Client }} opts
 * @returns {Promise<{ ok: boolean, unprotected: string[], error?: string }>}
 */
export async function checkPublicRlsAgainstDatabase(opts) {
  const { connectionString, root = ROOT } = opts
  const { Client } = opts.Client ?? (await import("pg"))
  const migrationPath = resolveHardeningMigrationPath(root)

  if (!fs.existsSync(migrationPath)) {
    return {
      ok: false,
      unprotected: [],
      error: `Missing hardening migration at ${HARDENING_MIGRATION_SQL}`,
    }
  }

  const sql = fs.readFileSync(migrationPath, "utf8")
  const client = new Client({ connectionString })

  try {
    await client.connect()
    await client.query(sql)
    const unprotected = await listPublicTablesWithoutRls(client)
    return {
      ok: unprotected.length === 0,
      unprotected,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      unprotected: [],
      error: message,
    }
  } finally {
    await client.end().catch(() => {})
  }
}

/**
 * @typedef {Record<string, string | undefined>} EnvLike
 */

/**
 * @param {string[]} argv
 * @param {EnvLike} [env]
 * @returns {"static" | "database"}
 */
export function resolveCheckMode(argv, env = process.env) {
  if (argv.includes("--database") || env.CHECK_PUBLIC_RLS_DATABASE === "1") {
    return "database"
  }
  return "static"
}

/**
 * @param {string[]} [argv]
 * @param {EnvLike} [env]
 * @param {{ log?: (msg: string) => void, err?: (msg: string) => void, checkDb?: typeof checkPublicRlsAgainstDatabase }} [deps]
 * @returns {Promise<number>}
 */
export async function main(
  argv = process.argv.slice(2),
  env = process.env,
  deps = {}
) {
  const log = deps.log ?? ((msg) => process.stdout.write(`${msg}\n`))
  const err = deps.err ?? ((msg) => process.stderr.write(`${msg}\n`))
  const mode = resolveCheckMode(argv, env)

  if (mode === "static") {
    const result = checkHardeningMigrationStatic()
    if (!result.ok) {
      if (result.error) {
        err(`[check-public-rls] ${result.error}`)
      }
      for (const gap of result.gaps) {
        err(`[check-public-rls] Missing required hardening: ${gap}`)
      }
      return 1
    }
    log(`[check-public-rls] Static OK — ${HARDENING_MIGRATION_SQL}`)
    return 0
  }

  const connectionString = env.DIRECT_URL || env.DATABASE_URL
  if (!connectionString) {
    err("[check-public-rls] DATABASE_URL or DIRECT_URL is required for --database")
    return 1
  }

  const checkDb = deps.checkDb ?? checkPublicRlsAgainstDatabase
  const result = await checkDb({ connectionString })
  if (!result.ok) {
    if (result.error) {
      err(`[check-public-rls] ${result.error}`)
    }
    if (result.unprotected.length > 0) {
      err(
        `[check-public-rls] Public tables without RLS: ${result.unprotected.join(", ")}`
      )
    }
    return 1
  }

  log("[check-public-rls] Database OK — all public tables have RLS enabled")
  return 0
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  main().then((code) => process.exit(code))
}
