# Agent onboarding — API Sandbox

**User story:** As a development agent, I want to onboard quickly so I can run the app, know where work and URLs live, follow repo conventions, and verify changes before shipping.

This page is for **any** automated or human developer working in this repository (Cursor Agent, Codex, Copilot, contractors, etc.). Read it once per engagement; use the linked docs for depth.

---

## Read first (order)

| Step | Document | Why |
|------|----------|-----|
| 1 | **This file** | Fast path: setup, verification, behaviour. |
| 2 | [Agent workspace map](AGENT_WORKSPACES.md) | GitHub, Vercel, SonarCloud, **Notion page URLs**, app routes, Notion `?v=` rules for MCP. |
| 3 | [Feature and backlog management](FEATURE_MANAGEMENT.md) | Hub vs tracker, status workflow, Notion fields, process. |

---

## Repository in one sentence

**API Sandbox** is a **Next.js (App Router)** app for interactive API learning: phases, demos, auth, subscriptions (Stripe), and PostgreSQL via **Prisma**. Primary code: `app/`, `lib/`, `components/`, `config/`.

---

## Quick setup (local)

Do these in order unless you already have Postgres and `.env.local`.

1. **Clone and install**

   ```bash
   git clone https://github.com/devcamos/apisandbox.git
   cd apisandbox
   npm install
   ```

   `postinstall` runs `prisma generate`.

2. **Environment file**

   ```bash
   npm run env:local
   ```

   Edit **`.env.local`**: at minimum **`DATABASE_URL`** must point at a running Postgres instance. The template defaults to Docker on **`localhost:5435`** (see `config/environments/local.env.example`).

3. **Database (Docker — recommended)**

   ```bash
   npm run dev:db:up
   npm run db:migrate
   npm run db:ensure-test-users
   ```

   Default local test users are documented in [Test users](TEST_USERS.md).

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open **`http://localhost:4000`**.

**One-shot alternative:** `npm run local-lite` orchestrates env, Docker (when configured), migrations, test users, and dev server — see script comments if it fails on your machine.

---

## Where work is tracked

All backlog rules, statuses, and fields are in **[Feature and backlog management](FEATURE_MANAGEMENT.md)** (hub vs tracker, workflow, what to avoid duplicating).

**MCP / Codex:** database tools need Notion **view** URLs with **`?v=`** — see [Agent workspace map](AGENT_WORKSPACES.md).

---

## How to verify a change

Run what applies to your edit (smallest useful subset):

| Check | Command |
|-------|---------|
| TypeScript | `npx tsc --noEmit` |
| ESLint | `npm run lint` |
| Unit tests | `npm run test:unit` |
| E2E (heavier) | `npm run test` or `npm run test:ci:chromium` |

CI also runs Playwright, coverage expectations, and **SonarCloud** on the analysed scope. Project: **`devcamos_apisandbox`**, org **`devcamos`** — links in [AGENT_WORKSPACES](AGENT_WORKSPACES.md).

---

## Conventions (stay merge-ready)

- **Scope:** Change only what the task requires; match existing patterns (imports, naming, file layout).
- **Secrets:** Never commit `.env.local` or real tokens. Use `*.example` files and Vercel/GitHub secrets for production.
- **Auth / billing:** Sensitive flows live under `app/api/`, `lib/services/`, and middleware — read neighbouring routes before editing.
- **Docs:** Prefer updating this onboarding or [AGENT_WORKSPACES](AGENT_WORKSPACES.md) when you add a new external system agents must know about.

---

## Deeper reference (as needed)

| Topic | Doc |
|-------|-----|
| Dev workflows, diagrams | [DEV_SETUP](DEV_SETUP.md) |
| Architecture | [ARCHITECTURE](ARCHITECTURE.md), `/docs/architecture` in app |
| CI / Vercel / GitHub | [CI_CD_GITHUB_VERCEL](CI_CD_GITHUB_VERCEL.md) |
| Env vars (Vercel) | [VERCEL_ENV_VARIABLES](VERCEL_ENV_VARIABLES.md) |
| Sonar quality gate | [SONAR_QUALITY_GATE](SONAR_QUALITY_GATE.md) |
| Demo login / test users | [TEST_USERS](TEST_USERS.md) |
| Branching | [GITFLOW](GITFLOW.md) |
| Backlog, status review, Notion workflow | [Feature and backlog management](FEATURE_MANAGEMENT.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-07 | Initial agent onboarding (story, setup order, verification, Notion, conventions). |
| 2026-05-07 | “Where work is tracked” defers to FEATURE_MANAGEMENT for backlog/workflow. |
| 2026-05-07 | Deeper reference row for backlog / status review doc. |
