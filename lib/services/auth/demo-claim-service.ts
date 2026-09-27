import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth"
import { isDemoUserEmail } from "@/lib/demo-login"
import { AppError } from "@/lib/http/errors"
import { databaseBusyAppError, isPrismaDatabaseBusyError } from "@/lib/http/database-busy"
import { mapUserToAuthResponse } from "@/lib/services/auth/auth-response-mapper"
import { composeDisplayName, splitFullName } from "@/lib/user-name"
import { withPrismaBusyRetry } from "@/lib/prisma-busy-retry"

export type DemoClaimPlan = "free" | "pro"

interface ClaimDemoAccountInput {
  userId: string
  email: string
  password: string
  name?: string
  plan?: DemoClaimPlan
}

/**
 * Convert an ephemeral demo session into a real account **in place**.
 * Keeps the same user id so Phase 1 progress, lessons, and quizzes stay attached.
 */
export async function claimDemoAccount(input: ClaimDemoAccountInput) {
  try {
    return await withPrismaBusyRetry(() => claimDemoAccountOnce(input))
  } catch (error) {
    if (isPrismaDatabaseBusyError(error)) {
      throw databaseBusyAppError()
    }
    throw error
  }
}

async function claimDemoAccountOnce(input: ClaimDemoAccountInput) {
  const email = input.email.trim().toLowerCase()
  if (!email) {
    throw new AppError("Email is required", 400, "validation_error")
  }

  const passwordValidation = validatePasswordStrength(input.password)
  if (!passwordValidation.isValid) {
    throw new AppError(
      "Password does not meet requirements",
      400,
      "validation_error",
      passwordValidation.errors,
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    include: { profile: true },
  })

  if (!user?.isActive) {
    throw new AppError("Demo session is no longer available", 401, "auth_failure")
  }

  if (!isDemoUserEmail(user.email)) {
    throw new AppError("Only demo sessions can be claimed", 403, "auth_failure")
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  if (existing && existing.id !== user.id) {
    throw new AppError("An account with this email already exists", 400, "validation_error")
  }

  const passwordHash = await hashPassword(input.password)
  const nameParts = splitFullName(input.name?.trim() || null)
  const displayName =
    composeDisplayName(nameParts.firstName, nameParts.lastName) ||
    user.name ||
    email.split("@")[0]

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email,
      passwordHash,
      name: displayName,
      loginAttempts: 0,
      lockedUntil: null,
      // Claimed demos stay FREE; Pro continues through Stripe on /upgrade.
      subscriptionTier: "FREE",
    },
  })

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      roleLabel: null,
      identityStatement: null,
    },
    update: {
      firstName: nameParts.firstName ?? user.profile?.firstName,
      lastName: nameParts.lastName ?? user.profile?.lastName,
      roleLabel: null,
      identityStatement: null,
    },
  })

  const hydrated = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { profile: true },
  })

  const auth = mapUserToAuthResponse(hydrated)
  return {
    ...auth,
    plan: input.plan === "pro" ? ("pro" as const) : ("free" as const),
  }
}
