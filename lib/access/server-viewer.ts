import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { findActiveUserSession } from "@/lib/services/auth/user-session-service"
import { isDemoUserEmail } from "@/lib/demo-login"
import type { PageViewer } from "@/lib/access/page-access"

const SESSION_COOKIES = [
  "auth_token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const

/** Signed-in user for a server component, or null for invalid tokens/sessions. */
export async function getServerViewer(): Promise<PageViewer | null> {
  const jar = await cookies()
  const token = SESSION_COOKIES.map((name) => jar.get(name)?.value).find(Boolean)
  if (!token) return null

  let userId: string
  let sessionId: string | undefined
  try {
    const payload = verifyJwtToken(token)
    userId = payload.sub
    sessionId = payload.sid
  } catch {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isActive: true,
      subscriptionTier: true,
      subscriptionExpiresAt: true,
    },
  })
  if (!user?.isActive) return null
  if (sessionId && !(await findActiveUserSession(user.id, sessionId))) return null

  return {
    id: user.id,
    email: user.email,
    isDemo: isDemoUserEmail(user.email),
    subscriptionTier: user.subscriptionTier,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
  }
}
