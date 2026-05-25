import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth"
import { AppError } from "@/lib/http/errors"
import { mapUserToAuthResponse, mapUserToAuthUser } from "@/lib/services/auth/auth-response-mapper"
import { createUserWithInitialData } from "@/lib/services/auth/user-bootstrap-service"
import { validatePasswordLogin } from "@/lib/services/auth/password-auth-service"
import { verifyGoogleIdentity } from "@/lib/services/auth/google-identity-service"
import { linkGoogleIdentityToExistingEmailAccount } from "@/lib/services/auth/account-linking-service"
import { verifyJwtToken } from "@/lib/services/auth/token-service"

interface RegisterInput {
  email: string
  password: string
  firstName?: string
  lastName?: string
  forceBootstrapFailure?: boolean
}

interface PasswordLoginInput {
  email: string
  password: string
}

interface GoogleLoginInput {
  idToken: string
}

export async function registerWithPassword(input: RegisterInput) {
  const passwordValidation = validatePasswordStrength(input.password)
  if (!passwordValidation.isValid) {
    throw new AppError(
      "Password does not meet requirements",
      400,
      "validation_error",
      passwordValidation.errors
    )
  }

  const passwordHash = await hashPassword(input.password)
  const user = await createUserWithInitialData({
    email: input.email.trim().toLowerCase(),
    passwordHash,
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null,
    avatarUrl: null,
    forceBootstrapFailure: input.forceBootstrapFailure,
  })

  return mapUserToAuthResponse(user)
}

export async function loginWithPassword(input: PasswordLoginInput) {
  const user = await validatePasswordLogin(input.email, input.password)
  return mapUserToAuthResponse(user)
}

export async function loginWithGoogle(input: GoogleLoginInput) {
  const identity = await verifyGoogleIdentity(input.idToken)

  const existingUser = await prisma.user.findUnique({
    where: { email: identity.email },
    include: { profile: true },
  })

  if (existingUser) {
    await linkGoogleIdentityToExistingEmailAccount(existingUser.id, identity)

    if (!existingUser.profile) {
      await prisma.userProfile.create({
        data: {
          userId: existingUser.id,
          firstName: identity.firstName,
          lastName: identity.lastName,
          avatarUrl: identity.avatarUrl,
        },
      })
    } else if (!existingUser.profile.avatarUrl && identity.avatarUrl) {
      await prisma.userProfile.update({
        where: { userId: existingUser.id },
        data: { avatarUrl: identity.avatarUrl },
      })
    }

    const hydrated = await prisma.user.findUniqueOrThrow({
      where: { id: existingUser.id },
      include: { profile: true },
    })
    return mapUserToAuthResponse(hydrated)
  }

  const user = await createUserWithInitialData({
    email: identity.email,
    passwordHash: null,
    firstName: identity.firstName,
    lastName: identity.lastName,
    avatarUrl: identity.avatarUrl,
  })

  await linkGoogleIdentityToExistingEmailAccount(user.id, identity)
  return mapUserToAuthResponse(user)
}

export async function getAuthenticatedUserFromToken(token: string) {
  const payload = verifyJwtToken(token)
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      subscriptionTier: true,
      isActive: true,
      profile: true,
    },
  })
  if (!user?.isActive) {
    throw new AppError("Unauthorized", 401, "auth_failure")
  }
  return mapUserToAuthUser(user)
}
