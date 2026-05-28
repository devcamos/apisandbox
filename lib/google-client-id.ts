/**
 * Resolve Google OAuth client ID for GSI button + server token verification.
 * Prefer NEXT_PUBLIC_* when set at build time; fall back to GOOGLE_CLIENT_ID at runtime
 * so Vercel/production only needs GOOGLE_CLIENT_ID (no duplicate public var required).
 */
export function getGoogleClientId(): string {
  // Prefer server runtime ID so Vercel preview/prod always match token verification.
  return (
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ||
    ""
  )
}

export function isGoogleAuthConfigured(): boolean {
  return getGoogleClientId().length > 0
}
