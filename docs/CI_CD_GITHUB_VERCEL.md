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
| Open / update **PR** → `main` | `CI`: lint, build, unit tests, E2E smoke, then **`Preview approved (Vercel)`** (waits for [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) approval) | **Preview deployment** (Vercel builds from the PR commit; check the Vercel bot comment for the URL) |
| Push / merge to **`main`** | `CI` on the merged commit | **Production deployment** (Vercel production branch) |
| Push to **`develop`** / **`dev`** | `CI` workflow | **Preview** for that branch (not production unless you set one of those as the production branch) |

### Local CI parity (agents)

Run **`npm run verify:ci`** before opening a PR. It mirrors blocking CI jobs locally (lint, build, unit tests with coverage, compose validate, npm audit, e2e-smoke with ephemeral Postgres). GitHub should only surface what cannot run locally: **Preview approved (Vercel)**, Vercel hosted deploy, and PR-only dependency diff nuances. See [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md).

### Manual approval before merging to `main`

This repo gates PRs with a GitHub Actions **environment** named `preview`:

1. **Vercel** (Git connected): every PR still gets an automatic **Preview** deployment and URL.
2. **GitHub Actions** (`preview-deploy-gate` in `.github/workflows/ci.yml`): after **lint, unit tests, E2E smoke, and compose validation** succeed, the workflow waits on the **`preview`** environment.
3. **You** (or designated reviewers): in the PR’s **Checks** tab, open the waiting **Preview approved (Vercel)** job and approve the deployment for the `preview` environment *after* reviewing the Vercel Preview in the browser.
4. **Branch protection**: on `main`, require the status check **`Preview approved (Vercel)`** (and your existing CI jobs, e.g. `lint-and-build`, `e2e-smoke`) so merges are blocked until both CI and the preview gate pass.

**One-time GitHub setup**

1. Repository **Settings → Environments → New environment** → name: **`preview`**.
2. Under **Deployment protection rules**, enable **Required reviewers** and add the people or teams allowed to sign off on previews.
3. **Settings → Rules → Rulesets** (or **Branches → Branch protection rules**) for `main`:
   - Require status checks: enable **`Preview approved (Vercel)`** plus **`lint-and-build`**, **`unit-tests`**, **`e2e-smoke`** (and any others you rely on).
   - Optionally require pull request reviews in addition to the preview gate.

**Draft PRs:** `preview-deploy-gate` is skipped for draft PRs. If your branch rules still require that check, enable the option to **not require status checks on draft pull requests** (Rulesets: configure required workflows / exemptions), or mark the PR ready for review when you want the gate to run.

**Forks:** Contributors from forks may not be able to use protected environments the same way; adjust protection rules or use a fork-specific policy if you accept external PRs.

### Optional: Vercel-side preview protection

In Vercel → Project → **Settings → Deployment Protection**, you can add an extra approval step for **Preview** deployments. That is independent of GitHub; use either or both, depending on how strict you want the process to be.

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

Vercel does **not** need a deploy secret in GitHub for the default flow: it builds from the webhook when you connect the repository.

### Aligning “releases” with production

**Recommended (simple):** treat **merge to `main`** as the release gate. Production deploys automatically. Create a **GitHub Release** / tag afterward for changelog and versioning; the live site is already updated.

**Stricter (production branch):** create a long-lived branch `production`, set Vercel **Production Branch** to `production`, and only fast-forward or merge into `production` when you intend to ship. `main` can stay for integration; use PRs from `main` → `production` for controlled releases.

## One-time GitHub setup (CI)

No secrets are required for the default **`.github/workflows/ci.yml`** (lint, build, E2E).

Enable **Actions** on the repository (Settings → Actions → General).

Optional hardening:

- Branch protection on `main`: require **status checks** `lint-and-build`, `unit-tests`, `e2e-smoke`, **`Preview approved (Vercel)`** (and `dependency-review` / Sonar if you use them).
- Create GitHub **Environment** `preview` with **Required reviewers** (see [Manual approval before merging to `main`](#manual-approval-before-merging-to-main)).
- Require PR code reviews before merge (in addition to the preview gate, if you want both).

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

CI uses **`prisma db push`** on an ephemeral Postgres database so smoke tests match the current `schema.prisma`. Hosted environments should use **`prisma migrate deploy`** against your real Postgres once migrations are aligned.

## Related docs

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)  
- [MONO_ENVIRONMENT.md](./MONO_ENVIRONMENT.md)  
- [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)
