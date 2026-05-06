import type { OAuth2Client } from "google-auth-library"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"

export type AuthorizeUserResult = {
  id: string
  email: string
  name: string | null
  image: string | null
}

export async function authorizeWithGoogleIdToken(
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
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error("CREDENTIALS_INVALID")
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60))
    throw new Error(`ACCOUNT_LOCKED:${minutesRemaining}`)
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated. Please contact support.")
  }

  if (!user.passwordHash) {
    throw new Error("This account was created with OAuth. Please sign in with your OAuth provider (Google).")
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    const newAttempts = (user.loginAttempts || 0) + 1
    let lockedUntil = null

    if (newAttempts >= 5) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: newAttempts,
        lockedUntil,
      },
    })

    if (newAttempts >= 5) {
      throw new Error("ACCOUNT_LOCKED")
    }
    const attemptsRemaining = 5 - newAttempts
    throw new Error(`PASSWORD_INCORRECT:${attemptsRemaining}`)
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
