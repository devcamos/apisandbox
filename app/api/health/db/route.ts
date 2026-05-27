import { prisma } from "@/lib/prisma"
import { okResponse, errorResponse } from "@/lib/http/responses"

export const runtime = "nodejs"

export async function GET() {
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
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error"
    return errorResponse(503, "configuration_error", message, { hasDatabaseUrl })
  }
}
