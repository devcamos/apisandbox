import { describe, expect, it } from "vitest"
import {
  mergeAssessmentProgress,
  mergePhaseProgress,
  simulateConcurrentScoreWrites,
} from "@/lib/progress/best-score-progress"

describe("mergePhaseProgress", () => {
  it("keeps the higher score and increments attempts", () => {
    const first = mergePhaseProgress(null, {
      xpEarned: 40,
      correctAnswers: 2,
      totalQuestions: 5,
      attemptedAt: new Date("2026-01-01T00:00:00Z"),
    })
    const second = mergePhaseProgress(first, {
      xpEarned: 20,
      correctAnswers: 1,
      totalQuestions: 5,
      attemptedAt: new Date("2026-01-01T00:01:00Z"),
    })

    expect(second.correctAnswers).toBe(2)
    expect(second.xpEarned).toBe(40)
    expect(second.attempts).toBe(2)
    expect(second.completedAt).toBeNull()
  })

  it("sets completedAt once on a perfect score and never clears it", () => {
    const perfectAt = new Date("2026-01-01T00:00:00Z")
    const perfect = mergePhaseProgress(null, {
      xpEarned: 100,
      correctAnswers: 5,
      totalQuestions: 5,
      attemptedAt: perfectAt,
    })
    const later = mergePhaseProgress(perfect, {
      xpEarned: 40,
      correctAnswers: 2,
      totalQuestions: 5,
      attemptedAt: new Date("2026-01-01T00:05:00Z"),
    })

    expect(perfect.completedAt).toEqual(perfectAt)
    expect(later.completedAt).toEqual(perfectAt)
    expect(later.correctAnswers).toBe(5)
    expect(later.attempts).toBe(2)
  })
})

describe("mergeAssessmentProgress", () => {
  it("only increases bestCorrectAnswers and increments attempts", () => {
    const first = mergeAssessmentProgress(null, {
      correctAnswers: 4,
      totalQuestions: 5,
      masteryThreshold: 0.8,
      attemptedAt: new Date("2026-01-01T00:00:00Z"),
    })
    const second = mergeAssessmentProgress(first, {
      correctAnswers: 2,
      totalQuestions: 5,
      masteryThreshold: 0.8,
      attemptedAt: new Date("2026-01-01T00:01:00Z"),
    })

    expect(second.bestCorrectAnswers).toBe(4)
    expect(second.attempts).toBe(2)
    expect(second.completedAt).toEqual(first.completedAt)
  })
})

describe("simulateConcurrentScoreWrites", () => {
  it("shows racey read-modify-write can lose the best score", async () => {
    const scores = [8, 3, 5, 1, 7]
    // Run several times — at least one racey outcome must regress below the max.
    const results: number[] = []
    for (let i = 0; i < 40; i += 1) {
      results.push(await simulateConcurrentScoreWrites(scores, "racey"))
    }
    expect(results.some((value) => value < Math.max(...scores))).toBe(true)
  })

  it("keeps the maximum score under concurrent atomic updates", async () => {
    const scores = [8, 3, 5, 1, 7]
    const results = await Promise.all(
      Array.from({ length: 20 }, () => simulateConcurrentScoreWrites(scores, "atomic")),
    )
    expect(results.every((value) => value === Math.max(...scores))).toBe(true)
  })
})
