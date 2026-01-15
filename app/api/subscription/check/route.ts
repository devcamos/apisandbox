/**
 * Subscription Check API
 * 
 * MENTOR NOTE: Access Control API
 * 
 * This endpoint checks if a user has access to a specific phase
 * Used by SubscriptionGate component to determine what to show
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { checkPhaseAccess } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  try {
    // MENTOR NOTE: Get session using NextAuth v5 auth helper
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const phaseParam = request.nextUrl.searchParams.get("phase")
    
    if (!phaseParam) {
      return NextResponse.json(
        { error: "Phase parameter required" },
        { status: 400 }
      )
    }

    // Parse phase number, "cloud", or "ai"
    let phaseNumber: number | "cloud" | "ai"
    if (phaseParam === "cloud" || phaseParam === "ai") {
      phaseNumber = phaseParam
    } else {
      phaseNumber = parseInt(phaseParam, 10)
      if (isNaN(phaseNumber)) {
        return NextResponse.json(
          { error: "Invalid phase parameter" },
          { status: 400 }
        )
      }
    }

    const accessCheck = await checkPhaseAccess(session.user.id, phaseNumber)

    return NextResponse.json(accessCheck)
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    )
  }
}

