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

**Settings → Environment Variables** (Production **and** Preview).

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_JWT_SECRET` | same generator (required on Preview) |
| `NEXTAUTH_SECRET` | same as `AUTH_SECRET` (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth Web client ID |
| `NEXT_PUBLIC_APP_URL` | canonical site URL |

**Preview pitfall:** If `AUTH_JWT_SECRET` is scoped to a single Git branch (e.g. `fix/foo` only), other PR previews will show *Sign-in is not configured*. Prefer **Preview → all branches**, or add the secret per branch. After changing env vars, **redeploy** the preview (Vercel → Deployments → Redeploy).

```bash
curl -sS "https://<preview-host>/api/health/auth" | jq '.data.jwtSecretConfigured'
# expect: true
```

Optional: `GOOGLE_CLIENT_SECRET`, Stripe, Resend, Upstash, OpenAI/Gemini — see `config/environments/prod.env.example`.

### AI API keys

There are two separate consumers with separate secret stores:

| Consumer | Secret location |
|----------|-----------------|
| PR Architecture Intelligence workflow | GitHub repository secret `GEMINI_API_KEY` |
| Deployed app assistant (Preview / local only) | Vercel **Preview** (and Development) environment variables for the configured provider |

The PR reviewer uses the Gemini Developer API free tier with `gemini-2.5-flash` by default. Create a key in Google AI Studio, then add it under repository **Settings → Secrets and variables → Actions → Repository secrets** as `GEMINI_API_KEY`. The optional repository variable `GEMINI_REVIEW_MODEL` overrides the model.

The Gemini free tier has project-level limits and may use submitted content to improve Google's products. The workflow sends repository diffs and diagnostic output, so it must never collect or transmit credentials or private runtime data.

The in-app learning assistant is **Preview / local Development only**. `isAssistantEnabled()` returns false when `VERCEL_ENV=production`; Production builds omit the widget and `POST /api/assistant` responds with `404`. On Preview, Premium sign-in is still required. Add `OPENAI_API_KEY` and/or `GEMINI_API_KEY` in the `apisandbox` Vercel project for **Preview** (and optional Development). Keep them server-only: never name them `NEXT_PUBLIC_*`. Do not rely on Production Vercel env for the assistant.

The equivalent interactive command for Preview is:

```bash
npx vercel env add OPENAI_API_KEY preview --sensitive --scope devonte-amos-projects
```

Enter the key only at the secure prompt. After adding or changing it, redeploy the Preview deployment; existing deployments do not receive new environment-variable values.

The GitHub `GEMINI_API_KEY` secret does not populate Vercel, and a Vercel environment variable does not populate GitHub Actions.

**Do not set** `PRISMA_GENERATE_DATAPROXY=true`. Builds use `env -u PRISMA_GENERATE_DATAPROXY prisma generate` (binary engine + `postgresql://`).

---

## Prisma on Vercel

| Item | Location |
|------|----------|
| Generate | `package.json` `postinstall` / `build` |
| Binary targets | `prisma/schema.prisma` — `native`, `rhel-openssl-3.0.x` |
| Client | `lib/prisma.ts` — standard `PrismaClient` |
| Build migrate gate | `scripts/migrate-on-production.mjs` via `npm run db:migrate:deploy:vercel` |

`vercel.json` runs `npm run db:migrate:deploy:vercel && npm run build`. That helper
runs migrations **only when** `VERCEL_ENV=production` (or as a
fail-safe when `VERCEL` is set but `VERCEL_ENV` is missing/unrecognized). Preview
and Development builds skip migrations and log a clear skip reason, so an
unreachable Preview database cannot fail the build step.

Production migrate invokes `bash scripts/prisma-migrate-deploy.sh` (via
`ensureDirectUrlEnv`): if `DIRECT_URL` is unset it reuses `DATABASE_URL`, matching
the Prisma schema `directUrl` requirement without requiring a new Vercel secret.

| Vercel environment | `VERCEL_ENV` | Migrations at build |
|--------------------|--------------|---------------------|
| Production | `production` | Yes — `prisma migrate deploy` |
| Preview | `preview` | No — migrate the Preview DB manually when needed |
| Development | `development` | No |
| On Vercel, env unset/unknown | (empty / other) | Yes — fail-safe (prefer migrate over shipping unmigrated) |

**Production** uses Neon (via Vercel Postgres / `DATABASE_URL`). **Preview** uses a
separate Preview-scoped Postgres (currently a Supabase project). Never point Preview
at Production.

When the Preview schema needs updating and the Preview DB is reachable:

```bash
# With Preview DATABASE_URL (and optional DIRECT_URL) in the environment:
npm run db:migrate:deploy
```

`next build` does not query the database: Prisma is used from API routes / auth at
runtime. Creating `PrismaClient` at module load does not open a connection until the
first query, so a healthy Preview build can succeed even when the Preview DB is down;
runtime routes that hit the DB will still fail until the Preview DB is restored.

Use `db push` only for local development or intentionally disposable databases.

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
- Vercel `vercel.deployment.ready` repository-dispatch events run `.github/workflows/vercel-e2e.yml` against the exact deployed SHA and URL.
- Preview E2E verifies database/auth health, then registers a disposable test user, signs in, and opens the dashboard with Playwright. Production deployments run read-only database/auth health checks and do not create a test account.
- If Preview Deployment Protection is enabled, create a Protection Bypass for Automation and store the same value as the GitHub Actions secret `VERCEL_AUTOMATION_BYPASS_SECRET`.

The repository-dispatch workflow must exist on `main`. In Vercel project Git settings, enable repository-dispatch deployment events. Optionally select `Vercel - API Sandbox E2E (preview)` and `Vercel - API Sandbox E2E (production)` as Vercel Deployment Checks. The environment suffix keeps Preview and Production statuses for the same commit independent.

### Neon branch capacity (Production / historical preview branches)

Production uses Neon. If a Neon/Vercel integration still tries to provision
`preview/<git-branch>` branches and Neon hits its branch limit, Vercel can fail
before the application build with `Resource provisioning failed`. See
[KNOWN_ERRORS.md](./KNOWN_ERRORS.md#vercel-preview-fails-before-build-neon-branch-limit)
and run `npm run neon:branches:cleanup` to review an obsolete-branch cleanup plan.
The repository policy retains no more than five total Neon branches.

Preview application data is configured via Preview-scoped `DATABASE_URL` (separate
from Production Neon). Preview builds skip `migrate deploy`; apply schema changes
manually against that Preview database when it is reachable.

---

## Config changelog (update when deploy contract changes)

| Date | Change |
|------|--------|
| 2026-08-10 | Added deployed-URL E2E for Vercel repository-dispatch events, including Preview database/auth checks and Playwright registration/login coverage |
| 2026-09-27 | Vercel build runs `prisma migrate deploy` only for Production (`db:migrate:deploy:vercel`); Preview skips migrate so unreachable Preview DB cannot fail the build |
| 2026-06-29 | Stripe production hardening: live-key validation, webhook idempotency ledger, status-driven entitlement reconciliation, and duplicate-subscription prevention |
| 2026-10-03 | Learning assistant gated to Preview/local only (`isAssistantEnabled`); Production returns 404 and omits the widget. PR Architecture Intelligence remains on Gemini. |
| 2026-06-29 | Switched PR Architecture Intelligence from OpenAI to the Gemini Developer API free tier |
| 2026-06-29 | Documented environment-specific test users and separate OpenAI secret locations for GitHub Actions and Vercel Preview |
| 2026-06-28 | Documented Neon preview branch capacity and added safe cleanup command (maximum five branches) |
| 2026-05-27 | Trunk workflow; consolidated deployment doc |
| 2026-05-25 | Prisma binary engine on Vercel; `DATABASE_URL=$POSTGRES_PRISMA_URL` |
| 2026-05-25 | Auth session cookie + `redirectAfterAuth` for middleware |
