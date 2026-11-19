import { describe, expect, it } from "vitest"
import { aifC01CapabilityUnits } from "@/lib/learning/aws-ai-practitioner-mastery"
import { formatCapabilityEvidence } from "@/lib/learning/capability-evidence"
import { capabilityLabs } from "@/lib/learning/capability-labs"
import { domainRubrics, questionReviewLink } from "@/lib/learning/capability-review"
import { updateReviewSchedule } from "@/lib/learning/checkpoint-review"
import { getLearningCourse } from "@/lib/learning/api-foundations-course"
import { AWS_AI_PRACTITIONER_COURSE_ID } from "@/lib/learning/course-ids"

describe("capability learning evidence", () => {
  it("covers every capability with runnable fixtures and paired recall answers", () => {
    expect(Object.keys(capabilityLabs).sort()).toEqual(aifC01CapabilityUnits.map(({ id }) => id).sort())
    for (const unit of aifC01CapabilityUnits) {
      const journey = unit.certification?.masteryJourney
      expect(journey?.recallAnswers).toHaveLength(journey?.recallPrompts.length ?? 0)
      expect(journey?.recallAnswers.every(Boolean)).toBe(true)
      expect(capabilityLabs[unit.id].checks.length).toBeGreaterThanOrEqual(2)
    }
  })

  it("covers all domain questions and criteria with links to real capabilities", () => {
    const domains = getLearningCourse(AWS_AI_PRACTITIONER_COURSE_ID)?.units.filter(({ certification }) => certification?.kind === "domain-exam") ?? []
    expect(Object.keys(domainRubrics).sort()).toEqual(domains.map(({ id }) => id).sort())
    for (const unit of domains) {
      const links = [
        ...domainRubrics[unit.id].links,
        ...unit.assessment.questions.flatMap(({ id, options }) => options.map((option) => questionReviewLink("domain-exam", id, option))),
      ]
      for (const link of links) {
        const parts = link?.match(/\/domains\/([^/]+)\/capabilities\/([^#]+)#(.+)$/)
        expect(parts).toBeTruthy()
        const capability = aifC01CapabilityUnits.find(({ id }) => id === parts?.[2])
        expect(capability?.certification?.domainId).toBe(parts?.[1])
        const row = parts?.[3].match(/^stage-aws-map-row-(\d+)$/)
        if (row) expect(capability?.certification?.masteryJourney?.platformMap.items[Number(row[1]) - 1]).toBeDefined()
      }
    }
  })

  it("schedules a miss and spaces successful recalls after the due date", () => {
    const questionId = "aif-security-mtls"
    const day = 86_400_000
    const details = [{ questionId, correct: false, reviewLabel: "mTLS" }]
    const answers = { [questionId]: "Business authorization" }
    const missed = updateReviewSchedule({}, "capability", details, answers, 0)
    expect(missed[questionId]).toMatchObject({ dueAt: day, href: "#stage-aws-map-row-3" })
    const correct = [{ ...details[0], correct: true }]
    expect(updateReviewSchedule(missed, "capability", correct, answers, 1)).toEqual(missed)
    expect(updateReviewSchedule(missed, "capability", correct, answers, day)[questionId]).toMatchObject({ dueAt: 3 * day, interval: 2 })
  })

  it("exports current evidence and safely fences draft text", () => {
    const markdown = formatCapabilityEvidence({
      title: "Training vs inference",
      prediction: "Use the frozen model",
      takeaway: "Keep versioned weights",
      runs: { build: { output: "router-7" }, fault: { output: "Mutated weights" }, recovery: { output: "PASS", passed: true } },
      explanation: "Parameters are fixed.\n```",
      review: { draft: "Old draft", feedback: [{ criterion: "Parameter boundary", status: "covered", feedback: "Stale" }] },
      checkpoint: { correctAnswers: 2, totalQuestions: 2, mastered: true },
    })
    expect(markdown).toContain("Use the frozen model")
    expect(markdown).toContain("Keep versioned weights")
    expect(markdown).toContain("router-7")
    expect(markdown).toContain("Mutated weights")
    expect(markdown).toContain("Passed\n\n```\nPASS")
    expect(markdown).toContain("````\nParameters are fixed.\n```\n````")
    expect(markdown).not.toContain("Stale")
    expect(markdown).toContain("2/2 correct (100%) · Passed")
  })
})
