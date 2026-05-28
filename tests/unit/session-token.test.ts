import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { readSessionCookieToken } from "@/lib/auth/session-token"

describe("readSessionCookieToken", () => {
  it("reads auth_token cookie", () => {
    const req = new NextRequest("http://localhost:4000/dashboard", {
      headers: { cookie: "auth_token=abc123" },
    })
    expect(readSessionCookieToken(req)).toBe("abc123")
  })

  it("falls back to legacy next-auth cookies", () => {
    const req = new NextRequest("http://localhost:4000/dashboard", {
      headers: { cookie: "__Secure-next-auth.session-token=legacy" },
    })
    expect(readSessionCookieToken(req)).toBe("legacy")
  })
})
