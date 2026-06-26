import type {
  CheckpointProgress,
  LessonProgressState,
} from "@/lib/lessons/lesson-progress"
import {
  computeModuleStats,
  computeOverallStats,
  countReviewsDue,
  emptyCheckpointProgress,
  findNextIncomplete,
} from "@/lib/lessons/lesson-progress"
import { getPhaseLessonPlan, type PhaseLessonPlan } from "@/lib/lessons/phase-lessons"

export const LEARNING_CHECKPOINT_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
] as const

export type LearningCheckpointStatus = (typeof LEARNING_CHECKPOINT_STATUSES)[number]

export interface LearningCheckpointRecord {
  moduleId: string
  checkpointId: string
  status: string
  answer: string
  evidence: string
  serviceName: string
  endpointName: string
  criticalPathStep: string
  auditEvidence: string
  retrievalStep: number
  retrievalDueAt: Date | string | null
  completedAt: Date | string | null
  updatedAt?: Date | string | null
}

export interface LearningProgressSummary {
  total: number
  completed: number
  percent: number
  modules: ReturnType<typeof computeModuleStats>
  nextIncomplete: ReturnType<typeof findNextIncomplete>
  reviewsDue: number
}

export function courseIdForPhase(phase: number) {
  return `phase-${phase}`
}

export function phaseFromCourseId(courseId: string): number | null {
  const match = /^phase-(\d+)$/.exec(courseId)
  if (!match) return null
  const phase = Number(match[1])
  return Number.isInteger(phase) ? phase : null
}

export function getCoursePlan(courseId: string): PhaseLessonPlan | null {
  const phase = phaseFromCourseId(courseId)
  if (phase === null) return null
  return getPhaseLessonPlan(phase) ?? null
}

export function isLearningCheckpointStatus(value: string): value is LearningCheckpointStatus {
  return LEARNING_CHECKPOINT_STATUSES.includes(value as LearningCheckpointStatus)
}

export function checkpointStatusFromState(state: CheckpointProgress): LearningCheckpointStatus {
  if (state.done) return "completed"
  const hasWork = [
    state.answer,
    state.evidence,
    state.serviceName,
    state.endpointName,
    state.criticalPathStep,
    state.auditEvidence,
    state.retrievalDueAt,
  ].some((value) => value.trim().length > 0) || state.retrievalStep > 0
  return hasWork ? "in_progress" : "not_started"
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

export function recordToCheckpointProgress(record: LearningCheckpointRecord): CheckpointProgress {
  return {
    done: record.status === "completed",
    answer: record.answer,
    evidence: record.evidence,
    serviceName: record.serviceName,
    endpointName: record.endpointName,
    criticalPathStep: record.criticalPathStep,
    auditEvidence: record.auditEvidence,
    retrievalStep: record.retrievalStep,
    retrievalDueAt: toIsoString(record.retrievalDueAt),
  }
}

export function recordsToLessonProgressState(records: LearningCheckpointRecord[]): LessonProgressState {
  return records.reduce<LessonProgressState>((state, record) => {
    const moduleProgress = state[record.moduleId] ?? {}
    return {
      ...state,
      [record.moduleId]: {
        ...moduleProgress,
        [record.checkpointId]: recordToCheckpointProgress(record),
      },
    }
  }, {})
}

export function isCheckpointProgressEmpty(state: CheckpointProgress): boolean {
  const empty = emptyCheckpointProgress()
  return (
    state.done === empty.done &&
    state.answer.trim() === "" &&
    state.evidence.trim() === "" &&
    state.serviceName.trim() === "" &&
    state.endpointName.trim() === "" &&
    state.criticalPathStep.trim() === "" &&
    state.auditEvidence.trim() === "" &&
    state.retrievalStep === 0 &&
    state.retrievalDueAt.trim() === ""
  )
}

export function hasAnyLessonProgress(progress: LessonProgressState): boolean {
  return Object.values(progress).some((moduleProgress) =>
    Object.values(moduleProgress).some((checkpoint) => !isCheckpointProgressEmpty(checkpoint)),
  )
}

export function summarizeLearningProgress(
  plan: PhaseLessonPlan,
  progress: LessonProgressState,
): LearningProgressSummary {
  const overall = computeOverallStats(plan, progress)
  return {
    ...overall,
    modules: computeModuleStats(plan, progress),
    nextIncomplete: findNextIncomplete(plan, progress),
    reviewsDue: countReviewsDue(plan, progress),
  }
}
