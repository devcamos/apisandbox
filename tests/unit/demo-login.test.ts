import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("demo-login", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("isDemoUserEmail matches ephemeral demo addresses", async () => {
    const { isDemoUserEmail } = await import("@/lib/demo-login")
    expect(isDemoUserEmail("demo.abc123@apisandbox.demo")).toBe(true)
    expect(isDemoUserEmail("Demo.XYZ_99@Apisandbox.Demo")).toBe(true)
    expect(isDemoUserEmail("user@example.com")).toBe(false)
    expect(isDemoUserEmail("demo@other.com")).toBe(false)
  })

  it("isDemoUserEmail matches legacy shared demo email from env", async () => {
    vi.stubEnv("DEMO_USER_EMAIL", "legacy-demo@apisandbox.demo")
    const { isDemoUserEmail } = await import("@/lib/demo-login")
    expect(isDemoUserEmail("legacy-demo@apisandbox.demo")).toBe(true)
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

  it("buildEphemeralDemoEmail builds a reserved-host address", async () => {
    const { buildEphemeralDemoEmail } = await import("@/lib/demo-login")
    expect(buildEphemeralDemoEmail("AbC-123")).toBe("demo.abc-123@apisandbox.demo")
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

  it("isDemoLoginRouteEnabled: on by default outside production, explicit false disables", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "")
    vi.stubEnv("DEMO_USER_PASSWORD", "")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("NODE_ENV", "production")
    let mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(true)

    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "false")
    mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(false)
  })

  it("isDemoLoginRouteEnabled on the production target needs flag + production override", async () => {
    vi.stubEnv("VERCEL_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "")
    vi.stubEnv("ALLOW_DEMO_LOGIN_IN_PRODUCTION", "")
    let mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(false)

    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "true")
    mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(false)

    vi.resetModules()
    vi.stubEnv("ALLOW_DEMO_LOGIN_IN_PRODUCTION", "true")
    mod = await import("@/lib/demo-login")
    expect(mod.isDemoLoginRouteEnabled()).toBe(true)
  })

  it("isPublicDemoLoginAttempt matches the displayed demo credentials only", async () => {
    const mod = await import("@/lib/demo-login")
    expect(mod.isPublicDemoLoginAttempt("Demo@ApiSandbox.demo")).toBe(true)
    expect(mod.isPublicDemoLoginAttempt("demo@apisandbox.demo", "try-the-demo")).toBe(true)
    expect(mod.isPublicDemoLoginAttempt("demo@apisandbox.demo", "nope")).toBe(false)
    expect(mod.isPublicDemoLoginAttempt("someone@example.com", "try-the-demo")).toBe(false)
  })

  it("getDemoUserTtlHours defaults to 24 and clamps invalid values", async () => {
    vi.stubEnv("DEMO_USER_TTL_HOURS", "")
    let mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserTtlHours()).toBe(24)

    vi.resetModules()
    vi.stubEnv("DEMO_USER_TTL_HOURS", "48")
    mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserTtlHours()).toBe(48)

    vi.resetModules()
    vi.stubEnv("DEMO_USER_TTL_HOURS", "0")
    mod = await import("@/lib/demo-login")
    expect(mod.getDemoUserTtlHours()).toBe(24)
  })
})
