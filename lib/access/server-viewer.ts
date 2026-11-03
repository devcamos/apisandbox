import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { isDemoUserEmail } from "@/lib/demo-login"
import type { PageViewer } from "@/lib/access/page-access"

const SESSION_COOKIES = [
  "auth_token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const

/** Signed-in user for a server component, or null (invalid/expired token = anonymous). */
export async function getServerViewer(): Promise<PageViewer | null> {
  const jar = await cookies()
  const token = SESSION_COOKIES.map((name) => jar.get(name)?.value).find(Boolean)
  if (!token) return null

  let userId: string
  try {
    userId = verifyJwtToken(token).sub
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

  return {
    id: user.id,
    email: user.email,
    isDemo: isDemoUserEmail(user.email),
    subscriptionTier: user.subscriptionTier,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
  }
}
