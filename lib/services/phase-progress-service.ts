import { Prisma } from "@prisma/client"
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

/**
 * Persist a phase quiz attempt with only-goes-up scores and incrementing attempts.
 * Uses SELECT FOR UPDATE so concurrent submissions cannot regress best scores
 * or lose attempt counts.
 */
export async function recordPhaseQuizAttempt({
  userId,
  phaseNumber,
  correctAnswers,
  xpEarned,
  totalQuestions,
}: RecordPhaseQuizAttemptInput) {
  return prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<
      Array<{
        id: string
        userId: string
        phaseNumber: number
        xpEarned: number
        totalQuestions: number
        correctAnswers: number
        attempts: number
        completedAt: Date | null
        lastAttemptAt: Date | null
        createdAt: Date
        updatedAt: Date
      }>
    >`
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

    const existing = locked[0] ?? null
    const now = new Date()
    const merged = mergePhaseProgress(existing, {
      xpEarned,
      correctAnswers,
      totalQuestions,
      attemptedAt: now,
    })
    const previousXp = existing?.xpEarned ?? 0

    if (!existing) {
      try {
        const progress = await tx.userPhaseProgress.create({
          data: {
            userId,
            phaseNumber,
            xpEarned: merged.xpEarned,
            totalQuestions: merged.totalQuestions,
            correctAnswers: merged.correctAnswers,
            attempts: merged.attempts,
            completedAt: merged.completedAt,
            lastAttemptAt: now,
          },
        })
        return {
          progress,
          bestXp: progress.xpEarned,
          improved: xpEarned > previousXp,
        }
      } catch (error) {
        if (!isUniqueConflict(error)) throw error
        // Concurrent insert won — lock the winner and apply only-goes-up merge.
        const retryLocked = await tx.$queryRaw<typeof locked>`
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
        const winner = retryLocked[0]
        if (!winner) throw error
        const retryMerged = mergePhaseProgress(winner, {
          xpEarned,
          correctAnswers,
          totalQuestions,
          attemptedAt: now,
        })
        const progress = await tx.userPhaseProgress.update({
          where: { id: winner.id },
          data: {
            xpEarned: retryMerged.xpEarned,
            totalQuestions: retryMerged.totalQuestions,
            correctAnswers: retryMerged.correctAnswers,
            attempts: retryMerged.attempts,
            completedAt: retryMerged.completedAt,
            lastAttemptAt: now,
          },
        })
        return {
          progress,
          bestXp: progress.xpEarned,
          improved: xpEarned > (winner.xpEarned ?? 0),
        }
      }
    }

    const progress = await tx.userPhaseProgress.update({
      where: { id: existing.id },
      data: {
        xpEarned: merged.xpEarned,
        totalQuestions: merged.totalQuestions,
        correctAnswers: merged.correctAnswers,
        attempts: merged.attempts,
        completedAt: merged.completedAt,
        lastAttemptAt: now,
      },
    })

    return {
      progress,
      bestXp: progress.xpEarned,
      improved: xpEarned > previousXp,
    }
  })
}
