# Deployment and environment

For Vercel production/preview and “works locally, fails on deploy” debugging.

---

## URLs

| Environment | URL |
|-------------|-----|
| Production | `https://apisandbox-coral.vercel.app` |
| Local | `http://localhost:4000` (`npm run dev`) |

Preview hosts change per PR (`https://apisandbox-<hash>-….vercel.app`). Each host used for Google sign-in must be added in Google Cloud.

---

## Required Vercel variables

Set variables per **environment scope** in Vercel → Settings → Environment Variables:

| Scope | Template |
|-------|----------|
| **Preview** (all branches) | [`config/environments/preview.env.example`](../config/environments/preview.env.example) |
| **Production** | [`config/environments/prod.env.example`](../config/environments/prod.env.example) |

### Shared minimum (Preview and Production)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_JWT_SECRET` | same generator (**required on Preview — all branches**) |
| `NEXTAUTH_SECRET` | same as `AUTH_SECRET` (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth Web client ID |
| `NEXT_PUBLIC_APP_URL` | canonical URL for that environment |

**Preview pitfall:** If `AUTH_JWT_SECRET` is scoped to a single Git branch (e.g. `fix/foo` only), other PR previews will show *Sign-in is not configured*. Prefer **Preview → all branches**, or add the secret per branch. After changing env vars, **redeploy** the preview (Vercel → Deployments → Redeploy).

```bash
curl -sS "https://<preview-host>/api/health/auth" | jq '.data.jwtSecretConfigured'
# expect: true
```

Optional: `GOOGLE_CLIENT_SECRET`, Stripe, Resend, Upstash, OpenAI/Gemini — see the scoped templates above.

### Preview vs Production differences

| Concern | Preview | Production |
|---------|---------|------------|
| Stripe keys | `sk_test_...` (Test mode) | `sk_live_...` (Live mode) |
| Feature flags | Start conservative — see `preview.env.example` | Full SaaS — see `prod.env.example` |
| Test users | Sign up on preview or demo flow — [TEST_USERS.md](./TEST_USERS.md) | Real accounts only |
| `NEXT_PUBLIC_APP_URL` | Per-preview host (changes each deployment) | Stable production domain |

### AI API keys (separate stores)

| Consumer | Secret location |
|----------|-----------------|
| PR Architecture Intelligence workflow | GitHub repository secret `GEMINI_API_KEY` |
| Deployed app assistant | Vercel env var (`OPENAI_API_KEY` or `GEMINI_API_KEY`) — **Preview** or **Production** scope |

For the app assistant on Preview, add `OPENAI_API_KEY` under Vercel **Preview** → all branches. Keep it server-only (never `NEXT_PUBLIC_*`). Redeploy after changing env vars.

GitHub `GEMINI_API_KEY` does **not** populate Vercel, and Vercel vars do **not** populate GitHub Actions.

**Do not set** `PRISMA_GENERATE_DATAPROXY=true`. Builds use `env -u PRISMA_GENERATE_DATAPROXY prisma generate` (binary engine + `postgresql://`).

---

## Prisma on Vercel

| Item | Location |
|------|----------|
| Generate | `package.json` `postinstall` / `build` |
| Binary targets | `prisma/schema.prisma` — `native`, `rhel-openssl-3.0.x` |
| Client | `lib/prisma.ts` — standard `PrismaClient` |

After first deploy: `npx prisma migrate deploy` (or `db push` in non-prod) against the linked database.

---

## Google Sign-In (GSI)

Uses **Google Identity Services** (ID token), not redirect OAuth.

1. [Google Cloud Console](https://console.cloud.google.com/) → Credentials → OAuth Web client.
2. **Authorized JavaScript origins** — add every browser origin (no path), e.g. production URL, `http://localhost:4000`, and each preview host you test.
3. Set `GOOGLE_CLIENT_ID` on Vercel (server runtime is enough for the button).

Check live host:

```bash
curl -sS "https://<your-host>/api/health/auth" | jq .data.authorizedJavaScriptOrigin
```

---

## Post-deploy smoke

```bash
curl -sS "https://apisandbox-coral.vercel.app/api/health/db" | jq .
curl -sS "https://apisandbox-coral.vercel.app/api/health/auth" | jq .
curl -sS "https://apisandbox-coral.vercel.app/api/health/saas" | jq .
PLAYWRIGHT_PROD_URL=https://apisandbox-coral.vercel.app npm run test:prod
```

SaaS billing and feature-flag checklist: [SAAS.md](./SAAS.md). Flag reference: [FEATURE_FLAGS.md](./FEATURE_FLAGS.md).

---

## CI / GitHub

- CI runs on PRs and pushes to `main` (see `.github/workflows/ci.yml`).
- Vercel deploys from Git integration; production on merge to `main`.
- Optional human gate: GitHub Environment `preview` for PR approval (see workflow `preview-deploy-gate`).

---

## Config changelog (update when deploy contract changes)

| Date | Change |
|------|--------|
| 2026-07-03 | Preview/production env split: `preview.env.example`, scoped DEPLOYMENT + TEST_USERS docs |
| 2026-06-29 | Stripe production hardening: live-key validation, webhook idempotency ledger, status-driven entitlement reconciliation, and duplicate-subscription prevention |
| 2026-05-27 | Trunk workflow; consolidated deployment doc |
| 2026-05-25 | Prisma binary engine on Vercel; `DATABASE_URL=$POSTGRES_PRISMA_URL` |
| 2026-05-25 | Auth session cookie + `redirectAfterAuth` for middleware |
