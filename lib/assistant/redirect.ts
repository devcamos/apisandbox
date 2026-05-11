export type AssistantRedirect = {
  href: string
  label: string
  reason: string
}

function norm(s: string) {
  return s.toLowerCase()
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n))
}

export function inferAssistantRedirect({
  message,
  pathname,
}: {
  message: string
  pathname: string
}): AssistantRedirect | null {
  const m = norm(message)
  const p = pathname || "/"

  // Keep these intentionally small and high-signal to avoid “random” redirects.
  // The assistant can still answer in-place; this just helps users jump to the best lesson.
  const rules: Array<{
    href: string
    label: string
    reason: string
    match: (m: string) => boolean
  }> = [
    {
      href: "/phase-2/demos/retry",
      label: "Go to Phase 2: Retry Demo",
      reason: "Retries, backoff, and safe retry rules are covered in the retry demo.",
      match: (s) => includesAny(s, ["retry", "backoff", "exponential backoff", "jitter"]),
    },
    {
      href: "/phase-2/demos/circuit-breaker",
      label: "Go to Phase 2: Circuit Breaker Demo",
      reason: "Circuit breakers and failure containment are covered in the circuit-breaker demo.",
      match: (s) => includesAny(s, ["circuit breaker", "breaker", "open state", "half-open", "half open"]),
    },
    {
      href: "/phase-2/demos/oauth2",
      label: "Go to Phase 2: OAuth2 Demo",
      reason: "OAuth2 flows (redirects, callbacks, tokens) are covered in the OAuth2 demo.",
      match: (s) => includesAny(s, ["oauth", "oauth2", "openid", "oidc", "authorization code", "pkce"]),
    },
    {
      href: "/phase-2/demos/jwt",
      label: "Go to Phase 2: JWT Demo",
      reason: "JWT structure, validation, and common pitfalls are covered in the JWT demo.",
      match: (s) => includesAny(s, ["jwt", "json web token", "bearer token", "claims", "jwks"]),
    },
    {
      href: "/phase-2/demos/api-keys",
      label: "Go to Phase 2: API Keys Demo",
      reason: "API key auth patterns and safe handling are covered in the API keys demo.",
      match: (s) => includesAny(s, ["api key", "api-key", "apikey", "x-api-key", "x api key"]),
    },
    {
      href: "/phase-2/databases/postgresql",
      label: "Go to Phase 2: PostgreSQL Basics",
      reason: "Persistence, migrations, and transactional boundaries are covered in the Postgres section.",
      match: (s) => includesAny(s, ["postgres", "postgresql", "migration", "migrations", "transaction", "acid"]),
    },
    {
      href: "/observability",
      label: "Go to Observability Dashboard",
      reason: "Logs, request IDs, metrics, and debugging workflows are covered in Observability.",
      match: (s) => includesAny(s, ["observability", "metrics", "logging", "logs", "trace", "tracing", "correlation id", "request id"]),
    },
    {
      href: "/docs/java",
      label: "Go to Java Track",
      reason: "The Java track collects the key API engineering concepts with code and labs.",
      match: (s) => includesAny(s, ["java", "spring", "objectmapper", "jackson", "dto", "@restcontroller", "validated", "@valid"]),
    },
  ]

  const hit = rules.find((r) => r.match(m))
  if (!hit) return null

  // Don't suggest a redirect if the user is already on that target page.
  if (p === hit.href || p.startsWith(hit.href + "/")) return null

  return { href: hit.href, label: hit.label, reason: hit.reason }
}

