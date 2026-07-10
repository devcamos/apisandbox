import type Stripe from "stripe"

import { sendSubscriptionCancelled, sendSubscriptionConfirmation } from "@/lib/email"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import {
  applyPremiumSubscription,
  downgradeToFreeSubscription,
  findUserIdByStripeCustomerId,
} from "@/lib/subscription-provision"

const ENTITLED_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  "active",
  "trialing",
  "past_due",
])

export function currentPeriodEndUnix(subscription: Stripe.Subscription): number | null {
  const legacyPeriodEnd = (subscription as unknown as { current_period_end?: unknown })
    .current_period_end
  if (typeof legacyPeriodEnd === "number") return legacyPeriodEnd

  const itemPeriodEnds = subscription.items?.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number")

  return itemPeriodEnds?.length ? Math.max(...itemPeriodEnds) : null
}

export function subscriptionStatusGrantsAccess(status: Stripe.Subscription.Status): boolean {
  return ENTITLED_SUBSCRIPTION_STATUSES.has(status)
}

function stripeCustomerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  return typeof value === "string" ? value : value?.id ?? null
}

async function resolveSubscriptionUserId(subscription: Stripe.Subscription): Promise<string | null> {
  if (subscription.metadata?.userId) return subscription.metadata.userId
  const customerId = stripeCustomerId(subscription.customer)
  return customerId ? findUserIdByStripeCustomerId(customerId) : null
}

async function resolveCheckoutUserId(session: Stripe.Checkout.Session): Promise<string | null> {
  if (session.metadata?.userId) return session.metadata.userId
  if (session.client_reference_id) return session.client_reference_id
  const customerId = stripeCustomerId(session.customer)
  return customerId ? findUserIdByStripeCustomerId(customerId) : null
}

async function sendConfirmationBestEffort(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (!user?.email) return
  await sendSubscriptionConfirmation(user.email).catch((error) => {
    logger.warn({ err: error, userId }, "Subscription confirmation email failed")
  })
}

async function sendCancellationBestEffort(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (!user?.email) return
  await sendSubscriptionCancelled(user.email, new Date()).catch((error) => {
    logger.warn({ err: error, userId }, "Subscription cancellation email failed")
  })
}

export async function reconcileStripeSubscription(subscription: Stripe.Subscription): Promise<void> {
  const userId = await resolveSubscriptionUserId(subscription)
  if (!userId) {
    logger.warn(
      { subscriptionId: subscription.id, customerId: stripeCustomerId(subscription.customer) },
      "Stripe subscription has no mapped user",
    )
    return
  }

  const periodEndUnix = currentPeriodEndUnix(subscription)
  const currentPeriodEnd = periodEndUnix === null ? null : new Date(periodEndUnix * 1000)

  if (subscriptionStatusGrantsAccess(subscription.status)) {
    await applyPremiumSubscription(userId, {
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
      subscriptionExpiresAt: subscription.cancel_at_period_end ? currentPeriodEnd : null,
    })
    logger.info({ userId, status: subscription.status }, "Stripe subscription grants premium access")
    return
  }

  await downgradeToFreeSubscription(userId, {
    stripeSubscriptionStatus: subscription.status,
    stripeCurrentPeriodEnd: currentPeriodEnd,
  })
  logger.info({ userId, status: subscription.status }, "Stripe subscription does not grant access")
}

export async function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    logger.info(
      { sessionId: session.id, paymentStatus: session.payment_status },
      "Checkout completed before payment; waiting for Stripe subscription status",
    )
    return
  }

  const userId = await resolveCheckoutUserId(session)
  if (!userId) {
    logger.warn({ sessionId: session.id }, "Checkout session has no mapped user")
    return
  }

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id

  await applyPremiumSubscription(userId, {
    stripeSubscriptionId: subscriptionId ?? null,
    stripeSubscriptionStatus: "active",
  })
  await sendConfirmationBestEffort(userId)

  logger.info({ userId, sessionId: session.id }, "User upgraded to PREMIUM via Stripe")
}

export async function handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = stripeCustomerId(invoice.customer)
  const userId = customerId ? await findUserIdByStripeCustomerId(customerId) : null

  logger.warn(
    { userId, customerId, invoiceId: invoice.id },
    "Stripe invoice payment failed; access retained until subscription becomes unpaid or canceled",
  )
}

export async function handleCustomerSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription
  const userId = await resolveSubscriptionUserId(subscription)
  if (!userId) {
    logger.warn({ subscriptionId: subscription.id }, "Deleted Stripe subscription has no mapped user")
    return
  }

  await downgradeToFreeSubscription(userId, {
    stripeSubscriptionStatus: "canceled",
    stripeCurrentPeriodEnd: null,
  })
  await sendCancellationBestEffort(userId)

  logger.info({ userId }, "User downgraded to FREE — subscription deleted")
}

export async function handleCustomerSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  await reconcileStripeSubscription(event.data.object as Stripe.Subscription)
}

export async function dispatchStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await handleCheckoutSessionCompleted(event)
      return
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event)
      return
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await reconcileStripeSubscription(event.data.object as Stripe.Subscription)
      return
    case "customer.subscription.deleted":
      await handleCustomerSubscriptionDeleted(event)
      return
    default:
      logger.debug({ type: event.type }, "Unhandled Stripe event")
  }
}
