import { afterEach, describe, expect, it } from "vitest"
import { getGoogleClientId, isGoogleAuthConfigured } from "@/lib/google-client-id"

const originalPublic = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const originalServer = process.env.GOOGLE_CLIENT_ID

afterEach(() => {
  if (originalPublic === undefined) {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  } else {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalPublic
  }
  if (originalServer === undefined) {
    delete process.env.GOOGLE_CLIENT_ID
  } else {
    process.env.GOOGLE_CLIENT_ID = originalServer
  }
})

describe("getGoogleClientId", () => {
  it("prefers NEXT_PUBLIC_GOOGLE_CLIENT_ID when set", () => {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = " public-client-id "
    process.env.GOOGLE_CLIENT_ID = "server-client-id"
    expect(getGoogleClientId()).toBe("public-client-id")
  })

  it("falls back to GOOGLE_CLIENT_ID for runtime server config", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    process.env.GOOGLE_CLIENT_ID = " server-only-client-id "
    expect(getGoogleClientId()).toBe("server-only-client-id")
    expect(isGoogleAuthConfigured()).toBe(true)
  })

  it("returns empty when unset", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_ID
    expect(getGoogleClientId()).toBe("")
    expect(isGoogleAuthConfigured()).toBe(false)
  })
})
