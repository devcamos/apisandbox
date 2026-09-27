import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
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

  const protocols = {
    databaseUrl: urlProtocol(process.env.DATABASE_URL),
    postgresPrismaUrl: urlProtocol(process.env.POSTGRES_PRISMA_URL),
    resolved: urlProtocol(resolved),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    return okResponse({
      ok: true,
      hasDatabaseUrl,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      protocols,
    })
  } catch (error) {
    logger.error({ err: error }, "Database health check failed")
    return errorResponse(503, "configuration_error", "Database unavailable", {
      hasDatabaseUrl,
      protocols,
    })
  }
}
