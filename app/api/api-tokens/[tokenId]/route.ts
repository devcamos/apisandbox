import { NextRequest } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { handleRouteError, okResponse } from "@/lib/http/responses"
import { revokeApiTokenForUser } from "@/lib/services/api-token-service"

interface RouteParams {
  params: Promise<{
    tokenId: string
  }>
}

function getRequestContext(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { tokenId } = await context.params
    const token = await revokeApiTokenForUser({
      userId: user.id,
      tokenId,
      ...getRequestContext(request),
    })
    return okResponse({ token })
  } catch (error) {
    return handleRouteError(error)
  }
}
