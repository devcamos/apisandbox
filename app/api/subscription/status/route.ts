/**
 * Subscription Status API
 * 
 * Returns user's current subscription tier and status
 */

import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { getUserSubscription } from "@/lib/subscription"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const subscription = await getUserSubscription(session.user.id)

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
    })
  } catch (error) {
    console.error("Subscription status error:", error)
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    )
  }
}

