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
| Deployed app assistant | Vercel environment variable for its configured provider |

The PR reviewer uses the Gemini Developer API free tier with `gemini-2.5-flash` by default. Create a key in Google AI Studio, then add it under repository **Settings → Secrets and variables → Actions → Repository secrets** as `GEMINI_API_KEY`. The optional repository variable `GEMINI_REVIEW_MODEL` overrides the model.

The Gemini free tier has project-level limits and may use submitted content to improve Google's products. The workflow sends repository diffs and diagnostic output, so it must never collect or transmit credentials or private runtime data.

For the app in Preview, add `OPENAI_API_KEY` in the `apisandbox` Vercel project, select **Preview** for the environment, and apply it to all preview branches unless branch isolation is intentional. Keep it server-only: never name it `NEXT_PUBLIC_OPENAI_API_KEY`.

The equivalent interactive command is:

```bash
npx vercel env add OPENAI_API_KEY preview --sensitive --scope devonte-amos-projects
```

Enter the key only at the secure prompt. After adding or changing it, redeploy the Preview deployment; existing deployments do not receive new environment-variable values.

The GitHub `GEMINI_API_KEY` secret does not populate Vercel, and a Vercel environment variable does not populate GitHub Actions. Configure Production and Development separately if those environments also need the assistant.

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

### Neon preview branch capacity

Vercel previews provision a Neon `preview/<git-branch>` before the application build. If Neon reaches its branch limit, Vercel fails immediately with `Resource provisioning failed` and no build logs. See [KNOWN_ERRORS.md](./KNOWN_ERRORS.md#vercel-preview-fails-before-build-neon-branch-limit) and run `npm run neon:branches:cleanup` to review an obsolete-branch cleanup plan. The repository policy retains no more than five total Neon branches.

---

## Config changelog (update when deploy contract changes)

| Date | Change |
|------|--------|
| 2026-06-29 | Stripe production hardening: live-key validation, webhook idempotency ledger, status-driven entitlement reconciliation, and duplicate-subscription prevention |
| 2026-06-29 | Switched PR Architecture Intelligence from OpenAI to the Gemini Developer API free tier |
| 2026-06-29 | Documented environment-specific test users and separate OpenAI secret locations for GitHub Actions and Vercel Preview |
| 2026-06-28 | Documented Neon preview branch capacity and added safe cleanup command (maximum five branches) |
| 2026-05-27 | Trunk workflow; consolidated deployment doc |
| 2026-05-25 | Prisma binary engine on Vercel; `DATABASE_URL=$POSTGRES_PRISMA_URL` |
| 2026-05-25 | Auth session cookie + `redirectAfterAuth` for middleware |
