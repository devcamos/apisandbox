import { beforeEach, describe, expect, it, vi } from "vitest"
import { emptyCheckpointProgress } from "@/lib/lessons/lesson-progress"
import { getCoursePlan } from "@/lib/learning/progress-mapping"

const prismaMock = vi.hoisted(() => ({
  learningEnrollment: { findMany: vi.fn(), findUnique: vi.fn(), upsert: vi.fn() },
  learningCheckpointProgress: { findMany: vi.fn(), upsert: vi.fn() },
}))
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))

import {
  getLearningProgressForUser,
  listLearningCourseProgressForUser,
  upsertLearningCheckpointProgress,
} from "@/lib/services/learning-progress-service"

function planFor(courseId: string) {
  const plan = getCoursePlan(courseId)
  if (!plan) throw new Error(`Missing plan: ${courseId}`)
  return plan
}

function checkpointFor(courseId: string) {
  const lessonModule = planFor(courseId).modules[0]
  return { moduleId: lessonModule.id, checkpointId: lessonModule.checkpoints[0].id }
}

function courseTotal(courseId: string) {
  return planFor(courseId).modules.reduce((total, module) => total + module.checkpoints.length, 0)
}

function completedCheckpoint(courseId: string) {
  return {
    ...emptyCheckpointProgress(),
    ...checkpointFor(courseId),
    courseId,
    status: "completed",
    completedAt: new Date("2026-10-20T10:00:00Z"),
    retrievalDueAt: null,
  }
}

beforeEach(() => {
  vi.resetAllMocks()
  prismaMock.learningEnrollment.findMany.mockResolvedValue([])
  prismaMock.learningEnrollment.findUnique.mockResolvedValue(null)
  prismaMock.learningCheckpointProgress.findMany.mockResolvedValue([])
  prismaMock.learningCheckpointProgress.upsert.mockResolvedValue({ id: "checkpoint-record" })
})

describe("listLearningCourseProgressForUser", () => {
  it.each([{ enrollments: [] }, { enrollments: [{ courseId: "retired-course", status: "completed" }] }])(
    "retains empty and unknown-only enrollments without loading checkpoints: %j",
    async ({ enrollments }) => {
      prismaMock.learningEnrollment.findMany.mockResolvedValue(enrollments)
      const result = await listLearningCourseProgressForUser("learner-1")
      expect(result).toEqual(enrollments.map((enrollment) => ({ ...enrollment, completed: 0, total: 0 })))
      expect(prismaMock.learningCheckpointProgress.findMany).not.toHaveBeenCalled()
    },
  )

  it("keeps enrollment order/status and separates known-course checkpoint summaries", async () => {
    prismaMock.learningEnrollment.findMany.mockResolvedValue([
      { courseId: "phase-2", status: "in_progress" },
      { courseId: "retired-course", status: "completed" },
      { courseId: "phase-1", status: "not_started" },
      { courseId: "phase-3", status: "in_progress" },
    ])
    prismaMock.learningCheckpointProgress.findMany.mockResolvedValue([
      completedCheckpoint("phase-1"),
      completedCheckpoint("phase-2"),
    ])

    expect(await listLearningCourseProgressForUser("learner-1")).toEqual([
      { courseId: "phase-2", status: "in_progress", completed: 1, total: courseTotal("phase-2") },
      { courseId: "retired-course", status: "completed", completed: 0, total: 0 },
      { courseId: "phase-1", status: "not_started", completed: 1, total: courseTotal("phase-1") },
      { courseId: "phase-3", status: "in_progress", completed: 0, total: courseTotal("phase-3") },
    ])
    expect(prismaMock.learningEnrollment.findMany).toHaveBeenCalledWith({
      where: { userId: "learner-1" }, orderBy: { lastActivityAt: "desc" },
    })
    expect(prismaMock.learningCheckpointProgress.findMany).toHaveBeenCalledExactlyOnceWith({
      where: { userId: "learner-1", courseId: { in: ["phase-2", "phase-1", "phase-3"] } },
      orderBy: [{ moduleId: "asc" }, { checkpointId: "asc" }],
    })
    expect(prismaMock.learningEnrollment.findUnique).not.toHaveBeenCalled()
  })

  it("preserves the same completed/total summary as the full course snapshot", async () => {
    const records = [completedCheckpoint("phase-2")]
    prismaMock.learningEnrollment.findMany.mockResolvedValue([{ courseId: "phase-2", status: "in_progress" }])
    prismaMock.learningCheckpointProgress.findMany.mockResolvedValue(records)
    const full = await getLearningProgressForUser("learner-1", "phase-2")
    const [listed] = await listLearningCourseProgressForUser("learner-1")
    expect(listed).toMatchObject({ completed: full.summary.completed, total: full.summary.total })
  })
})

describe("upsertLearningCheckpointProgress", () => {
  it.each([
    { done: true, answer: "", status: "completed", due: "2026-10-21T09:00:00Z" },
    { done: false, answer: "Saved answer", status: "in_progress", due: "invalid" },
    { done: false, answer: "", status: "not_started", due: "" },
  ])("keeps create/update fields aligned for $status", async ({ done, answer, status, due }) => {
    const input = {
      ...emptyCheckpointProgress(), ...checkpointFor("phase-2"),
      userId: "learner-1", courseId: "phase-2", done, answer, retrievalDueAt: due,
      evidence: "", serviceName: "", endpointName: "", criticalPathStep: "", auditEvidence: "",
    }
    const saved = await upsertLearningCheckpointProgress(input)
    const write = prismaMock.learningCheckpointProgress.upsert.mock.calls[0][0]
    const expected = {
      status, answer, evidence: "", serviceName: "", endpointName: "", criticalPathStep: "",
      auditEvidence: "", retrievalStep: 0,
      retrievalDueAt: due.startsWith("2026") ? new Date(due) : null,
      completedAt: done ? expect.any(Date) : null,
    }
    expect(write.update).toEqual(expected)
    expect(write.create).toEqual({
      userId: input.userId, courseId: input.courseId, moduleId: input.moduleId,
      checkpointId: input.checkpointId, ...expected,
    })
    expect(write.where).toEqual({ userId_courseId_moduleId_checkpointId: {
      userId: input.userId, courseId: input.courseId, moduleId: input.moduleId, checkpointId: input.checkpointId,
    } })
    expect(saved).toEqual({ id: "checkpoint-record" })
    expect(prismaMock.learningEnrollment.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ status: "in_progress", completedAt: null }),
    }))
  })

  it("marks enrollment completed only when every plan checkpoint is complete", async () => {
    const courseId = "phase-2"
    const records = planFor(courseId).modules.flatMap((module) =>
      module.checkpoints.map((checkpoint) => ({
        ...completedCheckpoint(courseId), moduleId: module.id, checkpointId: checkpoint.id,
      })),
    )
    prismaMock.learningCheckpointProgress.findMany.mockResolvedValue(records)
    await upsertLearningCheckpointProgress({
      ...emptyCheckpointProgress(), ...checkpointFor(courseId),
      userId: "learner-1", courseId, done: true,
    })
    expect(prismaMock.learningEnrollment.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ status: "completed", completedAt: expect.any(Date) }),
      create: expect.objectContaining({ status: "completed", completedAt: expect.any(Date) }),
    }))
  })

  it("rejects missing course/checkpoint definitions without writing", async () => {
    await expect(upsertLearningCheckpointProgress({
      ...emptyCheckpointProgress(), userId: "learner-1", courseId: "phase-999",
      moduleId: "missing", checkpointId: "missing",
    })).rejects.toMatchObject({ status: 404, category: "not_found" })
    await expect(upsertLearningCheckpointProgress({
      ...emptyCheckpointProgress(), userId: "learner-1", courseId: "phase-2",
      moduleId: "missing", checkpointId: "missing",
    })).rejects.toMatchObject({ status: 404, category: "not_found" })
    expect(prismaMock.learningCheckpointProgress.upsert).not.toHaveBeenCalled()
  })

  it("preserves explicit valid status over local done state", async () => {
    await upsertLearningCheckpointProgress({
      ...emptyCheckpointProgress(), ...checkpointFor("phase-2"),
      userId: "learner-1", courseId: "phase-2", done: true, status: "in_progress",
    })
    expect(prismaMock.learningCheckpointProgress.upsert.mock.calls[0][0].update).toMatchObject({
      status: "in_progress", completedAt: null,
    })
  })

  it("rejects invalid statuses before persistence", async () => {
    await expect(upsertLearningCheckpointProgress({
      ...emptyCheckpointProgress(), ...checkpointFor("phase-2"),
      userId: "learner-1", courseId: "phase-2",
      status: "invalid" as "completed",
    })).rejects.toMatchObject({ status: 400, category: "validation_error" })
    expect(prismaMock.learningCheckpointProgress.upsert).not.toHaveBeenCalled()
  })
})
