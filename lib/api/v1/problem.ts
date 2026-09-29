import { NextResponse } from "next/server"
import { REQUEST_ID_HEADER } from "@/lib/api/v1/request-id"

export type V1ProblemCode =
  | "missing_token"
  | "invalid_token"
  | "insufficient_scope"
  | "rate_limited"
  | "validation_error"
  | "not_found"
  | "unsupported_media_type"
  | "configuration_error"
  | "unknown_error"

export interface V1ProblemBody {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  code: V1ProblemCode
  requestId: string
  errors?: Array<{ path: string; message: string }>
}

const PROBLEM_TITLES: Record<V1ProblemCode, string> = {
  missing_token: "Authentication required",
  invalid_token: "Invalid API token",
  insufficient_scope: "Insufficient scope",
  rate_limited: "Too many requests",
  validation_error: "Validation failed",
  not_found: "Not found",
  unsupported_media_type: "Unsupported media type",
  configuration_error: "Service unavailable",
  unknown_error: "Unexpected server error",
}

function problemBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://apisandbox-coral.vercel.app"
  )
}

export function problemTypeUrl(code: V1ProblemCode) {
  return `${problemBaseUrl()}/problems/${code.replace(/_/g, "-")}`
}

export interface ProblemResponseOptions {
  status: number
  code: V1ProblemCode
  detail: string
  instance: string
  requestId: string
  errors?: V1ProblemBody["errors"]
  headers?: HeadersInit
  title?: string
}

export function problemResponse(options: ProblemResponseOptions): NextResponse {
  const body: V1ProblemBody = {
    type: problemTypeUrl(options.code),
    title: options.title ?? PROBLEM_TITLES[options.code],
    status: options.status,
    detail: options.detail,
    instance: options.instance,
    code: options.code,
    requestId: options.requestId,
    ...(options.errors?.length ? { errors: options.errors } : {}),
  }

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/problem+json")
  headers.set(REQUEST_ID_HEADER, options.requestId)

  return NextResponse.json(body, { status: options.status, headers })
}

export function zodIssuesToProblemErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): NonNullable<V1ProblemBody["errors"]> {
  return issues.map((issue) => ({
    path: issue.path.map(String).join(".") || "(root)",
    message: issue.message,
  }))
}
