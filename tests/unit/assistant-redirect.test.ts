import { describe, expect, test } from "vitest"
import { inferAssistantRedirect } from "@/lib/assistant/redirect"

describe("inferAssistantRedirect", () => {
  test("suggests retry demo when asking about retries on a different page", () => {
    const r = inferAssistantRedirect({ message: "How should I do retries with backoff?", pathname: "/phase-0" })
    expect(r?.href).toBe("/phase-2/demos/retry")
  })

  test("does not suggest redirect when already on target page", () => {
    const r = inferAssistantRedirect({ message: "retry backoff", pathname: "/phase-2/demos/retry" })
    expect(r).toBeNull()
  })

  test("does not suggest redirect when already on a child of the target page", () => {
    const r = inferAssistantRedirect({ message: "retry backoff", pathname: "/phase-2/demos/retry/walkthrough" })
    expect(r).toBeNull()
  })

  test("suggests Java track for Java/Spring questions from other pages", () => {
    const r = inferAssistantRedirect({ message: "What is ObjectMapper in Spring?", pathname: "/phase-0" })
    expect(r?.href).toBe("/docs/java")
  })

  test("returns null when no rule matches the message", () => {
    const r = inferAssistantRedirect({ message: "what is the weather today?", pathname: "/phase-0" })
    expect(r).toBeNull()
  })

  test("falls back to root pathname when an empty pathname is provided", () => {
    const r = inferAssistantRedirect({ message: "tell me about jwt claims", pathname: "" })
    expect(r?.href).toBe("/phase-2/demos/jwt")
  })
})

