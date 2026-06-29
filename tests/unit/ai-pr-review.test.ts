import { describe, expect, it } from "vitest"

import { describeGeminiError, redactSecrets } from "../../scripts/ai-pr-review.mjs"

describe("PR architecture review failures", () => {
  it("redacts exact and recognizable Gemini API keys", () => {
    const key = "AIzaRealGeminiSecretValue123456789"

    expect(redactSecrets(`Rejected ${key}`, key)).toBe("Rejected [redacted Gemini API key]")
    expect(redactSecrets("Rejected AIzaAnotherGeminiSecretValue98765", "different-key")).toBe(
      "Rejected [redacted Gemini API key]",
    )
  })

  it("turns an authentication error into actionable output without echoing the API message", () => {
    const result = describeGeminiError({
      status: 400,
      message: "API key not valid: AIzaAnotherGeminiSecretValue98765",
    })

    expect(result.reason).toBe("Gemini authentication failed (HTTP 400).")
    expect(result.recovery).toContain("GEMINI_API_KEY")
    expect(JSON.stringify(result)).not.toContain("98765")
  })

  it("explains that an unavailable custom model can be removed", () => {
    const result = describeGeminiError({ status: 404 }, "custom-review-model")

    expect(result.reason).toContain("custom-review-model")
    expect(result.recovery).toContain("GEMINI_REVIEW_MODEL")
  })

  it("identifies free-tier quota exhaustion", () => {
    const result = describeGeminiError({ status: 429 })

    expect(result.reason).toContain("free-tier quota")
    expect(result.recovery).toContain("Google AI Studio")
  })
})
