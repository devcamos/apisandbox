import { NextResponse, type NextRequest } from "next/server"
import { apiLimiter, checkRateLimit, rateLimitHeaders, type RateLimitResult } from "@/lib/rate-limit"
import { problemResponse } from "@/lib/api/v1/problem"
import { logger } from "@/lib/logger"

const API_LIMIT_PER_WINDOW = 100

/**
 * Per-token rate limit for `/api/v1`. When Upstash / the feature flag is off,
 * requests are allowed. When Upstash throws, fail open with a warning so token
 * clients are not locked out by infrastructure blips.
 */
export async function applyV1TokenRateLimit(
  request: NextRequest,
  tokenId: string,
  requestId: string,
): Promise<{ blocked: NextResponse } | { blocked: null; result: RateLimitResult }> {
  let result: RateLimitResult
  try {
    result = await checkRateLimit(`v1:${tokenId}`, apiLimiter)
  } catch (error) {
    logger.warn(
      { err: error, tokenId, requestId, route: request.nextUrl.pathname },
      "v1 rate limiter failed; allowing request",
    )
    return {
      blocked: null,
      result: { allowed: true, remaining: API_LIMIT_PER_WINDOW, resetAt: 0 },
    }
  }

  if (!result.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.resetAt - Date.now()) / 1000),
    )
    const headers = new Headers(rateLimitHeaders(result))
    headers.set("Retry-After", String(retryAfterSeconds))
    headers.set("RateLimit-Limit", String(API_LIMIT_PER_WINDOW))
    headers.set("RateLimit-Remaining", String(result.remaining))
    if (result.resetAt > 0) {
      headers.set("RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)))
    }

    return {
      blocked: problemResponse({
        status: 429,
        code: "rate_limited",
        detail: "Too many requests for this API token. Try again later.",
        instance: request.nextUrl.pathname,
        requestId,
        headers,
      }),
    }
  }

  return { blocked: null, result }
}

export function attachV1RateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
): NextResponse {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(rateLimitHeaders(result))) {
    headers.set(key, String(value))
  }
  if (result.resetAt > 0) {
    headers.set("RateLimit-Limit", String(API_LIMIT_PER_WINDOW))
    headers.set("RateLimit-Remaining", String(result.remaining))
    headers.set("RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)))
  }
  return new NextResponse(response.body, { status: response.status, headers })
}
