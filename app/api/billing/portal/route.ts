import { NextRequest, NextResponse } from "next/server"
import { assertNotDemoUser } from "@/lib/auth/demo-guards"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError } from "@/lib/http/responses"
import { requireStripeClient } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { isBillingPortalEnabled } from "@/config/featureFlags"
import { resolveBillingOrigin } from "@/lib/billing/checkout-origin"

export async function POST(request: NextRequest) {
  try {
    if (!isBillingPortalEnabled()) {
      return NextResponse.json(
        { error: "Billing portal is not enabled" },
        { status: 503 }
      )
    }

    let stripe
    let appUrl: string
    try {
      appUrl = resolveBillingOrigin(process.env, request.nextUrl.origin)
      stripe = requireStripeClient()
    } catch {
      return NextResponse.json(
        { error: "Billing is not configured" },
        { status: 503 }
      )
    }

    const user = await requireAuthenticatedUser(request)
    assertNotDemoUser(
      user.email,
      "Demo accounts cannot open the billing portal. Create a free account to manage subscriptions.",
    )

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
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
