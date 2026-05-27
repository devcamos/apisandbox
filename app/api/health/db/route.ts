import { prisma } from "@/lib/prisma"
import { okResponse, errorResponse } from "@/lib/http/responses"

export const runtime = "nodejs"

function urlProtocol(value: string | undefined) {
  if (!value) return "missing"
  return value.split(":")[0] ?? "unknown"
}

export async function GET() {
  const resolved = process.env.DATABASE_URL
  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL,
  )

  try {
    await prisma.$queryRaw`SELECT 1`
    return okResponse({
      ok: true,
      hasDatabaseUrl,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      protocols: {
        databaseUrl: urlProtocol(process.env.DATABASE_URL),
        postgresPrismaUrl: urlProtocol(process.env.POSTGRES_PRISMA_URL),
        resolved: urlProtocol(resolved),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error"
    return errorResponse(503, "configuration_error", message, {
      hasDatabaseUrl,
      protocols: {
        databaseUrl: urlProtocol(process.env.DATABASE_URL),
        postgresPrismaUrl: urlProtocol(process.env.POSTGRES_PRISMA_URL),
        resolved: urlProtocol(resolved),
      },
    })
  }
}
