import { domain1Questions } from "@/lib/learning/aif-c01-question-bank/questions/domain-1"
import { domain2Questions } from "@/lib/learning/aif-c01-question-bank/questions/domain-2"
import { domain3Questions } from "@/lib/learning/aif-c01-question-bank/questions/domain-3"
import { domain4Questions } from "@/lib/learning/aif-c01-question-bank/questions/domain-4"
import { domain5Questions } from "@/lib/learning/aif-c01-question-bank/questions/domain-5"
import type { AifExamQuestion } from "@/lib/learning/aif-c01-question-bank/types"
import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"

export { AIF_C01_QUESTION_BANK_VERSION } from "@/lib/learning/aif-c01-question-bank/types"
export * from "@/lib/learning/aif-c01-question-bank/types"
export * from "@/lib/learning/aif-c01-question-bank/catalog"
export {
  createAifFlashcards,
  gradeAifExamPracticeSession,
  gradeAifExamQuestion,
  isMetricsTopic,
  sanitizeAifExamQuestion,
  sanitizeAifExamQuestions,
  selectAifExamQuestions,
  summarizeAifQuestionBank,
  validateAifQuestion,
  validateAifQuestionBank,
} from "@/lib/learning/aif-c01-question-bank/helpers"
export { defineAifQuestion } from "@/lib/learning/aif-c01-question-bank/define"

/** Full AIF-C01 practice bank (original questions for API Sandbox). */
export const AIF_C01_QUESTION_BANK: readonly AifExamQuestion[] = [
  ...domain1Questions,
  ...domain2Questions,
  ...domain3Questions,
  ...domain4Questions,
  ...domain5Questions,
]

const questionsById = new Map(AIF_C01_QUESTION_BANK.map((question) => [question.id, question]))

export function getAifExamQuestionById(id: string): AifExamQuestion | undefined {
  return questionsById.get(id)
}

export function getAifExamQuestionsByIds(ids: string[]): AifExamQuestion[] {
  return ids
    .map((id) => questionsById.get(id))
    .filter((question): question is AifExamQuestion => Boolean(question))
}

export function listAifExamDomainIds(): AifC01DomainId[] {
  return [
    "ai-ml-fundamentals",
    "genai-fundamentals",
    "foundation-models",
    "responsible-ai",
    "ai-security",
  ]
}
