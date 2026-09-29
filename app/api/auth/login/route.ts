import { NextRequest } from "next/server"
import { z } from "zod"
import { loginWithPassword } from "@/lib/services/auth/auth-service"
import {
  authSessionResponse,
  parseJsonBody,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"
import { AppError } from "@/lib/http/errors"
import { applyRateLimit, attachRateLimitHeaders } from "@/lib/http/apply-rate-limit"
import { authLimiter, demoLoginLimiter, getClientIdentifier } from "@/lib/rate-limit"
import { isDemoLoginRouteEnabled, isPublicDemoLoginAttempt } from "@/lib/demo-login"
import { createEphemeralDemoSession } from "@/lib/services/auth/demo-auth-service"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const parsed = await parseJsonBody(request, schema, "Invalid login payload")
  if (!parsed.ok) return parsed.response

  const email = parsed.data.email.trim().toLowerCase()

  // Public demo account typed into the normal form -> ephemeral Phase 1 demo.
  if (isPublicDemoLoginAttempt(email)) {
    if (!isDemoLoginRouteEnabled()) {
      throw new AppError("Demo sign-in is not enabled on this deployment", 404, "not_found", {
        code: "DEMO_DISABLED",
      })
    }
    if (isPublicDemoLoginAttempt(email, parsed.data.password)) {
      const rate = await applyRateLimit(request, demoLoginLimiter)
      if (rate.blocked) return rate.blocked
      const demo = await createEphemeralDemoSession()
      return attachRateLimitHeaders(authSessionResponse(demo), rate.result)
    }
  }

  const rate = await applyRateLimit(
    request,
    authLimiter,
    `${getClientIdentifier(request)}:${email}`,
  )
  if (rate.blocked) return rate.blocked

  const response = await loginWithPassword({ email, password: parsed.data.password })
  return attachRateLimitHeaders(authSessionResponse(response), rate.result)
})
