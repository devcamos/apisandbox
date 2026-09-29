import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import {
  getLearningCourse,
  getLearningUnit,
  gradeLearningUnitAssessment,
  isLearningUnitMastered,
  type AssessmentGrade,
} from "@/lib/learning/api-foundations-course"
import {
  mergeAssessmentProgress,
  type AssessmentProgressSnapshot,
} from "@/lib/progress/best-score-progress"

export interface LearningAssessmentProgressRecord {
  unitId: string
  bestCorrectAnswers: number
  totalQuestions: number
  attempts: number
  completedAt: Date | null
  lastAttemptAt: Date | null
}

export interface CourseAssessmentSummary {
  courseId: string
  totalUnits: number
  attemptedUnits: number
  masteredUnits: number
  percent: number
  unitProgress: LearningAssessmentProgressRecord[]
}

function requireLearningUnit(courseId: string, unitId: string) {
  const unit = getLearningUnit(courseId, unitId)
  if (!unit) throw new AppError("Learning unit not found", 404, "not_found")
  return unit
}

function requireLearningCourse(courseId: string) {
  const course = getLearningCourse(courseId)
  if (!course) throw new AppError("Learning course not found", 404, "not_found")
  return course
}

function isUniqueConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  )
}

function toProgressRecord(
  unitId: string,
  row: {
    bestCorrectAnswers: number
    totalQuestions: number
    attempts: number
    completedAt: Date | null
    lastAttemptAt: Date | null
  },
): LearningAssessmentProgressRecord {
  return {
    unitId,
    bestCorrectAnswers: row.bestCorrectAnswers,
    totalQuestions: row.totalQuestions,
    attempts: row.attempts,
    completedAt: row.completedAt,
    lastAttemptAt: row.lastAttemptAt,
  }
}

async function lockAssessmentProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  courseId: string,
  unitId: string,
) {
  return tx.$queryRaw<
    Array<{
      id: string
      userId: string
      courseId: string
      unitId: string
      bestCorrectAnswers: number
      totalQuestions: number
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
      "courseId",
      "unitId",
      "bestCorrectAnswers",
      "totalQuestions",
      attempts,
      "completedAt",
      "lastAttemptAt",
      "createdAt",
      "updatedAt"
    FROM "LearningUnitAssessmentProgress"
    WHERE "userId" = ${userId} AND "courseId" = ${courseId} AND "unitId" = ${unitId}
    FOR UPDATE
  `
}

export async function getLearningAssessmentProgressForUser(userId: string, courseId: string, unitId: string) {
  requireLearningUnit(courseId, unitId)
  return prisma.learningUnitAssessmentProgress.findUnique({
    where: { userId_courseId_unitId: { userId, courseId, unitId } },
  })
}

export async function submitLearningUnitAssessment({
  userId,
  courseId,
  unitId,
  answers,
}: {
  userId: string
  courseId: string
  unitId: string
  answers: Record<string, string>
}): Promise<{ progress: LearningAssessmentProgressRecord; result: AssessmentGrade; improved: boolean }> {
  const unit = requireLearningUnit(courseId, unitId)
  const unanswered = unit.assessment.questions.filter((question) => !answers[question.id]?.trim())
  if (unanswered.length > 0) {
    throw new AppError("Answer every question before submitting", 400, "validation_error", {
      missingQuestionIds: unanswered.map((question) => question.id),
    })
  }

  const grading = gradeLearningUnitAssessment(courseId, unitId, answers)
  if (!grading) throw new AppError("Learning assessment not found", 404, "not_found")

  const course = requireLearningCourse(courseId)
  const now = new Date()

  const { progress, improved } = await prisma.$transaction(async (tx) => {
    const locked = await lockAssessmentProgress(tx, userId, courseId, unitId)
    const existing = locked[0] ?? null
    const previousBest = existing?.bestCorrectAnswers ?? 0

    const applyUpdate = async (current: AssessmentProgressSnapshot | null) => {
      const merged = mergeAssessmentProgress(current, {
        correctAnswers: grading.correctAnswers,
        totalQuestions: grading.totalQuestions,
        masteryThreshold: course.masteryThreshold,
        attemptedAt: now,
      })

      if (!current) {
        try {
          const created = await tx.learningUnitAssessmentProgress.create({
            data: {
              userId,
              courseId,
              unitId,
              bestCorrectAnswers: merged.bestCorrectAnswers,
              totalQuestions: merged.totalQuestions,
              attempts: merged.attempts,
              completedAt: merged.completedAt,
              lastAttemptAt: now,
            },
          })
          return {
            progress: toProgressRecord(unitId, created),
            improved: grading.correctAnswers > previousBest,
          }
        } catch (error) {
          if (!isUniqueConflict(error)) throw error
          const retryLocked = await lockAssessmentProgress(tx, userId, courseId, unitId)
          const winner = retryLocked[0]
          if (!winner) throw error
          const retryMerged = mergeAssessmentProgress(winner, {
            correctAnswers: grading.correctAnswers,
            totalQuestions: grading.totalQuestions,
            masteryThreshold: course.masteryThreshold,
            attemptedAt: now,
          })
          const updated = await tx.learningUnitAssessmentProgress.update({
            where: { id: winner.id },
            data: {
              bestCorrectAnswers: retryMerged.bestCorrectAnswers,
              totalQuestions: retryMerged.totalQuestions,
              attempts: retryMerged.attempts,
              completedAt: retryMerged.completedAt,
              lastAttemptAt: now,
            },
          })
          return {
            progress: toProgressRecord(unitId, updated),
            improved: grading.correctAnswers > winner.bestCorrectAnswers,
          }
        }
      }

      const updated = await tx.learningUnitAssessmentProgress.update({
        where: {
          userId_courseId_unitId: { userId, courseId, unitId },
        },
        data: {
          bestCorrectAnswers: merged.bestCorrectAnswers,
          totalQuestions: merged.totalQuestions,
          attempts: merged.attempts,
          completedAt: merged.completedAt,
          lastAttemptAt: now,
        },
      })
      return {
        progress: toProgressRecord(unitId, updated),
        improved: grading.correctAnswers > previousBest,
      }
    }

    return applyUpdate(existing)
  })

  return {
    progress,
    result: grading,
    improved,
  }
}

export async function getCourseAssessmentSummaryForUser(userId: string, courseId: string): Promise<CourseAssessmentSummary> {
  const course = requireLearningCourse(courseId)
  const unitProgress = await prisma.learningUnitAssessmentProgress.findMany({
    where: { userId, courseId },
    orderBy: { unitId: "asc" },
  })
  const attemptedUnits = unitProgress.filter((progress) => progress.attempts > 0).length
  const masteredUnits = unitProgress.filter((progress) =>
    isLearningUnitMastered(progress.bestCorrectAnswers, progress.totalQuestions, course.masteryThreshold),
  ).length

  return {
    courseId,
    totalUnits: course.units.length,
    attemptedUnits,
    masteredUnits,
    percent: course.units.length === 0 ? 0 : Math.round((masteredUnits / course.units.length) * 100),
    unitProgress,
  }
}
