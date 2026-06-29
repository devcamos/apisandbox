import { describe, expect, it } from "vitest"

import { classifyResult } from "../../scripts/test-openai-key.mjs"

describe("OpenAI API key test output", () => {
  it("distinguishes invalid credentials from permission failures", () => {
    expect(classifyResult(401, "invalid_api_key")).toContain("Invalid")
    expect(classifyResult(403, "permission_denied")).toContain("lacks permission")
  })

  it("distinguishes quota exhaustion from rate limiting", () => {
    expect(classifyResult(429, "insufficient_quota")).toContain("insufficient quota")
    expect(classifyResult(429, "rate_limit_exceeded")).toContain("rate limit")
  })

  it("treats network and unexpected errors as inconclusive", () => {
    expect(classifyResult(0, "")).toContain("inconclusive")
  })
})
