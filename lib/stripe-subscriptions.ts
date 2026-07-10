import type Stripe from "stripe"

const EXISTING_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  "active",
  "past_due",
  "paused",
  "trialing",
  "unpaid",
])

export function blocksNewStripeSubscription(status: Stripe.Subscription.Status): boolean {
  return EXISTING_SUBSCRIPTION_STATUSES.has(status)
}
