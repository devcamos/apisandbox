import { describe, expect, it } from "vitest"
import {
  computeGuideUnderstandingPercent,
  createEmptyGuideSteps,
  isGuideComplete,
  parseGuideSteps,
} from "@/lib/learning/app-guide"

describe("app-guide", () => {
  it("parses empty steps", () => {
    const steps = parseGuideSteps(null)
    expect(steps.read_docs.understood).toBe(false)
    expect(computeGuideUnderstandingPercent(steps)).toBe(0)
  })

  it("computes understanding percent", () => {
    const steps = createEmptyGuideSteps()
    steps.read_docs.understood = true
    steps.try_demos.understood = true
    expect(computeGuideUnderstandingPercent(steps)).toBe(50)
  })

  it("detects guide complete", () => {
    const steps = createEmptyGuideSteps()
    for (const id of Object.keys(steps) as (keyof typeof steps)[]) {
      steps[id].understood = true
    }
    expect(isGuideComplete(steps, null)).toBe(true)
    expect(isGuideComplete(steps, new Date())).toBe(true)
  })
})
