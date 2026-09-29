import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { AwsCertificationCourse } from "@/components/learning/AwsCertificationCourse"
import { getSanitizedLearningCourse } from "@/lib/learning/api-foundations-course"
import { awsCertificationTracks, getAwsCertificationTrack } from "@/lib/learning/aws-certification-course"

export function generateStaticParams() {
  return awsCertificationTracks.flatMap((track) =>
    track.course.units
      .filter((unit) => unit.certification?.kind === "capability")
      .map((unit) => ({
        trackId: track.slug,
        domainId: unit.certification?.domainId ?? "",
        capabilityId: unit.id,
      })),
  )
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ trackId: string; domainId: string; capabilityId: string }>
}>): Promise<Metadata> {
  const { trackId, domainId, capabilityId } = await params
  const track = getAwsCertificationTrack(trackId)
  const capability = track?.course.units.find(
    (unit) =>
      unit.id === capabilityId &&
      unit.certification?.kind === "capability" &&
      unit.certification.domainId === domainId,
  )
  if (!track || !capability) return {}

  return {
    title: capability.title + " | " + track.examCode + " | API Sandbox",
    description: capability.subtitle,
  }
}

export default async function AwsCertificationCapabilityPage({
  params,
}: Readonly<{
  params: Promise<{ trackId: string; domainId: string; capabilityId: string }>
}>) {
  const { trackId, domainId, capabilityId } = await params
  const track = getAwsCertificationTrack(trackId)
  const domainExists = track?.domains.some((domain) => domain.id === domainId)
  const capability = track?.course.units.find(
    (unit) =>
      unit.id === capabilityId &&
      unit.certification?.kind === "capability" &&
      unit.certification.domainId === domainId,
  )
  if (!track || !domainExists || !capability) notFound()

  const course = getSanitizedLearningCourse(track.course.id)
  if (!course) notFound()

  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName={track.examCode + " certification mastery"}>
      <AwsCertificationCourse track={track} course={course} unitId={capabilityId} />
    </SubscriptionGate>
  )
}
