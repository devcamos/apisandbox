/**
 * Prompts the browser password manager to offer saving credentials
 * after a successful email/password sign-in or sign-up.
 *
 * Uses the Credential Management API where supported (Chrome, Edge, Safari).
 * Falls back silently when unavailable or when the user dismisses the prompt.
 */
export async function promptSavePasswordCredential(
  email: string,
  password: string,
): Promise<void> {
  if (globalThis.window === undefined) return

  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedEmail || !password) return

  const PasswordCredentialCtor = (
    globalThis as typeof globalThis & {
      PasswordCredential?: new (data: PasswordCredentialData) => PasswordCredential
    }
  ).PasswordCredential

  if (!PasswordCredentialCtor || !navigator.credentials?.store) return

  try {
    const credential = new PasswordCredentialCtor({
      id: trimmedEmail,
      password,
      name: trimmedEmail,
    })
    await navigator.credentials.store(credential)
  } catch {
    // User dismissed the prompt or the browser blocked storage — ignore.
  }
}
