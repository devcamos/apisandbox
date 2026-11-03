# Stripe go-live checklist (API Sandbox)

Code is ready for live payments; this list is the **manual** part done in the Stripe and
Vercel dashboards. Names only — never paste secret values into the repo, PRs or chat.

## 1. Stripe Dashboard (live mode)

1. Create the **Premium monthly** Product and a recurring **Price** in live mode. Copy its
   `price_...` id (this becomes `STRIPE_PRICE_ID`).
2. Enable the **Customer Portal** (Settings → Billing → Customer portal): allow cancel and
   payment-method updates; set the default return URL to `https://<prod-domain>/dashboard`.
3. Add a **webhook endpoint**: `https://<prod-domain>/api/webhooks/stripe`
   Subscribe to exactly these events (all are handled in `lib/stripe-webhook-handlers.ts`):
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   Copy the endpoint's signing secret (`whsec_...`) for `STRIPE_WEBHOOK_SECRET`.

## 2. Vercel → Project → Settings → Environment Variables (Production only)

| Variable | Value shape | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Health check fails on Production with a test key. Keep `sk_test_` on Preview. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From the live endpoint above. |
| `STRIPE_PRICE_ID` | `price_...` | Live Premium monthly price. |
| `NEXT_PUBLIC_APP_URL` | `https://<prod-domain>` | Must be HTTPS; used for checkout success/cancel and portal return URLs. |
| `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` | `true` | Turns on `/api/checkout`. |
| `NEXT_PUBLIC_FF_BILLING_PORTAL` | `true` | Turns on `/api/billing/portal` (needs checkout on). |
| `NEXT_PUBLIC_FF_PREMIUM_PAYWALL` | `true` | Enforced on Production even if unset, but set it so the health check is green. |
| `NEXT_PUBLIC_FF_DEMO_LOGIN` | `false` (or unset) | Keep demo login off in Production. |

Optional but recommended: `RESEND_API_KEY` + `EMAIL_FROM` (receipt / cancellation emails),
`NEXT_PUBLIC_FF_RATE_LIMITING=true` with `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.

Redeploy Production after changing env vars (`NEXT_PUBLIC_*` values are baked in at build).

## 3. Verify after deploy

- `GET /api/health/saas` → `stripe`, `billing_portal`, `paywall`, `instant_upgrade` all `ok`.
- Sign up a real account, hit **Upgrade**, pay with a real card, confirm you land on
  `/upgrade/success` and a Phase 2 page now shows full content; refund yourself in Stripe.
- In Stripe → Webhooks → endpoint, confirm deliveries return `200`.
- Open **Manage subscription**, cancel, confirm the account keeps access until the period
  end (`subscriptionExpiresAt`) and then drops to the preview.

## How payments map to users (for reference)

- Checkout sets `client_reference_id`, `metadata.userId` and `subscription_data.metadata.userId`
  to the app user id, and reuses/creates a Stripe Customer stored as `stripeCustomerId`.
- `checkout.session.completed` (paid) → PREMIUM, clears any stale expiry.
- `customer.subscription.created/updated` → `active`/`trialing`/`past_due` keep PREMIUM;
  `cancel_at_period_end` sets `subscriptionExpiresAt` to the period end; other statuses → FREE.
- `customer.subscription.deleted` → FREE.
- Every premium check (pages, `/api/subscription/check`, assistant, Cloud tools) treats a past
  `subscriptionExpiresAt` as FREE.
- `POST /api/subscription/upgrade` (instant premium) works **only** under local `next dev`
  (`NODE_ENV=development`, no `VERCEL_ENV`, checkout flag off). It returns 403 on Preview and Production.
