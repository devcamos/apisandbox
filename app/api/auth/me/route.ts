import { NextRequest } from "next/server"
import { getAuthenticatedUserFromToken } from "@/lib/services/auth/auth-service"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"

function tokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  return request.cookies.get("auth_token")?.value ?? null
}

export async function GET(request: NextRequest) {
  try {
    const token = tokenFromRequest(request)
    if (!token) {
      return errorResponse(401, "auth_failure", "Unauthorized")
    }

    const user = await getAuthenticatedUserFromToken(token)
    return okResponse({ user })
  } catch (error) {
    return handleRouteError(error)
  }
}

