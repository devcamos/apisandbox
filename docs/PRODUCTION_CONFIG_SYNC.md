# Production config sync guide

**Purpose:** Single reference for keeping Vercel, Google Cloud, local `.env`, and CI in sync after auth/DB production incidents (May 2026). Use this when onboarding, opening a PR that touches auth/deploy, or debugging “works locally, fails on Vercel”.

**Related:** [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) · [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) · [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## Canonical production URL

| Environment | URL | Notes |
|-------------|-----|--------|
| Production | `https://apisandbox-coral.vercel.app` | Primary prod alias |
| Local dev | `http://localhost:4000` | `npm run dev` |

Preview URLs change per branch/PR (`https://apisandbox-<hash>-….vercel.app`). Treat each new host as a **Google authorized origin** if testing Google sign-in there.

---

## Required Vercel variables (Production + Preview)

Set in **Vercel Dashboard → Project → Settings → Environment Variables**.

| Variable | Production | Preview | Value / notes |
|----------|------------|---------|----------------|
| `DATABASE_URL` | ✅ | ✅ | `$POSTGRES_PRISMA_URL` (reference, do not paste URL) |
| `AUTH_SECRET` | ✅ | ✅ | `openssl rand -base64 32` |
| `AUTH_JWT_SECRET` | ✅ | ✅ **all branches** | Same generator; required for register/login/Google on preview |
| `NEXTAUTH_SECRET` | ✅ | optional | Same as `AUTH_SECRET` if using NextAuth |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | Server + GSI button; see [GOOGLE_OAUTH_SETUP](./GOOGLE_OAUTH_SETUP.md) |
| `NODE_ENV` | auto | auto | Vercel sets `production` on deploy |

**Preview gotcha:** `AUTH_JWT_SECRET` scoped to a single branch breaks other PR previews. Prefer **Preview → All branches**.

**Do not set** `PRISMA_GENERATE_DATAPROXY=true` for this repo. Build scripts unset it so `prisma generate` uses the **binary engine** with `postgresql://` URLs (see `package.json` `postinstall` / `build`).

---

## Build / Prisma (repo-specific)

| Item | Where | What to know |
|------|--------|----------------|
| Prisma generate | `package.json` | `env -u PRISMA_GENERATE_DATAPROXY prisma generate` |
| Binary targets | `prisma/schema.prisma` | `native`, `rhel-openssl-3.0.x` for Vercel |
| Client | `lib/prisma.ts` | Standard `PrismaClient` (not Data Proxy) |
| Trace includes | `next.config.mjs` | `outputFileTracingIncludes` for Prisma engines |

If prod DB errors mention `prisma://` or Data Proxy, redeploy after confirming the above and `DATABASE_URL=$POSTGRES_PRISMA_URL`.

---

## Auth behaviour (client + middleware)

| Layer | Mechanism |
|-------|-----------|
| API login/register/Google/demo | Sets **httpOnly** cookie `auth_token` + returns JWT in JSON |
| Middleware (`middleware.ts`) | Protects routes using **`auth_token` cookie only** |
| Client session | `localStorage` + `SessionProvider`; fetches use `credentials: "include"` |
| Post-login redirect | `redirectAfterAuth()` → `window.location.assign` so cookie is present before middleware runs (`lib/auth/client-fetch.ts`) |

Symptom “login succeeds but stays on `/login`”: usually cookie not sent on first navigation to `/dashboard` — fixed by full-page redirect + `credentials: "include"`.

---

## Health checks (after deploy)

```bash
# DB
curl -sS "https://apisandbox-coral.vercel.app/api/health/db" | jq .

# Auth config (secrets redacted; shows Google origin hint)
curl -sS "https://apisandbox-coral.vercel.app/api/health/auth" | jq .
```

Use `authorizedJavaScriptOrigin` from `/api/health/auth` when updating Google Cloud **Authorized JavaScript origins**.

Protected previews: `vercel curl https://<preview-host>/api/health/db --deployment <url>`

---

## Local env templates

| File | Use |
|------|-----|
| `config/environments/local.env.example` | Copy via `npm run env:local` → `.env.local` |
| `config/environments/prod.env.example` | Checklist mirror of Vercel prod vars (placeholders only) |

Never commit `.env.local` or real secrets.

---

## Verification commands

| Goal | Command |
|------|---------|
| Full local CI parity | `npm run verify:ci` |
| Auth E2E (local server :4000) | `CI= npx playwright test tests/auth-login-cookie.spec.ts tests/ci-smoke.spec.ts --project=chromium` |
| Staging / prod URL smoke | `STAGING_TEST=1 STAGING_URL=https://apisandbox-coral.vercel.app npx playwright test tests/ci-smoke.spec.ts --project=staging` |
| Prod register + login UI | `PLAYWRIGHT_PROD_URL=https://apisandbox-coral.vercel.app npm run test:prod` |

---

## Config changelog (keep updated in PRs)

When you change deploy/auth behaviour, add a row here and link the PR.

| Date | Change | PR / commit |
|------|--------|-------------|
| 2026-05-25 | Prisma: unset `PRISMA_GENERATE_DATAPROXY` on build; `DATABASE_URL=$POSTGRES_PRISMA_URL` on prod | `05088a4`, `5b801e8` |
| 2026-05-25 | Google: runtime `GOOGLE_CLIENT_ID`, `/api/health/auth`, preview `AUTH_JWT_SECRET` | #15 |
| 2026-05-25 | Login session: `credentials: "include"`, `redirectAfterAuth`, cookie E2E tests | #17 |
| 2026-05-27 | Trunk-based workflow; `v1` release line; auth client refactor (no behavior change) | `v1` / tag `v1.0.0` |

---

## PR checklist (config-only changes)

- [ ] Updated this file **changelog** row if env/build/auth contract changed
- [ ] Updated `config/environments/*.env.example` if new vars added
- [ ] Updated [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) table if Vercel vars changed
- [ ] Google origins documented if new stable host (prod or long-lived preview)
- [ ] Ran `npm run verify:ci` (or targeted Playwright) before push
