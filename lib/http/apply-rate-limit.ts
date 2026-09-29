import { NextRequest, NextResponse } from "next/server"
import type { Ratelimit } from "@upstash/ratelimit"
import { errorResponse } from "@/lib/http/responses"
import {
  checkRateLimit,
  getClientIdentifier,
  rateLimitHeaders,
  type RateLimitResult,
} from "@/lib/rate-limit"

/** Human message for a 429, including how long to wait when known. */
export function rateLimitedMessage(resetAt: number, now: number = Date.now()): string {
  const minutes = resetAt > now ? Math.ceil((resetAt - now) / 60_000) : 0
  if (minutes <= 0) return "Too many requests. Try again later."
  const unit = minutes === 1 ? "minute" : "minutes"
  return `Too many requests. Try again in ${minutes} ${unit}.`
}

/**
 * Apply a rate limit before running a route handler.
 * Returns a 429 response when exceeded, or null when allowed.
 */
export async function applyRateLimit(
  request: NextRequest,
  limiter: Ratelimit | null,
  identifier?: string,
): Promise<{ blocked: NextResponse } | { blocked: null; result: RateLimitResult }> {
  const id = identifier ?? getClientIdentifier(request)
  const result = await checkRateLimit(id, limiter)

  if (!result.allowed) {
    const res = errorResponse(429, "rate_limited", rateLimitedMessage(result.resetAt))
    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(rateLimitHeaders(result))) {
      headers.set(k, String(v))
    }
    return { blocked: new NextResponse(res.body, { status: 429, headers }) }
  }

  return { blocked: null, result }
}

export function attachRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
  const headers = new Headers(response.headers)
  for (const [k, v] of Object.entries(rateLimitHeaders(result))) {
    headers.set(k, String(v))
  }
  return new NextResponse(response.body, { status: response.status, headers })
}
