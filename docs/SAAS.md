# SaaS launch checklist

API Sandbox is **single-tenant per user** (no org/workspace model). Billing is **Stripe subscriptions** on the `User` record.

## Production feature flags (Vercel)

| Variable | Prod value | Purpose |
|----------|------------|---------|
| `NEXT_PUBLIC_FF_PREMIUM_PAYWALL` | `true` | Gate premium phases behind subscription |
| `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` | `true` | Real Checkout + Customer Portal |
| `NEXT_PUBLIC_FF_RATE_LIMITING` | `true` | Upstash limits on auth + assistant |
| `NEXT_PUBLIC_FF_DEMO_LOGIN` | `false` | Hide demo sign-in |
| `NEXT_PUBLIC_FF_ANALYTICS` | `true` | Optional |

Do **not** set `ALLOW_DEMO_LOGIN_IN_PRODUCTION` unless you accept a shared premium demo account.

## Required secrets

See [DEPLOYMENT.md](./DEPLOYMENT.md) plus:

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Checkout + webhooks |
| `STRIPE_WEBHOOK_SECRET` | Verify `POST /api/webhooks/stripe` |
| `STRIPE_PRICE_ID` | Premium monthly price |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limits |
| `OPENAI_API_KEY` or `GEMINI_API_KEY` | Learning assistant |

## Stripe setup

1. Create **Product** + recurring **Price** in Stripe Dashboard.
2. Set `STRIPE_PRICE_ID` on Vercel.
3. Webhook endpoint: `https://<your-host>/api/webhooks/stripe`  
   Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Enable **Customer Portal** in Stripe for self-service cancel.

## Verify after deploy

```bash
curl -sS "https://<your-host>/api/health/saas" | jq .
curl -sS "https://<your-host>/api/health/db" | jq .
```

`ready: true` means no blocking failures. Warnings (e.g. assistant key) may still need attention.

## What the app enforces

| Area | Behavior |
|------|----------|
| Billing | Checkout → webhook upgrades tier; instant `POST /api/subscription/upgrade` **disabled** when Stripe checkout is on or in production |
| Demo login | Off in production unless `ALLOW_DEMO_LOGIN_IN_PRODUCTION=true` |
| Assistant | **Auth required** in production; rate limited per user |
| Auth routes | Login/signup rate limited (when `RATE_LIMITING` on) |
| Legal | `/terms`, `/privacy` |

## Local dev

**Demo billing (default):** instant upgrade, no Stripe keys — see `config/environments/local.env.example`.

**Real Stripe Checkout locally:** [STRIPE_LOCAL.md](./STRIPE_LOCAL.md) (Test mode + Stripe CLI webhooks).

```bash
# .env.local — learning mode (no Stripe)
NEXT_PUBLIC_FF_PREMIUM_PAYWALL=false   # optional: explore all phases
NEXT_PUBLIC_FF_STRIPE_CHECKOUT=false   # instant upgrade API works locally
NEXT_PUBLIC_FF_RATE_LIMITING=false
```

## Out of scope (future)

- Multi-tenant orgs / team seats
- Usage metering beyond subscription tier
- Admin dashboard
