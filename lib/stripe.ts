/**
 * Stripe price configuration and client helpers.
 * Use getStripeClient() / requireStripeClient() from this module (see lib/stripe-client.ts).
 */
export { getStripeClient, requireStripeClient } from "@/lib/stripe-client"

export const PLANS = {
  PREMIUM_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_ID ?? "",
    amount: 500,
    currency: "gbp",
    interval: "month" as const,
    name: "Premium Monthly",
  },
} as const
