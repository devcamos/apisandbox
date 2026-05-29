import { NextRequest } from "next/server"
import { z } from "zod"
import { loginWithPassword } from "@/lib/services/auth/auth-service"
import {
  authSessionResponse,
  parseJsonBody,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"
import { applyRateLimit, attachRateLimitHeaders } from "@/lib/http/apply-rate-limit"
import { authLimiter } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const rate = await applyRateLimit(request, authLimiter)
  if (rate.blocked) return rate.blocked

  const parsed = await parseJsonBody(request, schema, "Invalid login payload")
  if (!parsed.ok) return parsed.response

  const response = await loginWithPassword(parsed.data)
  return attachRateLimitHeaders(authSessionResponse(response), rate.result)
})
