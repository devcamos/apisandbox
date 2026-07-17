import { FirstPrinciplesCourse } from "@/components/learning/FirstPrinciplesCourse"
import { API_FOUNDATIONS_COURSE_ID, getSanitizedLearningCourse } from "@/lib/learning/api-foundations-course"

export default function ApiFoundationsPage() {
  const course = getSanitizedLearningCourse(API_FOUNDATIONS_COURSE_ID)
  if (!course) return null
  return <FirstPrinciplesCourse course={course} />
}
