/**
 * Premium plan display pricing — one source of truth for UI amounts.
 *
 * When Stripe is configured (STRIPE_SECRET_KEY + STRIPE_PRICE_ID), the charged
 * amount is read from the Stripe Price object. Otherwise a local fallback is
 * used so marketing pages still render offline / in CI without secrets.
 */

import { getStripeClient } from "@/lib/stripe-client"

export type PremiumPricing = {
  amountPence: number
  currency: string
  interval: "month"
  formatted: string
  source: "stripe" | "fallback"
  priceId: string
}

/** Fallback when Stripe is unset or the Price cannot be retrieved (GBP £2). */
export const PREMIUM_PRICE_FALLBACK_PENCE = 200
export const PREMIUM_PRICE_FALLBACK_CURRENCY = "gbp"

const CACHE_TTL_MS = 5 * 60 * 1000

type CacheEntry = { pricing: PremiumPricing; expiresAt: number }

const globalForPricing = globalThis as typeof globalThis & {
  __premiumPricingCache?: CacheEntry
}

export function formatMoneyFromMinorUnits(amountMinor: number, currency: string): string {
  const major = amountMinor / 100
  const code = currency.trim().toLowerCase()
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: code.toUpperCase(),
      minimumFractionDigits: Number.isInteger(major) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(major)
  } catch {
    if (code === "gbp") return `£${major}`
    return `${major} ${code.toUpperCase()}`
  }
}

export function buildFallbackPremiumPricing(priceId = ""): PremiumPricing {
  return {
    amountPence: PREMIUM_PRICE_FALLBACK_PENCE,
    currency: PREMIUM_PRICE_FALLBACK_CURRENCY,
    interval: "month",
    formatted: formatMoneyFromMinorUnits(
      PREMIUM_PRICE_FALLBACK_PENCE,
      PREMIUM_PRICE_FALLBACK_CURRENCY,
    ),
    source: "fallback",
    priceId,
  }
}

/**
 * Resolve Premium display pricing. Prefers live Stripe Price.unit_amount when
 * keys are present; never throws — falls back on any failure.
 */
export async function resolvePremiumPricing(): Promise<PremiumPricing> {
  const priceId = process.env.STRIPE_PRICE_ID?.trim() ?? ""
  const cached = globalForPricing.__premiumPricingCache
  if (cached && cached.expiresAt > Date.now() && cached.pricing.priceId === priceId) {
    return cached.pricing
  }

  const stripe = getStripeClient()
  if (!stripe || !priceId) {
    const fallback = buildFallbackPremiumPricing(priceId)
    globalForPricing.__premiumPricingCache = {
      pricing: fallback,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }
    return fallback
  }

  try {
    const price = await stripe.prices.retrieve(priceId)
    const amountPence =
      typeof price.unit_amount === "number" && price.unit_amount >= 0
        ? price.unit_amount
        : PREMIUM_PRICE_FALLBACK_PENCE
    const currency = (price.currency || PREMIUM_PRICE_FALLBACK_CURRENCY).toLowerCase()
    const pricing: PremiumPricing = {
      amountPence,
      currency,
      interval: "month",
      formatted: formatMoneyFromMinorUnits(amountPence, currency),
      source: "stripe",
      priceId,
    }
    globalForPricing.__premiumPricingCache = {
      pricing,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }
    return pricing
  } catch {
    const fallback = buildFallbackPremiumPricing(priceId)
    globalForPricing.__premiumPricingCache = {
      pricing: fallback,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }
    return fallback
  }
}

/** Test helper — clears the in-memory price cache. */
export function clearPremiumPricingCache(): void {
  delete globalForPricing.__premiumPricingCache
}
