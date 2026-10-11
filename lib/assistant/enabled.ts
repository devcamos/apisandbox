/**
 * Learning assistant environment gate.
 *
 * Enabled on Vercel Preview / Development and local non-production runs.
 * Never enabled when `VERCEL_ENV === "production"`.
 */
export function isAssistantEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  const vercelEnv = env.VERCEL_ENV
  if (vercelEnv === "production") return false
  if (vercelEnv === "preview" || vercelEnv === "development") return true
  // Local / CI without Vercel: on in development and test; off for production Node builds.
  return env.NODE_ENV !== "production"
}
