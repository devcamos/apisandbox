import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const checkRateLimitMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/rate-limit", () => ({
  apiLimiter: { limit: vi.fn() },
  checkRateLimit: checkRateLimitMock,
  rateLimitHeaders: (result: { remaining: number; resetAt: number }) => ({
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt),
  }),
}))

import { applyV1TokenRateLimit, attachV1RateLimitHeaders } from "@/lib/api/v1/rate-limit"
import { REQUEST_ID_HEADER } from "@/lib/api/v1/request-id"
import { NextResponse } from "next/server"

describe("applyV1TokenRateLimit", () => {
  beforeEach(() => {
    checkRateLimitMock.mockReset()
  })

  it("allows requests when the limiter permits them", async () => {
    checkRateLimitMock.mockResolvedValue({
      allowed: true,
      remaining: 99,
      resetAt: Date.now() + 60_000,
    })

    const result = await applyV1TokenRateLimit(
      new NextRequest("http://localhost/api/v1/me"),
      "tok_1",
      "req-1",
    )

    expect(result.blocked).toBeNull()
    expect(checkRateLimitMock).toHaveBeenCalledWith("v1:tok_1", expect.anything())
  })

  it("returns 429 problem+json with Retry-After when limited", async () => {
    const resetAt = Date.now() + 15_000
    checkRateLimitMock.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt,
    })

    const result = await applyV1TokenRateLimit(
      new NextRequest("http://localhost/api/v1/me"),
      "tok_1",
      "req-429",
    )

    expect(result.blocked).not.toBeNull()
    const response = result.blocked!
    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toBeTruthy()
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe("req-429")
    const body = await response.json()
    expect(body.code).toBe("rate_limited")
    expect(body.requestId).toBe("req-429")
  })

  it("fails open when the limiter throws", async () => {
    checkRateLimitMock.mockRejectedValue(new Error("upstash down"))

    const result = await applyV1TokenRateLimit(
      new NextRequest("http://localhost/api/v1/me"),
      "tok_1",
      "req-open",
    )

    expect(result.blocked).toBeNull()
    if (result.blocked !== null) return
    expect(result.result.allowed).toBe(true)
  })
})

describe("attachV1RateLimitHeaders", () => {
  it("copies X-RateLimit headers onto the response", () => {
    const response = NextResponse.json({ ok: true })
    const withHeaders = attachV1RateLimitHeaders(response, {
      allowed: true,
      remaining: 42,
      resetAt: 0,
    })
    expect(withHeaders.headers.get("X-RateLimit-Remaining")).toBe("42")
  })

  it("adds IETF RateLimit headers when resetAt is set", () => {
    const resetAt = Date.now() + 60_000
    const response = NextResponse.json({ ok: true })
    const withHeaders = attachV1RateLimitHeaders(response, {
      allowed: true,
      remaining: 10,
      resetAt,
    })
    expect(withHeaders.headers.get("RateLimit-Limit")).toBe("100")
    expect(withHeaders.headers.get("RateLimit-Remaining")).toBe("10")
    expect(withHeaders.headers.get("RateLimit-Reset")).toBeTruthy()
  })
})
