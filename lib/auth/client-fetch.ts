/** Shared fetch options for auth API routes (session cookie + JSON body). */
export const AUTH_JWT_STORAGE_KEY = "auth_jwt"

export const authApiFetchInit = {
  credentials: "include" as RequestCredentials,
}

/** Cookie + optional Bearer from localStorage (fixes API calls when httpOnly cookie is missing). */
export function authApiRequestInit(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers)

  if (!headers.has("Authorization") && globalThis.window !== undefined) {
    const token = localStorage.getItem(AUTH_JWT_STORAGE_KEY)
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  return {
    ...authApiFetchInit,
    ...init,
    headers,
  }
}

export function authApiJsonInit(body: unknown, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return authApiRequestInit({
    ...init,
    method: init.method ?? "POST",
    headers,
    body: JSON.stringify(body),
  })
}

export type AuthApiEnvelope<TData = unknown> = {
  success?: boolean
  data?: TData
  error?: { message?: string; details?: unknown; category?: string }
}

/** POST JSON to an auth API route and parse the standard envelope. */
export async function authApiPostJson<TData = unknown>(
  path: string,
  body: unknown,
): Promise<{ ok: boolean; status: number; payload: AuthApiEnvelope<TData> }> {
  const response = await fetch(path, authApiJsonInit(body))
  const payload = (await response.json().catch(() => ({}))) as AuthApiEnvelope<TData>
  return { ok: response.ok, status: response.status, payload }
}

/**
 * Full-page navigation after login so middleware sees the httpOnly auth_token
 * cookie on the first protected request (client navigations can race Set-Cookie).
 */
export function redirectAfterAuth(callbackUrl: string) {
  globalThis.location?.assign(callbackUrl)
}
