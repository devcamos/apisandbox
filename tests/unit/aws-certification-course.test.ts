import { describe, expect, test } from "vitest"
import {
  getLearningCourse,
  getSanitizedLearningCourse,
  gradeLearningUnitAssessment,
} from "@/lib/learning/api-foundations-course"
import {
  awsCertificationTracks,
  getAwsCertificationTrack,
  getAwsCertificationTrackForCourse,
} from "@/lib/learning/aws-certification-course"

describe("AWS certification curriculum", () => {
  test("defines the Practitioner, Associate, and Professional ladder", () => {
    expect(awsCertificationTracks.map((track) => [track.slug, track.examCode])).toEqual([
      ["practitioner", "CLF-C02"],
      ["associate", "SAA-C03"],
      ["professional", "SAP-C02"],
    ])
    expect(awsCertificationTracks.every((track) => track.course.units.length === 5)).toBe(true)
    expect(awsCertificationTracks.flatMap((track) => track.course.units)).toHaveLength(15)
    expect(
      awsCertificationTracks.flatMap((track) => track.course.units).flatMap((unit) => unit.assessment.questions),
    ).toHaveLength(45)
    expect(getAwsCertificationTrack("associate")?.examCode).toBe("SAA-C03")
    expect(getAwsCertificationTrack("unknown")).toBeNull()
  })

  test("matches the official domain weight totals", () => {
    for (const track of awsCertificationTracks) {
      expect(track.domains.reduce((total, domain) => total + domain.weight, 0)).toBe(100)
      expect(track.domains).toHaveLength(4)
    }
  })

  test("registers every certification course with the shared assessment engine", () => {
    for (const track of awsCertificationTracks) {
      expect(getLearningCourse(track.course.id)?.title).toBe(track.course.title)
      expect(getAwsCertificationTrackForCourse(track.course.id)?.slug).toBe(track.slug)
      expect(track.readinessRequirements.length).toBeGreaterThanOrEqual(8)
    }
  })

  test("keeps answers server-side and grades every module", () => {
    for (const track of awsCertificationTracks) {
      const sanitized = getSanitizedLearningCourse(track.course.id)
      expect(sanitized?.units).toHaveLength(5)

      for (const unit of track.course.units) {
        const questionIds = unit.assessment.questions.map((question) => question.id)
        expect(new Set(questionIds).size).toBe(questionIds.length)

        const browserUnit = sanitized?.units.find((item) => item.id === unit.id)
        expect(browserUnit).toBeDefined()
        for (const question of browserUnit?.assessment.questions ?? []) {
          expect(question).not.toHaveProperty("correctAnswer")
          expect(question.options.length).toBeGreaterThanOrEqual(4)
        }

        const answers = Object.fromEntries(
          unit.assessment.questions.map((question) => [question.id, question.correctAnswer]),
        )
        expect(gradeLearningUnitAssessment(track.course.id, unit.id, answers)).toMatchObject({
          correctAnswers: unit.assessment.questions.length,
          mastered: true,
        })
      }
    }
  })
})
