import { describe, expect, test } from "vitest"
import {
  CAPABILITY_MASTERY_STAGES,
  getLearningCourse,
  getSanitizedLearningCourse,
  gradeLearningUnitAssessment,
} from "@/lib/learning/api-foundations-course"
import {
  AIF_C01_DOMAIN_ORDER,
  aifC01CapabilityUnits,
  getAifC01Capability,
} from "@/lib/learning/aws-ai-practitioner-mastery"
import {
  awsCertificationTracks,
  getAwsCertificationTrack,
  getAwsCertificationTrackForCourse,
} from "@/lib/learning/aws-certification-course"

const requiredCapabilityTitles = [
  "AI vs ML vs deep learning",
  "Foundation models",
  "Transformers",
  "Tokens",
  "Embeddings",
  "Vector similarity",
  "Prompt engineering",
  "Retrieval-augmented generation (RAG)",
  "Fine-tuning",
  "Model evaluation",
  "Hallucination",
  "Responsible AI",
  "Guardrails",
  "AI security",
  "AI governance",
]

describe("AWS certification curriculum", () => {
  test("defines the certification ladder without hiding the expanded AI path", () => {
    expect(awsCertificationTracks.map((track) => [track.slug, track.examCode])).toEqual([
      ["practitioner", "CLF-C02"],
      ["ai-practitioner", "AIF-C01"],
      ["associate", "SAA-C03"],
      ["professional", "SAP-C02"],
    ])

    const aiTrack = getAwsCertificationTrack("ai-practitioner")
    expect(aiTrack?.course.units.filter((unit) => unit.certification?.kind === "capability")).toHaveLength(16)
    expect(aiTrack?.course.units.filter((unit) => unit.certification?.kind === "domain-exam")).toHaveLength(5)
    expect(
      awsCertificationTracks
        .filter((track) => track.slug !== "ai-practitioner")
        .every((track) => track.course.units.length === 5),
    ).toBe(true)
    expect(awsCertificationTracks.flatMap((track) => track.course.units).every((unit) => unit.difficulty)).toBe(true)
    expect(new Set(awsCertificationTracks.flatMap((track) => track.course.units).map((unit) => unit.difficulty))).toEqual(
      new Set(["Easy", "Medium", "Hard", "Expert"]),
    )
    expect(awsCertificationTracks.flatMap((track) => track.course.units)).toHaveLength(36)
    expect(
      awsCertificationTracks.flatMap((track) => track.course.units).flatMap((unit) => unit.assessment.questions),
    ).toHaveLength(92)
    expect(getAwsCertificationTrack("associate")?.examCode).toBe("SAA-C03")
    expect(getAwsCertificationTrack("unknown")).toBeNull()
  })

  test("models AIF-C01 as domains containing capability journeys and a domain exam", () => {
    const track = getAwsCertificationTrack("ai-practitioner")
    if (!track) throw new Error("AI Practitioner track is missing")

    expect(AIF_C01_DOMAIN_ORDER).toEqual([
      "ai-ml-fundamentals",
      "genai-fundamentals",
      "foundation-models",
      "responsible-ai",
      "ai-security",
    ])
    expect(track.domains.map((domain) => domain.title)).toEqual([
      "AI and ML fundamentals",
      "Generative AI fundamentals",
      "Applications of foundation models",
      "Responsible AI",
      "Security, compliance and governance",
    ])
    expect(CAPABILITY_MASTERY_STAGES.map((stage) => stage.label)).toEqual([
      "Problem",
      "Predict",
      "Learn",
      "Recall",
      "Reason",
      "Build",
      "Break",
      "Explain",
      "AWS Map",
      "Exam",
    ])
    const capabilityTitles = aifC01CapabilityUnits.map((unit) => unit.title)
    for (const title of requiredCapabilityTitles) expect(capabilityTitles).toContain(title)

    for (const domainId of AIF_C01_DOMAIN_ORDER) {
      const domainUnits = track.course.units.filter((unit) => unit.certification?.domainId === domainId)
      expect(domainUnits.filter((unit) => unit.certification?.kind === "capability").length).toBeGreaterThan(0)
      expect(domainUnits.filter((unit) => unit.certification?.kind === "domain-exam")).toHaveLength(1)
      expect(domainUnits.at(-1)?.certification?.kind).toBe("domain-exam")
    }
  })

  test("gives every AI capability transferable, Java-first mastery evidence", () => {
    expect(new Set(aifC01CapabilityUnits.map((unit) => unit.id)).size).toBe(aifC01CapabilityUnits.length)

    for (const unit of aifC01CapabilityUnits) {
      const metadata = unit.certification
      const journey = metadata?.masteryJourney
      if (!metadata || !journey) throw new Error(unit.id + " is missing certification mastery metadata")

      expect(metadata.kind).toBe("capability")
      expect(AIF_C01_DOMAIN_ORDER).toContain(metadata.domainId)
      expect(metadata.sequence).toEqual(expect.any(Number))
      expect(journey.problem.length).toBeGreaterThan(20)
      expect(unit.principle.length).toBeGreaterThan(20)
      expect(journey.mechanism.length).toBeGreaterThan(20)
      expect(journey.decision.useWhen.length).toBeGreaterThan(0)
      expect(journey.decision.avoidWhen.length).toBeGreaterThan(0)
      expect(journey.decision.alternatives.length).toBeGreaterThan(0)
      expect(journey.tradeOffs.length).toBeGreaterThan(0)
      expect(journey.recallPrompts.length).toBeGreaterThanOrEqual(2)
      expect(journey.reasoning.strongAnswerIncludes.length).toBeGreaterThanOrEqual(3)
      expect(journey.implementation.language).toBe("Java 21")
      expect(journey.implementation.stack.length).toBeGreaterThan(0)
      expect(journey.implementation.code.length).toBeGreaterThan(20)
      expect(journey.implementation.successCriteria.length).toBeGreaterThanOrEqual(2)
      expect(journey.breakExercise.faults.length).toBeGreaterThan(0)
      expect(journey.breakExercise.observe.length).toBeGreaterThan(0)
      expect(journey.explanation.evidenceCriteria.length).toBeGreaterThanOrEqual(3)
      expect(journey.platformMap.label).toBe("AWS Map")
      expect(journey.platformMap.items.length).toBeGreaterThan(0)
      expect(unit.assessment.questions).toHaveLength(2)
    }
  })

  test("does not expose prediction roles through browser choice identifiers", () => {
    const aiTrack = getAwsCertificationTrack("ai-practitioner")
    const browserCourse = aiTrack ? getSanitizedLearningCourse(aiTrack.course.id) : null
    if (!browserCourse) throw new Error("AI Practitioner browser course is missing")
    const browserCapabilities = browserCourse.units.filter((unit) => unit.certification?.kind === "capability")
    const allChoiceIds = browserCapabilities.flatMap((unit) => unit.scenario.options.map((option) => option.id))

    expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length)
    for (const unit of browserCapabilities) {
      expect(unit.scenario.options).toHaveLength(2)
      for (const option of unit.scenario.options) {
        expect(option.id).toMatch(/^choice-[0-9a-z]{7}$/)
        expect(option.id).not.toMatch(/preferred|alternative|correct|incorrect|answer/i)
      }
    }
  })

  test("places TLS and mTLS at transport while retaining separate authorization", () => {
    const security = getAifC01Capability("ai-security")
    const journey = security?.certification?.masteryJourney
    if (!security || !journey) throw new Error("AI security capability is missing")

    expect(journey.mechanism).toContain("TLS encrypts transport")
    expect(journey.mechanism).toContain("mTLS adds client-certificate authentication")
    expect(journey.decision.useWhen.join(" ")).toContain("mTLS")
    expect(journey.decision.avoidWhen.join(" ")).toContain("authorization")
    expect(journey.implementation.title).toContain("mTLS")
    expect(journey.platformMap.examLens).toContain("transport")
    expect(journey.platformMap.examLens).toContain("IAM is authorization")
  })

  test("matches the official domain weight totals", () => {
    for (const track of awsCertificationTracks) {
      expect(track.domains.reduce((total, domain) => total + domain.weight, 0)).toBe(100)
      expect(track.domains.length).toBeGreaterThanOrEqual(4)
    }
  })

  test("registers every certification course with the shared assessment engine", () => {
    for (const track of awsCertificationTracks) {
      expect(getLearningCourse(track.course.id)?.title).toBe(track.course.title)
      expect(getAwsCertificationTrackForCourse(track.course.id)?.slug).toBe(track.slug)
      expect(track.readinessRequirements.length).toBeGreaterThanOrEqual(8)
    }
  })

  test("keeps answers server-side, preserves safe journeys, and grades every checkpoint", () => {
    for (const track of awsCertificationTracks) {
      expect(new Set(track.course.units.map((unit) => unit.id)).size).toBe(track.course.units.length)
      const sanitized = getSanitizedLearningCourse(track.course.id)
      expect(sanitized?.units).toHaveLength(track.course.units.length)

      for (const unit of track.course.units) {
        const questionIds = unit.assessment.questions.map((question) => question.id)
        expect(new Set(questionIds).size).toBe(questionIds.length)

        const browserUnit = sanitized?.units.find((item) => item.id === unit.id)
        expect(browserUnit).toBeDefined()
        if (unit.certification?.kind === "capability") {
          expect(browserUnit?.certification?.masteryJourney?.implementation.language).toBe("Java 21")
        }
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
