import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { findActiveUserSession } from "@/lib/services/auth/user-session-service"
import { AppError } from "@/lib/http/errors"
import { readAuthToken } from "@/lib/http/auth-route-helpers"
import { hasActivePremium } from "@/lib/subscription-access"

export async function requireAuthenticatedSession(request: NextRequest) {
  const token = readAuthToken(request)
  if (!token) {
    throw new AppError("Missing auth token", 401, "auth_failure")
  }

  const payload = verifyJwtToken(token)
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, isActive: true },
  })

  if (!user?.isActive) {
    throw new AppError("User is not active", 401, "auth_failure")
  }

  if (payload.sid) {
    const session = await findActiveUserSession(user.id, payload.sid)
    if (!session) {
      throw new AppError("Session has been revoked or expired", 401, "auth_failure")
    }
  }

  return { user, sessionId: payload.sid ?? null }
}

export async function requireAuthenticatedUser(request: NextRequest) {
  const { user } = await requireAuthenticatedSession(request)
  return user
}

export async function requirePremiumUser(request: NextRequest) {
  const user = await requireAuthenticatedUser(request)
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { subscriptionTier: true, subscriptionExpiresAt: true },
  })

  // Same effective-tier rule as checkPhaseAccess: lapsed premium counts as FREE.
  if (!hasActivePremium(record)) {
    throw new AppError(
      "Learning Assistant is available for Premium subscribers only",
      403,
      "auth_failure",
    )
  }

  return user
}
