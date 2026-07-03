# Agent onboarding — API Sandbox

**For:** Human developers and coding agents (Cursor, Codex, etc.).

**API Sandbox** is a **Next.js (App Router)** learning app: phases, auth, Stripe subscriptions, PostgreSQL via **Prisma**. Code: `app/`, `lib/`, `components/`, `config/`.

---

## Read first

1. This file — setup and verification  
2. [CI_PIPELINE.md](./CI_PIPELINE.md) — PR job ↔ local command map  
3. `.cursor/rules/` — green builds, auth/subscription conventions  
3. [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md) — before every PR  
4. [DEPLOYMENT.md](./DEPLOYMENT.md) — only if you touch auth, env, or deploy (Preview vs Production: `config/environments/`)  
5. [SAAS.md](./SAAS.md) — production billing flags, Stripe, rate limits  
6. [STRIPE_LOCAL.md](./STRIPE_LOCAL.md) — real Checkout + webhooks on localhost  

---

## Quick setup (local)

```bash
git clone https://github.com/devcamos/apisandbox.git
cd apisandbox
npm install
npm run env:local          # → .env.local
npm run dev:db:up
npm run db:migrate         # or: npx prisma db push if migrate lock issues
npm run db:ensure-test-users
npm run dev                # http://localhost:4000
```

**One shot:** `npm run local-lite`

**Test users:** [TEST_USERS.md](./TEST_USERS.md)

### Local gotchas

- **Prisma:** If `migrate deploy` fails (lock provider mismatch), use `npx prisma db push` for dev only.
- **Env:** Source `.env.local` before CLI: `set -a && source .env.local && set +a`
- **Port:** App uses **4000**; stop other dev servers before `npm run verify:ci`
- **Feature flags:** Stripe, Redis, email, analytics off by default in `.env.local` — app runs without them
- **Architecture diagrams:** Browser only → `http://localhost:4000/docs/architecture` (not a repo markdown file)
- **Mobile layout tests (optional):** `npx playwright test tests/mobile-layout.spec.ts --project="Mobile Chrome"` — not in `verify:ci`

---

## Project links

| System | URL / key |
|--------|-----------|
| GitHub | https://github.com/devcamos/apisandbox |
| Vercel | https://vercel.com/dashboard (project linked to repo) |
| SonarCloud | https://sonarcloud.io/project/overview?id=devcamos_apisandbox (`devcamos_apisandbox`) |
| Production app | https://apisandbox-coral.vercel.app |

**Backlog / specs:** Notion (team workspace — ask for hub + work tracker links).

---

## Verify before PR

```bash
npm run verify:ci:strict
```

Mirrors CI: lint, build, unit tests + coverage, compose validate, audit (critical), e2e smoke (Docker Postgres on **5436**).

| Area | Extra command |
|------|----------------|
| Auth | `CI=1 npx playwright test tests/unified-auth.spec.ts --project=chromium` |
| Login cookie | `CI= npx playwright test tests/auth-login-cookie.spec.ts --project=chromium` |

After push: `gh pr checks --watch` (includes **SonarQube Cloud**). Optional: `npm run sonar:status` with `SONAR_TOKEN` in `.env.local`.

**Branching:** [GITFLOW.md](./GITFLOW.md) — trunk is `main`; short-lived feature branches; tag releases on `v1` line.

---

## Conventions

- Minimal diffs; match existing patterns.
- Never commit `.env.local` or secrets.
- New users: `createUserWithInitialData` with `subscriptionTier: "FREE"` (see `.cursor/rules/auth-subscription.mdc`).
- Deploy/env changes: update [DEPLOYMENT.md](./DEPLOYMENT.md) changelog.

---

## Doc index

See [docs/README.md](./README.md).
