import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { parseJsonBody, withRouteErrorHandling } from "@/lib/http/auth-route-helpers"
import { okResponse } from "@/lib/http/responses"
import { createApiToken, listApiTokensForUser } from "@/lib/services/api-token-service"

const createTokenSchema = z.object({
  name: z.string().trim().min(1).max(80),
  scopes: z.array(z.string()).min(1),
  expiresAt: z.string().datetime().nullable().optional(),
})

function getRequestContext(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
  }
}

export const GET = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const tokens = await listApiTokensForUser(user.id)
  return okResponse({ tokens })
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const parsed = await parseJsonBody(request, createTokenSchema, "Invalid API token payload")
  if (!parsed.ok) return parsed.response

  const apiToken = await createApiToken({
    userId: user.id,
    ...parsed.data,
    ...getRequestContext(request),
  })

  return okResponse(apiToken, 201)
})
