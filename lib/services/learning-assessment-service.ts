import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import {
  getLearningCourse,
  getLearningUnit,
  gradeLearningUnitAssessment,
  isLearningUnitMastered,
  type AssessmentGrade,
} from "@/lib/learning/api-foundations-course"

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

  const existing = await prisma.learningUnitAssessmentProgress.findUnique({
    where: { userId_courseId_unitId: { userId, courseId, unitId } },
  })
  const bestCorrectAnswers = Math.max(existing?.bestCorrectAnswers ?? 0, grading.correctAnswers)
  const mastered = isLearningUnitMastered(
    bestCorrectAnswers,
    grading.totalQuestions,
    requireLearningCourse(courseId).masteryThreshold,
  )
  const now = new Date()

  const progress = await prisma.learningUnitAssessmentProgress.upsert({
    where: { userId_courseId_unitId: { userId, courseId, unitId } },
    update: {
      bestCorrectAnswers,
      totalQuestions: grading.totalQuestions,
      attempts: (existing?.attempts ?? 0) + 1,
      completedAt: mastered ? existing?.completedAt ?? now : null,
      lastAttemptAt: now,
    },
    create: {
      userId,
      courseId,
      unitId,
      bestCorrectAnswers,
      totalQuestions: grading.totalQuestions,
      attempts: 1,
      completedAt: mastered ? now : null,
      lastAttemptAt: now,
    },
  })

  return {
    progress,
    result: grading,
    improved: grading.correctAnswers > (existing?.bestCorrectAnswers ?? 0),
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
