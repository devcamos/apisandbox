import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { AwsCertificationCourse } from "@/components/learning/AwsCertificationCourse"
import { getSanitizedLearningCourse } from "@/lib/learning/api-foundations-course"
import { awsCertificationTracks, getAwsCertificationTrack } from "@/lib/learning/aws-certification-course"

export function generateStaticParams() {
  return awsCertificationTracks.flatMap((track) =>
    track.course.units.map((unit) => ({ trackId: track.slug, unitId: unit.id })),
  )
}
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ trackId: string; unitId: string }> }>): Promise<Metadata> {
  const { trackId, unitId } = await params
  const track = getAwsCertificationTrack(trackId)
  const unit = track?.course.units.find((item) => item.id === unitId)
  if (!track || !unit) return {}
  return {
    title: `${unit.title} | ${track.examCode} | API Sandbox`,
    description: unit.subtitle,
  }
}

export default async function AwsCertificationUnitPage({
  params,
}: Readonly<{ params: Promise<{ trackId: string; unitId: string }> }>) {
  const { trackId, unitId } = await params
  const track = getAwsCertificationTrack(trackId)
  if (!track || !track.course.units.some((unit) => unit.id === unitId)) notFound()
  const course = getSanitizedLearningCourse(track.course.id)
  if (!course) notFound()

  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName={`${track.examCode} certification course`}>
      <AwsCertificationCourse track={track} course={course} unitId={unitId} />
    </SubscriptionGate>
  )
}
