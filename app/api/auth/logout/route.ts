import { NextRequest } from "next/server"
import { okResponse } from "@/lib/http/responses"
import { clearAuthCookie, readAuthToken, withRouteErrorHandling } from "@/lib/http/auth-route-helpers"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { revokeUserSession } from "@/lib/services/auth/user-session-service"
import { AppError } from "@/lib/http/errors"
import type { AuthPayload } from "@/lib/auth/types"

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const token = readAuthToken(request)
  if (token) {
    let payload: AuthPayload | undefined
    try {
      payload = verifyJwtToken(token)
    } catch (error) {
      // Logout remains idempotent when the token is already expired or invalid.
      if (!(error instanceof SyntaxError) && !(error instanceof AppError && error.status === 401)) {
        throw error
      }
    }
    if (payload?.sid) {
      await revokeUserSession(payload.sub, payload.sid)
    }
  }
  return clearAuthCookie(okResponse({ loggedOut: true }))
})
