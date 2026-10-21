import { runInNewContext } from "node:vm"
import type { Page } from "@playwright/test"
import { describe, expect, it, vi } from "vitest"
import { AUTH_JWT_STORAGE_KEY } from "../../lib/auth/client-fetch"
import { injectAuthToken } from "../helpers/premium-helpers"

async function injectedStorageWrites(frameOrigin: string, allowedOrigin?: string) {
  const setItem = vi.fn()
  const page = {
    addInitScript: vi.fn(async (script: (...args: unknown[]) => unknown, args: unknown) => {
      runInNewContext(`(${script.toString()})(args)`, {
        args,
        globalThis: { location: { origin: frameOrigin } },
        window: { localStorage: { setItem } },
      })
    }),
  } as unknown as Page
  await injectAuthToken(page, "test-jwt-value", allowedOrigin)
  return setItem
}

describe("Preview auth initializer origin boundary", () => {
  it("makes the JWT available on the explicitly allowed application origin", async () => {
    const origin = "https://apisandbox-git-feature-example.vercel.app"
    const setItem = await injectedStorageWrites(origin, origin)
    expect(setItem).toHaveBeenCalledExactlyOnceWith(AUTH_JWT_STORAGE_KEY, "test-jwt-value")
  })

  it.each([
    "https://checkout.stripe.com",
    "https://js.stripe.com",
    "https://apisandbox-git-other-example.vercel.app",
    "https://apisandbox-git-feature-example.vercel.app.untrusted.example",
    "null",
  ])("never writes the JWT on a foreign or opaque frame origin: %s", async (frameOrigin) => {
    const setItem = await injectedStorageWrites(frameOrigin, "https://apisandbox-git-feature-example.vercel.app")
    expect(setItem).not.toHaveBeenCalled()
  })

  it("preserves existing unscoped local-only callers", async () => {
    const setItem = await injectedStorageWrites("http://localhost:4000")
    expect(setItem).toHaveBeenCalledExactlyOnceWith(AUTH_JWT_STORAGE_KEY, "test-jwt-value")
  })
})
