# SaaS launch checklist

API Sandbox is **single-tenant per user** (no org/workspace model). Billing is **Stripe subscriptions** on the `User` record.

Feature flag reference: [FEATURE_FLAGS.md](./FEATURE_FLAGS.md).

## Production feature flags (Vercel)

Full reference: [FEATURE_FLAGS.md](./FEATURE_FLAGS.md).

| Variable | Prod value | Purpose |
|----------|------------|---------|
| `NEXT_PUBLIC_FF_PREMIUM_PAYWALL` | `true` | Gate premium phases behind subscription |
| `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` | `true` | Real Checkout + webhooks |
| `NEXT_PUBLIC_FF_BILLING_PORTAL` | `true` | Stripe Customer Portal (manage/cancel) |
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

**Deploy order (no user impact until flags + webhooks are live):**

1. Run `npx prisma migrate deploy` on the target database **before** deploying app code that includes the Stripe hardening migration.
2. Deploy the application build.
3. Set `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` and `NEXT_PUBLIC_FF_BILLING_PORTAL` only when Stripe Dashboard + keys are ready.

Until step 3, existing users keep the current experience: demo instant-upgrade remains available in non-production when `STRIPE_CHECKOUT` is off; production users are unchanged if flags stay off.

1. Create a **Product** and recurring **Price** in Stripe **Live mode**.
2. Apply database migrations before enabling the webhook: `npx prisma migrate deploy`.
3. Set the live `STRIPE_SECRET_KEY`, live `STRIPE_PRICE_ID`, and production `NEXT_PUBLIC_APP_URL` on Vercel.
4. Set `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true` and `NEXT_PUBLIC_FF_BILLING_PORTAL=true` (see [FEATURE_FLAGS.md](./FEATURE_FLAGS.md)).
5. Add `https://<your-host>/api/webhooks/stripe` as a Stripe webhook and subscribe to the events below. Set its signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Enable the **Customer Portal** in Stripe Dashboard for payment-method changes and cancellation.

| Webhook event | Application behavior |
|---------------|----------------------|
| `checkout.session.completed` | Provisions access only after confirmed payment |
| `checkout.session.async_payment_succeeded` | Provisions delayed-payment checkouts |
| `customer.subscription.created` / `updated` | Reconciles tier, status, period end, and scheduled cancellation |
| `customer.subscription.deleted` | Revokes premium access |
| `invoice.payment_failed` | Records the failure; retains access during Stripe recovery |

Webhook event IDs are stored in `StripeWebhookEvent`, so duplicate deliveries do not repeat provisioning or email side effects. Failed and stale deliveries can be retried safely.

| Stripe status | Access |
|---------------|--------|
| `active`, `trialing`, `past_due` | PREMIUM |
| `unpaid`, `canceled`, `paused`, incomplete states | FREE |

`past_due` intentionally retains access while Stripe retries payment. Access is revoked when Stripe transitions the subscription to `unpaid`, `canceled`, or another non-entitled state.

## Verify after deploy

```bash
curl -sS "https://<your-host>/api/health/saas" | jq .
curl -sS "https://<your-host>/api/health/db" | jq .
```

`ready: true` means no blocking failures. Warnings (e.g. assistant key) may still need attention.

The production readiness check rejects missing Stripe values, malformed prefixes, non-HTTPS public URLs, and `sk_test_...` keys in production. It never returns secret values.

## Production smoke test

Run this in Stripe **Test mode** against a preview deployment before switching production to live keys:

1. Complete Checkout with Stripe test card `4242 4242 4242 4242`.
2. Confirm the user becomes PREMIUM and `/api/subscription/status` reports `active`.
3. Replay the same webhook event and confirm it returns success without sending a second email.
4. Schedule cancellation in the Customer Portal; confirm access remains until period end.
5. Send an `unpaid` or deleted subscription event; confirm premium access is revoked.

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
