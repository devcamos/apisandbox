import { describe, expect, it } from "vitest"
import { decidePageAccess } from "@/lib/access/page-access"
import { getPhasePreviewContent } from "@/lib/access/phase-preview-content"
import { effectiveTier, hasActivePremium, isPremiumPhase } from "@/lib/subscription-access"

const now = new Date("2026-11-02T12:00:00Z")
const v = (tier: string, exp: Date | null = null, isDemo = false) => ({
  id: "u", email: "e@x.com", isDemo, subscriptionTier: tier, subscriptionExpiresAt: exp,
})

describe("subscription-access", () => {
  it("computes effective tier with expiry", () => {
    expect(effectiveTier(null)).toEqual({ tier: "FREE", isExpired: false })
    expect(effectiveTier({ subscriptionTier: "PREMIUM", subscriptionExpiresAt: null }, now).tier).toBe("PREMIUM")
    expect(effectiveTier({ subscriptionTier: "PREMIUM", subscriptionExpiresAt: new Date("2026-11-01") }, now))
      .toEqual({ tier: "FREE", isExpired: true })
    expect(hasActivePremium({ subscriptionTier: "PREMIUM", subscriptionExpiresAt: new Date("2026-12-01") }, now)).toBe(true)
    expect(hasActivePremium({ subscriptionTier: "ENTERPRISE", subscriptionExpiresAt: null }, now)).toBe(false)
  })

  it("classifies phases", () => {
    expect(isPremiumPhase(1)).toBe(false)
    expect(isPremiumPhase(9)).toBe(true)
    expect(isPremiumPhase(10)).toBe(false)
    expect(isPremiumPhase("ai")).toBe(true)
  })
})

describe("decidePageAccess", () => {
  it("free phases are always granted", () => {
    expect(decidePageAccess({ phase: 1, paywallEnabled: true, viewer: null })).toBe("granted")
  })
  it("demo users are locked from premium phases", () => {
    expect(decidePageAccess({ phase: 2, paywallEnabled: false, viewer: v("FREE", null, true) })).toBe("demo-locked")
  })
  it("anonymous needs sign in, free needs upgrade, premium granted", () => {
    expect(decidePageAccess({ phase: 2, paywallEnabled: true, viewer: null })).toBe("signin")
    expect(decidePageAccess({ phase: 2, paywallEnabled: true, viewer: v("FREE"), now })).toBe("upgrade")
    expect(decidePageAccess({ phase: 2, paywallEnabled: true, viewer: v("PREMIUM"), now })).toBe("granted")
    expect(decidePageAccess({ phase: 2, paywallEnabled: true, viewer: v("PREMIUM", new Date("2026-01-01")), now })).toBe("upgrade")
  })
  it("paywall off grants non-demo users", () => {
    expect(decidePageAccess({ phase: "cloud", paywallEnabled: false, viewer: null })).toBe("granted")
  })
})

describe("getPhasePreviewContent", () => {
  it("uses catalog metadata for phases", () => {
    const c = getPhasePreviewContent(9)
    expect(c.title).toBe("Phase 9: Database Fundamentals")
    expect(c.estimatedTime).toBe("3-4 hours")
    expect(c.outcomes.length).toBeGreaterThanOrEqual(3)
    expect(c.outcomes.length).toBeLessThanOrEqual(5)
    expect(c.href).toBe("/phase-9")
  })
  it("uses section metadata for cloud/ai and honours the locked name", () => {
    const c = getPhasePreviewContent("cloud", "AWS Cloud Services")
    expect(c.title).toBe("AWS Cloud Services")
    expect(c.topics).toContain("AWS services")
    expect(c.estimatedTime).toBeNull()
    expect(getPhasePreviewContent("ai").href).toBe("/ai")
  })
  it("falls back for unknown phases", () => {
    const c = getPhasePreviewContent(42)
    expect(c.title).toBe("Phase 42")
    expect(c.href).toBe("/phase-42")
  })
})
