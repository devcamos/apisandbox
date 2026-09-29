/**
 * Demo Phase 1 completion detection — pure helpers for UI + tests.
 */

export interface PhaseQuizProgressLike {
  completedAt?: Date | string | null
  correctAnswers?: number | null
  totalQuestions?: number | null
}

export interface PhaseQuizResultLike {
  correctAnswers: number
  totalQuestions: number
}

/** True when the phase quiz is fully mastered (all questions correct). */
export function isPhaseQuizFullyComplete(
  progress: PhaseQuizProgressLike | null | undefined,
  latestResult?: PhaseQuizResultLike | null,
): boolean {
  if (
    latestResult &&
    latestResult.totalQuestions > 0 &&
    latestResult.correctAnswers === latestResult.totalQuestions
  ) {
    return true
  }

  if (progress?.completedAt) return true

  const total = progress?.totalQuestions ?? 0
  const correct = progress?.correctAnswers ?? 0
  return total > 0 && correct === total
}

/**
 * Show the demo congratulations + Free/Pro prompt after Phase 1's final
 * mastery checkpoint is completed.
 */
export function shouldShowDemoPhase1Completion(input: {
  isDemo: boolean
  phaseNumber: number
  progress?: PhaseQuizProgressLike | null
  result?: PhaseQuizResultLike | null
}): boolean {
  if (!input.isDemo || input.phaseNumber !== 1) return false
  return isPhaseQuizFullyComplete(input.progress, input.result)
}

/** Lesson tracker finished every checkpoint for Phase 1 in a demo session. */
export function shouldShowDemoPhase1LessonCompletion(input: {
  isDemo: boolean
  phase: number
  lessonComplete: boolean
}): boolean {
  return input.isDemo && input.phase === 1 && input.lessonComplete
}
