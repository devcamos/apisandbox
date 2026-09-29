import { beforeEach, describe, expect, it, vi } from "vitest"

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

beforeEach(() => {
  vi.clearAllMocks()
  prismaMock.$transaction.mockImplementation(async (fn: (client: typeof prismaMock.__tx) => unknown) =>
    fn(prismaMock.__tx),
  )
})

describe("recordPhaseQuizAttempt", () => {
  it("creates progress on first attempt", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([])
    prismaMock.__tx.userPhaseProgress.create.mockResolvedValueOnce({
      id: "p1",
      userId: "u1",
      phaseNumber: 0,
      xpEarned: 40,
      totalQuestions: 5,
      correctAnswers: 2,
      attempts: 1,
      completedAt: null,
      lastAttemptAt: expect.any(Date),
    })

    const result = await recordPhaseQuizAttempt({
      userId: "u1",
      phaseNumber: 0,
      correctAnswers: 2,
      xpEarned: 40,
      totalQuestions: 5,
    })

    expect(result.improved).toBe(true)
    expect(result.bestXp).toBe(40)
    expect(prismaMock.__tx.userPhaseProgress.create).toHaveBeenCalled()
  })

  it("keeps the higher score when a lower concurrent-looking attempt arrives", async () => {
    prismaMock.__tx.$queryRaw.mockResolvedValueOnce([
      {
        id: "p1",
        userId: "u1",
        phaseNumber: 0,
        xpEarned: 80,
        totalQuestions: 5,
        correctAnswers: 4,
        attempts: 1,
        completedAt: null,
        lastAttemptAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    prismaMock.__tx.userPhaseProgress.update.mockResolvedValueOnce({
      id: "p1",
      userId: "u1",
      phaseNumber: 0,
      xpEarned: 80,
      totalQuestions: 5,
      correctAnswers: 4,
      attempts: 2,
      completedAt: null,
      lastAttemptAt: new Date(),
    })

    const result = await recordPhaseQuizAttempt({
      userId: "u1",
      phaseNumber: 0,
      correctAnswers: 1,
      xpEarned: 20,
      totalQuestions: 5,
    })

    expect(result.improved).toBe(false)
    expect(prismaMock.__tx.userPhaseProgress.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          correctAnswers: 4,
          xpEarned: 80,
          attempts: 2,
        }),
      }),
    )
  })
})
