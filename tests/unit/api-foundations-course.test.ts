import { describe, expect, test } from "vitest"
import {
  API_FOUNDATIONS_COURSE_ID,
  API_FOUNDATIONS_MASTERY_THRESHOLD,
  getLearningCourse,
  getSanitizedLearningCourse,
  gradeLearningUnitAssessment,
  isLearningUnitMastered,
} from "@/lib/learning/api-foundations-course"
import { getCoursePlan } from "@/lib/learning/progress-mapping"

describe("API foundations curriculum", () => {
  test("keeps the first-principles units in causal order", () => {
    const course = getLearningCourse(API_FOUNDATIONS_COURSE_ID)
    expect(course?.units.map((unit) => unit.id)).toEqual([
      "programs-and-state",
      "machines-and-processes",
      "network-path",
      "http-messages",
      "api-contracts",
      "dependable-integrations",
    ])
    expect(course?.units.map((unit) => unit.phase)).toEqual([0, 0, 0, 1, 1, 1])
  })

  test("sanitizes correct answers before course content reaches a browser", () => {
    const course = getSanitizedLearningCourse(API_FOUNDATIONS_COURSE_ID)
    expect(course?.units).toHaveLength(6)
    for (const unit of course?.units ?? []) {
      for (const question of unit.assessment.questions) {
        expect(question).not.toHaveProperty("correctAnswer")
        expect(question.options.length).toBeGreaterThan(1)
      }
    }
  })

  test("grades assessment answers and applies the 80 percent mastery threshold", () => {
    const course = getLearningCourse(API_FOUNDATIONS_COURSE_ID)!
    const unit = course.units[0]
    const correctAnswers = Object.fromEntries(unit.assessment.questions.map((question) => [question.id, question.correctAnswer]))
    const correct = gradeLearningUnitAssessment(course.id, unit.id, correctAnswers)
    const incorrect = gradeLearningUnitAssessment(course.id, unit.id, {
      [unit.assessment.questions[0].id]: "A completed response",
      [unit.assessment.questions[1].id]: "await prevents all failures",
    })

    expect(correct).toMatchObject({ correctAnswers: 2, totalQuestions: 2, mastered: true })
    expect(incorrect).toMatchObject({ correctAnswers: 0, totalQuestions: 2, mastered: false })
    expect(isLearningUnitMastered(4, 5, API_FOUNDATIONS_MASTERY_THRESHOLD)).toBe(true)
    expect(isLearningUnitMastered(3, 5, API_FOUNDATIONS_MASTERY_THRESHOLD)).toBe(false)
  })

  test("retains the phase-based lesson plans as legacy curriculum", () => {
    expect(getCoursePlan("phase-0")?.phase).toBe(0)
    expect(getCoursePlan("phase-2")?.phase).toBe(2)
  })
})
