import { Prisma, type UserPhaseProgress } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { mergePhaseProgress } from "@/lib/progress/best-score-progress"

export interface RecordPhaseQuizAttemptInput {
  userId: string
  phaseNumber: number
  correctAnswers: number
  xpEarned: number
  totalQuestions: number
}

function isUniqueConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  )
}

async function lockPhaseProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  phaseNumber: number,
): Promise<UserPhaseProgress | null> {
  const rows = await tx.$queryRaw<UserPhaseProgress[]>`
    SELECT
      id,
      "userId",
      "phaseNumber",
      "xpEarned",
      "totalQuestions",
      "correctAnswers",
      attempts,
      "completedAt",
      "lastAttemptAt",
      "createdAt",
      "updatedAt"
    FROM "UserPhaseProgress"
    WHERE "userId" = ${userId} AND "phaseNumber" = ${phaseNumber}
    FOR UPDATE
  `
  return rows[0] ?? null
}

function phaseAttemptData(
  existing: UserPhaseProgress | null,
  attempt: RecordPhaseQuizAttemptInput,
  attemptedAt: Date,
) {
  return {
    ...mergePhaseProgress(existing, { ...attempt, attemptedAt }),
    lastAttemptAt: attemptedAt,
  }
}

function phaseAttemptResult(progress: UserPhaseProgress, xpEarned: number, previousXp: number) {
  return {
    progress,
    bestXp: progress.xpEarned,
    improved: xpEarned > previousXp,
  }
}

async function updatePhaseProgress(
  tx: Prisma.TransactionClient,
  existing: UserPhaseProgress,
  attempt: RecordPhaseQuizAttemptInput,
  attemptedAt: Date,
) {
  const progress = await tx.userPhaseProgress.update({
    where: { id: existing.id },
    data: phaseAttemptData(existing, attempt, attemptedAt),
  })
  return phaseAttemptResult(progress, attempt.xpEarned, existing.xpEarned)
}

/**
 * Persist a phase quiz attempt with only-goes-up scores and incrementing attempts.
 * Uses SELECT FOR UPDATE so concurrent submissions cannot regress best scores
 * or lose attempt counts.
 */
export async function recordPhaseQuizAttempt(attempt: RecordPhaseQuizAttemptInput) {
  const { userId, phaseNumber, xpEarned } = attempt
  return prisma.$transaction(async (tx) => {
    const existing = await lockPhaseProgress(tx, userId, phaseNumber)
    const now = new Date()

    if (existing) return updatePhaseProgress(tx, existing, attempt, now)

    try {
      const progress = await tx.userPhaseProgress.create({
        data: {
          userId,
          phaseNumber,
          ...phaseAttemptData(null, attempt, now),
        },
      })
      return phaseAttemptResult(progress, xpEarned, 0)
    } catch (error) {
      if (!isUniqueConflict(error)) throw error
      // Concurrent insert won — lock the winner and apply only-goes-up merge.
      const winner = await lockPhaseProgress(tx, userId, phaseNumber)
      if (!winner) throw error
      return updatePhaseProgress(tx, winner, attempt, now)
    }
  })
}
