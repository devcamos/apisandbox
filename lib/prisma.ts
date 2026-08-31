/**
 * Prisma Client Singleton
 *
 * Uses the Rust query engine (binary) with pooled Postgres URLs
 * (Supabase Preview / Neon Production / local Docker).
 * outputFileTracingIncludes in next.config.mjs ensures engines ship on Vercel.
 */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DATABASE_ENV_KEYS = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
] as const

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

export function getDatabaseUrlSource(): (typeof DATABASE_ENV_KEYS)[number] | undefined {
  for (const key of DATABASE_ENV_KEYS) {
    const value = process.env[key]
    if (!value) continue
    if (value.startsWith("prisma://") || value.startsWith("prisma+postgres://")) {
      continue
    }
    return key
  }
  return undefined
}

function resolveDatabaseUrl() {
  for (const key of DATABASE_ENV_KEYS) {
    const raw = process.env[key]
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
