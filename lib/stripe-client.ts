import Stripe from "stripe"

/**
 * Returns a configured Stripe SDK client, or null when no secret key is set.
 * Avoids constructing Stripe with an empty API key (security / static analysis).
 */
export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    return null
  }
  return new Stripe(key, { typescript: true })
}

export function requireStripeClient(): Stripe {
  const client = getStripeClient()
  if (!client) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return client
}
