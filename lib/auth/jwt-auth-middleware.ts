import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { AppError } from "@/lib/http/errors"

function readTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  const cookieToken = request.cookies.get("auth_token")?.value
  return cookieToken || null
}

export async function requireAuthenticatedUser(request: NextRequest) {
  const token = readTokenFromRequest(request)
  if (!token) {
    throw new AppError("Missing auth token", 401, "auth_failure")
  }

  const payload = verifyJwtToken(token)
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, isActive: true },
  })

  if (!user || !user.isActive) {
    throw new AppError("User is not active", 401, "auth_failure")
  }

  return user
}

