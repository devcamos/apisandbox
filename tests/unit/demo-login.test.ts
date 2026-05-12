import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("demo-login", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("isDemoSessionEmail matches public demo email when env set", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_USER_EMAIL", "demo@example.com")
    const { isDemoSessionEmail } = await import("@/lib/demo-login")
    expect(isDemoSessionEmail("demo@example.com")).toBe(true)
    expect(isDemoSessionEmail("other@example.com")).toBe(false)
  })

  it("isDemoSessionEmail matches explicit canonical without public env", async () => {
    const { isDemoSessionEmail } = await import("@/lib/demo-login")
    expect(isDemoSessionEmail("Live@Demo.com", "live@demo.com")).toBe(true)
    expect(isDemoSessionEmail("x@y.com", "live@demo.com")).toBe(false)
  })

  it("isDemoSessionEmail returns false for falsy email inputs", async () => {
    const { isDemoSessionEmail } = await import("@/lib/demo-login")
    expect(isDemoSessionEmail(undefined)).toBe(false)
    expect(isDemoSessionEmail(null)).toBe(false)
    expect(isDemoSessionEmail("")).toBe(false)
  })

  it("normalizeDemoEmail trims and lowercases", async () => {
    const { normalizeDemoEmail } = await import("@/lib/demo-login")
    expect(normalizeDemoEmail("  Foo@Bar.COM  ")).toBe("foo@bar.com")
  })

  it("getDemoUserEmail honours DEMO_USER_EMAIL env (trimmed, lowercased)", async () => {
    vi.stubEnv("DEMO_USER_EMAIL", "  Live@Demo.COM ")
    const { getDemoUserEmail } = await import("@/lib/demo-login")
    expect(getDemoUserEmail()).toBe("live@demo.com")
  })

  it("getDemoUserEmail falls back to the built-in demo email when env is unset", async () => {
    vi.stubEnv("DEMO_USER_EMAIL", "")
    const { getDemoUserEmail } = await import("@/lib/demo-login")
    expect(getDemoUserEmail()).toBe("demo@apisandbox.demo")
  })

  it("getPublicDemoUserEmail honours NEXT_PUBLIC_DEMO_USER_EMAIL env when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_USER_EMAIL", "  Public@Demo.COM ")
    const { getPublicDemoUserEmail } = await import("@/lib/demo-login")
    expect(getPublicDemoUserEmail()).toBe("public@demo.com")
  })

  it("getPublicDemoUserEmail falls back to the built-in demo email when env is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_USER_EMAIL", "")
    const { getPublicDemoUserEmail } = await import("@/lib/demo-login")
    expect(getPublicDemoUserEmail()).toBe("demo@apisandbox.demo")
  })

  it("getDemoUserPassword returns the env value when set and null otherwise", async () => {
    vi.stubEnv("DEMO_USER_PASSWORD", "")
    let mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserPassword()).toBeNull()

    vi.resetModules()
    vi.stubEnv("DEMO_USER_PASSWORD", "  ") // whitespace-only is treated as unset
    mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserPassword()).toBeNull()

    vi.resetModules()
    vi.stubEnv("DEMO_USER_PASSWORD", "s3cret")
    mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserPassword()).toBe("s3cret")
  })

  it("isDemoLoginRouteEnabled requires both feature flag and password", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "")
    vi.stubEnv("DEMO_USER_PASSWORD", "s3cret")
    let mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(false)

    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "true")
    vi.stubEnv("DEMO_USER_PASSWORD", "")
    mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(false)

    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "true")
    vi.stubEnv("DEMO_USER_PASSWORD", "s3cret")
    mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(true)
  })
})
