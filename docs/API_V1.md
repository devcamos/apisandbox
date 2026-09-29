# Public API v1 (personal API tokens)

Learners can call API Sandbox from their own tools (`curl`, Postman, scripts) using **personal API tokens** created on [/settings](/settings).

## Auth

```http
Authorization: Bearer apisb_…
```

| Status | When |
|--------|------|
| `401` | Missing, malformed, revoked, expired, or non-`apisb_` token |
| `403` | Valid token without the required scope |
| `429` | Per-token rate limit exceeded (`Retry-After` set) |

Website session cookies / JWTs are **not** accepted on `/api/v1`. They continue to work on the internal `/api/*` BFF used by the UI.

### Scopes

| Scope | Endpoints |
|-------|-----------|
| `profile:read` | `GET /api/v1/me` |
| `progress:read` | `GET /api/v1/progress/courses`, `GET /api/v1/progress/courses/{courseId}` |
| `progress:write` | `PUT …/checkpoints/{checkpointId}` |

## Quick start

1. Sign in and open **Settings**.
2. Create a token with at least `profile:read` (add progress scopes as needed).
3. Copy the secret once (it is shown only at creation).

```bash
export APISB_TOKEN='apisb_…'   # paste the token from Settings
export APISB_BASE='http://localhost:4000'  # or your deployed origin

curl -sS -H "Authorization: Bearer $APISB_TOKEN" \
  -H "X-Request-Id: demo-$(date +%s)" \
  "$APISB_BASE/api/v1/me" | jq .
```

Example success body (email is intentionally omitted):

```json
{
  "id": "clx…",
  "name": "Ada Lovelace",
  "subscriptionTier": "FREE",
  "token": {
    "id": "clx…",
    "scopes": ["profile:read", "progress:read"],
    "expiresAt": null
  }
}
```

## Errors (RFC 9457)

`/api/v1` errors use `Content-Type: application/problem+json`:

```json
{
  "type": "https://apisandbox-coral.vercel.app/problems/insufficient-scope",
  "title": "Insufficient scope",
  "status": 403,
  "detail": "API token is missing the required scope: progress:write",
  "instance": "/api/v1/progress/courses/phase-1/modules/…/checkpoints/…",
  "code": "insufficient_scope",
  "requestId": "…"
}
```

Every response includes `X-Request-Id` (accept a client value or generate one).

## OpenAPI

- Live: `GET /api/v1/openapi.json`
- Static copy: [`public/openapi/v1.json`](../public/openapi/v1.json)

Regenerate the static file:

```bash
node scripts/generate-openapi-v1.cjs
```

## Rate limiting

When `NEXT_PUBLIC_FF_RATE_LIMITING=true` and Upstash Redis is configured, each token is limited to **100 requests / 15 minutes**. Without Redis or with the flag off, requests are allowed (fail-open). Exceeded limits return `429` with `Retry-After` and `RateLimit-*` headers.
