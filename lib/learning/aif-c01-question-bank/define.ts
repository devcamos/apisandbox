import {
  AIF_C01_QUESTION_BANK_VERSION,
  type AifC01TaskStatementId,
  type AifExamDifficulty,
  type AifExamOption,
  type AifExamQuestion,
  type AifExamQuestionFormat,
} from "@/lib/learning/aif-c01-question-bank/types"
import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"

export interface DefineAifQuestionInput {
  id: string
  format: AifExamQuestionFormat
  domainId: AifC01DomainId
  taskStatement: AifC01TaskStatementId
  topic: string
  difficulty: AifExamDifficulty
  stem: string
  options: AifExamOption[]
  correctOptionIds: string[]
}

/** Authoring helper that stamps the current bank version onto every question. */
export function defineAifQuestion(input: DefineAifQuestionInput): AifExamQuestion {
  return {
    bankVersion: AIF_C01_QUESTION_BANK_VERSION,
    ...input,
  }
}
