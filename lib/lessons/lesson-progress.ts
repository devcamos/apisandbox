import type { LessonCheckpoint, PhaseLessonPlan } from "@/lib/lessons/phase-lessons"

export interface CheckpointProgress {
  done: boolean
  answer: string
  evidence: string
  serviceName: string
  endpointName: string
  criticalPathStep: string
  auditEvidence: string
  retrievalStep: number
  retrievalDueAt: string
}

export type LessonProgressState = Record<string, Record<string, CheckpointProgress>>

export interface CompletionCheck {
  id: string
  label: string
  pass: boolean
}

export interface OverallStats {
  total: number
  completed: number
  percent: number
}

export interface ModuleStat {
  id: string
  title: string
  total: number
  completed: number
  percent: number
}

export interface NextCheckpoint {
  moduleId: string
  moduleTitle: string
  checkpointId: string
  label: string
  /** Flat index across all modules, matching the order used for focus navigation. */
  index: number
}

export const RETRIEVAL_INTERVAL_DAYS = [1, 3, 7, 14]

export const RETRIEVAL_CHECKPOINT_ID = "retrieval"

export function emptyCheckpointProgress(): CheckpointProgress {
  return {
    done: false,
    answer: "",
    evidence: "",
    serviceName: "",
    endpointName: "",
    criticalPathStep: "",
    auditEvidence: "",
    retrievalStep: 0,
    retrievalDueAt: "",
  }
}

export function getCheckpointState(
  progress: LessonProgressState,
  moduleId: string,
  checkpointId: string,
): CheckpointProgress {
  return progress[moduleId]?.[checkpointId] ?? emptyCheckpointProgress()
}

export function countBullets(value: string): number {
  return value
    .split("\n")
    .filter((line) => /^\s*([-*•]|\d+\.)\s+/.test(line.trim())).length
}

export function hasMeasurableDecision(value: string): boolean {
  const hasTimedOrRateMetric = /\b\d+(?:\.\d+)?\s?(?:ms|s|sec|seconds|minutes|m|hours|h|%|x)\b/i.test(value)
  const hasPercentile = /\bp(?:95|99)\b/i.test(value)
  const hasOpsKeyword = /\b(?:slo|latency|error rate|cost)\b/i.test(value)
  return hasTimedOrRateMetric || hasPercentile || hasOpsKeyword
}

export function hasFallbackPolicy(value: string): boolean {
  return /(fallback|fail-open|fail-closed|graceful degradation|degrade|circuit breaker|retry budget|shed load|timeout)/i.test(value)
}

export function getCompletionChecks(state: CheckpointProgress): CompletionCheck[] {
  const answer = state.answer.trim()
  return [
    { id: "answer", label: "Answer is provided", pass: answer.length > 0 },
    { id: "evidence", label: "Project evidence is provided", pass: state.evidence.trim().length > 0 },
    { id: "bullets", label: "Minimum 3 bullets", pass: countBullets(state.answer) >= 3 },
    { id: "measurable", label: "Contains 1 measurable decision", pass: hasMeasurableDecision(state.answer) },
    { id: "fallback", label: "Contains 1 explicit fallback policy", pass: hasFallbackPolicy(state.answer) },
  ]
}

/** A non-retrieval checkpoint can be marked complete only when every rubric check passes. */
export function canCompleteCheckpoint(checkpoint: LessonCheckpoint, state: CheckpointProgress): boolean {
  if (checkpoint.id === RETRIEVAL_CHECKPOINT_ID) return true
  return getCompletionChecks(state).every((check) => check.pass)
}

export function scheduleNextRetrieval(prevStep: number): { nextStep: number; dueAt: string } {
  const boundedStep = Math.max(0, Math.min(prevStep, RETRIEVAL_INTERVAL_DAYS.length - 1))
  const nextStep = Math.min(boundedStep + 1, RETRIEVAL_INTERVAL_DAYS.length - 1)
  const days = RETRIEVAL_INTERVAL_DAYS[boundedStep]
  const dueAt = new Date()
  dueAt.setDate(dueAt.getDate() + days)
  return { nextStep, dueAt: dueAt.toISOString() }
}

export function computeOverallStats(plan: PhaseLessonPlan, progress: LessonProgressState): OverallStats {
  let total = 0
  let completed = 0
  for (const courseModule of plan.modules) {
    for (const checkpoint of courseModule.checkpoints) {
      total += 1
      if (getCheckpointState(progress, courseModule.id, checkpoint.id).done) completed += 1
    }
  }
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, percent }
}

export function computeModuleStats(plan: PhaseLessonPlan, progress: LessonProgressState): ModuleStat[] {
  return plan.modules.map((courseModule) => {
    const total = courseModule.checkpoints.length
    const completed = courseModule.checkpoints.filter(
      (checkpoint) => getCheckpointState(progress, courseModule.id, checkpoint.id).done,
    ).length
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { id: courseModule.id, title: courseModule.title, total, completed, percent }
  })
}

/** First not-yet-completed checkpoint in plan order, or null when the lesson is complete. */
export function findNextIncomplete(plan: PhaseLessonPlan, progress: LessonProgressState): NextCheckpoint | null {
  let index = 0
  for (const courseModule of plan.modules) {
    for (const checkpoint of courseModule.checkpoints) {
      if (!getCheckpointState(progress, courseModule.id, checkpoint.id).done) {
        return {
          moduleId: courseModule.id,
          moduleTitle: courseModule.title,
          checkpointId: checkpoint.id,
          label: checkpoint.label,
          index,
        }
      }
      index += 1
    }
  }
  return null
}

/** Completed spaced-repetition checkpoints whose next review date has arrived. */
export function countReviewsDue(
  plan: PhaseLessonPlan,
  progress: LessonProgressState,
  now: Date = new Date(),
): number {
  let due = 0
  for (const courseModule of plan.modules) {
    for (const checkpoint of courseModule.checkpoints) {
      if (checkpoint.id !== RETRIEVAL_CHECKPOINT_ID) continue
      const state = getCheckpointState(progress, courseModule.id, checkpoint.id)
      if (!state.done || !state.retrievalDueAt) continue
      const dueAt = new Date(state.retrievalDueAt)
      if (!Number.isNaN(dueAt.getTime()) && dueAt.getTime() <= now.getTime()) due += 1
    }
  }
  return due
}
