import { z } from "zod"
import { API_TOKEN_SCOPES } from "@/lib/api-tokens/token-types"

export const apiTokenScopeSchema = z.enum(API_TOKEN_SCOPES)

export const v1MeResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  subscriptionTier: z.enum(["FREE", "PREMIUM"]),
  token: z.object({
    id: z.string(),
    scopes: z.array(apiTokenScopeSchema),
    expiresAt: z.string().datetime().nullable(),
  }),
})

export const v1CourseProgressSummarySchema = z.object({
  courseId: z.string(),
  status: z.string(),
  completed: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export const v1CourseListResponseSchema = z.object({
  data: z.array(v1CourseProgressSummarySchema),
})

export const v1CheckpointStateSchema = z.object({
  done: z.boolean(),
  answer: z.string().default(""),
  evidence: z.string().default(""),
  serviceName: z.string().default(""),
  endpointName: z.string().default(""),
  criticalPathStep: z.string().default(""),
  auditEvidence: z.string().default(""),
  retrievalStep: z.number().int().min(0).default(0),
  retrievalDueAt: z.string().default(""),
})

export const v1CheckpointPutBodySchema = v1CheckpointStateSchema

export const v1CourseProgressResponseSchema = z.object({
  courseId: z.string(),
  enrollment: z
    .object({
      status: z.string(),
      startedAt: z.string().datetime().nullable(),
      completedAt: z.string().datetime().nullable(),
      lastActivityAt: z.string().datetime().nullable(),
    })
    .nullable(),
  progress: z.record(z.string(), z.record(z.string(), v1CheckpointStateSchema)),
  summary: z.object({
    total: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    percent: z.number().nonnegative(),
  }),
  lastActivityAt: z.string().datetime().nullable(),
})

export const v1CheckpointPutResponseSchema = z.object({
  checkpoint: z.object({
    courseId: z.string(),
    moduleId: z.string(),
    checkpointId: z.string(),
    status: z.string(),
    done: z.boolean(),
    updatedAt: z.string().datetime().nullable(),
  }),
  progress: v1CourseProgressResponseSchema,
})

export const v1ProblemSchema = z.object({
  type: z.string().url(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
  instance: z.string(),
  code: z.string(),
  requestId: z.string(),
  errors: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
})

export type V1MeResponse = z.infer<typeof v1MeResponseSchema>
export type V1CourseListResponse = z.infer<typeof v1CourseListResponseSchema>
export type V1CourseProgressResponse = z.infer<typeof v1CourseProgressResponseSchema>
export type V1CheckpointPutBody = z.infer<typeof v1CheckpointPutBodySchema>
