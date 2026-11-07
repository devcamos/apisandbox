# Consistent Stripe billing on Preview

Preview deployments use one shared Stripe TEST account and Preview-only database.
New branches inherit the billing baseline; they do not need copied branch secrets.
Production settings and live Stripe resources are separate.

## Vercel baseline

Set these on **Preview / All Git Branches** in the `apisandbox` project:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_FF_STRIPE_CHECKOUT` | `true` |
| `STRIPE_SECRET_KEY` | Stripe TEST secret key (`sk_test_...`), stored encrypted |
| `STRIPE_PRICE_ID` | Active recurring monthly TEST Price |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the shared TEST webhook endpoint |

Keep branch overrides only for intentional experiments. An old branch override
can shadow the baseline. Do not copy Production credentials or database URLs.
Changing Vercel environment variables requires a new Git deployment; existing
deployments retain their build/runtime configuration.

Checkout and portal return URLs allow only exact origins built from Vercel's
trusted `VERCEL_BRANCH_URL` and `VERCEL_URL` in Preview. The active request origin
may select either exact match; an arbitrary Host header cannot choose a return
URL. Otherwise the branch origin is preferred, falling back to the deployment
origin. A shared `NEXT_PUBLIC_APP_URL` cannot redirect users to another branch. Production uses its configured
canonical `NEXT_PUBLIC_APP_URL`. Checkout idempotency includes the origin, so two
branches cannot reuse a session containing each other's return URLs.

Preview fails readiness if checkout is disabled or its key is not test-mode.
The Stripe client independently rejects live keys on Preview.

## Shared webhook ingress

Stripe needs a stable HTTPS webhook URL that is reachable without Vercel sign-in.
Register `/api/webhooks/stripe` on a dedicated Preview webhook alias, using the
same TEST account and database as the branch deployments. Enable these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

The shared database maps Stripe customer/subscription metadata to each learner.
The webhook ledger deduplicates events. All application/webhook code paths retain
signature verification and app authentication; do not expose signing secrets in
URLs or disable protection on the whole Vercel project.

Provision the dedicated alias with explicit owner approval and keep it assigned
to a reviewed Preview revision. Repoint the Stripe TEST endpoint, retaining its
signer, or rotate the shared Preview signing secret when creating a new endpoint.
Verify an unauthenticated webhook GET returns 405 and an unsigned POST returns
400 rather than Vercel login. Then verify actual Stripe event delivery.

This shared ingress assumes a shared Preview database and compatible schema.
Database-per-branch experiments require their own event routing; do not apply the
shared setup to isolated databases without adapting it.

### Preview database cutovers (Neon / shared DB)

Checkout and learner registration run on the branch Preview URL. Stripe delivers
events to the shared alias (`apisandbox-billing-preview.vercel.app`). Those two
hosts must resolve to a deployment that uses the **same** Preview database.

After changing Preview `DATABASE_URL` / `DIRECT_URL` (for example the 2026-11-07
cutover to isolated Neon project `apisandbox-preview`):

1. Redeploy a reviewed Preview Git revision that already has the new Preview env.
2. Assign `apisandbox-billing-preview.vercel.app` to **that** deployment (Vercel →
   Deployments → … → Assign Domain / alias). Keep the existing Stripe TEST
   endpoint URL and signing secret unless you intentionally rotate them.
3. Confirm unauthenticated `GET /api/webhooks/stripe` → `405` and unsigned
   `POST` → `400` on the alias.
4. Confirm `GET /api/health/saas` on both the branch Preview and the alias report
   the same non-secret `data.deployment.deploymentId` (and matching `gitSha`).
5. Re-run hosted Preview billing E2E. Do not treat database/auth health alone as
   proof that entitlements work.

If hosted Checkout returns to `/upgrade/success` with a `cs_test_` session but
`/api/auth/me` stays `FREE`, the usual cause is a stale alias still writing an
older Preview database — not a need to disable Deployment Protection or weaken
the E2E.

## Automated E2E

The deployed-URL workflow checks out the exact deployment SHA and runs
`npm run test:prod`. The runner includes `test:preview:billing` only when
`DEPLOYMENT_ENVIRONMENT=preview`; Production remains outside payment tests.

The Preview billing suite checks deployed readiness and environment, then probes
the shared webhook ingress without any Vercel bypass credentials before creating
users or test payments. Its default ingress is
`https://apisandbox-billing-preview.vercel.app/api/webhooks/stripe`; override with
`PREVIEW_STRIPE_WEBHOOK_URL` for a deliberately different setup. Before registration
it also compares non-secret `data.deployment` from `/api/health/saas` on the branch
Preview and on the shared ingress origin, failing fast when the alias still points
at another deployment. It then registers a disposable FREE learner, opens a real
`cs_test_` hosted Checkout session, submits Stripe's `4242` test card, verifies the
return to the same branch, and polls for PREMIUM after Stripe's real webhook. No app
checkout stub or synthesized webhook is used by this acceptance test. Traces,
screenshots and videos are disabled, and Vercel bypass headers are stripped before
external requests.

Run against each of two branch origins:

```bash
DEPLOYMENT_ENVIRONMENT=preview \
PLAYWRIGHT_PROD_URL=https://your-preview.vercel.app \
npm run test:preview:billing
```

Use the existing `VERCEL_AUTOMATION_BYPASS_SECRET` environment binding when
Deployment Protection requires it. Never paste it into a command or commit it.
The acceptance test needs no Stripe API/signing keys in CI.

Test payments create TEST subscriptions and disposable `preview-paid-*` learners.
Clean up test subscriptions/customers in Stripe TEST mode after verification;
keep test fixtures out of Production.

An optional richer diagnostic (`PREVIEW_BILLING_SIGNED_DIAGNOSTIC=1`) uses dedicated
Node-only `PREVIEW_STRIPE_TEST_SECRET_KEY` and
`PREVIEW_STRIPE_TEST_WEBHOOK_SECRET` bindings to inspect session fields and test
signature/replay behavior. Its simulated event is not proof of payment delivery.

## Completion evidence

Record both branch names, deployed SHAs, URLs, E2E run links, test-mode Checkout
session IDs, webhook delivery result, and resulting PREMIUM tier. A healthy
database/auth probe alone does not demonstrate that premium upgrades work.
