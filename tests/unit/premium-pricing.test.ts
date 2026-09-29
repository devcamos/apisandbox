import { afterEach, describe, expect, it, vi } from "vitest"

const retrieveMock = vi.hoisted(() => vi.fn())
const getStripeClientMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/stripe-client", () => ({
  getStripeClient: getStripeClientMock,
}))

import {
  buildFallbackPremiumPricing,
  clearPremiumPricingCache,
  formatMoneyFromMinorUnits,
  PREMIUM_PRICE_FALLBACK_PENCE,
  resolvePremiumPricing,
} from "@/lib/premium-pricing"

describe("premium-pricing", () => {
  afterEach(() => {
    clearPremiumPricingCache()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("formats GBP without unnecessary decimals", () => {
    expect(formatMoneyFromMinorUnits(200, "gbp")).toBe("£2")
    expect(formatMoneyFromMinorUnits(250, "gbp")).toBe("£2.50")
  })

  it("buildFallbackPremiumPricing uses the £2 fallback", () => {
    const pricing = buildFallbackPremiumPricing("price_x")
    expect(pricing.amountPence).toBe(PREMIUM_PRICE_FALLBACK_PENCE)
    expect(pricing.formatted).toBe("£2")
    expect(pricing.source).toBe("fallback")
    expect(pricing.priceId).toBe("price_x")
  })

  it("falls back when Stripe is not configured", async () => {
    getStripeClientMock.mockReturnValue(null)
    vi.stubEnv("STRIPE_PRICE_ID", "")
    const pricing = await resolvePremiumPricing()
    expect(pricing.source).toBe("fallback")
    expect(pricing.amountPence).toBe(200)
  })

  it("reads unit_amount from the configured Stripe Price", async () => {
    retrieveMock.mockResolvedValue({
      unit_amount: 200,
      currency: "gbp",
    })
    getStripeClientMock.mockReturnValue({
      prices: { retrieve: retrieveMock },
    })
    vi.stubEnv("STRIPE_PRICE_ID", "price_1UKWxeIdnfsbsSlnLJDxdHky")

    const pricing = await resolvePremiumPricing()
    expect(retrieveMock).toHaveBeenCalledWith("price_1UKWxeIdnfsbsSlnLJDxdHky")
    expect(pricing.source).toBe("stripe")
    expect(pricing.amountPence).toBe(200)
    expect(pricing.formatted).toBe("£2")
  })

  it("falls back when Stripe retrieve fails", async () => {
    retrieveMock.mockRejectedValue(new Error("network"))
    getStripeClientMock.mockReturnValue({
      prices: { retrieve: retrieveMock },
    })
    vi.stubEnv("STRIPE_PRICE_ID", "price_broken")

    const pricing = await resolvePremiumPricing()
    expect(pricing.source).toBe("fallback")
    expect(pricing.formatted).toBe("£2")
  })
})
