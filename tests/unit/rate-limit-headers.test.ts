import { describe, expect, it } from "vitest"
import { rateLimitHeaders } from "@/lib/rate-limit"

describe("rateLimitHeaders", () => {
  it("includes Retry-After when the request is blocked", () => {
    const resetAt = Date.now() + 45_000
    const headers = rateLimitHeaders({
      allowed: false,
      remaining: 0,
      resetAt,
    }) as Record<string, string>

    expect(headers["X-RateLimit-Remaining"]).toBe("0")
    expect(headers["X-RateLimit-Reset"]).toBe(String(resetAt))
    expect(Number(headers["Retry-After"])).toBeGreaterThanOrEqual(1)
    expect(Number(headers["Retry-After"])).toBeLessThanOrEqual(45)
  })

  it("omits Retry-After when the request is allowed", () => {
    const headers = rateLimitHeaders({
      allowed: true,
      remaining: 2,
      resetAt: Date.now() + 60_000,
    }) as Record<string, string>

    expect(headers["Retry-After"]).toBeUndefined()
    expect(headers["X-RateLimit-Remaining"]).toBe("2")
  })
})
