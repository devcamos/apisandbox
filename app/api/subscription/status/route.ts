/**
 * Subscription Status API
 * 
 * Returns user's current subscription tier and status
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { getUserSubscription } from "@/lib/subscription"
import { handleRouteError } from "@/lib/http/responses"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const subscription = await getUserSubscription(user.id)

    if (!subscription) {
      return NextResponse.json({
        tier: "FREE",
        isExpired: false,
      })
    }

    return NextResponse.json({
      tier: subscription.tier,
      isExpired: subscription.isExpired,
      expiresAt: subscription.expiresAt,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
