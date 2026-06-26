import { describe, expect, test } from "vitest"
import type { PhaseLessonPlan } from "@/lib/lessons/phase-lessons"
import {
  canCompleteCheckpoint,
  computeModuleStats,
  computeOverallStats,
  countBullets,
  countReviewsDue,
  emptyCheckpointProgress,
  findNextIncomplete,
  getCompletionChecks,
  hasFallbackPolicy,
  hasMeasurableDecision,
  RETRIEVAL_INTERVAL_DAYS,
  scheduleNextRetrieval,
  type LessonProgressState,
} from "@/lib/lessons/lesson-progress"

const plan: PhaseLessonPlan = {
  phase: 0,
  title: "Fundamentals Progress Tracker",
  structureLabel: "Build-first fundamentals",
  modules: [
    {
      id: "m1",
      title: "Module One",
      urgency: "",
      checkpoints: [
        { id: "observe", label: "Observe", prompt: "" },
        { id: "mechanics", label: "Mechanics", prompt: "" },
      ],
    },
    {
      id: "m2",
      title: "Module Two",
      urgency: "",
      checkpoints: [
        { id: "drill", label: "Drill", prompt: "" },
        { id: "retrieval", label: "Retrieval", prompt: "" },
      ],
    },
  ],
}

function done(): ReturnType<typeof emptyCheckpointProgress> {
  return { ...emptyCheckpointProgress(), done: true }
}

describe("lesson-progress rubric checks", () => {
  test("countBullets counts dash, bullet, and numbered lines", () => {
    expect(countBullets("- a\n* b\n1. c\nplain")).toBe(3)
    expect(countBullets("no bullets here")).toBe(0)
  })

  test("hasMeasurableDecision detects metrics and ops keywords", () => {
    expect(hasMeasurableDecision("p95 dropped to 120ms")).toBe(true)
    expect(hasMeasurableDecision("reduced latency under load")).toBe(true)
    expect(hasMeasurableDecision("it got faster")).toBe(false)
  })

  test("hasFallbackPolicy detects resilience language", () => {
    expect(hasFallbackPolicy("added a circuit breaker")).toBe(true)
    expect(hasFallbackPolicy("graceful degradation on timeout")).toBe(true)
    expect(hasFallbackPolicy("set a retry budget and shed load")).toBe(true)
    expect(hasFallbackPolicy("just retried twice")).toBe(false)
    expect(hasFallbackPolicy("no plan")).toBe(false)
  })

  test("getCompletionChecks passes only a fully-formed answer", () => {
    const weak = getCompletionChecks(emptyCheckpointProgress())
    expect(weak.every((c) => c.pass)).toBe(false)

    const strong = getCompletionChecks({
      ...emptyCheckpointProgress(),
      answer: "- one\n- two\n- three with p95 120ms\n- fallback returns cached value",
      evidence: "PR #1",
    })
    expect(strong.every((c) => c.pass)).toBe(true)
  })

  test("canCompleteCheckpoint always allows retrieval but gates others", () => {
    const empty = emptyCheckpointProgress()
    expect(canCompleteCheckpoint({ id: "retrieval", label: "R", prompt: "" }, empty)).toBe(true)
    expect(canCompleteCheckpoint({ id: "observe", label: "O", prompt: "" }, empty)).toBe(false)
  })
})

describe("lesson-progress stats", () => {
  test("computeOverallStats counts completed checkpoints", () => {
    const progress: LessonProgressState = { m1: { observe: done() } }
    expect(computeOverallStats(plan, progress)).toEqual({ total: 4, completed: 1, percent: 25 })
  })

  test("computeOverallStats is zero-safe for empty progress", () => {
    expect(computeOverallStats(plan, {})).toEqual({ total: 4, completed: 0, percent: 0 })
  })

  test("computeModuleStats reports per-module percentages in plan order", () => {
    const progress: LessonProgressState = { m1: { observe: done(), mechanics: done() } }
    const stats = computeModuleStats(plan, progress)
    expect(stats.map((s) => s.id)).toEqual(["m1", "m2"])
    expect(stats[0]).toMatchObject({ completed: 2, total: 2, percent: 100 })
    expect(stats[1]).toMatchObject({ completed: 0, total: 2, percent: 0 })
  })

  test("findNextIncomplete returns the first unfinished checkpoint with a flat index", () => {
    const progress: LessonProgressState = { m1: { observe: done() } }
    expect(findNextIncomplete(plan, progress)).toMatchObject({
      moduleId: "m1",
      checkpointId: "mechanics",
      index: 1,
    })
  })

  test("findNextIncomplete returns null when everything is done", () => {
    const progress: LessonProgressState = {
      m1: { observe: done(), mechanics: done() },
      m2: { drill: done(), retrieval: done() },
    }
    expect(findNextIncomplete(plan, progress)).toBeNull()
  })

  test("countReviewsDue only counts due, completed retrieval checkpoints", () => {
    const past = new Date(Date.now() - 1000).toISOString()
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const now = new Date()

    expect(
      countReviewsDue(plan, { m2: { retrieval: { ...done(), retrievalDueAt: past } } }, now),
    ).toBe(1)
    expect(
      countReviewsDue(plan, { m2: { retrieval: { ...done(), retrievalDueAt: future } } }, now),
    ).toBe(0)
    expect(
      countReviewsDue(plan, { m2: { retrieval: { ...emptyCheckpointProgress(), retrievalDueAt: past } } }, now),
    ).toBe(0)
  })
})

describe("scheduleNextRetrieval", () => {
  test("advances the interval step and clamps at the final interval", () => {
    expect(scheduleNextRetrieval(0).nextStep).toBe(1)
    const last = RETRIEVAL_INTERVAL_DAYS.length - 1
    expect(scheduleNextRetrieval(last).nextStep).toBe(last)
  })

  test("schedules a future due date", () => {
    const { dueAt } = scheduleNextRetrieval(0)
    expect(new Date(dueAt).getTime()).toBeGreaterThan(Date.now())
  })
})
