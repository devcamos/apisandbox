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

**Settings → Environment Variables** (Production **and** Preview, all branches for `AUTH_JWT_SECRET`).

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_JWT_SECRET` | same generator (required on Preview) |
| `NEXTAUTH_SECRET` | same as `AUTH_SECRET` (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth Web client ID |
| `NEXT_PUBLIC_APP_URL` | canonical site URL |

Optional: `GOOGLE_CLIENT_SECRET`, Stripe, Resend, Upstash, OpenAI/Gemini — see `config/environments/prod.env.example`.

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
PLAYWRIGHT_PROD_URL=https://apisandbox-coral.vercel.app npm run test:prod
```

---

## CI / GitHub

- CI runs on PRs and pushes to `main` (see `.github/workflows/ci.yml`).
- Vercel deploys from Git integration; production on merge to `main`.
- Optional human gate: GitHub Environment `preview` for PR approval (see workflow `preview-deploy-gate`).

---

## Config changelog (update when deploy contract changes)

| Date | Change |
|------|--------|
| 2026-05-27 | Trunk workflow; consolidated deployment doc |
| 2026-05-25 | Prisma binary engine on Vercel; `DATABASE_URL=$POSTGRES_PRISMA_URL` |
| 2026-05-25 | Auth session cookie + `redirectAfterAuth` for middleware |
