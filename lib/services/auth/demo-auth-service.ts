import { randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"
import {
  buildEphemeralDemoEmail,
  DEMO_EMAIL_HOST,
  getDemoUserTtlHours,
} from "@/lib/demo-login"
import { mapUserToAuthResponse } from "@/lib/services/auth/auth-response-mapper"
import { createUserWithInitialData } from "@/lib/services/auth/user-bootstrap-service"
import { logger } from "@/lib/logger"

/**
 * Delete ephemeral demo users past their TTL.
 * Cascades remove profile, phase progress, tokens, etc.
 */
export async function cleanupExpiredDemoUsers(now = new Date()): Promise<number> {
  const ttlMs = getDemoUserTtlHours() * 60 * 60 * 1000
  const cutoff = new Date(now.getTime() - ttlMs)

  const result = await prisma.user.deleteMany({
    where: {
      AND: [
        { email: { startsWith: "demo." } },
        { email: { endsWith: `@${DEMO_EMAIL_HOST}` } },
        { createdAt: { lt: cutoff } },
      ],
    },
  })

  if (result.count > 0) {
    logger.info({ count: result.count, cutoff }, "Cleaned up expired demo users")
  }

  return result.count
}

/**
 * Provision an isolated FREE demo visitor with Phase 1 access only.
 * No shared password — session is issued immediately after create.
 */
export async function createEphemeralDemoSession() {
  await cleanupExpiredDemoUsers().catch((err) => {
    logger.warn({ err }, "Demo user cleanup failed; continuing with new demo session")
  })

  const uniqueId = randomBytes(8).toString("hex")
  const email = buildEphemeralDemoEmail(uniqueId)

  const user = await createUserWithInitialData({
    email,
    passwordHash: null,
    firstName: "Demo",
    lastName: "Visitor",
    avatarUrl: null,
  })

  await prisma.userProfile.update({
    where: { userId: user.id },
    data: {
      roleLabel: "Phase 1 demo",
      identityStatement:
        "Ephemeral demo session — Phase 1 only. Sign up to keep progress and unlock later phases.",
    },
  })

  const hydrated = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { profile: true },
  })

  return mapUserToAuthResponse(hydrated)
}
