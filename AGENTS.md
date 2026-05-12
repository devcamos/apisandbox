# AGENTS.md

## Cursor Cloud specific instructions

### Product Overview

API Integration Training Platform — a Next.js 16 educational app for learning API integrations. Runs on port 4000. Uses PostgreSQL (via Docker on port 5435), Prisma ORM, NextAuth.js v5 for auth.

### Running Services

| Service | Command | Notes |
|---------|---------|-------|
| PostgreSQL | `npm run dev:db:up` | Docker container on port 5435 |
| Next.js dev | `npm run dev` | Runs on port 4000. Requires `.env.local` and env vars sourced. |
| All-in-one | `npm run local-lite` | Starts DB + migrations + dev server (interactive, checks port 4000 free) |

### Key Development Commands

- **Lint**: `npm run lint`
- **Unit tests**: `npm run test:unit` (Vitest, 57 tests)
- **E2E tests**: `npx playwright test tests/ci-smoke.spec.ts --project=chromium` (smoke subset)
- **Full E2E**: `npx playwright test --project=chromium` (note: `tests/unit/` files error if Playwright tries to load them; stick to `.spec.ts` patterns or specific test files)
- **DB Studio**: `npm run db:studio`

### Environment Setup Gotchas

1. **Migration lock mismatch**: The repo's `prisma/migrations/migration_lock.toml` says `sqlite` but `prisma/schema.prisma` targets PostgreSQL. Use `npx prisma db push` instead of `npx prisma migrate deploy` to initialize the dev database schema.

2. **Env vars must be sourced**: Prisma CLI and the seed script require `DATABASE_URL` in the environment. Before running Prisma or seed commands outside of `local-lite`, source the env file: `set -a && source .env.local && set +a`.

3. **Docker permissions**: After installing Docker in the cloud VM, run `sudo chmod 666 /var/run/docker.sock` to allow non-root access.

4. **Feature flags**: All optional services (Stripe, Upstash Redis, Resend, Analytics) are disabled by default via feature flags in `.env.local`. The app runs fully without them.

5. **Test users**: `node scripts/ensure-test-users.js` creates users only when the DB is empty. Credentials: `test@example.com` / `Test1234!@#$` and `qa@example.com` / `QaTest1234!@#$`.

6. **Playwright**: Only Chromium is installed in the cloud VM. Run E2E tests with `--project=chromium`. Avoid running without a project filter as Firefox/WebKit are not available.
