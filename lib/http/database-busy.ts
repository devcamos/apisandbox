import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { AppError } from "@/lib/http/errors"

export const DATABASE_BUSY_CODE = "DATABASE_BUSY" as const

/** Friendly copy for auth UIs when the DB pool is saturated. */
export const DATABASE_BUSY_MESSAGE =
  "The database is busy. Please wait a moment and try again."

/** Seconds for Retry-After when we know the pool is saturated. */
export const DATABASE_BUSY_RETRY_AFTER_SECONDS = 2

/** Supabase/Neon session-pool exhaustion (and similar capacity errors). */
export function isDatabaseCapacityError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "")
  return (
    message.includes("EMAXCONNSESSION") ||
    message.includes("max clients reached") ||
    message.includes("too many clients") ||
    message.includes("remaining connection slots") ||
    message.includes("MaxClientsInSessionMode")
  )
}

export function isPrismaDatabaseBusyError(error: unknown): boolean {
  if (isDatabaseCapacityError(error)) return true
  return error instanceof Prisma.PrismaClientInitializationError
}

export function databaseBusyAppError(): AppError {
  return new AppError(DATABASE_BUSY_MESSAGE, 503, "configuration_error", {
    code: DATABASE_BUSY_CODE,
  })
}

export function isDatabaseBusyAppError(error: unknown): error is AppError {
  if (!(error instanceof AppError)) return false
  const details = error.details
  if (!details || typeof details !== "object") return false
  return (details as { code?: string }).code === DATABASE_BUSY_CODE
}

/** 503 JSON body + Retry-After for clients/load tests to back off. */
export function databaseBusyResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        category: "configuration_error",
        message: DATABASE_BUSY_MESSAGE,
        details: { code: DATABASE_BUSY_CODE },
      },
    },
    {
      status: 503,
      headers: {
        "Retry-After": String(DATABASE_BUSY_RETRY_AFTER_SECONDS),
      },
    },
  )
}
