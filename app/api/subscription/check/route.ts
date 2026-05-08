/**
 * Subscription Check API
 * 
 * MENTOR NOTE: Access Control API
 * 
 * This endpoint checks if a user has access to a specific phase
 * Used by SubscriptionGate component to determine what to show
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { checkPhaseAccess } from "@/lib/subscription"
import { handleRouteError } from "@/lib/http/responses"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)

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

    const accessCheck = await checkPhaseAccess(user.id, phaseNumber)

    return NextResponse.json(accessCheck)
  } catch (error) {
    return handleRouteError(error)
  }
}
