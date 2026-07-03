import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError } from "@/lib/http/responses"
import { requireStripeClient, PLANS } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { isFeatureEnabled } from "@/config/featureFlags"
import { logger } from "@/lib/logger"
import { blocksNewStripeSubscription } from "@/lib/stripe-subscriptions"

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled("STRIPE_CHECKOUT")) {
      return NextResponse.json(
        { error: "Stripe checkout is not enabled" },
        { status: 503 }
      )
    }

    const priceId = PLANS.PREMIUM_MONTHLY.priceId?.trim()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
    if (!priceId || !appUrl) {
      logger.error("Stripe checkout misconfigured: missing STRIPE_PRICE_ID or NEXT_PUBLIC_APP_URL")
      return NextResponse.json(
        { error: "Billing is not configured" },
        { status: 503 }
      )
    }

    let stripe
    try {
      stripe = requireStripeClient()
    } catch {
      logger.error("Stripe checkout: STRIPE_SECRET_KEY not set")
      return NextResponse.json(
        { error: "Billing is not configured" },
        { status: 503 }
      )
    }

    const user = await requireAuthenticatedUser(request)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionTier: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (dbUser.subscriptionTier === "PREMIUM" || dbUser.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "An active subscription already exists. Use Manage subscription instead." },
        { status: 409 },
      )
    }

    let customerId = dbUser.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: { userId: user.id },
      }, {
        idempotencyKey: `customer:${user.id}`,
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    })
    if (subscriptions.data.some((subscription) => blocksNewStripeSubscription(subscription.status))) {
      return NextResponse.json(
        { error: "An existing Stripe subscription must be managed before starting another." },
        { status: 409 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/upgrade`,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
      customer_update: { address: "auto", name: "auto" },
    }, {
      idempotencyKey: `checkout:${user.id}:${priceId}:${Math.floor(Date.now() / 300_000)}`,
    })

    logger.info({ userId: user.id, sessionId: session.id }, "Checkout session created")

    if (!session.url) {
      logger.error({ userId: user.id, sessionId: session.id }, "Stripe Checkout returned no URL")
      return NextResponse.json({ error: "Checkout is unavailable" }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
