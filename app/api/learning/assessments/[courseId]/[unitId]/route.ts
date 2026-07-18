import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { parseJsonBody } from "@/lib/http/auth-route-helpers"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"
import { getSanitizedAssessment } from "@/lib/learning/api-foundations-course"
import {
  getLearningAssessmentProgressForUser,
  submitLearningUnitAssessment,
} from "@/lib/services/learning-assessment-service"

const submissionSchema = z.object({
  answers: z.record(z.string(), z.string().min(1)),
})

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; unitId: string }> },
) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { courseId, unitId } = await context.params
    const assessment = getSanitizedAssessment(courseId, unitId)
    if (!assessment) return errorResponse(404, "not_found", "Learning assessment not found")

    const progress = await getLearningAssessmentProgressForUser(user.id, courseId, unitId)
    return okResponse({ assessment, progress })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; unitId: string }> },
) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { courseId, unitId } = await context.params
    const parsed = await parseJsonBody(request, submissionSchema, "Invalid learning assessment submission")
    if (!parsed.ok) return parsed.response

    const submission = await submitLearningUnitAssessment({
      userId: user.id,
      courseId,
      unitId,
      answers: parsed.data.answers,
    })
    return okResponse(submission)
  } catch (error) {
    return handleRouteError(error)
  }
}
