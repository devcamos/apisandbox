import { Prisma } from "@prisma/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => {
  const tx = {
    $queryRaw: vi.fn(),
    userPhaseProgress: {
      create: vi.fn(),
      update: vi.fn(),
    },
  }
  return {
    $transaction: vi.fn(async (fn: (client: typeof tx) => unknown) => fn(tx)),
    __tx: tx,
  }
})

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))

import { recordPhaseQuizAttempt } from "@/lib/services/phase-progress-service"

const now = new Date("2026-10-20T12:00:00Z")
const completedAt = new Date("2026-10-19T12:00:00Z")
const attempt = {
  userId: "u1",
  phaseNumber: 0,
  correctAnswers: 2,
  xpEarned: 40,
  totalQuestions: 5,
}
const existing = {
  id: "p1",
  userId: "u1",
  phaseNumber: 0,
  xpEarned: 80,
  totalQuestions: 5,
  correctAnswers: 4,
  attempts: 1,
  completedAt: null,
  lastAttemptAt: completedAt,
  createdAt: completedAt,
  updatedAt: completedAt,
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.setSystemTime(now)
  prismaMock.$transaction.mockImplementation(async (fn: (client: typeof prismaMock.__tx) => unknown) =>
    fn(prismaMock.__tx),
  )
  prismaMock.__tx.userPhaseProgress.create.mockImplementation(async ({ data }) => ({
    ...existing,
    ...data,
  }))
  prismaMock.__tx.userPhaseProgress.update.mockImplementation(async ({ data }) => ({
    ...existing,
    ...data,
  }))
})

afterEach(() => vi.useRealTimers())

describe("recordPhaseQuizAttempt", () => {
  it("creates progress on first attempt and scopes the row lock to the learner and phase", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([])

    const result = await recordPhaseQuizAttempt(attempt)

    expect(prismaMock.$transaction).toHaveBeenCalledOnce()
    const [sql, userId, phaseNumber] = prismaMock.__tx.$queryRaw.mock.calls[0]
    expect(sql.join("?")).toContain('WHERE "userId" = ? AND "phaseNumber" = ?')
    expect(sql.join("?")).toContain("FOR UPDATE")
    expect([userId, phaseNumber]).toEqual(["u1", 0])
    expect(prismaMock.__tx.userPhaseProgress.create).toHaveBeenCalledWith({
      data: { ...attempt, attempts: 1, completedAt: null, lastAttemptAt: now },
    })
    expect(prismaMock.__tx.userPhaseProgress.update).not.toHaveBeenCalled()
    expect(result).toEqual({
      progress: expect.objectContaining({ ...attempt, attempts: 1 }),
      improved: true,
      bestXp: 40,
    })
  })

  it.each([
    { label: "lower", xpEarned: 20, correctAnswers: 1, bestXp: 80, bestCorrect: 4, improved: false },
    { label: "equal", xpEarned: 80, correctAnswers: 4, bestXp: 80, bestCorrect: 4, improved: false },
    { label: "higher", xpEarned: 100, correctAnswers: 5, bestXp: 100, bestCorrect: 5, improved: true },
  ])("merges a $label attempt without losing best scores or attempts", async (score) => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([existing])

    const result = await recordPhaseQuizAttempt({
      ...attempt,
      xpEarned: score.xpEarned,
      correctAnswers: score.correctAnswers,
    })

    expect(prismaMock.__tx.userPhaseProgress.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: {
        xpEarned: score.bestXp,
        correctAnswers: score.bestCorrect,
        totalQuestions: 5,
        attempts: 2,
        completedAt: score.bestCorrect === 5 ? now : null,
        lastAttemptAt: now,
      },
    })
    expect(prismaMock.__tx.userPhaseProgress.create).not.toHaveBeenCalled()
    expect(result.bestXp).toBe(score.bestXp)
    expect(result.improved).toBe(score.improved)
  })

  it("keeps the original completion timestamp on later attempts", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([
      { ...existing, correctAnswers: 5, xpEarned: 100, completedAt },
    ])

    const result = await recordPhaseQuizAttempt(attempt)

    expect(result.progress.completedAt).toEqual(completedAt)
    expect(result.progress.attempts).toBe(2)
    expect(result.progress.lastAttemptAt).toEqual(now)
  })

  it("marks a perfect first attempt completed", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([])

    const result = await recordPhaseQuizAttempt({ ...attempt, correctAnswers: 5, xpEarned: 100 })

    expect(result.progress.completedAt).toEqual(now)
    expect(result.progress.attempts).toBe(1)
  })

  it("reports no improvement for a zero-XP first attempt", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([])

    const result = await recordPhaseQuizAttempt({ ...attempt, correctAnswers: 0, xpEarned: 0 })

    expect(result.bestXp).toBe(0)
    expect(result.improved).toBe(false)
  })

  it.each([
    { winnerXp: 80, winnerCorrect: 4, bestXp: 80, improved: false },
    { winnerXp: 20, winnerCorrect: 1, bestXp: 40, improved: true },
  ])("merges a unique-conflict winner with $winnerXp XP and compares improvement against it", async (score) => {
    const conflict = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
    })
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { ...existing, xpEarned: score.winnerXp, correctAnswers: score.winnerCorrect },
    ])
    prismaMock.__tx.userPhaseProgress.create.mockRejectedValueOnce(conflict)

    const result = await recordPhaseQuizAttempt(attempt)

    expect(prismaMock.__tx.$queryRaw).toHaveBeenCalledTimes(2)
    expect(prismaMock.__tx.$queryRaw.mock.calls[1]).toEqual(prismaMock.__tx.$queryRaw.mock.calls[0])
    expect(prismaMock.__tx.userPhaseProgress.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: {
        xpEarned: score.bestXp,
        correctAnswers: Math.max(score.winnerCorrect, attempt.correctAnswers),
        totalQuestions: 5,
        attempts: 2,
        completedAt: null,
        lastAttemptAt: now,
      },
    })
    expect(result.bestXp).toBe(score.bestXp)
    expect(result.improved).toBe(score.improved)
  })

  it("rethrows the original conflict when no winner can be locked", async () => {
    const conflict = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
    })
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([])
    prismaMock.__tx.userPhaseProgress.create.mockRejectedValueOnce(conflict)

    await expect(recordPhaseQuizAttempt(attempt)).rejects.toBe(conflict)
    expect(prismaMock.__tx.userPhaseProgress.update).not.toHaveBeenCalled()
  })

  it.each([
    new Error("database unavailable"),
    new Prisma.PrismaClientKnownRequestError("transaction timed out", {
      code: "P2028",
      clientVersion: "test",
    }),
  ])("propagates non-unique create failures without retrying", async (error) => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([])
    prismaMock.__tx.userPhaseProgress.create.mockRejectedValueOnce(error)

    await expect(recordPhaseQuizAttempt(attempt)).rejects.toBe(error)
    expect(prismaMock.__tx.$queryRaw).toHaveBeenCalledOnce()
    expect(prismaMock.__tx.userPhaseProgress.update).not.toHaveBeenCalled()
  })

  it("propagates an existing-row write failure without retrying it as an insert", async () => {
    const failure = new Error("write failed")
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([existing])
    prismaMock.__tx.userPhaseProgress.update.mockRejectedValueOnce(failure)

    await expect(recordPhaseQuizAttempt(attempt)).rejects.toBe(failure)
    expect(prismaMock.__tx.$queryRaw).toHaveBeenCalledOnce()
    expect(prismaMock.__tx.userPhaseProgress.create).not.toHaveBeenCalled()
  })
})
