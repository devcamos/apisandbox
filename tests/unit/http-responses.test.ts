import { describe, expect, it } from "vitest"
import { Prisma } from "@prisma/client"
import { handleRouteError } from "@/lib/http/responses"
import {
  DATABASE_BUSY_CODE,
  DATABASE_BUSY_MESSAGE,
  DATABASE_BUSY_RETRY_AFTER_SECONDS,
  databaseBusyAppError,
  isDatabaseCapacityError,
} from "@/lib/http/database-busy"

function prismaInitializationError(message = "Database unavailable") {
  return Object.assign(
    Object.create(Prisma.PrismaClientInitializationError.prototype),
    {
      name: "PrismaClientInitializationError",
      message,
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

describe("isDatabaseCapacityError", () => {
  it("detects EMAXCONNSESSION", () => {
    expect(
      isDatabaseCapacityError(
        new Error("FATAL: (EMAXCONNSESSION) max clients reached in session mode"),
      ),
    ).toBe(true)
  })
})

describe("handleRouteError", () => {
  it("maps Prisma initialization / pool exhaustion to DATABASE_BUSY with Retry-After", async () => {
    const response = handleRouteError(
      prismaInitializationError(
        "Error querying the database: FATAL: (EMAXCONNSESSION) max clients reached in session mode",
      ),
    )
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(response.headers.get("Retry-After")).toBe(String(DATABASE_BUSY_RETRY_AFTER_SECONDS))
    expect(body).toEqual({
      success: false,
      error: {
        category: "configuration_error",
        message: DATABASE_BUSY_MESSAGE,
        details: { code: DATABASE_BUSY_CODE },
      },
    })
  })

  it("maps databaseBusyAppError the same way", async () => {
    const response = handleRouteError(databaseBusyAppError())
    const body = await response.json()
    expect(response.status).toBe(503)
    expect(response.headers.get("Retry-After")).toBe(String(DATABASE_BUSY_RETRY_AFTER_SECONDS))
    expect(body.error.details.code).toBe(DATABASE_BUSY_CODE)
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
