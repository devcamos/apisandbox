import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { parseJsonBody, withRouteErrorHandling } from "@/lib/http/auth-route-helpers"
import { errorResponse, okResponse } from "@/lib/http/responses"
import {
  getLearningProgressForUser,
  importLearningProgressForUser,
  upsertLearningCheckpointProgress,
} from "@/lib/services/learning-progress-service"

const checkpointProgressSchema = z.object({
  courseId: z.string().min(1),
  moduleId: z.string().min(1),
  checkpointId: z.string().min(1),
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

const checkpointStateSchema = checkpointProgressSchema.omit({
  courseId: true,
  moduleId: true,
  checkpointId: true,
})

const importProgressSchema = z.object({
  courseId: z.string().min(1),
  progress: z.record(z.string(), z.record(z.string(), checkpointStateSchema)),
})

export const GET = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const courseId = request.nextUrl.searchParams.get("courseId")
  if (!courseId) {
    return errorResponse(400, "validation_error", "courseId is required")
  }

  const progress = await getLearningProgressForUser(user.id, courseId)
  return okResponse(progress)
})

export const PATCH = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const parsed = await parseJsonBody(request, checkpointProgressSchema, "Invalid learning progress payload")
  if (!parsed.ok) return parsed.response

  const checkpoint = await upsertLearningCheckpointProgress({
    userId: user.id,
    ...parsed.data,
  })
  const progress = await getLearningProgressForUser(user.id, parsed.data.courseId)
  return okResponse({ checkpoint, progress })
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const parsed = await parseJsonBody(request, importProgressSchema, "Invalid learning progress import payload")
  if (!parsed.ok) return parsed.response

  const progress = await importLearningProgressForUser(
    user.id,
    parsed.data.courseId,
    parsed.data.progress,
  )
  return okResponse(progress)
})
