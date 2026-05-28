import type { NextRequest } from "next/server"

/**
 * Session tokens from httpOnly cookies (app JWT + legacy NextAuth cookies).
 * Used by edge middleware for page protection — not for Bearer API auth.
 */
export function readSessionCookieToken(request: NextRequest): string | null {
  return (
    request.cookies.get("auth_token")?.value ??
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value ??
    null
  )
}
