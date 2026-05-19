import { describe, expect, it } from "vitest"
import { Prisma } from "@prisma/client"
import { handleRouteError } from "@/lib/http/responses"

function prismaInitializationError() {
  return Object.assign(
    Object.create(Prisma.PrismaClientInitializationError.prototype),
    {
      name: "PrismaClientInitializationError",
      message: "Database unavailable",
      errorCode: "P1001",
      clientVersion: "test",
    },
  ) as Prisma.PrismaClientInitializationError
}

function prismaKnownRequestError(code: string) {
  return Object.assign(
    Object.create(Prisma.PrismaClientKnownRequestError.prototype),
    {
      name: "PrismaClientKnownRequestError",
      message: "Known request error",
      code,
      clientVersion: "test",
      meta: {},
    },
  ) as Prisma.PrismaClientKnownRequestError
}

describe("handleRouteError", () => {
  it("maps Prisma initialization failures to configuration_error", async () => {
    const response = handleRouteError(prismaInitializationError())
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body).toEqual({
      success: false,
      error: {
        category: "configuration_error",
        message: "Authentication service is temporarily unavailable",
      },
    })
  })

  it("maps Prisma schema drift failures to configuration_error", async () => {
    const response = handleRouteError(prismaKnownRequestError("P2021"))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body).toEqual({
      success: false,
      error: {
        category: "configuration_error",
        message: "Authentication service is temporarily unavailable",
      },
    })
  })

  it("preserves generic unknown_error for other Prisma request failures", async () => {
    const response = handleRouteError(prismaKnownRequestError("P2002"))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      success: false,
      error: {
        category: "unknown_error",
        message: "Unexpected server error",
      },
    })
  })
})
