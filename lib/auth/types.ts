export type AuthSubscriptionTier = "FREE" | "PREMIUM"

export interface AuthUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  roleLabel: string | null
  identityStatement: string | null
  subscriptionTier: AuthSubscriptionTier
}

export interface AuthPayload {
  sub: string
  email: string
}

export interface AuthResponse {
  token: string
  expiresIn: number
  user: AuthUser
}

export interface VerifiedGoogleIdentity {
  googleSubject: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

