import { OAuth2Client } from "google-auth-library"
import { AppError } from "@/lib/http/errors"
import type { VerifiedGoogleIdentity } from "@/lib/auth/types"
import { getGoogleClientId } from "@/lib/google-client-id"

const googleClientId = getGoogleClientId()
const oauthClient = googleClientId ? new OAuth2Client(googleClientId) : null

function parseTestIdentity(idToken: string): VerifiedGoogleIdentity | null {
  if (process.env.NODE_ENV === "production" || !idToken.startsWith("test-google:")) {
    return null
  }

  const encodedPayload = idToken.slice("test-google:".length)
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8")) as {
      sub: string
      email: string
      given_name?: string
      family_name?: string
      picture?: string
    }
    if (!payload.email || !payload.sub) return null
    return {
      googleSubject: payload.sub,
      email: payload.email.toLowerCase(),
      firstName: payload.given_name ?? null,
      lastName: payload.family_name ?? null,
      avatarUrl: payload.picture ?? null,
    }
  } catch {
    return null
  }
}

export async function verifyGoogleIdentity(idToken: string): Promise<VerifiedGoogleIdentity> {
  const testIdentity = parseTestIdentity(idToken)
  if (testIdentity) {
    return testIdentity
  }

  if (!oauthClient || !googleClientId) {
    throw new AppError(
      "Google sign-in is not configured",
      500,
      "configuration_error"
    )
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: googleClientId,
  })

  const payload = ticket.getPayload()
  if (!payload?.email || !payload.sub) {
    throw new AppError(
      "Google identity payload missing required fields",
      401,
      "auth_failure"
    )
  }

  return {
    googleSubject: payload.sub,
    email: payload.email.toLowerCase(),
    firstName: payload.given_name ?? null,
    lastName: payload.family_name ?? null,
    avatarUrl: payload.picture ?? null,
  }
}

