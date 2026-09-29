/**
 * Stripe price configuration and client helpers.
 * Use getStripeClient() / requireStripeClient() from this module (see lib/stripe-client.ts).
 * Display amounts: prefer resolvePremiumPricing() / PremiumPriceLabel (live Stripe Price).
 */
export { getStripeClient, requireStripeClient } from "@/lib/stripe-client"
export {
  PREMIUM_PRICE_FALLBACK_PENCE,
  resolvePremiumPricing,
  formatMoneyFromMinorUnits,
} from "@/lib/premium-pricing"

import { PREMIUM_PRICE_FALLBACK_PENCE, PREMIUM_PRICE_FALLBACK_CURRENCY } from "@/lib/premium-pricing"

export const PLANS = {
  PREMIUM_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_ID ?? "",
    /** Fallback minor units when Stripe Price has not been resolved yet. */
    amount: PREMIUM_PRICE_FALLBACK_PENCE,
    currency: PREMIUM_PRICE_FALLBACK_CURRENCY,
    interval: "month" as const,
    name: "Premium Monthly",
  },
} as const
