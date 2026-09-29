# Stripe Integration TODO

Checkout Studio alignment for the existing hosted Checkout Session create in
[`app/api/checkout/route.ts`](app/api/checkout/route.ts) (Scenario A).

SDK: `stripe@22.3.0` (lockfile). `ui_mode` set to **`hosted_page`** (≥ 21.0.0).
TypeScript types in this SDK already include `ui_mode: 'hosted_page'`,
`integration_identifier`, and `origin_context` — no cast required.

Display price: `resolvePremiumPricing()` / `GET /api/billing/price` reads
`unit_amount` from the configured Stripe Price (`STRIPE_PRICE_ID`); UI falls back
to **£2** when Stripe is unset.

## Values to Replace

None. Line item price comes from `STRIPE_PRICE_ID` (env), not a hard-coded
`price_xxx` sample. Success/cancel URLs use `NEXT_PUBLIC_APP_URL`.

## Configured Parameters

| Parameter | Value | Notes |
| --- | --- | --- |
| `ui_mode` | `hosted_page` | [`app/api/checkout/route.ts`](app/api/checkout/route.ts) |
| `billing_address_collection` | `auto` | Replaces previous `customer_update` address/name auto |
| `phone_number_collection` | `{ enabled: false }` | |
| `automatic_tax` | `{ enabled: false }` | |
| `allow_promotion_codes` | `false` | |
| `payment_method_collection` | `always` | Included because `mode === 'subscription'` |
| `submit_type` | *(omitted)* | Studio suggested `auto`, but Stripe rejects `submit_type` on **subscription** Checkout Sessions; omitting avoids breaking create |
| `integration_identifier` | `hosted_web_0001` | |
| `origin_context` | `web` | |
| `mode` | `subscription` | Kept — £5/month Premium plan |
| `line_items` | `[{ price: STRIPE_PRICE_ID, quantity: 1 }]` | Kept |
| `success_url` / `cancel_url` | `/upgrade/success…` / `/upgrade` | Kept |
| `customer` | existing Stripe customer id | Kept — app creates/reuses customer before session |
| `client_reference_id` | app user id | Kept — webhook user mapping |
| `metadata.userId` | app user id | Kept — webhook user mapping |
| `subscription_data.metadata.userId` | app user id | Kept — subscription webhook mapping |

**Removed (Checkout-Studio-style / superseded):** `customer_update: { address: "auto", name: "auto" }` — billing address collection is now `billing_address_collection: "auto"`.

**Not a Checkout Session call site:** [`app/api/billing/portal/route.ts`](app/api/billing/portal/route.ts) uses `billingPortal.sessions.create` (Customer Portal). Educational snippet in [`app/phase-2/page.tsx`](app/phase-2/page.tsx) is display-only, not executed.

## Setup steps (Preview = Stripe TEST mode)

1. Set Preview env (owner-managed; do not commit secrets):
   - `STRIPE_SECRET_KEY` = `sk_test_…`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_…` (from Stripe CLI or Dashboard webhook for Preview URL)
   - `STRIPE_PRICE_ID` = `price_…` (TEST mode £5/month Premium price)
   - `NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true`
   - `NEXT_PUBLIC_APP_URL` = Preview HTTPS origin
2. Point a TEST-mode webhook at `https://<preview-host>/api/webhooks/stripe` for:
   `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`.
3. Confirm `/api/health/saas` stripe check is `ok` (Preview allows `sk_test_` via `isProductionTarget`).
4. Production keeps `sk_live_` only — never put live keys on Preview.

## Flow overview

1. Authenticated non-demo user hits `POST /api/checkout`.
2. App ensures a Stripe Customer exists, then creates a **hosted** Checkout Session (`ui_mode: hosted_page`, `mode: subscription`).
3. Client redirects to `session.url`.
4. On success, Stripe webhooks update `User` subscription fields and record `StripeWebhookEvent` for idempotency.
5. Success page: `/upgrade/success?session_id=…`.

## Test cards (TEST mode)

| Card | Result |
| --- | --- |
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Decline |
| `4000 0025 0000 3155` | Requires 3D Secure |

Use any future expiry and any CVC. See [Stripe testing docs](https://docs.stripe.com/testing).

## Next steps

- [ ] Owner confirms Preview TEST keys + webhook endpoint are set (not by this PR).
- [ ] Smoke: upgrade → Checkout → webhook → user `PREMIUM`.
- [ ] Optionally enable Stripe Tax / promo codes later by flipping `automatic_tax` / `allow_promotion_codes`.
- [ ] Keep live keys Production-only.

## Resources

- https://support.stripe.com
- https://docs.stripe.com/mcp
