import type { NextRequest } from "next/server"
import type { Ratelimit } from "@upstash/ratelimit"
import { assertPhaseAccessForUser } from "@/lib/auth/demo-guards"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { applyRateLimit } from "@/lib/http/apply-rate-limit"
import { handleRouteError } from "@/lib/http/responses"
import type { PhaseId } from "@/lib/subscription-access"

type Guarded = (user: { id: string; email: string }) => Promise<Response> | Response

/**
 * Authenticated + phase-gated + per-user rate-limited API handler.
 * 401 without a session, 403 without premium access, 429 when over the limit.
 */
export async function withPremiumApiAccess(
  request: NextRequest,
  options: { phase: PhaseId; limiter: Ratelimit | null; bucket: string },
  handler: Guarded,
): Promise<Response> {
  try {
    const user = await requireAuthenticatedUser(request)
    await assertPhaseAccessForUser(user, options.phase)
    const limited = await applyRateLimit(request, options.limiter, `${options.bucket}:${user.id}`)
    if (limited.blocked) return limited.blocked
    return await handler(user)
  } catch (error) {
    return handleRouteError(error)
  }
}
