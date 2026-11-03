import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const requireAuthenticatedUser = vi.hoisted(() => vi.fn())
const applyPremiumSubscription = vi.hoisted(() => vi.fn())
vi.mock("@/lib/auth/jwt-auth-middleware", () => ({ requireAuthenticatedUser }))
vi.mock("@/lib/subscription-provision", () => ({ applyPremiumSubscription }))

async function callUpgrade() {
  vi.resetModules()
  const { POST } = await import("@/app/api/subscription/upgrade/route")
  return POST(new NextRequest("http://localhost/api/subscription/upgrade", { method: "POST" }))
}

describe("POST /api/subscription/upgrade (local only)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("VERCEL_ENV", "")
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "false")
    requireAuthenticatedUser.mockResolvedValue({ id: "u1", email: "learner@example.com" })
  })
  afterEach(() => vi.unstubAllEnvs())

  it("upgrades instantly under local next dev", async () => {
    vi.stubEnv("NODE_ENV", "development")
    const res = await callUpgrade()
    expect(res.status).toBe(200)
    expect(applyPremiumSubscription).toHaveBeenCalledWith("u1")
  })

  it.each([
    ["production", ""],
    ["production", "preview"],
    ["production", "production"],
    ["test", ""],
    ["development", "preview"],
  ])("is blocked for NODE_ENV=%s VERCEL_ENV=%s", async (nodeEnv, vercelEnv) => {
    vi.stubEnv("NODE_ENV", nodeEnv)
    vi.stubEnv("VERCEL_ENV", vercelEnv)
    const res = await callUpgrade()
    expect(res.status).toBe(403)
    expect(applyPremiumSubscription).not.toHaveBeenCalled()
  })

  it("is blocked locally when Stripe checkout is on", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "true")
    expect((await callUpgrade()).status).toBe(403)
  })
})
