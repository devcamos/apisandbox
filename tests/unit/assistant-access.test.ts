import { describe, expect, it } from "vitest"
import { canAccessLearningAssistant, isAuthMarketingPath } from "@/lib/assistant/access"

describe("canAccessLearningAssistant", () => {
  it("allows authenticated premium users on learning pages", () => {
    expect(
      canAccessLearningAssistant({
        status: "authenticated",
        subscriptionTier: "PREMIUM",
        pathname: "/phase-2",
      }),
    ).toBe(true)
  })

  it("denies unauthenticated users", () => {
    expect(
      canAccessLearningAssistant({
        status: "unauthenticated",
        subscriptionTier: "PREMIUM",
        pathname: "/dashboard",
      }),
    ).toBe(false)
  })

  it("denies free tier users", () => {
    expect(
      canAccessLearningAssistant({
        status: "authenticated",
        subscriptionTier: "FREE",
        pathname: "/dashboard",
      }),
    ).toBe(false)
  })

  it("denies premium users on public auth pages", () => {
    expect(
      canAccessLearningAssistant({
        status: "authenticated",
        subscriptionTier: "PREMIUM",
        pathname: "/login",
      }),
    ).toBe(false)
  })
})

describe("isAuthMarketingPath", () => {
  it("matches signup and forgot-password", () => {
    expect(isAuthMarketingPath("/signup")).toBe(true)
    expect(isAuthMarketingPath("/forgot-password")).toBe(true)
    expect(isAuthMarketingPath("/phase-0")).toBe(false)
  })
})
