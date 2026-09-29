/**
 * Prisma Client Singleton
 *
 * Uses the Rust query engine (binary) with pooled Neon/Vercel Postgres URLs.
 * outputFileTracingIncludes in next.config.mjs ensures engines ship on Vercel.
 *
 * Preview/Supabase session poolers cap concurrent clients (EMAXCONNSESSION at
 * pool_size ≈ 15). On Vercel each serverless isolate must reuse one PrismaClient
 * and open at most one connection — otherwise signup fails as
 * "Failed to initialize account data".
 */

import { PrismaClient } from "@prisma/client"
import { resolveDatabaseUrl } from "@/lib/prisma-url"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = resolveDatabaseUrl()
  if (connectionString) {
    process.env.DATABASE_URL = connectionString
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Always cache on globalThis so warm serverless isolates reuse one client
// (NODE_ENV is "production" on Vercel Preview — do not skip this).
globalForPrisma.prisma = prisma

export {
  normalizePooledDatabaseUrl,
  resolveDatabaseUrl,
  shouldLimitPrismaConnections,
} from "@/lib/prisma-url"
