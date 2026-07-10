import { describe, expect, it } from "vitest"

import {
  getDocumentationKeywords,
  phaseDocumentationKeywords,
} from "../../lib/learning/documentation-keywords"

describe("phase documentation keywords", () => {
  it("highlights the OAuth2 token lifecycle", () => {
    expect(getDocumentationKeywords("OAuth2")).toEqual([
      "authorization code",
      "PKCE",
      "access token",
      "refresh token",
      "scopes",
    ])
  })

  it("provides concise, unique keywords for every configured document", () => {
    for (const keywords of Object.values(phaseDocumentationKeywords)) {
      expect(keywords.length).toBeGreaterThanOrEqual(3)
      expect(keywords.length).toBeLessThanOrEqual(5)
      expect(new Set(keywords).size).toBe(keywords.length)
    }
  })

  it("returns no badges for documents without a phase keyword definition", () => {
    expect(getDocumentationKeywords("Unknown document")).toEqual([])
  })
})
