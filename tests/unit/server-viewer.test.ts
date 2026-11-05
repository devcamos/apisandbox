import { beforeEach, describe, expect, it, vi } from "vitest"

const jar = vi.hoisted(() => ({ values: {} as Record<string, string> }))
const findUnique = vi.hoisted(() => vi.fn())
const verifyJwtToken = vi.hoisted(() => vi.fn())
const findActiveUserSession = vi.hoisted(() => vi.fn())

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (jar.values[name] ? { value: jar.values[name] } : undefined) }),
}))
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique } } }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken }))
vi.mock("@/lib/services/auth/user-session-service", () => ({ findActiveUserSession }))

import { getServerViewer } from "@/lib/access/server-viewer"

describe("getServerViewer", () => {
  beforeEach(() => {
    jar.values = {}
    findUnique.mockReset()
    verifyJwtToken.mockReset()
    findActiveUserSession.mockReset()
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
    expect(findActiveUserSession).not.toHaveBeenCalled()
  })

  it("returns a viewer for an active persisted session", async () => {
    jar.values.auth_token = "t"
    verifyJwtToken.mockReturnValue({ sub: "u1", sid: "s1" })
    findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", isActive: true, subscriptionTier: "PREMIUM", subscriptionExpiresAt: null })
    findActiveUserSession.mockResolvedValue({ id: "s1" })
    expect(await getServerViewer()).toMatchObject({ id: "u1", subscriptionTier: "PREMIUM" })
    expect(findActiveUserSession).toHaveBeenCalledWith("u1", "s1")
  })

  it.each(["auth_token", "next-auth.session-token", "__Secure-next-auth.session-token"])("is signed out when the retained %s session is revoked, expired or missing", async (cookieName) => {
    jar.values[cookieName] = "retained-token"
    verifyJwtToken.mockReturnValue({ sub: "u1", sid: "s1" })
    findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", isActive: true, subscriptionTier: "PREMIUM", subscriptionExpiresAt: null })
    findActiveUserSession.mockResolvedValue(null)
    expect(await getServerViewer()).toBeNull()
    expect(findActiveUserSession).toHaveBeenCalledWith("u1", "s1")
  })

  it("does not return a viewer when persisted session lookup fails", async () => {
    jar.values.auth_token = "t"
    verifyJwtToken.mockReturnValue({ sub: "u1", sid: "s1" })
    findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", isActive: true, subscriptionTier: "PREMIUM", subscriptionExpiresAt: null })
    const failure = new Error("Session database unavailable")
    findActiveUserSession.mockRejectedValue(failure)
    await expect(getServerViewer()).rejects.toThrow(failure)
  })
})
