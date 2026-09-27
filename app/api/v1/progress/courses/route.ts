import { withV1Auth, v1Json } from "@/lib/api/v1/handler"
import { listLearningCourseProgressForUser } from "@/lib/services/learning-progress-service"

export const GET = withV1Auth({ scope: "progress:read" }, async ({ auth, requestId }) => {
  const data = await listLearningCourseProgressForUser(auth.userId)
  return v1Json({ data }, requestId)
})
