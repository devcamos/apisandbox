import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const DEFAULT_SESSION_SECONDS = 30 * 24 * 60 * 60
const TOUCH_INTERVAL_MS = 5 * 60 * 1000

export type UserSessionContext = {
  userAgent: string | null
  ipAddress: string | null
}

function sessionLifetimeSeconds() {
  const configured = Number(process.env.AUTH_SESSION_MAX_AGE_SECONDS)
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_SESSION_SECONDS
}

function firstForwardedValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || null
}

export function getUserSessionContext(request: NextRequest): UserSessionContext {
  const forwardedFor = firstForwardedValue(request.headers.get("x-forwarded-for"))
  const forwardedIp = request.headers.get("x-real-ip")?.trim() || null
  const ipAddress = (forwardedFor ?? forwardedIp)?.slice(0, 64) || null
  const userAgent = request.headers.get("user-agent")?.slice(0, 512) || null

  return { userAgent, ipAddress }
}

function deviceNameFromUserAgent(userAgent: string | null) {
  if (!userAgent) return "Unknown device"
  if (/iphone|ipad|ipod/i.test(userAgent)) return "Apple mobile device"
  if (/android/i.test(userAgent)) return "Android device"
  if (/macintosh|mac os/i.test(userAgent)) return "Mac"
  if (/windows/i.test(userAgent)) return "Windows PC"
  if (/linux/i.test(userAgent)) return "Linux device"
  return "Web browser"
}

export async function createUserSession(userId: string, context: UserSessionContext) {
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds() * 1000)
  const session = await prisma.userSession.create({
    data: {
      userId,
      deviceName: deviceNameFromUserAgent(context.userAgent),
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
      expiresAt,
    },
    select: { id: true, expiresAt: true },
  })

  return {
    id: session.id,
    expiresIn: Math.max(1, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)),
  }
}

export async function findActiveUserSession(userId: string, sessionId: string) {
  const session = await prisma.userSession.findFirst({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true, expiresAt: true, lastUsedAt: true },
  })

  if (!session) return null

  if (Date.now() - session.lastUsedAt.getTime() >= TOUCH_INTERVAL_MS) {
    await prisma.userSession.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { lastUsedAt: new Date() },
    })
  }

  return session
}

export async function listUserSessions(userId: string) {
  return prisma.userSession.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: [{ lastUsedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      deviceName: true,
      userAgent: true,
      ipAddress: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  })
}

export async function revokeUserSession(userId: string, sessionId: string) {
  const result = await prisma.userSession.updateMany({
    where: { id: sessionId, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
  return result.count > 0
}

export async function revokeAllUserSessions(userId: string, exceptSessionId?: string) {
  const result = await prisma.userSession.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
    },
    data: { revokedAt: new Date() },
  })
  return result.count
}
