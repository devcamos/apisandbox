import { describe, expect, it } from "vitest"
import {
  ASSISTANT_MAX_HISTORY_ITEM_CHARS,
  ASSISTANT_MAX_MESSAGE_CHARS,
  isAbortError,
  validateAssistantInput,
} from "@/lib/assistant/limits"

describe("validateAssistantInput", () => {
  it("accepts a normal message and trims history to the last items", () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `msg-${i}`,
    }))
    const result = validateAssistantInput({
      message: "How do retries work?",
      pathname: "/phase-0",
      mode: "guided",
      history,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.history).toHaveLength(12)
    expect(result.history[0]?.content).toBe("msg-3")
    expect(result.message).toBe("How do retries work?")
  })

  it("rejects oversized messages with 413", () => {
    const result = validateAssistantInput({
      message: "x".repeat(ASSISTANT_MAX_MESSAGE_CHARS + 1),
    })
    expect(result).toEqual({
      ok: false,
      status: 413,
      error: `Message exceeds the ${ASSISTANT_MAX_MESSAGE_CHARS} character limit.`,
    })
  })

  it("rejects oversized history items with 413", () => {
    const result = validateAssistantInput({
      message: "ok",
      history: [{ role: "user", content: "y".repeat(ASSISTANT_MAX_HISTORY_ITEM_CHARS + 1) }],
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.status).toBe(413)
  })

  it("rejects missing message with 400", () => {
    expect(validateAssistantInput({})).toEqual({
      ok: false,
      status: 400,
      error: "Invalid request",
    })
  })
})

describe("isAbortError", () => {
  it("detects AbortError and TimeoutError names", () => {
    expect(isAbortError(Object.assign(new Error("aborted"), { name: "AbortError" }))).toBe(true)
    expect(isAbortError(Object.assign(new Error("timed out"), { name: "TimeoutError" }))).toBe(true)
    expect(isAbortError(new Error("boom"))).toBe(false)
  })
})
