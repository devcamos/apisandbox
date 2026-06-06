import type Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { sendSubscriptionConfirmation, sendSubscriptionCancelled } from "@/lib/email"
import {
  applyPremiumSubscription,
  downgradeToFreeSubscription,
  findUserIdByStripeCustomerId,
} from "@/lib/subscription-provision"

export function currentPeriodEndUnix(subscription: Stripe.Subscription): number | null {
  const raw = (subscription as unknown as { current_period_end?: unknown }).current_period_end
  return typeof raw === "number" ? raw : null
}

export async function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session
  const userId = session.metadata?.userId
  if (!userId) return

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id

  await applyPremiumSubscription(userId, {
    stripeSubscriptionId: subscriptionId ?? null,
  })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (user?.email) {
    await sendSubscriptionConfirmation(user.email)
  }

  logger.info({ userId }, "User upgraded to PREMIUM via Stripe")
}

export async function handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id

  if (!customerId) {
    logger.warn("Payment failed — no customer id on invoice")
    return
  }

  const userId = await findUserIdByStripeCustomerId(customerId)
  if (!userId) {
    logger.warn({ customerId }, "Payment failed — no user for Stripe customer")
    return
  }

  await downgradeToFreeSubscription(userId)
  logger.warn({ userId, customerId }, "Payment failed — user downgraded to FREE")
}

export async function handleCustomerSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId
  if (!userId) return

  await downgradeToFreeSubscription(userId)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (user?.email) {
    await sendSubscriptionCancelled(user.email, new Date())
  }

  logger.info({ userId }, "User downgraded to FREE — subscription deleted")
}

export async function handleCustomerSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId
  if (!userId) return

  if (subscription.cancel_at_period_end) {
    const periodEnd = currentPeriodEndUnix(subscription)
    if (periodEnd === null) return
    const endsAt = new Date(periodEnd * 1000)
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionExpiresAt: endsAt },
    })
    logger.info({ userId, endsAt }, "Subscription set to cancel at period end")
    return
  }

  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionExpiresAt: null },
  })
}

export async function dispatchStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event)
      return
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event)
      return
    case "customer.subscription.deleted":
      await handleCustomerSubscriptionDeleted(event)
      return
    case "customer.subscription.updated":
      await handleCustomerSubscriptionUpdated(event)
      return
    default:
      logger.debug({ type: event.type }, "Unhandled Stripe event")
  }
}
