import { NextRequest } from "next/server"
import { requireAuthenticatedSession } from "@/lib/auth/jwt-auth-middleware"
import { withRouteErrorHandling } from "@/lib/http/auth-route-helpers"
import { okResponse } from "@/lib/http/responses"
import {
  listUserSessions,
  revokeAllUserSessions,
} from "@/lib/services/auth/user-session-service"

export const GET = withRouteErrorHandling(async (request: NextRequest) => {
  const { user, sessionId } = await requireAuthenticatedSession(request)
  const sessions = await listUserSessions(user.id)
  return okResponse({
    sessions: sessions.map((session) => ({
      ...session,
      current: session.id === sessionId,
      ipAddress: session.ipAddress ? maskIpAddress(session.ipAddress) : null,
    })),
  })
})

export const DELETE = withRouteErrorHandling(async (request: NextRequest) => {
  const { user, sessionId } = await requireAuthenticatedSession(request)
  const revoked = await revokeAllUserSessions(user.id, sessionId ?? undefined)
  return okResponse({ revoked, currentSessionPreserved: Boolean(sessionId) })
})

function maskIpAddress(value: string) {
  if (value.includes(":")) {
    const parts = value.split(":")
    return parts.length > 2 ? `${parts.slice(0, 2).join(":")}:••••` : "Hidden"
  }
  const parts = value.split(".")
  return parts.length === 4 ? `${parts.slice(0, 2).join(".")}.•••.•••` : "Hidden"
}
