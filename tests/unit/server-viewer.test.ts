import { beforeEach, describe, expect, it, vi } from "vitest"

const jar = vi.hoisted(() => ({ values: {} as Record<string, string> }))
const findUnique = vi.hoisted(() => vi.fn())
const verifyJwtToken = vi.hoisted(() => vi.fn())

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (jar.values[name] ? { value: jar.values[name] } : undefined) }),
}))
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique } } }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken }))

import { getServerViewer } from "@/lib/access/server-viewer"

describe("getServerViewer", () => {
  beforeEach(() => {
    jar.values = {}
    findUnique.mockReset()
    verifyJwtToken.mockReset()
  })

  it("is null without a session cookie", async () => {
    expect(await getServerViewer()).toBeNull()
    expect(verifyJwtToken).not.toHaveBeenCalled()
  })

  it("is null for an invalid token", async () => {
    jar.values.auth_token = "bad"
    verifyJwtToken.mockImplementation(() => {
      throw new Error("bad")
    })
    expect(await getServerViewer()).toBeNull()
  })

  it("is null for inactive users", async () => {
    jar.values["next-auth.session-token"] = "t"
    verifyJwtToken.mockReturnValue({ sub: "u1" })
    findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", isActive: false })
    expect(await getServerViewer()).toBeNull()
  })

  it("returns tier, expiry and demo flag for active users", async () => {
    jar.values.auth_token = "t"
    verifyJwtToken.mockReturnValue({ sub: "u1" })
    const exp = new Date("2027-01-01")
    findUnique.mockResolvedValue({
      id: "u1", email: "demo.abc@apisandbox.demo", isActive: true,
      subscriptionTier: "PREMIUM", subscriptionExpiresAt: exp,
    })
    expect(await getServerViewer()).toEqual({
      id: "u1", email: "demo.abc@apisandbox.demo", isDemo: true,
      subscriptionTier: "PREMIUM", subscriptionExpiresAt: exp,
    })
  })
})
