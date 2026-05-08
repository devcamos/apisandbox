import { NextRequest, NextResponse } from "next/server"
import {
  authSessionResponse,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"
import { AppError } from "@/lib/http/errors"
import { errorResponse } from "@/lib/http/responses"
import { isDemoLoginRouteEnabled, getDemoUserEmail, getDemoUserPassword } from "@/lib/demo-login"
import { loginWithPassword } from "@/lib/services/auth/auth-service"
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

  const password = getDemoUserPassword()
  if (!password) {
    throw new AppError("Demo login is not configured", 503, "configuration_error")
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

  const response = await loginWithPassword({
    email: getDemoUserEmail(),
    password,
  })
  const res = authSessionResponse(response)
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(rateLimitHeaders(limit))) {
    headers.set(k, String(v))
  }
  return new NextResponse(res.body, { status: res.status, headers })
})
