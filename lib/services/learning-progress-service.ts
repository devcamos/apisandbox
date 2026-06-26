import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import type { CheckpointProgress, LessonProgressState } from "@/lib/lessons/lesson-progress"
import {
  checkpointStatusFromState,
  getCoursePlan,
  hasAnyLessonProgress,
  isLearningCheckpointStatus,
  recordsToLessonProgressState,
  summarizeLearningProgress,
  type LearningCheckpointStatus,
} from "@/lib/learning/progress-mapping"

interface CheckpointInput extends CheckpointProgress {
  userId: string
  courseId: string
  moduleId: string
  checkpointId: string
  status?: LearningCheckpointStatus
}

function requireCoursePlan(courseId: string) {
  const plan = getCoursePlan(courseId)
  if (!plan) {
    throw new AppError("Learning course not found", 404, "not_found")
  }
  return plan
}

function requireCheckpoint(courseId: string, moduleId: string, checkpointId: string) {
  const plan = requireCoursePlan(courseId)
  const lessonModule = plan.modules.find((item) => item.id === moduleId)
  const checkpoint = lessonModule?.checkpoints.find((item) => item.id === checkpointId)
  if (!lessonModule || !checkpoint) {
    throw new AppError("Learning checkpoint not found", 404, "not_found")
  }
  return { plan, lessonModule, checkpoint }
}

function dateOrNull(value: string) {
  if (!value.trim()) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

async function touchEnrollment(userId: string, courseId: string, status: string) {
  const now = new Date()
  await prisma.learningEnrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      status,
      lastActivityAt: now,
      completedAt: status === "completed" ? now : null,
    },
    create: {
      userId,
      courseId,
      status,
      lastActivityAt: now,
      completedAt: status === "completed" ? now : null,
    },
  })
}

export async function getLearningProgressForUser(userId: string, courseId: string) {
  const plan = requireCoursePlan(courseId)
  const [enrollment, records] = await Promise.all([
    prisma.learningEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    }),
    prisma.learningCheckpointProgress.findMany({
      where: { userId, courseId },
      orderBy: [{ moduleId: "asc" }, { checkpointId: "asc" }],
    }),
  ])

  const progress = recordsToLessonProgressState(records)
  const summary = summarizeLearningProgress(plan, progress)

  return {
    courseId,
    enrollment,
    progress,
    summary,
    lastActivityAt: enrollment?.lastActivityAt?.toISOString() ?? null,
  }
}

export async function upsertLearningCheckpointProgress(input: CheckpointInput) {
  requireCheckpoint(input.courseId, input.moduleId, input.checkpointId)

  const state: CheckpointProgress = {
    done: input.done,
    answer: input.answer,
    evidence: input.evidence,
    serviceName: input.serviceName,
    endpointName: input.endpointName,
    criticalPathStep: input.criticalPathStep,
    auditEvidence: input.auditEvidence,
    retrievalStep: input.retrievalStep,
    retrievalDueAt: input.retrievalDueAt,
  }
  const status = input.status ?? checkpointStatusFromState(state)
  if (!isLearningCheckpointStatus(status)) {
    throw new AppError("Invalid learning checkpoint status", 400, "validation_error")
  }

  const completedAt = status === "completed" ? new Date() : null
  const record = await prisma.learningCheckpointProgress.upsert({
    where: {
      userId_courseId_moduleId_checkpointId: {
        userId: input.userId,
        courseId: input.courseId,
        moduleId: input.moduleId,
        checkpointId: input.checkpointId,
      },
    },
    update: {
      status,
      answer: input.answer,
      evidence: input.evidence,
      serviceName: input.serviceName,
      endpointName: input.endpointName,
      criticalPathStep: input.criticalPathStep,
      auditEvidence: input.auditEvidence,
      retrievalStep: input.retrievalStep,
      retrievalDueAt: dateOrNull(input.retrievalDueAt),
      completedAt,
    },
    create: {
      userId: input.userId,
      courseId: input.courseId,
      moduleId: input.moduleId,
      checkpointId: input.checkpointId,
      status,
      answer: input.answer,
      evidence: input.evidence,
      serviceName: input.serviceName,
      endpointName: input.endpointName,
      criticalPathStep: input.criticalPathStep,
      auditEvidence: input.auditEvidence,
      retrievalStep: input.retrievalStep,
      retrievalDueAt: dateOrNull(input.retrievalDueAt),
      completedAt,
    },
  })

  const latest = await getLearningProgressForUser(input.userId, input.courseId)
  await touchEnrollment(
    input.userId,
    input.courseId,
    latest.summary.completed === latest.summary.total && latest.summary.total > 0 ? "completed" : "in_progress",
  )

  return record
}

export async function importLearningProgressForUser(
  userId: string,
  courseId: string,
  progress: LessonProgressState,
) {
  const plan = requireCoursePlan(courseId)
  if (!hasAnyLessonProgress(progress)) {
    return getLearningProgressForUser(userId, courseId)
  }

  for (const courseModule of plan.modules) {
    for (const checkpoint of courseModule.checkpoints) {
      const state = progress[courseModule.id]?.[checkpoint.id]
      if (!state) continue
      await upsertLearningCheckpointProgress({
        userId,
        courseId,
        moduleId: courseModule.id,
        checkpointId: checkpoint.id,
        ...state,
      })
    }
  }

  return getLearningProgressForUser(userId, courseId)
}
