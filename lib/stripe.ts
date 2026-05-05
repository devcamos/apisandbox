import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is required in production")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
})

export const PLANS = {
  PREMIUM_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_ID ?? "",
    amount: 500,
    currency: "gbp",
    interval: "month" as const,
    name: "Premium Monthly",
  },
} as const
