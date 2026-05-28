/** Shared fetch options for auth API routes (session cookie + JSON body). */
export const authApiFetchInit = {
  credentials: "include" as RequestCredentials,
}

export function authApiJsonInit(body: unknown): RequestInit {
  return {
    ...authApiFetchInit,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
}

/**
 * Full-page navigation after login so middleware sees the httpOnly auth_token
 * cookie on the first protected request (client navigations can race Set-Cookie).
 */
export function redirectAfterAuth(callbackUrl: string) {
  window.location.assign(callbackUrl)
}
