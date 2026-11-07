import { NextRequest } from "next/server"
import { requireAuthenticatedSession } from "@/lib/auth/jwt-auth-middleware"
import { clearAuthCookie } from "@/lib/http/auth-route-helpers"
import { handleRouteError, okResponse } from "@/lib/http/responses"
import { revokeUserSession } from "@/lib/services/auth/user-session-service"

interface RouteContext {
  params: Promise<{ sessionId: string }>
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { user, sessionId: currentSessionId } = await requireAuthenticatedSession(request)
    const { sessionId } = await context.params
    const revoked = await revokeUserSession(user.id, sessionId)

    if (!revoked) {
      return okResponse({ revoked: false })
    }

    const response = okResponse({
      revoked: true,
      current: sessionId === currentSessionId,
    })
    return sessionId === currentSessionId ? clearAuthCookie(response) : response
  } catch (error) {
    return handleRouteError(error)
  }
}
