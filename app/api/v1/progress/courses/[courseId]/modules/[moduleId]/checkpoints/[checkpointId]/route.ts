import { withV1Auth, v1Json, parseV1JsonBody } from "@/lib/api/v1/handler"
import { v1CheckpointPutBodySchema } from "@/lib/api/v1/schemas"
import {
  getLearningProgressForUser,
  toV1CourseProgressResponse,
  upsertLearningCheckpointProgress,
} from "@/lib/services/learning-progress-service"

export const PUT = withV1Auth(
  { scope: "progress:write" },
  async ({ request, auth, requestId, params }) => {
    const courseId = params.courseId
    const moduleId = params.moduleId
    const checkpointId = params.checkpointId

    const parsed = await parseV1JsonBody(request, v1CheckpointPutBodySchema, requestId)
    if (!parsed.ok) return parsed.response

    const checkpoint = await upsertLearningCheckpointProgress({
      userId: auth.userId,
      courseId,
      moduleId,
      checkpointId,
      ...parsed.data,
    })

    const progress = await getLearningProgressForUser(auth.userId, courseId)

    return v1Json(
      {
        checkpoint: {
          courseId: checkpoint.courseId,
          moduleId: checkpoint.moduleId,
          checkpointId: checkpoint.checkpointId,
          status: checkpoint.status,
          done: checkpoint.status === "completed",
          updatedAt: checkpoint.updatedAt?.toISOString() ?? null,
        },
        progress: toV1CourseProgressResponse(progress),
      },
      requestId,
    )
  },
)
