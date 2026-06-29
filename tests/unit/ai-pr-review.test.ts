import { describe, expect, it } from "vitest"

import { describeOpenAIError, redactSecrets } from "../../scripts/ai-pr-review.mjs"

describe("PR architecture review failures", () => {
  it("redacts exact and recognizable OpenAI API keys", () => {
    const key = "sk-proj-realSecretValue123"

    expect(redactSecrets(`Rejected ${key}`, key)).toBe("Rejected [redacted OpenAI API key]")
    expect(redactSecrets("Rejected sk-proj-********abcd", "different-key")).toBe(
      "Rejected [redacted OpenAI API key]",
    )
  })

  it("turns an authentication error into actionable output without echoing the API message", () => {
    const result = describeOpenAIError({
      status: 401,
      message: "Incorrect API key provided: sk-proj-********abcd",
    })

    expect(result.reason).toBe("OpenAI authentication failed (HTTP 401).")
    expect(result.recovery).toContain("OPENAI_API_KEY")
    expect(JSON.stringify(result)).not.toContain("abcd")
  })

  it("explains that an unavailable custom model can be removed", () => {
    const result = describeOpenAIError({ status: 404 }, "custom-review-model")

    expect(result.reason).toContain("custom-review-model")
    expect(result.recovery).toContain("OPENAI_REVIEW_MODEL")
  })
})
