import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { AppError } from "@/lib/http/errors"
import { logger } from "@/lib/logger"

export function okResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function errorResponse(
  status: number,
  category: string,
  message: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        category,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status }
  )
}

export function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(error.status, error.category, error.message, error.details)
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error(
      {
        err: error,
        category: "configuration_error",
      },
      "Prisma initialization failed",
    )
    return errorResponse(
      503,
      "configuration_error",
      "Authentication service is temporarily unavailable",
    )
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const isSchemaDrift =
      error.code === "P2021" || error.code === "P2022"

    logger.error(
      {
        err: error,
        category: isSchemaDrift ? "configuration_error" : "unknown_error",
        prismaCode: error.code,
      },
      "Prisma request failed",
    )

    if (isSchemaDrift) {
      return errorResponse(
        503,
        "configuration_error",
        "Authentication service is temporarily unavailable",
      )
    }
  }

  logger.error({ err: error }, "Unhandled route error")

  return errorResponse(500, "unknown_error", "Unexpected server error")
}
