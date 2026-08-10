import { getDatabaseUrlSource, prisma } from "@/lib/prisma"
import { okResponse, errorResponse } from "@/lib/http/responses"

export const runtime = "nodejs"

function urlProtocol(value: string | undefined) {
  if (!value) return "missing"
  return value.split(":")[0] ?? "unknown"
}

export async function GET() {
  const resolved = process.env.DATABASE_URL
  const source = getDatabaseUrlSource()
  const hasDatabaseUrl = Boolean(source)

  try {
    await prisma.$queryRaw`SELECT 1`
    return okResponse({
      ok: true,
      hasDatabaseUrl,
      source: source ?? "missing",
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
      source: source ?? "missing",
      protocols: {
        databaseUrl: urlProtocol(process.env.DATABASE_URL),
        postgresPrismaUrl: urlProtocol(process.env.POSTGRES_PRISMA_URL),
        resolved: urlProtocol(resolved),
      },
    })
  }
}
