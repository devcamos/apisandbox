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

export type AuthApiEnvelope<TData = unknown> = {
  success?: boolean
  data?: TData
  error?: { message?: string; details?: unknown }
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
  window.location.assign(callbackUrl)
}
