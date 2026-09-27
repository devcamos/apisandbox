import { describe, expect, it, vi } from "vitest"
import { adoptAutofilledValue, readAutofilledValue } from "@/lib/auth/autofill-sync"

describe("autofill-sync", () => {
  it("reads the DOM value from an input", () => {
    const el = { value: "autofilled@example.com" } as HTMLInputElement
    expect(readAutofilledValue(el)).toBe("autofilled@example.com")
    expect(readAutofilledValue(null)).toBe("")
  })

  it("adopts a DOM value when React state is still empty", () => {
    const setValue = vi.fn()
    const el = { value: "secret" } as HTMLInputElement
    adoptAutofilledValue(el, "", setValue)
    expect(setValue).toHaveBeenCalledWith("secret")
  })

  it("does not overwrite matching React state", () => {
    const setValue = vi.fn()
    const el = { value: "same" } as HTMLInputElement
    adoptAutofilledValue(el, "same", setValue)
    expect(setValue).not.toHaveBeenCalled()
  })
})
