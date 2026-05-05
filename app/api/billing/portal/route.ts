import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError } from "@/lib/http/responses"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { isFeatureEnabled } from "@/config/featureFlags"

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled("STRIPE_CHECKOUT")) {
      return NextResponse.json(
        { error: "Billing portal is not enabled" },
        { status: 503 }
      )
    }

    const user = await requireAuthenticatedUser(request)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    })

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
