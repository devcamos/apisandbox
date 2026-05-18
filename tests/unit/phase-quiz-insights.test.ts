import { describe, expect, test } from "vitest"
import { masteryLabel, masterySummary, recommendedRedirects } from "@/lib/learning/phase-quiz-insights"

describe("phase quiz insights", () => {
  test("maps score bands to mastery labels", () => {
    expect(masteryLabel(3, 3)).toBe("Ready for the next phase")
    expect(masteryLabel(3, 4)).toBe("Strong grasp")
    expect(masteryLabel(2, 4)).toBe("Building understanding")
    expect(masteryLabel(1, 4)).toBe("Needs reinforcement")
  })

  test("summarises strengths and gaps by concept", () => {
    const summary = masterySummary([
      { questionId: "a", concept: "HTTP semantics", isCorrect: true },
      { questionId: "b", concept: "OAuth2", isCorrect: false },
      { questionId: "c", concept: "OAuth2", isCorrect: false },
    ])

    expect(summary.strengths).toEqual(["HTTP semantics"])
    expect(summary.gaps).toEqual(["OAuth2"])
  })

  test("deduplicates redirect recommendations", () => {
    const redirects = recommendedRedirects([
      {
        questionId: "a",
        concept: "Retries",
        isCorrect: false,
        redirect: { href: "/phase-2/demos/retry", label: "Open the retry demo" },
      },
      {
        questionId: "b",
        concept: "Retries",
        isCorrect: false,
        redirect: { href: "/phase-2/demos/retry", label: "Open the retry demo" },
      },
      {
        questionId: "c",
        concept: "OAuth2",
        isCorrect: true,
        redirect: { href: "/phase-2/demos/oauth2", label: "Open the OAuth2 demo" },
      },
    ])

    expect(redirects).toEqual([{ href: "/phase-2/demos/retry", label: "Open the retry demo" }])
  })
})

