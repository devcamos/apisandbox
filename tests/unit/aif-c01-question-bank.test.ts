import { describe, expect, it } from "vitest"
import {
  AIF_C01_DOMAIN_WEIGHTS,
  AIF_C01_MIN_METRICS_QUESTIONS,
  AIF_C01_MIN_MULTI_RESPONSE_RATIO,
  AIF_C01_MIN_QUESTION_COUNT,
  AIF_C01_QUESTION_BANK,
  AIF_C01_QUESTION_BANK_VERSION,
  getAifExamQuestionById,
  gradeAifExamPracticeSession,
  gradeAifExamQuestion,
  sanitizeAifExamQuestion,
  selectAifExamQuestions,
  summarizeAifQuestionBank,
  validateAifQuestionBank,
} from "@/lib/learning/aif-c01-question-bank"

describe("AIF-C01 question bank", () => {
  const summary = summarizeAifQuestionBank(AIF_C01_QUESTION_BANK)
  const issues = validateAifQuestionBank(AIF_C01_QUESTION_BANK)

  it("passes schema validation for every question", () => {
    expect(issues).toEqual([])
  })

  it("meets the shipping size and metrics depth floors", () => {
    expect(summary.totalQuestions).toBeGreaterThanOrEqual(AIF_C01_MIN_QUESTION_COUNT)
    expect(summary.metricsTopicCount).toBeGreaterThanOrEqual(AIF_C01_MIN_METRICS_QUESTIONS)
    expect(summary.version).toBe(AIF_C01_QUESTION_BANK_VERSION)
  })

  it("keeps at least 20% multiple-response questions", () => {
    const ratio = summary.multiResponseCount / summary.totalQuestions
    expect(ratio).toBeGreaterThanOrEqual(AIF_C01_MIN_MULTI_RESPONSE_RATIO)
  })

  it("keeps domain mix within ±2 percentage points of official weightings", () => {
    for (const domain of AIF_C01_DOMAIN_WEIGHTS) {
      const actual = summary.byDomain[domain.domainId].percent
      expect(Math.abs(actual - domain.weightPercent)).toBeLessThanOrEqual(2)
    }
  })

  it("stamps every question with the current bank version and unique ids", () => {
    const ids = new Set(AIF_C01_QUESTION_BANK.map((question) => question.id))
    expect(ids.size).toBe(AIF_C01_QUESTION_BANK.length)
    for (const question of AIF_C01_QUESTION_BANK) {
      expect(question.bankVersion).toBe(AIF_C01_QUESTION_BANK_VERSION)
      expect(question.options.every((option) => option.explanation.trim().length > 0)).toBe(true)
    }
  })

  it("sanitizes questions so answers and explanations stay server-side until grading", () => {
    const sample = AIF_C01_QUESTION_BANK[0]
    const sanitized = sanitizeAifExamQuestion(sample)
    expect(sanitized).not.toHaveProperty("correctOptionIds")
    expect(sanitized.options[0]).not.toHaveProperty("explanation")
    expect(sanitized.selectCount).toBe(sample.correctOptionIds.length)
  })

  it("grades single-choice and multi-response answers", () => {
    const single = AIF_C01_QUESTION_BANK.find((question) => question.format === "single-choice")
    const multi = AIF_C01_QUESTION_BANK.find((question) => question.format === "multi-response")
    expect(single).toBeDefined()
    expect(multi).toBeDefined()
    if (!single || !multi) return

    const singlePass = gradeAifExamQuestion(single, [...single.correctOptionIds])
    const singleFail = gradeAifExamQuestion(single, [
      single.options.find((option) => !single.correctOptionIds.includes(option.id))!.id,
    ])
    expect(singlePass.correct).toBe(true)
    expect(singleFail.correct).toBe(false)
    expect(singlePass.options.every((option) => option.explanation.length > 0)).toBe(true)

    const multiPass = gradeAifExamQuestion(multi, [...multi.correctOptionIds])
    const multiPartial = gradeAifExamQuestion(multi, multi.correctOptionIds.slice(0, 1))
    expect(multiPass.correct).toBe(true)
    expect(multiPartial.correct).toBe(false)
  })

  it("selects metrics-only and domain-filtered practice sets deterministically", () => {
    const metrics = selectAifExamQuestions(AIF_C01_QUESTION_BANK, {
      metricsOnly: true,
      seed: 42,
      limit: 5,
    })
    const again = selectAifExamQuestions(AIF_C01_QUESTION_BANK, {
      metricsOnly: true,
      seed: 42,
      limit: 5,
    })
    expect(metrics).toHaveLength(5)
    expect(metrics.every((question) =>
      ["precision", "recall", "f1-score", "confusion-matrix", "accuracy", "evaluation-metrics"].includes(
        question.topic,
      ),
    )).toBe(true)
    expect(metrics.map((question) => question.id)).toEqual(again.map((question) => question.id))

    const domain3 = selectAifExamQuestions(AIF_C01_QUESTION_BANK, {
      domainId: "foundation-models",
      seed: 7,
      limit: 3,
    })
    expect(domain3).toHaveLength(3)
    expect(domain3.every((question) => question.domainId === "foundation-models")).toBe(true)
  })

  it("grades a practice session payload used by the API route", () => {
    const set = selectAifExamQuestions(AIF_C01_QUESTION_BANK, { seed: 9, limit: 3 })
    const answers = Object.fromEntries(
      set.map((question) => [question.id, [...question.correctOptionIds]]),
    )
    const result = gradeAifExamPracticeSession(set, answers)
    expect(result.correctCount).toBe(3)
    expect(result.scorePercent).toBe(100)
    expect(getAifExamQuestionById(set[0].id)?.id).toBe(set[0].id)
  })
})
