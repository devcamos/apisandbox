import type { AuthResponse, AuthUser } from "@/lib/auth/types"
import { issueJwtToken } from "@/lib/services/auth/token-service"
import { splitFullName } from "@/lib/user-name"

interface UserWithProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  subscriptionTier: "FREE" | "PREMIUM"
  profile: {
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    roleLabel: string | null
    identityStatement: string | null
  } | null
}

export function mapUserToAuthUser(user: UserWithProfile): AuthUser {
  const fallback = splitFullName(user.name)
  return {
    id: user.id,
    email: user.email,
    firstName: user.profile?.firstName ?? fallback.firstName,
    lastName: user.profile?.lastName ?? fallback.lastName,
    avatarUrl: user.profile?.avatarUrl ?? user.image ?? null,
    roleLabel: user.profile?.roleLabel ?? null,
    identityStatement: user.profile?.identityStatement ?? null,
    subscriptionTier: user.subscriptionTier,
  }
}

export function issueAuthTokenForUser(authUser: AuthUser) {
  const { token, expiresIn } = issueJwtToken({
    sub: authUser.id,
    email: authUser.email,
  })

  return {
    token,
    expiresIn,
  }
}

export function mapUserToAuthResponse(user: UserWithProfile): AuthResponse {
  const authUser = mapUserToAuthUser(user)
  const { token, expiresIn } = issueAuthTokenForUser(authUser)
  return {
    token,
    expiresIn,
    user: authUser,
  }
}
