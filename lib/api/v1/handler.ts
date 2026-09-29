import { NextRequest, NextResponse } from "next/server"
import { AppError } from "@/lib/http/errors"
import { logger } from "@/lib/logger"
import type { ApiTokenScope } from "@/lib/api-tokens/token-types"
import {
  attachV1RateLimitHeaders,
  applyV1TokenRateLimit,
} from "@/lib/api/v1/rate-limit"
import { problemResponse, zodIssuesToProblemErrors, type V1ProblemCode } from "@/lib/api/v1/problem"
import { REQUEST_ID_HEADER, resolveRequestId } from "@/lib/api/v1/request-id"
import {
  requireApiToken,
  V1AuthError,
  type ApiTokenPrincipal,
} from "@/lib/api/v1/require-api-token"
import type { z } from "zod"

export interface V1RouteContext {
  request: NextRequest
  requestId: string
  auth: ApiTokenPrincipal
  params: Record<string, string>
}

type V1Handler = (ctx: V1RouteContext) => Promise<NextResponse>

interface V1RouteOptions {
  scope: ApiTokenScope
}

function withRequestId(response: NextResponse, requestId: string): NextResponse {
  const headers = new Headers(response.headers)
  headers.set(REQUEST_ID_HEADER, requestId)
  return new NextResponse(response.body, { status: response.status, headers })
}

function appErrorToProblemCode(error: AppError): V1ProblemCode {
  if (error.status === 404) return "not_found"
  if (error.status === 400) return "validation_error"
  if (error.status === 401) return "invalid_token"
  if (error.status === 403) return "insufficient_scope"
  return "unknown_error"
}

function mapRouteError(
  error: unknown,
  request: NextRequest,
  requestId: string,
): NextResponse {
  const instance = request.nextUrl.pathname

  if (error instanceof V1AuthError) {
    return problemResponse({
      status: error.status,
      code: error.code,
      detail: error.detail,
      instance,
      requestId,
    })
  }

  if (error instanceof AppError) {
    const details = Array.isArray(error.details)
      ? zodIssuesToProblemErrors(
          error.details as Array<{ path: PropertyKey[]; message: string }>,
        )
      : undefined
    return problemResponse({
      status: error.status,
      code: appErrorToProblemCode(error),
      detail: error.message,
      instance,
      requestId,
      errors: details,
    })
  }

  logger.error(
    { err: error, requestId, route: instance },
    "Unhandled /api/v1 route error",
  )
  return problemResponse({
    status: 500,
    code: "unknown_error",
    detail: "Unexpected server error",
    instance,
    requestId,
  })
}

/**
 * Wrap a versioned public API handler: request ID, token auth, scope, rate limit.
 */
export function withV1Auth(options: V1RouteOptions, handler: V1Handler) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<Record<string, string>> | Record<string, string> },
  ): Promise<NextResponse> => {
    const requestId = resolveRequestId(request)
    const started = Date.now()
    let tokenId: string | undefined
    let status = 500

    try {
      const auth = await requireApiToken(request, options.scope)
      tokenId = auth.tokenId

      const rate = await applyV1TokenRateLimit(request, auth.tokenId, requestId)
      if (rate.blocked) {
        status = 429
        return rate.blocked
      }

      const rawParams = context?.params
      const params = rawParams
        ? await Promise.resolve(rawParams)
        : {}

      const response = await handler({
        request,
        requestId,
        auth,
        params,
      })
      status = response.status
      return attachV1RateLimitHeaders(withRequestId(response, requestId), rate.result)
    } catch (error) {
      const response = mapRouteError(error, request, requestId)
      status = response.status
      return response
    } finally {
      logger.info(
        {
          requestId,
          method: request.method,
          route: request.nextUrl.pathname,
          status,
          durationMs: Date.now() - started,
          tokenId,
        },
        "api.v1.request",
      )
    }
  }
}

export function v1Json<T>(data: T, requestId: string, status = 200, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers)
  responseHeaders.set(REQUEST_ID_HEADER, requestId)
  responseHeaders.set("Content-Type", "application/json")
  return NextResponse.json(data, { status, headers: responseHeaders })
}

export async function parseV1JsonBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
  requestId: string,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: problemResponse({
        status: 415,
        code: "unsupported_media_type",
        detail: "Content-Type must be application/json",
        instance: request.nextUrl.pathname,
        requestId,
      }),
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return {
      ok: false,
      response: problemResponse({
        status: 400,
        code: "validation_error",
        detail: "Request body must be valid JSON",
        instance: request.nextUrl.pathname,
        requestId,
      }),
    }
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return {
      ok: false,
      response: problemResponse({
        status: 400,
        code: "validation_error",
        detail: "Invalid request payload",
        instance: request.nextUrl.pathname,
        requestId,
        errors: zodIssuesToProblemErrors(parsed.error.issues),
      }),
    }
  }

  return { ok: true, data: parsed.data }
}
