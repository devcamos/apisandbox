/** Shared learning-course types (kept separate to avoid circular imports). */
export interface InteractiveScenarioOption {
  id: string
  label: string
  consequence: string
}

export interface InteractiveScenarioStep {
  id: string
  label: string
  system: string
  detail: string
}

export interface InteractiveScenario {
  title: string
  prompt: string
  options: InteractiveScenarioOption[]
  trace: InteractiveScenarioStep[]
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  options: string[]
  correctAnswer: string
  explanation: string
  reviewLabel: string
}

export interface AssessmentDefinition {
  title: string
  description: string
  questions: AssessmentQuestion[]
  reflectionPrompt: string
}

export type LearningDifficulty = "Easy" | "Medium" | "Hard" | "Expert"

export const CAPABILITY_MASTERY_STAGES = [
  { id: "problem", label: "Problem" },
  { id: "predict", label: "Predict" },
  { id: "learn", label: "Learn" },
  { id: "recall", label: "Recall" },
  { id: "reason", label: "Reason" },
  { id: "build", label: "Build" },
  { id: "break", label: "Break" },
  { id: "explain", label: "Explain" },
  { id: "aws-map", label: "AWS Map" },
  { id: "exam", label: "Exam" },
] as const

export type CapabilityMasteryStageId = (typeof CAPABILITY_MASTERY_STAGES)[number]["id"]

export interface CapabilityDecisionGuide {
  useWhen: string[]
  avoidWhen: string[]
  alternatives: string[]
}

export interface CapabilityReasoningExercise {
  prompt: string
  strongAnswerIncludes: string[]
}

export interface CapabilityOpenSourceImplementation {
  title: string
  language: string
  stack: string[]
  objective: string
  steps: string[]
  code: string
  successCriteria: string[]
}

export interface CapabilityBreakExercise {
  faults: string[]
  observe: string[]
  recovery: string
}

export interface CapabilityExplanationExercise {
  prompt: string
  evidenceCriteria: string[]
}

export interface CapabilityPlatformMappingItem {
  invariant: string
  implementation: string
  why: string
}

export interface CapabilityPlatformMapping {
  label: string
  items: CapabilityPlatformMappingItem[]
  examLens: string
}

export interface CapabilityMasteryJourney {
  problem: string
  mechanism: string
  decision: CapabilityDecisionGuide
  tradeOffs: string[]
  recallPrompts: string[]
  reasoning: CapabilityReasoningExercise
  implementation: CapabilityOpenSourceImplementation
  breakExercise: CapabilityBreakExercise
  explanation: CapabilityExplanationExercise
  platformMap: CapabilityPlatformMapping
}

export interface CertificationUnitMetadata {
  kind: "capability" | "domain-exam"
  domainId: string
  sequence?: number
  masteryJourney?: CapabilityMasteryJourney
}

export interface LearningUnit {
  id: string
  phase: number
  difficulty?: LearningDifficulty
  title: string
  subtitle: string
  principle: string
  goal: string
  concepts: string[]
  sections: Array<{ title: string; body: string }>
  scenario: InteractiveScenario
  assessment: AssessmentDefinition
  certification?: CertificationUnitMetadata
}

export interface LearningCourse {
  id: string
  title: string
  description: string
  audience: string
  masteryThreshold: number
  units: LearningUnit[]
}

export interface SanitizedAssessmentQuestion {
  id: string
  prompt: string
  options: string[]
}

export interface SanitizedAssessmentDefinition {
  title: string
  description: string
  questions: SanitizedAssessmentQuestion[]
  reflectionPrompt: string
}

export interface SanitizedLearningUnit extends Omit<LearningUnit, "assessment"> {
  assessment: SanitizedAssessmentDefinition
}

export interface SanitizedLearningCourse extends Omit<LearningCourse, "units"> {
  units: SanitizedLearningUnit[]
}

export interface AssessmentGrade {
  correctAnswers: number
  totalQuestions: number
  scorePercent: number
  mastered: boolean
  details: Array<{
    questionId: string
    correct: boolean
    explanation: string
    reviewLabel: string
  }>
}
