import type { OAuth2Client } from "google-auth-library"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"
import { isAccountLocked, lockMinutesRemaining, registerFailedAttempt } from "@/lib/auth/login-lockout"
import {
  DATABASE_BUSY_MESSAGE,
  isPrismaDatabaseBusyError,
} from "@/lib/http/database-busy"
import { withPrismaBusyRetry } from "@/lib/prisma-busy-retry"

export type AuthorizeUserResult = {
  id: string
  email: string
  name: string | null
  image: string | null
}

function rethrowMappedPrismaBusy(error: unknown): never {
  if (isPrismaDatabaseBusyError(error)) {
    throw new Error(DATABASE_BUSY_MESSAGE)
  }
  throw error
}

export async function authorizeWithGoogleIdToken(
  googleIdToken: string,
  googleOAuth2Client: OAuth2Client,
  googleClientId: string
): Promise<AuthorizeUserResult> {
  try {
    return await withPrismaBusyRetry(() =>
      authorizeWithGoogleIdTokenOnce(googleIdToken, googleOAuth2Client, googleClientId),
    )
  } catch (error) {
    rethrowMappedPrismaBusy(error)
  }
}

async function authorizeWithGoogleIdTokenOnce(
  googleIdToken: string,
  googleOAuth2Client: OAuth2Client,
  googleClientId: string
): Promise<AuthorizeUserResult> {
  const ticket = await googleOAuth2Client.verifyIdToken({
    idToken: googleIdToken,
    audience: googleClientId,
  })
  const payload = ticket.getPayload()
  if (!payload?.email) {
    throw new Error("Google did not provide an email")
  }
  const email = payload.email
  const name = payload.name ?? undefined
  const image = payload.picture ?? undefined

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name ?? email.split("@")[0],
        image,
        passwordHash: null,
      },
    })
  } else if (!user.image && image) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { image, ...(name && !user.name ? { name } : {}) },
    })
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  }
}

export async function authorizeWithEmailPassword(
  email: string,
  password: string
): Promise<AuthorizeUserResult> {
  try {
    return await withPrismaBusyRetry(() => authorizeWithEmailPasswordOnce(email, password))
  } catch (error) {
    rethrowMappedPrismaBusy(error)
  }
}

async function authorizeWithEmailPasswordOnce(
  email: string,
  password: string
): Promise<AuthorizeUserResult> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error("CREDENTIALS_INVALID")
  }

  const now = new Date()
  if (isAccountLocked(user, now)) {
    throw new Error(`ACCOUNT_LOCKED:${lockMinutesRemaining(user, now)}`)
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated. Please contact support.")
  }

  if (!user.passwordHash) {
    throw new Error("This account was created with OAuth. Please sign in with your OAuth provider (Google).")
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    const update = registerFailedAttempt(user, now)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: update.loginAttempts,
        lockedUntil: update.lockedUntil,
      },
    })
    // Attempts 1-5 are all reported as a wrong password; the lock only
    // surfaces on the next (6th) attempt.
    throw new Error(`PASSWORD_INCORRECT:${update.attemptsRemaining}`)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
    },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  }
}
