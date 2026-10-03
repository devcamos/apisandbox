import { describe, expect, it } from "vitest"
import { isAssistantEnabled } from "@/lib/assistant/enabled"

describe("isAssistantEnabled", () => {
  it("is off when VERCEL_ENV is production", () => {
    expect(
      isAssistantEnabled({
        VERCEL_ENV: "production",
        NODE_ENV: "production",
      }),
    ).toBe(false)
  })

  it("is on when VERCEL_ENV is preview", () => {
    expect(
      isAssistantEnabled({
        VERCEL_ENV: "preview",
        NODE_ENV: "production",
      }),
    ).toBe(true)
  })

  it("is on when VERCEL_ENV is development", () => {
    expect(
      isAssistantEnabled({
        VERCEL_ENV: "development",
        NODE_ENV: "development",
      }),
    ).toBe(true)
  })

  it("is on for local development without VERCEL_ENV", () => {
    expect(
      isAssistantEnabled({
        NODE_ENV: "development",
      }),
    ).toBe(true)
  })

  it("is on for unit tests without VERCEL_ENV", () => {
    expect(
      isAssistantEnabled({
        NODE_ENV: "test",
      }),
    ).toBe(true)
  })

  it("is off for production Node builds without VERCEL_ENV", () => {
    expect(
      isAssistantEnabled({
        NODE_ENV: "production",
      }),
    ).toBe(false)
  })
})
