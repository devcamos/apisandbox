import { redirectAfterAuth } from "@/lib/auth/client-fetch"
import { promptSavePasswordCredential } from "@/lib/browser-credentials"

export type ClientAuthSessionPayload = {
  token: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
}

interface CompleteClientAuthSessionOptions {
  authData: ClientAuthSessionPayload
  redirectTo: string
  setSession: (authData: ClientAuthSessionPayload) => void
  savePassword?: { email: string; password: string }
}

/** Apply session in client storage, optional credential save, then full-page redirect. */
export async function completeClientAuthSession({
  authData,
  redirectTo,
  setSession,
  savePassword,
}: CompleteClientAuthSessionOptions) {
  setSession(authData)
  if (savePassword) {
    await promptSavePasswordCredential(savePassword.email, savePassword.password)
  }
  redirectAfterAuth(redirectTo)
}
