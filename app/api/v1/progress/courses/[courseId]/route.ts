import { AppError } from "@/lib/http/errors"
import { withV1Auth, v1Json } from "@/lib/api/v1/handler"
import {
  getLearningProgressForUser,
  toV1CourseProgressResponse,
} from "@/lib/services/learning-progress-service"
import { getCoursePlan } from "@/lib/learning/progress-mapping"

export const GET = withV1Auth(
  { scope: "progress:read" },
  async ({ auth, requestId, params }) => {
    const courseId = params.courseId
    if (!courseId) {
      throw new AppError("courseId is required", 400, "validation_error")
    }
    if (!getCoursePlan(courseId)) {
      throw new AppError("Learning course not found", 404, "not_found")
    }

    const progress = await getLearningProgressForUser(auth.userId, courseId)
    return v1Json(toV1CourseProgressResponse(progress), requestId)
  },
)
