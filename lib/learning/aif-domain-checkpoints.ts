import { getAifExamQuestionById } from "@/lib/learning/aif-c01-question-bank"
import type { AssessmentQuestion } from "@/lib/learning/course-types"

// Fixed sets keep retries comparable and preserve the original checkpoint question IDs.
export const aifDomainCheckpointQuestions = {
  "ai-ml-fundamentals": ["aif-d1-001", "aif-d1-002", "aif-d1-007", "aif-d1-021", "aif-d1-028", "aif-d1-029", "aif-d1-030"],
  "generative-ai-fundamentals": ["aif-d2-006", "aif-d2-007", "aif-d2-015", "aif-d2-016", "aif-d2-017", "aif-d2-028", "aif-d2-032"],
  "foundation-model-applications": ["aif-d3-002", "aif-d3-009", "aif-d3-013", "aif-d3-014", "aif-d3-028", "aif-d3-034", "aif-d3-038"],
  "responsible-ai": ["aif-d4-002", "aif-d4-003", "aif-d4-004", "aif-d4-006", "aif-d4-008", "aif-d4-010", "aif-d4-022"],
  "ai-security-governance": ["aif-d5-002", "aif-d5-003", "aif-d5-004", "aif-d5-008", "aif-d5-010", "aif-d5-011", "aif-d5-013"],
} as const

export function additionalAifDomainQuestions(unitId: keyof typeof aifDomainCheckpointQuestions): AssessmentQuestion[] {
  return aifDomainCheckpointQuestions[unitId].map((id) => {
    const question = getAifExamQuestionById(id)
    const correct = question?.options.find((option) => option.id === question.correctOptionIds[0])
    if (!question || question.format !== "single-choice" || !correct) {
      throw new Error(`Invalid single-choice domain checkpoint question: ${id}`)
    }
    // Rotate the authored order so the correct choice does not always appear first.
    const offset = Number(id.slice(-3)) % question.options.length
    const options = [...question.options.slice(offset), ...question.options.slice(0, offset)]
    return {
      id,
      prompt: question.stem,
      options: options.map(({ text }) => text),
      correctAnswer: correct.text,
      explanation: correct.explanation.replace(/^Correct\.\s*/, ""),
      reviewLabel: question.topic.replaceAll("-", " "),
    }
  })
}
