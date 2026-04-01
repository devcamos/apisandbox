import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { getProfileByUserId, updateProfileByUserId } from "@/lib/services/profile/profile-service"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"

const schema = z.object({
  firstName: z.string().trim().max(100).nullable().optional(),
  lastName: z.string().trim().max(100).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  roleLabel: z.string().trim().max(100).nullable().optional(),
  identityStatement: z.string().trim().max(500).nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const profile = await getProfileByUserId(user.id)
    return okResponse({ profile })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(400, "validation_error", "Invalid profile payload", parsed.error.issues)
    }

    const profile = await updateProfileByUserId(user.id, parsed.data)
    return okResponse({ profile })
  } catch (error) {
    return handleRouteError(error)
  }
}

