/**
 * Prisma Client Singleton
 *
 * Uses the Rust query engine (binary) with pooled Neon/Vercel Postgres URLs.
 * outputFileTracingIncludes in next.config.mjs ensures engines ship on Vercel.
 */

import { PrismaClient } from "@prisma/client"

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
  if (connectionString) {
    process.env.DATABASE_URL = connectionString
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
