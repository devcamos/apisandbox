# Feature flags

Boolean toggles control SaaS billing, auth, rate limits, and analytics without code deploys for every environment — set env vars on Vercel or in `.env.local`, then **redeploy** (or restart `npm run dev`).

**Source of truth:** [`config/featureFlags.ts`](../config/featureFlags.ts)

## Quick reference

| Flag | Env variable | Local default | Prod typical |
|------|--------------|---------------|--------------|
| `PREMIUM_PAYWALL` | `NEXT_PUBLIC_FF_PREMIUM_PAYWALL` | `false` | `true` |
| `STRIPE_CHECKOUT` | `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` | `false` | `true` |
| `BILLING_PORTAL` | `NEXT_PUBLIC_FF_BILLING_PORTAL` | `false` | `true` |
| `EMAIL_VERIFICATION` | `NEXT_PUBLIC_FF_EMAIL_VERIFICATION` | `false` | `false` |
| `RATE_LIMITING` | `NEXT_PUBLIC_FF_RATE_LIMITING` | `false` | `true` |
| `ANALYTICS` | `NEXT_PUBLIC_FF_ANALYTICS` | `false` | `true` |
| `DEMO_LOGIN` | `NEXT_PUBLIC_FF_DEMO_LOGIN` | `false` | `false` |

Only the literal string `"true"` enables a flag (`"yes"`, `"1"`, etc. are treated as off).

Templates: [`config/environments/local.env.example`](../config/environments/local.env.example), [`config/environments/prod.env.example`](../config/environments/prod.env.example).

## Usage in code

### Server (API routes, middleware, server components)

```typescript
import { isFeatureEnabled } from "@/config/featureFlags"

if (!isFeatureEnabled("STRIPE_CHECKOUT")) {
  return NextResponse.json({ error: "Stripe checkout is disabled" }, { status: 503 })
}
```

### Client components

`NEXT_PUBLIC_FF_*` vars are inlined at build time. Client components may import the same helpers:

```typescript
import { isFeatureEnabled } from "@/config/featureFlags"

if (isFeatureEnabled("BILLING_PORTAL")) {
  // render Manage subscription
}
```

Restart the dev server after changing `.env.local`.

### Inspect all flags (tests, debugging)

```typescript
import { getAllFlags, featureFlagEnvKey } from "@/config/featureFlags"

getAllFlags() // { PREMIUM_PAYWALL: { enabled, description }, ... }
featureFlagEnvKey("BILLING_PORTAL") // "NEXT_PUBLIC_FF_BILLING_PORTAL"
```

## Flag dependencies

| Flag | Requires | Notes |
|------|----------|-------|
| `BILLING_PORTAL` | `STRIPE_CHECKOUT` | Portal API returns 503 if checkout flag is off, even when portal flag is on |
| `STRIPE_CHECKOUT` | Stripe env keys | See [STRIPE_LOCAL.md](./STRIPE_LOCAL.md), [SAAS.md](./SAAS.md) |
| `RATE_LIMITING` | Upstash Redis URL + token | |
| `DEMO_LOGIN` | `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`, demo user in DB | [TEST_USERS.md](./TEST_USERS.md) |

## Billing portal

Enable self-service cancel/update in the Stripe Customer Portal:

1. **App flags:** `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true` and `NEXT_PUBLIC_FF_BILLING_PORTAL=true`
2. **Stripe Dashboard:** Settings → Billing → Customer portal → Enable
3. **User record:** `stripeCustomerId` set after real Checkout (not demo instant-upgrade)
4. **Env:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`

See [STRIPE_LOCAL.md](./STRIPE_LOCAL.md) for local test mode.

## Adding a new flag

1. Add the name to the `FeatureFlag` union in `config/featureFlags.ts`.
2. Add a `flags` entry with `NEXT_PUBLIC_FF_<NAME>` (or a server-only env if never needed in the browser).
3. Gate behavior with `isFeatureEnabled("YOUR_FLAG")` in API routes, middleware, or UI.
4. Document the env var in `local.env.example`, `prod.env.example`, and this file.
5. Add tests in `tests/unit/feature-flags.test.ts`.
6. If the flag affects production readiness, add a check in `lib/saas/config.ts`.

## Where flags are used today

| Flag | Primary touchpoints |
|------|---------------------|
| `PREMIUM_PAYWALL` | `middleware.ts`, `SubscriptionGate`, dashboard |
| `STRIPE_CHECKOUT` | `/api/checkout`, webhooks, instant-upgrade guard |
| `BILLING_PORTAL` | `/api/billing/portal`, `ManageSubscriptionButton` in nav |
| `RATE_LIMITING` | `lib/rate-limit.ts`, auth + assistant routes |
| `ANALYTICS` | `AnalyticsProvider` |
| `DEMO_LOGIN` | `TryDemoButton`, `/api/auth/demo`, layout demo banner |

## Production checklist

See [SAAS.md](./SAAS.md). Verify after deploy:

```bash
curl -sS "https://<host>/api/health/saas" | jq '.data.checks[] | select(.id | startswith("stripe") or . == "billing_portal")'
```

## Limitations (current design)

- Flags are **static per deploy** — no runtime toggle service (LaunchDarkly, Edge Config, etc.).
- `NEXT_PUBLIC_*` values are baked into client bundles at build time.
- For server-only secrets or A/B tests across users, add a server-only env or a future flag provider in a follow-up PR.
