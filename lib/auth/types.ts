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
  /** True for ephemeral/legacy demo sessions (Phase 1 only). */
  isDemo: boolean
}

export interface AuthPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
  idleExp?: number
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
