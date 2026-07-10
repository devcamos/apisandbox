# Stripe checkout — local test mode

Use this when you want the **real Stripe Checkout UI** locally (not the instant demo upgrade).

## Do you need a separate dev account?

No. Stripe gives every account **Test mode** and **Live mode** in one Dashboard. Local dev uses **Test mode** only:

| | Test mode | Live mode |
|---|-----------|-----------|
| Secret key | `sk_test_…` | `sk_live_…` |
| Money | Fake (test cards) | Real charges |
| Checkout URL | `checkout.stripe.com` | Same |

Sign up: [dashboard.stripe.com/register](https://dashboard.stripe.com/register). Toggle **Test mode** (top right) before creating products and keys.

## Two local billing modes

| Mode | Flag | Upgrade button behavior |
|------|------|-------------------------|
| **Demo** (default) | `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=false` | `POST /api/subscription/upgrade` → instant PREMIUM → `/upgrade/success` |
| **Real Stripe** | `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true` + keys | `POST /api/checkout` → redirect to Stripe → webhook → PREMIUM |
| **Customer portal** | above + `NEXT_PUBLIC_FF_BILLING_PORTAL=true` | Nav **Manage subscription** → Stripe portal |

If you saw “Welcome to Premium” with no payment page, you were in **demo mode**.

## Prerequisites

- App running: `npm run dev:db:up` then `npm run dev` → http://localhost:4000
- Local Postgres (see [AGENT_ONBOARDING.md](./AGENT_ONBOARDING.md))
- [Stripe CLI](https://stripe.com/docs/stripe-cli) installed (`brew install stripe/stripe-cli/stripe`)

## 1. Stripe Dashboard (Test mode)

1. **Product catalog** → create a **Product** (e.g. “API Sandbox Premium”).
2. Add a recurring **Price** (e.g. £5/month). Copy **`price_…`**.
3. **Developers → API keys** → reveal **Secret key** (`sk_test_…`).
4. **Settings → Billing → Customer portal** → enable (optional; for “Manage subscription” in the app).

## 2. Environment (`.env.local`)

```bash
# Paywall + real checkout (override defaults from npm run env:local)
NEXT_PUBLIC_FF_PREMIUM_PAYWALL=true
NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true
NEXT_PUBLIC_FF_BILLING_PORTAL=true
NEXT_PUBLIC_APP_URL=http://localhost:4000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from Stripe CLI step below
```

Restart the dev server after editing env. Do **not** pass `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=false` on the `npm run dev` command line — that overrides `.env.local`.

## 3. Forward webhooks

Premium is applied when Stripe calls `POST /api/webhooks/stripe`. Locally, use the CLI:

```bash
stripe login
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Copy the **`whsec_…`** signing secret the CLI prints into `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

**Events this app handles:**

| Event | Effect |
|-------|--------|
| `checkout.session.completed` | Upgrade after confirmed payment |
| `checkout.session.async_payment_succeeded` | Upgrade after a delayed payment succeeds |
| `customer.subscription.created` | Reconcile initial subscription status |
| `customer.subscription.updated` | Reconcile access, status, period end, and cancellation |
| `customer.subscription.deleted` | Downgrade to FREE |
| `invoice.payment_failed` | Log payment recovery; keep access while `past_due` |

The handler deduplicates events by Stripe event ID. A subscription retains access while `active`, `trialing`, or `past_due`, and loses access when it becomes `unpaid`, `canceled`, `paused`, or incomplete.

You can also register these on a Dashboard webhook when testing against a preview URL; for localhost, the CLI is simplest.

## 4. Run the flow

1. Sign in (or sign up) — e.g. [TEST_USERS.md](./TEST_USERS.md).
2. Open `/upgrade` → **Upgrade — £5/month**.
3. You should land on **Stripe Checkout** (`checkout.stripe.com`).
4. Pay with a [test card](https://docs.stripe.com/testing#cards), e.g. `4242 4242 4242 4242`, any future expiry, any CVC.
5. Return to `/upgrade/success` — page polls until tier is PREMIUM, then redirects to `/phase-2`.

In the terminal running `stripe listen`, you should see `checkout.session.completed` forwarded with `200`.

## 5. Verify configuration

```bash
curl -sS http://localhost:4000/api/health/saas | jq '.data.checks[] | select(.id=="stripe" or .id=="instant_upgrade")'
```

Expected with Stripe enabled:

- **stripe** → `status: "ok"` (keys + price configured)
- **instant_upgrade** → blocked (“Use Stripe checkout…”)

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Instant premium, no Checkout | `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=false` in env or shell |
| “Billing is not configured” on upgrade | Missing `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, or `NEXT_PUBLIC_APP_URL` |
| Checkout works but stuck on “Activating…” | Webhook not reaching app — run `stripe listen`, fix `STRIPE_WEBHOOK_SECRET`, restart dev |
| `Invalid signature` in server logs | `STRIPE_WEBHOOK_SECRET` does not match the CLI session (re-copy after `stripe listen`) |
| Portal button fails | `NEXT_PUBLIC_FF_BILLING_PORTAL=false`, Customer portal not enabled in Dashboard, or no `stripeCustomerId` after checkout |
| Database error from webhook | Run `npx prisma migrate deploy`; the webhook event ledger migration must exist before enabling Stripe |

## Production / preview

Same integration; use **Live** keys on production and **Test** keys on preview. See [SAAS.md](./SAAS.md) for Vercel env and webhook URL (`https://<host>/api/webhooks/stripe`).
