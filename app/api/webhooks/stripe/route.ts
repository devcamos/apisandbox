import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { sendSubscriptionConfirmation, sendSubscriptionCancelled } from "@/lib/email"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    )
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  logger.info({ type: event.type, id: event.id }, "Stripe webhook received")

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
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
        const invoice = event.data.object
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
        const subscription = event.data.object
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
        const subscription = event.data.object as unknown as Record<string, unknown>
        const userId = (subscription.metadata as Record<string, string>)?.userId
        if (!userId) break

        if (subscription.cancel_at_period_end) {
          const periodEnd = subscription.current_period_end as number
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
