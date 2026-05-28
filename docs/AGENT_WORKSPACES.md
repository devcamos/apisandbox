# Agent workspace map — API Sandbox

**New to this repo?** Start with **[Agent onboarding](AGENT_ONBOARDING.md)** — quick local setup, where work lives, verification commands, and merge conventions.

This file is the **canonical URL and integration map** for humans and automated agents (Cursor, Codex, CI bots, etc.): **where** the project lives (GitHub, Vercel, Sonar, Notion, app routes) and **which URL shapes** (e.g. Notion `?v=`) tools require. Update it when you add databases, boards, or new third-party projects.

---

## GitHub

| Item | Value |
|------|--------|
| Repository | `https://github.com/devcamos/apisandbox` |
| Default branch | `main` (confirm in repo settings if unsure) |

Further reading: [CI/CD and Vercel](CI_CD_GITHUB_VERCEL.md), [Trunk + v1 branching](GITFLOW.md), [Engineering principles](ENGINEERING_PRINCIPLES.md).

---

## Vercel

| Item | Value |
|------|--------|
| Dashboard | `https://vercel.com/dashboard` — import or locate the project linked to `devcamos/apisandbox` |

Further reading: [Vercel deployment](VERCEL_DEPLOYMENT.md), [Environment variables](VERCEL_ENV_VARIABLES.md).

---

## SonarCloud (quality gate)

| Item | Value |
|------|--------|
| Organization | `devcamos` |
| Project key | `devcamos_apisandbox` |
| Project overview | `https://sonarcloud.io/project/overview?id=devcamos_apisandbox` |
| Project configuration | `https://sonarcloud.io/project/configuration?id=devcamos_apisandbox` |

Source of truth in repo: `sonar-project.properties`. Further reading: [Sonar quality gate](SONAR_QUALITY_GATE.md).

---

## Notion (tasks, specs, knowledge)

**Backlog fields, status workflow, and hub vs tracker:** [Feature and backlog management](FEATURE_MANAGEMENT.md).

### Notion pages (navigation — use in browser)

These are the **actual workspace pages** referenced from this repo (same as `FEATURE_MANAGEMENT.md`):

| Purpose | URL |
|---------|-----|
| Repo hub | `https://www.notion.so/3417233a96ec81ddbae4dcd29a68b775` |
| Work tracker | `https://www.notion.so/6ea1b2867262468fbb15da5984602d5b` |

Use these for humans opening Notion from docs. They are **page** links; they may or may not include `?v=` depending on Notion’s link format.

### Notion database views (MCP / Codex / automation)

Many Notion MCP tools and Codex-style flows need a **database view URL** with a **view id**, not only a page or bare database id.

**Required shape:**

```text
https://www.notion.so/<workspace-slug>/<page-title-or-id>?v=<view_id>
```

The `v=` segment identifies the **table / board / list / calendar view** (columns, filters, and sorts are view-scoped). URLs **without** `?v=...` often fail for tools that target a specific view.

**Incorrect (typical failure for DB tools):**

```text
https://www.notion.so/0fc46b2f7d8e4b43b11222a8051ce7a8
```

**Correct for automation:** open the database as a full page, select the desired view tab, then **⋯** → **Copy link to view** so the URL includes `?v=`.

### Canonical Notion **view** URLs (for MCP / Codex)

Use these with `notion-query-database-view` (and similar tools). Resolved from the live **API Sandbox Work Tracker** database.

| Purpose | Notion view URL (includes `?v=`) |
|---------|----------------------------------|
| Work tracker — **Default view** (table) | `https://www.notion.so/6ea1b2867262468fbb15da5984602d5b?v=a03cd9d2ecd54ae68b998d8bdc0a5b69` |
| Work tracker — **Developer Board** (by Board Status) | `https://www.notion.so/6ea1b2867262468fbb15da5984602d5b?v=3417233a96ec8129aee8000c5e9cc40c` |

If queries fail, use **⋯** on the view tab in Notion → **Copy link to view** and replace the row above (IDs can change if views are recreated).

### Agent instruction (copy into prompts)

```text
For Notion database reads/writes, use only the view URLs documented in the repo at docs/AGENT_WORKSPACES.md (Notion section). Each URL must include ?v=<view_id>. Do not use bare notion.so/<id> links without ?v=.
```

---

## Deployed app (production / preview)

There is **no fixed production hostname** in this repo. The live URL is whatever you set as **`NEXT_PUBLIC_APP_URL`** on Vercel (and in Google OAuth redirect URIs). Find current deployment URLs in [Vercel Dashboard](https://vercel.com/dashboard) → this project → **Deployments**.

---

## Local app

| Item | Value |
|------|--------|
| Dev server | `http://localhost:4000` (see `package.json` `dev` script) |

### Key routes (append to dev or production origin)

| Path | Notes |
|------|--------|
| `/` | Home |
| `/start` | Onboarding / entry |
| `/login` | Sign in (includes **Try live demo** when demo flag is on) |
| `/signup` | Sign up |
| `/dashboard` | Authenticated dashboard |
| `/upgrade` | Pricing / upgrade |
| `/settings` | User settings (when present in nav) |
| `/phase-0` … `/phase-8` | Learning phases |
| `/story` | Story mode |
| `/cloud`, `/cloud/aws/*`, `/cloud/security`, `/cloud/vercel` | Cloud curriculum |
| `/ai`, `/ai/components` | AI content |
| `/observability` | Observability |
| `/system-design/tracker` | System design tracker |
| `/docs/architecture` | In-app architecture doc |
| `/terms`, `/privacy` | Legal |

Further reading: [Dev setup](DEV_SETUP.md), [Test users / demo](TEST_USERS.md).

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-07 | Initial agent workspace map (GitHub, Vercel, SonarCloud, Notion rules, local URL). |
| 2026-05-07 | Notion hub + tracker page URLs; app route table; production URL note. |
| 2026-05-07 | Link to [AGENT_ONBOARDING](AGENT_ONBOARDING.md) at top for fast agent onboarding. |
| 2026-05-07 | Notion section defers backlog/workflow to FEATURE_MANAGEMENT. |
| 2026-05-08 | Filled canonical work-tracker **view** URLs (default table + developer board) for MCP. |
