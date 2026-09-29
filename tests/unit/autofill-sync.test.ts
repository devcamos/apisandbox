import { describe, expect, it, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { createRef } from "react"
import {
  adoptAutofilledValue,
  readAutofilledValue,
  syncValueFromDom,
  syncValueFromEvent,
  useAutofillSync,
} from "@/lib/auth/autofill-sync"

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

  it("syncValueFromDom always returns the live DOM value and updates when different", () => {
    const setValue = vi.fn()
    const el = { value: "from-dom@example.com" } as HTMLInputElement
    expect(syncValueFromDom(el, "", setValue)).toBe("from-dom@example.com")
    expect(setValue).toHaveBeenCalledWith("from-dom@example.com")
  })

  it("syncValueFromEvent prefers currentTarget over stale React state", () => {
    const setValue = vi.fn()
    const event = {
      currentTarget: { value: "picked-from-autofill@example.com" } as HTMLInputElement,
    }
    expect(syncValueFromEvent(event, setValue)).toBe("picked-from-autofill@example.com")
    expect(setValue).toHaveBeenCalledWith("picked-from-autofill@example.com")
  })

  it("useAutofillSync adopts a silent DOM fill while the field is focused", () => {
    vi.useFakeTimers()
    const input = document.createElement("input")
    document.body.appendChild(input)
    const ref = createRef<HTMLInputElement>()
    Object.assign(ref, { current: input })

    let current = ""
    const setValue = vi.fn((next: string) => {
      current = next
    })

    renderHook(() =>
      useAutofillSync([
        {
          ref,
          getCurrent: () => current,
          setValue,
        },
      ]),
    )

    act(() => {
      input.dispatchEvent(new FocusEvent("focus"))
    })

    // Chrome-style silent fill: DOM value changes with no input/change event.
    input.value = "silent-autofill@example.com"

    act(() => {
      vi.advanceTimersByTime(60)
    })

    expect(setValue).toHaveBeenCalledWith("silent-autofill@example.com")
    expect(current).toBe("silent-autofill@example.com")

    act(() => {
      input.dispatchEvent(new FocusEvent("blur"))
    })
    vi.useRealTimers()
    input.remove()
  })
})
