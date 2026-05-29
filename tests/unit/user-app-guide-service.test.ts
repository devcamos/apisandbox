import { describe, expect, it } from "vitest"
import { createEmptyGuideSteps } from "@/lib/learning/app-guide"
import { toGuideResponse } from "@/lib/services/user-app-guide-service"

describe("toGuideResponse", () => {
  it("shows quick start for new incomplete users", () => {
    const steps = createEmptyGuideSteps()
    const createdAt = new Date()
    const res = toGuideResponse(
      { steps, completedAt: null, updatedAt: new Date() },
      createdAt,
    )
    expect(res.showQuickStart).toBe(true)
    expect(res.understandingPercent).toBe(0)
    expect(res.isComplete).toBe(false)
  })

  it("hides quick start when guide is complete", () => {
    const steps = createEmptyGuideSteps()
    for (const id of Object.keys(steps) as (keyof typeof steps)[]) {
      steps[id].understood = true
    }
    const res = toGuideResponse(
      { steps, completedAt: new Date(), updatedAt: new Date() },
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    )
    expect(res.showQuickStart).toBe(false)
    expect(res.isComplete).toBe(true)
    expect(res.understandingPercent).toBe(100)
  })
})
