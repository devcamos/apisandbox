/**
 * Resolve JWT signing secret from env (preview/prod must set at least one).
 * Order: AUTH_JWT_SECRET → AUTH_SECRET → NEXTAUTH_SECRET
 */

function readTrimmedEnv(key: string): string | null {
  const raw = process.env[key]
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** First configured secret, or null if none are set (including empty strings). */
export function resolveJwtSecret(): string | null {
  return (
    readTrimmedEnv("AUTH_JWT_SECRET") ??
    readTrimmedEnv("AUTH_SECRET") ??
    readTrimmedEnv("NEXTAUTH_SECRET")
  )
}

export function isJwtSecretConfigured(): boolean {
  return resolveJwtSecret() !== null
}

export function jwtSecretSource(): "AUTH_JWT_SECRET" | "AUTH_SECRET" | "NEXTAUTH_SECRET" | null {
  if (readTrimmedEnv("AUTH_JWT_SECRET")) return "AUTH_JWT_SECRET"
  if (readTrimmedEnv("AUTH_SECRET")) return "AUTH_SECRET"
  if (readTrimmedEnv("NEXTAUTH_SECRET")) return "NEXTAUTH_SECRET"
  return null
}
