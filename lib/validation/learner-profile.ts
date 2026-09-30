import { z } from "zod"
import {
  CLOUD_PROVIDER_OPTIONS,
  ENGINEERING_ROLE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  FRAMEWORK_IDS,
  LANGUAGE_OPTIONS,
  LEARNING_GOAL_OPTIONS,
  RUNTIME_ENVIRONMENT_OPTIONS,
} from "@/lib/learning/learner-profile"

const nullableOption = (values: readonly string[]) =>
  z.string().refine((value) => values.includes(value), "Unsupported option").nullable().optional()

export const learnerProfileUpdateSchema = z.object({
  engineeringRole: nullableOption(ENGINEERING_ROLE_OPTIONS.map((option) => option.id)),
  experienceLevel: nullableOption(EXPERIENCE_LEVEL_OPTIONS.map((option) => option.id)),
  primaryLanguage: nullableOption(LANGUAGE_OPTIONS.map((option) => option.id)),
  primaryFramework: nullableOption(FRAMEWORK_IDS),
  runtimeEnvironment: nullableOption(RUNTIME_ENVIRONMENT_OPTIONS.map((option) => option.id)),
  cloudProvider: nullableOption(CLOUD_PROVIDER_OPTIONS.map((option) => option.id)),
  learningGoal: nullableOption(LEARNING_GOAL_OPTIONS.map((option) => option.id)),
})

export type LearnerProfileUpdate = z.infer<typeof learnerProfileUpdateSchema>
