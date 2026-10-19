/**
 * AIF-C01 exam-style question bank types.
 * Versioned so later tickets (timed mock, weak-area tracking) can evolve without breaking practice.
 */

import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"

export const AIF_C01_QUESTION_BANK_VERSION = "1.0.0" as const

export type AifExamQuestionFormat = "single-choice" | "multi-response"
export type AifExamDifficulty = "easy" | "medium" | "hard"

/** Official task statement ids from the AIF-C01 exam guide (v1.1). */
export type AifC01TaskStatementId =
  | "1.1"
  | "1.2"
  | "1.3"
  | "2.1"
  | "2.2"
  | "2.3"
  | "3.1"
  | "3.2"
  | "3.3"
  | "3.4"
  | "4.1"
  | "4.2"
  | "5.1"
  | "5.2"

export interface AifExamOption {
  id: string
  text: string
  /** Plain-English why this option is right or wrong (1–2 short sentences). */
  explanation: string
}

export interface AifExamQuestion {
  id: string
  /** Bank schema version this question was authored against. */
  bankVersion: typeof AIF_C01_QUESTION_BANK_VERSION
  format: AifExamQuestionFormat
  domainId: AifC01DomainId
  taskStatement: AifC01TaskStatementId
  topic: string
  difficulty: AifExamDifficulty
  stem: string
  options: AifExamOption[]
  /** Option ids that must all be selected for credit. */
  correctOptionIds: string[]
}

/** Client-safe question: no correct keys or option explanations until after submit. */
export interface SanitizedAifExamQuestion {
  id: string
  format: AifExamQuestionFormat
  domainId: AifC01DomainId
  taskStatement: AifC01TaskStatementId
  topic: string
  difficulty: AifExamDifficulty
  stem: string
  options: Array<{ id: string; text: string }>
  /** How many options must be correct (1 for single-choice; 2+ for multi-response). */
  selectCount: number
}

export interface AifExamOptionResult {
  optionId: string
  text: string
  correct: boolean
  selected: boolean
  explanation: string
}

export interface AifExamQuestionGrade {
  questionId: string
  correct: boolean
  selectedOptionIds: string[]
  correctOptionIds: string[]
  options: AifExamOptionResult[]
}

export interface AifExamPracticeSessionGrade {
  correctCount: number
  totalQuestions: number
  scorePercent: number
  details: AifExamQuestionGrade[]
}

export interface AifDomainWeightSpec {
  domainId: AifC01DomainId
  title: string
  /** Official exam weighting as a percentage of scored content. */
  weightPercent: number
  taskStatements: Array<{ id: AifC01TaskStatementId; title: string }>
}

export interface AifQuestionBankSummary {
  version: typeof AIF_C01_QUESTION_BANK_VERSION
  totalQuestions: number
  singleChoiceCount: number
  multiResponseCount: number
  metricsTopicCount: number
  byDomain: Record<AifC01DomainId, { count: number; percent: number }>
}
