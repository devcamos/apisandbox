import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError } from "@/lib/http/responses"
import { stripe, PLANS } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { isFeatureEnabled } from "@/config/featureFlags"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled("STRIPE_CHECKOUT")) {
      return NextResponse.json(
        { error: "Stripe checkout is not enabled" },
        { status: 503 }
      )
    }

    const user = await requireAuthenticatedUser(request)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, stripeCustomerId: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let customerId = dbUser.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: PLANS.PREMIUM_MONTHLY.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
    })

    logger.info({ userId: user.id, sessionId: session.id }, "Checkout session created")

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
