import { describe, expect, test } from "vitest"
import {
  getFrameworkOptions,
  getLearnerProfileLabels,
  getPersonalizedLearningPath,
  getStackBlueprint,
  isFrameworkCompatible,
  isLearnerProfileComplete,
  type LearnerProfileSelection,
} from "@/lib/learning/learner-profile"

const completeProfile: LearnerProfileSelection = {
  engineeringRole: "backend-engineer",
  experienceLevel: "senior",
  primaryLanguage: "java",
  primaryFramework: "spring-boot",
  runtimeEnvironment: "kubernetes",
  cloudProvider: "aws",
  learningGoal: "career-progression",
}

describe("learner profile", () => {
  test("only returns frameworks compatible with the selected language", () => {
    expect(getFrameworkOptions("java").map((option) => option.id)).toEqual(["spring-boot", "quarkus"])
    expect(getFrameworkOptions("unknown")).toEqual([])
    expect(isFrameworkCompatible("java", "spring-boot")).toBe(true)
    expect(isFrameworkCompatible("java", "nextjs")).toBe(false)
    expect(isFrameworkCompatible(null, "spring-boot")).toBe(false)
  })

  test("requires role, level, language, compatible framework, and goal", () => {
    expect(isLearnerProfileComplete(completeProfile)).toBe(true)
    expect(isLearnerProfileComplete({ ...completeProfile, learningGoal: null })).toBe(false)
    expect(isLearnerProfileComplete({ ...completeProfile, primaryFramework: "nextjs" })).toBe(false)
  })

  test("turns stored identifiers into human-readable profile labels", () => {
    expect(getLearnerProfileLabels(completeProfile)).toEqual({
      role: "Backend engineer",
      experience: "Senior engineer",
      language: "Java",
      framework: "Spring Boot",
      runtime: "Kubernetes",
      cloud: "AWS",
      goal: "Progress toward principal",
    })

    expect(getLearnerProfileLabels({
      engineeringRole: null,
      experienceLevel: null,
      primaryLanguage: null,
      primaryFramework: null,
      runtimeEnvironment: null,
      cloudProvider: null,
      learningGoal: null,
    }).framework).toBe("Framework-neutral")
  })

  test("builds a senior path from universal foundations to distributed systems", () => {
    const path = getPersonalizedLearningPath(completeProfile)
    expect(path.map((step) => step.href)).toEqual([
      "/learn/api-foundations",
      "/learn/stack",
      "/phase-3",
    ])
    expect(path[1]?.title).toBe("Spring Boot with Java")
    expect(path[0]?.description).toMatch(/Validate the universal model/i)
  })

  test("adjusts enterprise growth for beginner and principal profiles", () => {
    expect(getPersonalizedLearningPath({ ...completeProfile, experienceLevel: "beginner" })[2]).toMatchObject({
      href: "/phase-2",
      title: "Production integrations",
    })
    expect(getPersonalizedLearningPath({ ...completeProfile, experienceLevel: "principal" })[2]).toMatchObject({
      href: "/phase-4",
      title: "Principal architecture judgement",
    })
  })

  test("provides framework-specific and language-neutral blueprints", () => {
    const spring = getStackBlueprint("spring-boot")
    expect(spring).toHaveLength(6)
    expect(spring.some((item) => item.implementation.includes("Resilience4j"))).toBe(true)

    const fallback = getStackBlueprint("future-framework")
    expect(fallback).toHaveLength(6)
    expect(fallback[0]?.implementation).toMatch(/Program, process/i)
  })
})
