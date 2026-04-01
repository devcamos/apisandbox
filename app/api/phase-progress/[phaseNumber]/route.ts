import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"
import { gradePhaseQuiz, getPhaseQuiz, getSanitizedPhaseQuiz } from "@/lib/learning/phase-quizzes"
import { prisma } from "@/lib/prisma"

const submitSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(0)),
})

function parsePhaseNumber(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

export async function GET(request: NextRequest, context: { params: Promise<{ phaseNumber: string }> }) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { phaseNumber: rawPhaseNumber } = await context.params
    const phaseNumber = parsePhaseNumber(rawPhaseNumber)

    if (phaseNumber === null || !getPhaseQuiz(phaseNumber)) {
      return errorResponse(404, "not_found", "Quiz not found for this phase")
    }

    const [quiz, progress] = await Promise.all([
      Promise.resolve(getSanitizedPhaseQuiz(phaseNumber)),
      prisma.userPhaseProgress.findUnique({
        where: {
          userId_phaseNumber: {
            userId: user.id,
            phaseNumber,
          },
        },
      }),
    ])

    return okResponse({ quiz, progress })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ phaseNumber: string }> }) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { phaseNumber: rawPhaseNumber } = await context.params
    const phaseNumber = parsePhaseNumber(rawPhaseNumber)

    if (phaseNumber === null || !getPhaseQuiz(phaseNumber)) {
      return errorResponse(404, "not_found", "Quiz not found for this phase")
    }

    const body = await request.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(400, "validation_error", "Invalid quiz submission", parsed.error.issues)
    }

    const grading = gradePhaseQuiz(phaseNumber, parsed.data.answers)
    if (!grading) {
      return errorResponse(404, "not_found", "Quiz not found for this phase")
    }

    const existing = await prisma.userPhaseProgress.findUnique({
      where: {
        userId_phaseNumber: {
          userId: user.id,
          phaseNumber,
        },
      },
    })

    const bestCorrectAnswers = Math.max(existing?.correctAnswers ?? 0, grading.correctAnswers)
    const bestXp = Math.max(existing?.xpEarned ?? 0, grading.xpEarned)
    const totalQuestions = grading.totalQuestions
    const completedAt =
      bestCorrectAnswers === totalQuestions ? existing?.completedAt ?? new Date() : existing?.completedAt ?? null

    const progress = await prisma.userPhaseProgress.upsert({
      where: {
        userId_phaseNumber: {
          userId: user.id,
          phaseNumber,
        },
      },
      update: {
        xpEarned: bestXp,
        totalQuestions,
        correctAnswers: bestCorrectAnswers,
        attempts: (existing?.attempts ?? 0) + 1,
        completedAt,
        lastAttemptAt: new Date(),
      },
      create: {
        userId: user.id,
        phaseNumber,
        xpEarned: grading.xpEarned,
        totalQuestions,
        correctAnswers: grading.correctAnswers,
        attempts: 1,
        completedAt: grading.correctAnswers === totalQuestions ? new Date() : null,
        lastAttemptAt: new Date(),
      },
    })

    return okResponse({
      progress,
      result: grading,
      awardedXp: grading.xpEarned,
      bestXp,
      improved: grading.xpEarned > (existing?.xpEarned ?? 0),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
