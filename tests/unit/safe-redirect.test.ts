import { describe, expect, it } from "vitest"
import {
  getSafeClientRelativeRedirect,
  isAllowedStripeCheckoutRedirectUrl,
  isSafeRelativeCallbackPath,
} from "@/lib/safe-redirect"

describe("isSafeRelativeCallbackPath", () => {
  it("allows root-relative paths", () => {
    expect(isSafeRelativeCallbackPath("/dashboard")).toBe(true)
    expect(isSafeRelativeCallbackPath("/phase-2/foo")).toBe(true)
  })

  it("rejects open-redirect patterns", () => {
    expect(isSafeRelativeCallbackPath("//evil.com")).toBe(false)
    expect(isSafeRelativeCallbackPath("https://evil.com")).toBe(false)
    expect(isSafeRelativeCallbackPath(String.raw`/\evil`)).toBe(false)
    expect(isSafeRelativeCallbackPath("relative")).toBe(false)
  })
})

describe("getSafeClientRelativeRedirect", () => {
  it("returns safe path or fallback", () => {
    expect(getSafeClientRelativeRedirect("/ok", "/")).toBe("/ok")
    expect(getSafeClientRelativeRedirect("//evil", "/home")).toBe("/home")
    expect(getSafeClientRelativeRedirect(undefined, "/")).toBe("/")
  })
})

describe("isAllowedStripeCheckoutRedirectUrl", () => {
  it("allows Stripe checkout HTTPS URLs", () => {
    expect(
      isAllowedStripeCheckoutRedirectUrl("https://checkout.stripe.com/c/pay/cs_test_abc"),
    ).toBe(true)
  })

  it("rejects non-HTTPS and non-Stripe hosts", () => {
    expect(isAllowedStripeCheckoutRedirectUrl("http://checkout.stripe.com/pay")).toBe(false)
    expect(isAllowedStripeCheckoutRedirectUrl("https://evil.com/")).toBe(false)
    expect(isAllowedStripeCheckoutRedirectUrl("https://phishing-stripe.com.fake/")).toBe(false)
    expect(isAllowedStripeCheckoutRedirectUrl("not-a-valid-url")).toBe(false)
  })
})
