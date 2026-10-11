import { describe, expect, it } from "vitest"
import { getPhaseLessonPlan } from "@/lib/lessons/phase-lessons"

describe("EP226 phase lessons", () => {
  it("registers design-decision modules on phase 1", () => {
    const plan = getPhaseLessonPlan(1)
    expect(plan).toBeDefined()
    const ids = plan!.modules.map((lesson) => lesson.id)
    expect(ids).toEqual(expect.arrayContaining(["resource-naming", "pagination", "api-documentation"]))

    for (const id of ["resource-naming", "pagination", "api-documentation"] as const) {
      const lesson = plan!.modules.find((entry) => entry.id === id)
      expect(lesson?.checkpoints.map((checkpoint) => checkpoint.id)).toEqual([
        "context",
        "model",
        "contrast",
        "decision",
      ])
    }
  })

  it("registers security and webhook modules on phase 2 with /api/v1 worked examples", () => {
    const plan = getPhaseLessonPlan(2)
    expect(plan).toBeDefined()
    const ids = plan!.modules.map((lesson) => lesson.id)
    expect(ids).toEqual(expect.arrayContaining(["token-scopes", "permissions", "webhooks"]))

    const scopes = plan!.modules.find((lesson) => lesson.id === "token-scopes")
    const scopesText = scopes?.checkpoints
      .flatMap((checkpoint) => [checkpoint.prompt, checkpoint.answerGuide, checkpoint.projectTask])
      .filter(Boolean)
      .join("\n")
    expect(scopesText).toContain("/api/v1")
    expect(scopesText).toContain("insufficient_scope")
    expect(scopesText).toContain("profile:read")

    for (const id of ["token-scopes", "permissions", "webhooks"] as const) {
      const lesson = plan!.modules.find((entry) => entry.id === id)
      expect(lesson?.checkpoints.map((checkpoint) => checkpoint.id)).toEqual([
        "integrity",
        "mechanics",
        "failure",
        "ops",
      ])
    }
  })

  it("keeps existing phase-2 oauth module ids stable", () => {
    const plan = getPhaseLessonPlan(2)
    expect(plan?.modules.some((lesson) => lesson.id === "oauth-flow")).toBe(true)
    expect(plan?.modules.find((lesson) => lesson.id === "oauth-flow")?.checkpoints[0]?.id).toBe("integrity")
  })
})
