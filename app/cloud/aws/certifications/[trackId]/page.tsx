import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { AwsCertificationCourse } from "@/components/learning/AwsCertificationCourse"
import { getSanitizedLearningCourse } from "@/lib/learning/api-foundations-course"
import { awsCertificationTracks, getAwsCertificationTrack } from "@/lib/learning/aws-certification-course"

export function generateStaticParams() {
  return awsCertificationTracks.map((track) => ({ trackId: track.slug }))
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ trackId: string }> }>): Promise<Metadata> {
  const { trackId } = await params
  const track = getAwsCertificationTrack(trackId)
  if (!track) return {}
  return {
    title: `${track.examCode} ${track.shortTitle} | API Sandbox`,
    description: track.course.description,
  }
}

export default async function AwsCertificationTrackPage({
  params,
}: Readonly<{ params: Promise<{ trackId: string }> }>) {
  const { trackId } = await params
  const track = getAwsCertificationTrack(trackId)
  if (!track) notFound()
  const course = getSanitizedLearningCourse(track.course.id)
  if (!course) notFound()

  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName={`${track.examCode} certification course`}>
      <AwsCertificationCourse track={track} course={course} />
    </SubscriptionGate>
  )
}
