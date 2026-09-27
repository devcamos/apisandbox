import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const loginWithPassword = vi.hoisted(() => vi.fn())
const createEphemeralDemoSession = vi.hoisted(() => vi.fn())
const checkRateLimit = vi.hoisted(() => vi.fn())
const demoEnabled = vi.hoisted(() => ({ value: true }))

vi.mock("@/lib/services/auth/auth-service", () => ({ loginWithPassword }))
vi.mock("@/lib/services/auth/demo-auth-service", () => ({ createEphemeralDemoSession }))
vi.mock("@/lib/rate-limit", async (orig) => {
  const actual = await orig<typeof import("@/lib/rate-limit")>()
  return {
    ...actual,
    authLimiter: { name: "auth" },
    demoLoginLimiter: { name: "demo" },
    checkRateLimit,
  }
})
vi.mock("@/lib/demo-login", async (orig) => {
  const actual = await orig<typeof import("@/lib/demo-login")>()
  return { ...actual, isDemoLoginRouteEnabled: () => demoEnabled.value }
})

import { POST } from "@/app/api/auth/login/route"
import { AppError } from "@/lib/http/errors"

const session = (email: string, isDemo = false) => ({
  token: "t",
  expiresIn: 3600,
  user: { id: "u", email, isDemo },
})

function req(body: unknown) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": "1.2.3.4" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    demoEnabled.value = true
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 10, resetAt: 0 })
  })

  it("valid email/password returns 200 and sets the auth cookie", async () => {
    loginWithPassword.mockResolvedValue(session("user@example.com"))
    const res = await POST(req({ email: "User@Example.com", password: "pw" }))
    expect(res.status).toBe(200)
    expect(loginWithPassword).toHaveBeenCalledWith({ email: "user@example.com", password: "pw" })
    expect(res.headers.get("set-cookie") ?? "").toContain("auth_token=")
  })

  it("wrong password / unknown email return 401 Invalid email or password", async () => {
    loginWithPassword.mockRejectedValue(new AppError("Invalid email or password", 401, "auth_failure"))
    const res = await POST(req({ email: "nobody@example.com", password: "x" }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error.message).toBe("Invalid email or password")
  })

  it("rate limit is keyed per IP + email", async () => {
    loginWithPassword.mockResolvedValue(session("user@example.com"))
    await POST(req({ email: "user@example.com", password: "pw" }))
    expect(checkRateLimit).toHaveBeenCalledWith("1.2.3.4:user@example.com", { name: "auth" })
  })

  it("rate-limited request gets 429 with a wait time", async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 10 * 60_000 })
    const res = await POST(req({ email: "user@example.com", password: "pw" }))
    expect(res.status).toBe(429)
    const body = await res.json()
    expect(body.error.message).toMatch(/Try again in 10 minutes/)
    expect(loginWithPassword).not.toHaveBeenCalled()
  })

  it("demo credentials typed into the normal form start an ephemeral demo session", async () => {
    createEphemeralDemoSession.mockResolvedValue(session("demo.abc@apisandbox.demo", true))
    const res = await POST(req({ email: "demo@apisandbox.demo", password: "try-the-demo" }))
    expect(res.status).toBe(200)
    expect(createEphemeralDemoSession).toHaveBeenCalledTimes(1)
    expect(loginWithPassword).not.toHaveBeenCalled()
    expect(checkRateLimit).toHaveBeenCalledWith("1.2.3.4", { name: "demo" })
    const body = await res.json()
    expect(body.data.user.isDemo).toBe(true)
  })

  it("demo email when demo is disabled explains that instead of 'invalid credentials'", async () => {
    demoEnabled.value = false
    const res = await POST(req({ email: "demo@apisandbox.demo", password: "try-the-demo" }))
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.message).toBe("Demo sign-in is not enabled on this deployment")
    expect(createEphemeralDemoSession).not.toHaveBeenCalled()
  })

  it("invalid payload returns 400 validation error", async () => {
    const res = await POST(req({ email: "not-an-email", password: "" }))
    expect(res.status).toBe(400)
  })
})
