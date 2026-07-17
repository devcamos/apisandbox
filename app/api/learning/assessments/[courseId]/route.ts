import { NextRequest } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError, okResponse } from "@/lib/http/responses"
import { getCourseAssessmentSummaryForUser } from "@/lib/services/learning-assessment-service"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { courseId } = await context.params
    const summary = await getCourseAssessmentSummaryForUser(user.id, courseId)
    return okResponse(summary)
  } catch (error) {
    return handleRouteError(error)
  }
}
