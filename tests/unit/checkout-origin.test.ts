import { describe, expect, it } from "vitest"
import { checkoutIdempotencyKey, resolveBillingOrigin } from "@/lib/billing/checkout-origin"

const preview = {
  VERCEL_ENV: "preview", NODE_ENV: "production", NEXT_PUBLIC_APP_URL: "https://production.example",
  VERCEL_BRANCH_URL: "apisandbox-git-feature-a-owner.vercel.app",
  VERCEL_URL: "apisandbox-hash-owner.vercel.app",
}

describe("resolveBillingOrigin", () => {
  it("uses the trusted branch URL ahead of the deployment and canonical URLs", () => {
    expect(resolveBillingOrigin(preview)).toBe("https://apisandbox-git-feature-a-owner.vercel.app")
    expect(resolveBillingOrigin({ ...preview, VERCEL_BRANCH_URL: "apisandbox-git-feature-b-owner.vercel.app" }))
      .toBe("https://apisandbox-git-feature-b-owner.vercel.app")
  })

  it("retains the active origin for either trusted branch alias or immutable deployment", () => {
    for (const host of [preview.VERCEL_BRANCH_URL, preview.VERCEL_URL]) {
      expect(resolveBillingOrigin(preview, `https://${host}`)).toBe(`https://${host}`)
    }
  })

  it.each([
    "https://attacker.example", "https://apisandbox-hash-owner.vercel.app.attacker.example",
    "https://user@apisandbox-hash-owner.vercel.app", "http://apisandbox-hash-owner.vercel.app",
    "https://apisandbox-hash-owner.vercel.app/path", "https://apisandbox-hash-owner.vercel.app?next=evil",
    "https://other-branch.vercel.app", "https://production.example",
  ])("never reflects an origin outside the exact server allowlist: %s", (requestedOrigin) => {
    expect(resolveBillingOrigin(preview, requestedOrigin)).toBe(`https://${preview.VERCEL_BRANCH_URL}`)
  })

  it("cannot use a request origin to recover invalid Preview environment configuration", () => {
    expect(() => resolveBillingOrigin({ VERCEL_ENV: "preview" }, `https://${preview.VERCEL_URL}`))
      .toThrow("Preview billing requires a valid Vercel deployment URL")
  })

  it("ignores requested Preview origins on Production", () => {
    expect(resolveBillingOrigin({ ...preview, VERCEL_ENV: "production" }, `https://${preview.VERCEL_URL}`))
      .toBe("https://production.example")
  })

  it("separates idempotency for branch and deployment origins even with shared billing data", () => {
    const branch = resolveBillingOrigin(preview, `https://${preview.VERCEL_BRANCH_URL}`)
    const deployment = resolveBillingOrigin(preview, `https://${preview.VERCEL_URL}`)
    expect(checkoutIdempotencyKey("user-1", "price-1", branch, 300_000))
      .not.toBe(checkoutIdempotencyKey("user-1", "price-1", deployment, 300_000))
  })

  it("uses the deployment URL when the branch URL is unavailable or invalid", () => {
    for (const value of [undefined, "", "evil.example", "https://branch.vercel.app", "branch.vercel.app/path"]) {
      expect(resolveBillingOrigin({ ...preview, VERCEL_BRANCH_URL: value }))
        .toBe("https://apisandbox-hash-owner.vercel.app")
    }
  })

  it.each([
    "attacker.example", "branch.vercel.app.evil.example", "user@branch.vercel.app", "branch.vercel.app:443",
    "branch.vercel.app/path", "branch.vercel.app?next=evil", "branch.vercel.app#fragment", "branch..vercel.app",
    "-branch.vercel.app", "branch-.vercel.app", "https://branch.vercel.app", "//branch.vercel.app", "",
  ])("rejects untrusted Preview host %j without falling back to Production", (host) => {
    expect(() => resolveBillingOrigin({ ...preview, VERCEL_BRANCH_URL: host, VERCEL_URL: host }))
      .toThrow("Preview billing requires a valid Vercel deployment URL")
  })

  it("normalizes configured whitespace/case", () => {
    expect(resolveBillingOrigin({ ...preview, VERCEL_BRANCH_URL: "  BRANCH.vercel.app  " }))
      .toBe("https://branch.vercel.app")
  })

  it("keeps Production on its configured canonical origin regardless of deployment hosts", () => {
    expect(resolveBillingOrigin({ ...preview, VERCEL_ENV: "production", NEXT_PUBLIC_APP_URL: "https://canonical.example/" }))
      .toBe("https://canonical.example")
  })

  it("supports configured local/development and explicit local CI origins", () => {
    expect(resolveBillingOrigin({ NEXT_PUBLIC_APP_URL: "http://localhost:4000/" })).toBe("http://localhost:4000")
    expect(resolveBillingOrigin({ NEXT_PUBLIC_APP_URL: "http://dev.internal:4000", VERCEL_ENV: "development", NODE_ENV: "production" }))
      .toBe("http://dev.internal:4000")
    expect(resolveBillingOrigin({ NEXT_PUBLIC_APP_URL: "http://127.0.0.1:4000", NODE_ENV: "production", CI: "true" }))
      .toBe("http://127.0.0.1:4000")
  })

  it.each([
    undefined, "", "not a URL", "javascript:alert(1)", "https://user:password@example.com", "https://example.com/path",
    "https://example.com?return=evil", "https://example.com#fragment", "http://example.com", "https://localhost",
  ])("fails closed for invalid Production app URL %j", (appUrl) => {
    expect(() => resolveBillingOrigin({ VERCEL_ENV: "production", NEXT_PUBLIC_APP_URL: appUrl })).toThrow()
  })

  it("never allows the CI loopback exception on the Production target", () => {
    expect(() => resolveBillingOrigin({ VERCEL_ENV: "production", NEXT_PUBLIC_APP_URL: "http://localhost:4000", CI: "true" })).toThrow()
  })
})

describe("checkoutIdempotencyKey", () => {
  it("reuses sessions only for the same user, price, origin and time bucket", () => {
    const base = checkoutIdempotencyKey("user-1", "price-1", "https://branch-a.vercel.app", 300_000)
    expect(checkoutIdempotencyKey("user-1", "price-1", "https://branch-a.vercel.app", 599_999)).toBe(base)
    expect(checkoutIdempotencyKey("user-1", "price-1", "https://branch-b.vercel.app", 300_000)).not.toBe(base)
    expect(checkoutIdempotencyKey("user-2", "price-1", "https://branch-a.vercel.app", 300_000)).not.toBe(base)
    expect(checkoutIdempotencyKey("user-1", "price-2", "https://branch-a.vercel.app", 300_000)).not.toBe(base)
    expect(checkoutIdempotencyKey("user-1", "price-1", "https://branch-a.vercel.app", 600_000)).not.toBe(base)
  })
})
