/**
 * DATABASE_URL helpers for Prisma on serverless / PgBouncer.
 * Kept separate from the client singleton so unit tests can import without
 * constructing PrismaClient.
 */

/** Env bag used by URL helpers (subset of process.env). */
export type PrismaUrlEnv = Record<string, string | undefined>

/** True when this process should limit itself to a single DB connection. */
export function shouldLimitPrismaConnections(
  hostname: string,
  env: PrismaUrlEnv = process.env,
): boolean {
  if (env.VERCEL === "1") return true
  if (hostname.includes("pooler")) return true
  return false
}

/**
 * Normalize DATABASE_URL for Prisma + PgBouncer / serverless.
 * Preview Supabase session poolers reject excess clients (EMAXCONNSESSION).
 */
export function normalizePooledDatabaseUrl(
  url: string,
  env: PrismaUrlEnv = process.env,
): string {
  try {
    const parsed = new URL(url)
    const isPooler = parsed.hostname.includes("pooler")

    if (isPooler && !parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true")
    }

    if (
      shouldLimitPrismaConnections(parsed.hostname, env) &&
      !parsed.searchParams.has("connection_limit")
    ) {
      parsed.searchParams.set("connection_limit", "1")
    }

    return parsed.toString()
  } catch {
    return url
  }
}

export function resolveDatabaseUrl(env: PrismaUrlEnv = process.env): string | undefined {
  const candidates = [env.DATABASE_URL, env.POSTGRES_PRISMA_URL, env.POSTGRES_URL]

  for (const raw of candidates) {
    if (!raw) continue
    if (raw.startsWith("prisma://") || raw.startsWith("prisma+postgres://")) {
      continue
    }
    return normalizePooledDatabaseUrl(raw, env)
  }

  return undefined
}
