import { NextRequest } from "next/server"
import { getAuthenticatedUserFromToken } from "@/lib/services/auth/auth-service"
import { issueAuthTokenForUser } from "@/lib/services/auth/auth-response-mapper"
import { errorResponse, okResponse } from "@/lib/http/responses"
import {
  authSessionResponse,
  readAuthToken,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"

export const GET = withRouteErrorHandling(async (request: NextRequest) => {
  const token = readAuthToken(request)
  if (!token) {
    return errorResponse(401, "auth_failure", "Unauthorized")
  }

  const user = await getAuthenticatedUserFromToken(token)
  const { token: refreshedToken, expiresIn } = issueAuthTokenForUser(user)
  return authSessionResponse(
    {
      user,
      token: refreshedToken,
      expiresIn,
    },
    200,
  )
})
