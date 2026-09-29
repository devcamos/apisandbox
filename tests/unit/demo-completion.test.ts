import { describe, expect, it } from "vitest"
import {
  isPhaseQuizFullyComplete,
  shouldShowDemoPhase1Completion,
  shouldShowDemoPhase1LessonCompletion,
} from "@/lib/demo-completion"

describe("demo-completion", () => {
  it("detects full quiz completion from latest perfect result", () => {
    expect(
      isPhaseQuizFullyComplete(null, { correctAnswers: 5, totalQuestions: 5 }),
    ).toBe(true)
    expect(
      isPhaseQuizFullyComplete(null, { correctAnswers: 4, totalQuestions: 5 }),
    ).toBe(false)
  })

  it("detects full quiz completion from stored progress", () => {
    expect(
      isPhaseQuizFullyComplete({
        completedAt: "2026-09-27T12:00:00.000Z",
        correctAnswers: 5,
        totalQuestions: 5,
      }),
    ).toBe(true)
    expect(
      isPhaseQuizFullyComplete({
        completedAt: null,
        correctAnswers: 5,
        totalQuestions: 5,
      }),
    ).toBe(true)
    expect(
      isPhaseQuizFullyComplete({
        completedAt: null,
        correctAnswers: 2,
        totalQuestions: 5,
      }),
    ).toBe(false)
  })

  it("shows Phase 1 completion prompt only for demo users on phase 1", () => {
    expect(
      shouldShowDemoPhase1Completion({
        isDemo: true,
        phaseNumber: 1,
        result: { correctAnswers: 5, totalQuestions: 5 },
      }),
    ).toBe(true)

    expect(
      shouldShowDemoPhase1Completion({
        isDemo: false,
        phaseNumber: 1,
        result: { correctAnswers: 5, totalQuestions: 5 },
      }),
    ).toBe(false)

    expect(
      shouldShowDemoPhase1Completion({
        isDemo: true,
        phaseNumber: 2,
        result: { correctAnswers: 5, totalQuestions: 5 },
      }),
    ).toBe(false)

    expect(
      shouldShowDemoPhase1Completion({
        isDemo: true,
        phaseNumber: 1,
        result: { correctAnswers: 3, totalQuestions: 5 },
      }),
    ).toBe(false)
  })

  it("shows lesson completion prompt for demo Phase 1 only", () => {
    expect(
      shouldShowDemoPhase1LessonCompletion({
        isDemo: true,
        phase: 1,
        lessonComplete: true,
      }),
    ).toBe(true)
    expect(
      shouldShowDemoPhase1LessonCompletion({
        isDemo: true,
        phase: 1,
        lessonComplete: false,
      }),
    ).toBe(false)
    expect(
      shouldShowDemoPhase1LessonCompletion({
        isDemo: false,
        phase: 1,
        lessonComplete: true,
      }),
    ).toBe(false)
  })
})
