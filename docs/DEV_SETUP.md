# Developer Setup Guide

This guide is the quickest way to get productive in the app as a developer.

## What this app is

`apisandbox` is a Next.js training platform for API integration topics. It combines:

- public marketing and onboarding pages
- gated learning content for multiple phases
- interactive demos for auth, retry, circuit breaker, and cloud topics
- authentication and subscription logic
- a Prisma-backed data layer
- Playwright coverage for browser and API flows

## Core stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth
- Playwright

## First-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment config

```bash
npm run env:local
```

This copies the local template into `.env.local`. Fill in the values you need before starting the app.

### 3. Start PostgreSQL

Recommended:

```bash
npm run db:up
```

If you prefer a local Postgres install, point `DATABASE_URL` in `.env.local` at that database instead.

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start the app

```bash
npm run dev
```

The web app runs on `http://localhost:4000`.

## Important routes

- `/` landing page
- `/dashboard` learning hub
- `/phase-0` through `/phase-4` learning content
- `/cloud` cloud and migration content
- `/ai` AI-related content
- `/docs/architecture` in-app architecture viewer
- `/login` and `/signup` authentication entry points

## Repo areas that matter most

| Path | Purpose |
| --- | --- |
| `app/` | App Router pages and API routes |
| `components/` | Shared UI and interactive demos |
| `lib/` | Auth, Prisma, rate limiting, metrics, and subscription helpers |
| `config/` | Environment and feature-flag behavior |
| `prisma/` | Prisma schema and migrations |
| `tests/` | Playwright coverage |
| `docs/` | Architecture, workflow, and setup documentation |
| `mobile/` | Separate mobile client experiments |

## Developer workflow

Use the branch model in [GITFLOW.md](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/GITFLOW.md):

1. Branch from `staging`
2. Keep changes on a short-lived feature branch
3. Open PRs into `staging`
4. Merge to `main` only from `staging`

Typical flow:

```bash
git checkout staging
git pull origin staging
git checkout -b codex/your-change
```

## Testing and verification

### Type checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

If `next lint` behaves unexpectedly after framework upgrades, verify the local Next.js lint command and repo config before assuming your code is the issue.

### Playwright

```bash
npm test
```

Helpful variants:

```bash
npm run test:ui
npm run test:headed
npm run test:debug
npm run test:coverage
```

### Staging smoke tests

```bash
npm run staging:up
npm run test:staging
npm run staging:down
```

## Architecture docs

You can view the diagrams in either place:

- browser: `http://localhost:4000/docs/architecture`
- source: [`docs/ARCHITECTURE.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/ARCHITECTURE.md)

## Troubleshooting

### App fails to boot

- confirm `.env.local` exists
- confirm Postgres is reachable
- confirm Prisma migrations have run

### Auth behaves differently between environments

- check values in `.env.local`
- compare with [`config/environments/local.env.example`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/config/environments/local.env.example)
- review auth behavior in [`lib/auth-config.ts`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/lib/auth-config.ts)

### Staging behavior differs from local dev

- compare feature flags in [`config/featureFlags.ts`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/config/featureFlags.ts)
- run the staging stack locally with `npm run staging:up`

### Generated test artifacts clutter the repo

These are safe to clean when they are not needed:

```bash
rm -rf test-results playwright-report
```

## Recommended developer checklist

Before opening a PR:

1. Run `npx tsc --noEmit`
2. Run the most relevant Playwright test slice for your change
3. Confirm you are branching from `staging`
4. Update docs when behavior or workflow changes
