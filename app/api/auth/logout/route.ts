import { NextRequest } from "next/server"
import { okResponse } from "@/lib/http/responses"
import { clearAuthCookie, readAuthToken } from "@/lib/http/auth-route-helpers"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { revokeUserSession } from "@/lib/services/auth/user-session-service"

export async function POST(request: NextRequest) {
  const token = readAuthToken(request)
  if (token) {
    try {
      const payload = verifyJwtToken(token)
      if (payload.sid) {
        await revokeUserSession(payload.sub, payload.sid)
      }
    } catch {
      // Logout remains idempotent when the token is already expired or invalid.
    }
  }
  return clearAuthCookie(okResponse({ loggedOut: true }))
}
