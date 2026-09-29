import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"
import { parseJsonBody } from "@/lib/http/auth-route-helpers"
import { gradePhaseQuiz, getPhaseQuiz, getSanitizedPhaseQuiz } from "@/lib/learning/phase-quizzes"
import { prisma } from "@/lib/prisma"
import { recordPhaseQuizAttempt } from "@/lib/services/phase-progress-service"

const submitSchema = z.object({
  answers: z.record(z.string(), z.string().min(1)),
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

    const parsed = await parseJsonBody(request, submitSchema, "Invalid quiz submission")
    if (!parsed.ok) return parsed.response

    const grading = gradePhaseQuiz(phaseNumber, parsed.data.answers)
    if (!grading) {
      return errorResponse(404, "not_found", "Quiz not found for this phase")
    }

    const quiz = getPhaseQuiz(phaseNumber)!
    const unanswered = quiz.questions.filter((question) => !parsed.data.answers[question.id]?.trim())
    if (unanswered.length > 0) {
      return errorResponse(400, "validation_error", "Answer every question before submitting", {
        missingQuestionIds: unanswered.map((question) => question.id),
      })
    }

    const { progress, bestXp, improved } = await recordPhaseQuizAttempt({
      userId: user.id,
      phaseNumber,
      correctAnswers: grading.correctAnswers,
      xpEarned: grading.xpEarned,
      totalQuestions: grading.totalQuestions,
    })

    return okResponse({
      progress,
      result: grading,
      awardedXp: grading.xpEarned,
      bestXp,
      improved,
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
