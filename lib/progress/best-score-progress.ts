/**
 * Pure "only-goes-up" merge helpers for quiz / assessment progress.
 * DB writes should apply the same rules atomically (GREATEST + attempts increment).
 */

export interface PhaseProgressSnapshot {
  xpEarned: number
  correctAnswers: number
  totalQuestions: number
  attempts: number
  completedAt: Date | null
}

export interface PhaseAttemptScore {
  xpEarned: number
  correctAnswers: number
  totalQuestions: number
  attemptedAt?: Date
}

export interface AssessmentProgressSnapshot {
  bestCorrectAnswers: number
  totalQuestions: number
  attempts: number
  completedAt: Date | null
}

export interface AssessmentAttemptScore {
  correctAnswers: number
  totalQuestions: number
  masteryThreshold: number
  attemptedAt?: Date
}

export function mergePhaseProgress(
  existing: PhaseProgressSnapshot | null,
  attempt: PhaseAttemptScore,
): PhaseProgressSnapshot {
  const now = attempt.attemptedAt ?? new Date()
  if (!existing) {
    return {
      xpEarned: attempt.xpEarned,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      attempts: 1,
      completedAt:
        attempt.correctAnswers === attempt.totalQuestions ? now : null,
    }
  }

  const correctAnswers = Math.max(existing.correctAnswers, attempt.correctAnswers)
  const xpEarned = Math.max(existing.xpEarned, attempt.xpEarned)
  const completedAt =
    correctAnswers === attempt.totalQuestions
      ? existing.completedAt ?? now
      : existing.completedAt

  return {
    xpEarned,
    correctAnswers,
    totalQuestions: attempt.totalQuestions,
    attempts: existing.attempts + 1,
    completedAt,
  }
}

export function isAssessmentMastered(
  bestCorrectAnswers: number,
  totalQuestions: number,
  masteryThreshold: number,
): boolean {
  if (totalQuestions <= 0) return false
  return bestCorrectAnswers / totalQuestions >= masteryThreshold
}

export function mergeAssessmentProgress(
  existing: AssessmentProgressSnapshot | null,
  attempt: AssessmentAttemptScore,
): AssessmentProgressSnapshot {
  const now = attempt.attemptedAt ?? new Date()
  const bestCorrectAnswers = Math.max(
    existing?.bestCorrectAnswers ?? 0,
    attempt.correctAnswers,
  )
  const mastered = isAssessmentMastered(
    bestCorrectAnswers,
    attempt.totalQuestions,
    attempt.masteryThreshold,
  )

  return {
    bestCorrectAnswers,
    totalQuestions: attempt.totalQuestions,
    attempts: (existing?.attempts ?? 0) + 1,
    completedAt: mastered ? existing?.completedAt ?? now : null,
  }
}

/**
 * In-memory concurrency demo: racey read-modify-write can regress scores;
 * atomic merge (GREATEST-style) cannot.
 */
export async function simulateConcurrentScoreWrites(
  scores: number[],
  mode: "racey" | "atomic",
): Promise<number> {
  let stored = 0

  if (mode === "atomic") {
    // Serialize updates the way SELECT FOR UPDATE / GREATEST does in Postgres.
    let chain = Promise.resolve()
    await Promise.all(
      scores.map(
        (score) =>
          (chain = chain.then(async () => {
            await new Promise<void>((resolve) => queueMicrotask(resolve))
            stored = Math.max(stored, score)
          })),
      ),
    )
    return stored
  }

  // Racey: read, yield, then write max(readValue, score) — stale reads regress.
  await Promise.all(
    scores.map(async (score) => {
      const readValue = stored
      await new Promise<void>((resolve) => queueMicrotask(resolve))
      stored = Math.max(readValue, score)
    }),
  )
  return stored
}
