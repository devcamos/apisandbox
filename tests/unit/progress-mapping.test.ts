import { describe, expect, it } from "vitest"
import {
  checkpointStatusFromState,
  courseIdForPhase,
  getCoursePlan,
  hasAnyLessonProgress,
  phaseFromCourseId,
  recordsToLessonProgressState,
  summarizeLearningProgress,
} from "@/lib/learning/progress-mapping"
import { emptyCheckpointProgress } from "@/lib/lessons/lesson-progress"

describe("learning progress mapping", () => {
  it("maps phase numbers to stable course ids", () => {
    expect(courseIdForPhase(2)).toBe("phase-2")
    expect(phaseFromCourseId("phase-9")).toBe(9)
    expect(phaseFromCourseId("cloud")).toBeNull()
  })

  it("returns known course plans only", () => {
    expect(getCoursePlan("phase-1")?.phase).toBe(1)
    expect(getCoursePlan("phase-999")).toBeNull()
  })

  it("derives checkpoint status from local tracker state", () => {
    expect(checkpointStatusFromState(emptyCheckpointProgress())).toBe("not_started")
    expect(checkpointStatusFromState({
      ...emptyCheckpointProgress(),
      answer: "A measured fallback with p95 impact",
    })).toBe("in_progress")
    expect(checkpointStatusFromState({
      ...emptyCheckpointProgress(),
      done: true,
    })).toBe("completed")
  })

  it("converts database records into lesson progress state", () => {
    const state = recordsToLessonProgressState([
      {
        moduleId: "oauth-flow",
        checkpointId: "mechanics",
        status: "completed",
        answer: "answer",
        evidence: "evidence",
        serviceName: "auth-service",
        endpointName: "POST /oauth/callback",
        criticalPathStep: "callback -> token exchange",
        auditEvidence: "test run",
        retrievalStep: 2,
        retrievalDueAt: "2026-06-26T10:00:00.000Z",
        completedAt: "2026-06-26T09:00:00.000Z",
      },
    ])

    expect(state["oauth-flow"]?.mechanics).toMatchObject({
      done: true,
      answer: "answer",
      retrievalDueAt: "2026-06-26T10:00:00.000Z",
    })
    expect(hasAnyLessonProgress(state)).toBe(true)
  })

  it("summarizes course progress using the existing lesson plan helpers", () => {
    const plan = getCoursePlan("phase-2")
    if (!plan) throw new Error("missing phase 2 plan")

    const progress = {
      "oauth-flow": {
        integrity: {
          ...emptyCheckpointProgress(),
          done: true,
        },
      },
    }

    const summary = summarizeLearningProgress(plan, progress)
    expect(summary.total).toBeGreaterThan(0)
    expect(summary.completed).toBe(1)
    expect(summary.nextIncomplete?.checkpointId).toBe("mechanics")
  })
})
