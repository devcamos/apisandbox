import type { AuthResponse, AuthUser } from "@/lib/auth/types"
import { issueJwtToken } from "@/lib/services/auth/token-service"

interface UserWithProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  profile: {
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    roleLabel: string | null
    identityStatement: string | null
  } | null
}

function splitName(name: string | null) {
  if (!name) return { firstName: null, lastName: null }
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: null, lastName: null }
  return {
    firstName: parts[0] || null,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : null,
  }
}

export function mapUserToAuthUser(user: UserWithProfile): AuthUser {
  const fallback = splitName(user.name)
  return {
    id: user.id,
    email: user.email,
    firstName: user.profile?.firstName ?? fallback.firstName,
    lastName: user.profile?.lastName ?? fallback.lastName,
    avatarUrl: user.profile?.avatarUrl ?? user.image ?? null,
    roleLabel: user.profile?.roleLabel ?? null,
    identityStatement: user.profile?.identityStatement ?? null,
  }
}

export function mapUserToAuthResponse(user: UserWithProfile): AuthResponse {
  const authUser = mapUserToAuthUser(user)
  const { token, expiresIn } = issueJwtToken({
    sub: authUser.id,
    email: authUser.email,
  })
  return {
    token,
    expiresIn,
    user: authUser,
  }
}

