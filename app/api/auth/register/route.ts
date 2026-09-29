import { NextRequest } from "next/server"
import { z } from "zod"
import { registerWithPassword } from "@/lib/services/auth/auth-service"
import {
  authSessionResponse,
  parseJsonBody,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"
import { applyRateLimit, attachRateLimitHeaders } from "@/lib/http/apply-rate-limit"
import { signupLimiter } from "@/lib/rate-limit"
import { splitFullName } from "@/lib/user-name"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  __testForceBootstrapFail: z.boolean().optional(),
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const rate = await applyRateLimit(request, signupLimiter)
  if (rate.blocked) return rate.blocked

  const parsed = await parseJsonBody(request, schema, "Invalid register payload")
  if (!parsed.ok) return parsed.response

  const fallback = splitFullName(parsed.data.name)
  const response = await registerWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
    firstName: parsed.data.firstName ?? fallback.firstName ?? undefined,
    lastName: parsed.data.lastName ?? fallback.lastName ?? undefined,
    forceBootstrapFailure:
      process.env.NODE_ENV !== "production" && parsed.data.__testForceBootstrapFail === true,
  })

  return attachRateLimitHeaders(authSessionResponse(response, 201), rate.result)
})
