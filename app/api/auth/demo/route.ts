import { NextRequest, NextResponse } from "next/server"
import {
  authSessionResponse,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"
import { AppError } from "@/lib/http/errors"
import { errorResponse } from "@/lib/http/responses"
import { isDemoLoginRouteEnabled } from "@/lib/demo-login"
import { createEphemeralDemoSession } from "@/lib/services/auth/demo-auth-service"
import {
  checkRateLimit,
  demoLoginLimiter,
  getClientIdentifier,
  rateLimitHeaders,
} from "@/lib/rate-limit"

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  if (!isDemoLoginRouteEnabled()) {
    throw new AppError("Demo login is not available", 404, "not_found")
  }

  const limit = await checkRateLimit(getClientIdentifier(request), demoLoginLimiter)
  if (!limit.allowed) {
    const res = errorResponse(429, "validation_error", "Too many demo sign-in attempts. Try again later.")
    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(rateLimitHeaders(limit))) {
      headers.set(k, String(v))
    }
    return new NextResponse(res.body, { status: 429, headers })
  }

  const response = await createEphemeralDemoSession()
  const res = authSessionResponse(response)
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(rateLimitHeaders(limit))) {
    headers.set(k, String(v))
  }
  return new NextResponse(res.body, { status: res.status, headers })
})
