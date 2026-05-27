/**
 * Prisma Client Singleton
 *
 * Uses the Prisma driver adapter (no Rust query-engine binary) so deploys work
 * on Vercel/Next.js 16 standalone without bundling libquery_engine.
 */

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function normalizePooledDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url)
    const isPooler = parsed.hostname.includes("pooler")

    if (isPooler && !parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true")
    }

    return parsed.toString()
  } catch {
    return url
  }
}

function resolveDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
  ]

  for (const raw of candidates) {
    if (!raw) continue
    if (raw.startsWith("prisma://") || raw.startsWith("prisma+postgres://")) {
      continue
    }
    return normalizePooledDatabaseUrl(raw)
  }

  return undefined
}

function createPrismaClient() {
  const connectionString = resolveDatabaseUrl()
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL (or POSTGRES_PRISMA_URL) must be set to a postgresql:// connection string",
    )
  }

  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
