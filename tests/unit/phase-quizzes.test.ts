import { describe, expect, test, vi } from "vitest"
import {
  getPhaseQuiz,
  getSanitizedPhaseQuiz,
  gradePhaseQuiz,
  shuffleOptions,
} from "@/lib/learning/phase-quizzes"

describe("phase quizzes", () => {
  test("shuffleOptions returns a permutation of the same items", () => {
    const source = ["a", "b", "c", "d"]
    const shuffled = shuffleOptions(source)

    expect(shuffled).toHaveLength(source.length)
    expect([...shuffled].sort()).toEqual([...source].sort())
    expect(source).toEqual(["a", "b", "c", "d"])
  })

  test("getSanitizedPhaseQuiz randomizes option order", () => {
    const quiz = getPhaseQuiz(0)
    expect(quiz).not.toBeNull()

    const originalOrder = quiz!.questions.map((q) => q.options.join("|"))
    const seen = new Set<string>()

    for (let i = 0; i < 24; i++) {
      const sanitized = getSanitizedPhaseQuiz(0)
      expect(sanitized).not.toBeNull()
      sanitized!.questions.forEach((question, index) => {
        expect(question.options).toHaveLength(quiz!.questions[index].options.length)
        seen.add(question.options.join("|"))
      })
    }

    expect(seen.size).toBeGreaterThan(1)
    expect([...seen].some((order) => order !== originalOrder[0])).toBe(true)
  })

  test("gradePhaseQuiz scores by selected answer text", () => {
    const quiz = getPhaseQuiz(0)!
    const question = quiz.questions[0]
    const correctAnswer = question.options[question.correctIndex]
    const wrongAnswer = question.options.find((_, i) => i !== question.correctIndex)!

    const correctResult = gradePhaseQuiz(0, { [question.id]: correctAnswer })
    expect(correctResult?.correctAnswers).toBe(1)

    const wrongResult = gradePhaseQuiz(0, { [question.id]: wrongAnswer })
    expect(wrongResult?.correctAnswers).toBe(0)
    expect(wrongResult?.details[0].correctAnswer).toBe(correctAnswer)
  })

  test("getSanitizedPhaseQuiz does not expose correctIndex", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    const sanitized = getSanitizedPhaseQuiz(0)
    vi.mocked(Math.random).mockRestore()

    expect(sanitized).not.toBeNull()
    for (const question of sanitized!.questions) {
      expect(question).not.toHaveProperty("correctIndex")
    }
  })
})
