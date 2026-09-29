import { describe, expect, it, vi } from "vitest"

const loggerError = vi.hoisted(() => vi.fn())

vi.mock("@/lib/logger", () => ({
  logger: {
    error: loggerError,
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

import { prisma } from "@/lib/prisma"
import { GET } from "@/app/api/health/db/route"

describe("GET /api/health/db", () => {
  it("returns a generic 503 message and logs the raw error", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(
      new Error("password authentication failed for user \"postgres\""),
    )

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.success).toBe(false)
    expect(body.error.message).toBe("Database unavailable")
    expect(JSON.stringify(body)).not.toContain("password authentication failed")
    expect(loggerError).toHaveBeenCalled()
  })
})
