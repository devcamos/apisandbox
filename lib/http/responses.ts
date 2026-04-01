import { NextResponse } from "next/server"
import { AppError } from "@/lib/http/errors"

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
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  )
}

export function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(error.status, error.category, error.message, error.details)
  }

  return errorResponse(500, "unknown_error", "Unexpected server error")
}

