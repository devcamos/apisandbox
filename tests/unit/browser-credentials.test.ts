import { afterEach, describe, expect, it, vi } from "vitest"
import { promptSavePasswordCredential } from "@/lib/browser-credentials"

describe("promptSavePasswordCredential", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("no-ops when email or password is empty", async () => {
    const store = vi.fn()
    vi.stubGlobal("navigator", { credentials: { store } })

    await promptSavePasswordCredential("", "secret")
    await promptSavePasswordCredential("user@example.com", "")

    expect(store).not.toHaveBeenCalled()
  })

  it("no-ops when PasswordCredential API is unavailable", async () => {
    const store = vi.fn()
    vi.stubGlobal("navigator", { credentials: { store } })
    vi.stubGlobal("PasswordCredential", undefined)

    await promptSavePasswordCredential("user@example.com", "secret")

    expect(store).not.toHaveBeenCalled()
  })

  it("stores a normalized credential when the browser API is available", async () => {
    const store = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { credentials: { store } })

    class MockPasswordCredential {
      id: string
      password: string
      name?: string

      constructor(data: { id: string; password: string; name?: string }) {
        this.id = data.id
        this.password = data.password
        this.name = data.name
      }
    }
    vi.stubGlobal("PasswordCredential", MockPasswordCredential)

    await promptSavePasswordCredential("  User@Example.COM  ", "secret123")

    expect(store).toHaveBeenCalledOnce()
    const credential = store.mock.calls[0]?.[0] as MockPasswordCredential
    expect(credential.id).toBe("user@example.com")
    expect(credential.password).toBe("secret123")
    expect(credential.name).toBe("user@example.com")
  })

  it("swallows store failures when the user dismisses the prompt", async () => {
    const store = vi.fn().mockRejectedValue(new Error("dismissed"))
    vi.stubGlobal("navigator", { credentials: { store } })

    class MockPasswordCredential {
      constructor(_data: { id: string; password: string; name?: string }) {}
    }
    vi.stubGlobal("PasswordCredential", MockPasswordCredential)

    await expect(
      promptSavePasswordCredential("user@example.com", "secret123"),
    ).resolves.toBeUndefined()
  })
})
