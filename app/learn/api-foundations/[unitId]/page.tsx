import { notFound } from "next/navigation"
import { FirstPrinciplesCourse } from "@/components/learning/FirstPrinciplesCourse"
import { API_FOUNDATIONS_COURSE_ID, getSanitizedLearningCourse } from "@/lib/learning/api-foundations-course"

export function generateStaticParams() {
  const course = getSanitizedLearningCourse(API_FOUNDATIONS_COURSE_ID)
  return course?.units.map((unit) => ({ unitId: unit.id })) ?? []
}

export default async function ApiFoundationsUnitPage({
  params,
}: Readonly<{ params: Promise<{ unitId: string }> }>) {
  const { unitId } = await params
  const course = getSanitizedLearningCourse(API_FOUNDATIONS_COURSE_ID)
  if (!course || !course.units.some((unit) => unit.id === unitId)) notFound()
  return <FirstPrinciplesCourse course={course} unitId={unitId} />
}
