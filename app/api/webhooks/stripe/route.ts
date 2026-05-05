import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripeClient } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { sendSubscriptionConfirmation, sendSubscriptionCancelled } from "@/lib/email"

function currentPeriodEndUnix(subscription: Stripe.Subscription): number | null {
  const raw = (subscription as unknown as { current_period_end?: unknown }).current_period_end
  return typeof raw === "number" ? raw : null
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    logger.error("Stripe webhook: STRIPE_SECRET_KEY not set")
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  logger.info({ type: event.type, id: event.id }, "Stripe webhook received")

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (!userId) break

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: "PREMIUM",
            stripeSubscriptionId: subscriptionId ?? null,
            subscriptionExpiresAt: null,
          },
        })

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })
        if (user?.email) {
          await sendSubscriptionConfirmation(user.email)
        }

        logger.info({ userId }, "User upgraded to PREMIUM via Stripe")
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id

        if (customerId) {
          logger.warn({ customerId }, "Payment failed — grace period started")
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (!userId) break

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: "FREE",
            stripeSubscriptionId: null,
            subscriptionExpiresAt: null,
          },
        })

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })
        if (user?.email) {
          await sendSubscriptionCancelled(user.email, new Date())
        }

        logger.info({ userId }, "User downgraded to FREE — subscription deleted")
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (!userId) break

        if (subscription.cancel_at_period_end) {
          const periodEnd = currentPeriodEndUnix(subscription)
          if (periodEnd === null) break
          const endsAt = new Date(periodEnd * 1000)
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionExpiresAt: endsAt },
          })
          logger.info({ userId, endsAt }, "Subscription set to cancel at period end")
        } else {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionExpiresAt: null },
          })
        }
        break
      }

      default:
        logger.debug({ type: event.type }, "Unhandled Stripe event")
    }
  } catch (err) {
    logger.error({ err, eventType: event.type }, "Error processing webhook")
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
