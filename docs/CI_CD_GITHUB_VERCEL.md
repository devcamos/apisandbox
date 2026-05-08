# CI/CD with GitHub and Vercel

This repo uses **GitHub Actions for CI** (quality gates) and **Vercel Git integration for CD** (preview + production deployments).

## CLI deploy vs Git-connected deploy

A one-off **`vercel deploy`** from a laptop uploads **whatever is on that machine** to a Vercel project. It does **not**:

- Bind deployments to **your GitHub account** or org  
- Follow **branches**, **PRs**, or **git-flow** (e.g. `develop` → `main`)  
- Guarantee the same commit as `origin` on GitHub  

**Treat CLI deploy as an emergency or bootstrap only.** For day-to-day work, **CD must come from the Vercel ↔ GitHub integration** so every push and PR matches your Git history and access control.

### Sync Vercel with *your* GitHub and git-flow

1. **Use the right Vercel scope**  
   Open the project under **your** Vercel team or personal account (e.g. devcamos), not an old or shared team where a CLI link first landed.

2. **Connect the canonical Git repo**  
   Vercel → Project → **Settings → Git** → **Connect Git Repository** → choose the GitHub **org/user and repo** you actually push to (e.g. `your-org/apisandbox`).  
   Install or approve the **Vercel GitHub App** for that org if prompted.

3. **Set the production branch (git-flow)**  
   Still under **Settings → Git** → **Production Branch**:
   - **GitHub Flow / trunk:** `main` — merges to `main` → **Production**; every **PR** → **Preview**.
   - **Git-flow:** often **`main` = production** and **`develop` = integration** — set Production Branch to **`main`**. Pushes to `develop` and feature branches still get **Preview** deployments; only merges into `main` promote to production.

4. **Retire or ignore the old CLI-only project**  
   If a project was created under another team via `vercel link`, either delete it after Git is wired on the correct project, or stop using it so nobody confuses URLs.

5. **Local CLI (optional)**  
   From the repo: `rm -rf .vercel` then `npx vercel@latest link` and select the **same** project you connected to GitHub in step 2—so `vercel env pull` and ad-hoc previews match that project.

## What runs where

| Trigger | GitHub Actions | Vercel |
|--------|----------------|--------|
| Open / update **PR** | `CI` workflow: lint, build, **Playwright smoke** (Chromium + Postgres), dependency review | **Preview deployment** for the PR (unique URL) |
| Push to **`main`** (or your production branch) | Same `CI` workflow | **Production deployment** to your production domain / alias |
| Push to **`develop`** or **`dev`** | `CI` workflow | **Preview** deployments for that branch (not production unless you set one of them as the production branch) |

Vercel does **not** need a deploy secret in GitHub for the default flow: it builds from the webhook when you connect the repository.

## One-time Vercel setup (CD)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project (e.g. **apisandbox**).
2. **Settings → Git**  
   - Connect **GitHub** and select this repository.  
   - **Production Branch**: set to `main` (or `master` if that is your default).  
3. **Settings → Git → Deploy Hooks** (optional): only if you need out-of-band redeploys.
4. Confirm **Environment Variables** for Production and Preview (see [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)).

After this:

- Every **pull request** gets a **Preview** build and URL (Vercel comments on the PR when enabled in team settings).
- Every merge to **`main`** triggers a **Production** deployment.

### Aligning “releases” with production

**Recommended (simple):** treat **merge to `main`** as the release gate. Production deploys automatically. Create a **GitHub Release** / tag afterward for changelog and versioning; the live site is already updated.

**Stricter (production branch):** create a long-lived branch `production`, set Vercel **Production Branch** to `production`, and only fast-forward or merge into `production` when you intend to ship. `main` can stay for integration; use PRs from `main` → `production` for controlled releases.

## One-time GitHub setup (CI)

No secrets are required for the default **`.github/workflows/ci.yml`** (lint, build, E2E).

Enable **Actions** on the repository (Settings → Actions → General).

Optional hardening (same ideas as other templates):

- Branch protection on `main`: require **status checks** `lint-and-build` and `e2e-smoke` (and `dependency-review` for PRs).
- Require PR reviews before merge.

## Optional: deploy production from GitHub Actions

Only use this if you **intentionally** want Vercel production to be triggered by a workflow (for example on `release: published`) **instead of** or **in addition to** Git pushes. Duplication is easy to misconfigure; prefer **Git-connected production branch** unless you have a specific reason.

If you need it:

1. Vercel → Account Settings → Tokens → create a token.  
2. Vercel project → Settings → General → copy **Project ID** and **Team / Org ID**.  
3. GitHub repo → Settings → Secrets → add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.  
4. Add a workflow that runs `npx vercel@latest deploy --prod --token ...` with those env vars (and coordinate with Vercel “Ignored Build Step” if you must avoid double production builds).

## Local parity

- CI build: `npm run lint` && `npm run build`  
- CI E2E gate: `npm run test:ci:smoke` (see `tests/ci-smoke.spec.ts`) — needs Postgres and a free port **4000** (stop `npm run dev` first), same env vars as in `.github/workflows/ci.yml`.  
- Full browser matrix: `npm run test` or `npm run test:ci:chromium` locally / in a separate scheduled workflow if you add one.

### Prisma migrations vs CI

Historical migration SQL targets SQLite (`migration_lock.toml`). CI applies the current **Postgres** schema with `prisma db push` on an empty database so smoke tests can run. For production, continue using your existing migration / deploy process until you add a Postgres-native migration baseline (then you can switch CI to `prisma migrate deploy`).

## Related docs

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)  
- [MONO_ENVIRONMENT.md](./MONO_ENVIRONMENT.md)  
- [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)
