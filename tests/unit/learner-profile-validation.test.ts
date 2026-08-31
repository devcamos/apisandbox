import { describe, expect, test } from "vitest"
import { learnerProfileUpdateSchema } from "@/lib/validation/learner-profile"

describe("learner profile validation", () => {
  test("accepts a supported enterprise stack profile", () => {
    expect(learnerProfileUpdateSchema.safeParse({
      engineeringRole: "platform-engineer",
      experienceLevel: "principal",
      primaryLanguage: "csharp",
      primaryFramework: "aspnet-core",
      runtimeEnvironment: "kubernetes",
      cloudProvider: "azure",
      learningGoal: "team-standards",
    }).success).toBe(true)
  })

  test("allows partial and nullable profile updates", () => {
    expect(learnerProfileUpdateSchema.safeParse({ primaryLanguage: null }).success).toBe(true)
    expect(learnerProfileUpdateSchema.safeParse({}).success).toBe(true)
  })

  test("rejects identifiers outside the supported catalogue", () => {
    const result = learnerProfileUpdateSchema.safeParse({ primaryLanguage: "cobol" })
    expect(result.success).toBe(false)
  })
})
