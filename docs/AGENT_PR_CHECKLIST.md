# Agent PR checklist — verify before opening or updating a PR

**User story:** As an agent, I want a clear pre-PR gate so I only raise PRs that match CI and repo conventions.

**Principle:** *Only surprises should be found by GitHub pipelines.* Every blocking CI job has a local equivalent — run it before push.

Use this **before** `git push` and `gh pr create`. Do not mark work complete until section 2 passes.

**Cursor rule:** `.cursor/rules/green-builds.mdc` (always applied).

---

## 0. Local-first rule

| Run locally (before PR) | GitHub job | Notes |
|-------------------------|------------|-------|
| `npm run verify:ci` | All blocking jobs below | Single command; requires Docker |
| ↳ lint + build | `lint-and-build` | Same CI build env vars |
| ↳ vitest `--coverage` | `unit-tests` | Same as CI |
| ↳ `validate:compose` | `docker-compose-validate` | Needs `AUTH_SECRET` (script sets placeholder) |
| ↳ `npm audit --audit-level=critical` | `dependency-review` | Approximates critical vuln gate |
| ↳ postgres-ci + `db push` + smoke | `e2e-smoke` | Port **5436**, fresh DB like CI |
| `npm run sonar:local` (if `SONAR_TOKEN` set) | `sonarcloud` | Optional; needs coverage from verify |
| `npm run sonar:status` (after push, when CI done) | `sonarcloud` | Quality Gate summary via API; or `gh pr checks` |
| — | **Preview approved (Vercel)** | **Human only** — not automatable |
| — | **Vercel Preview deploy** | Hosted — smoke locally first |

---

## 1. Branch and diff hygiene

- [ ] Branch from the correct base (`main` trunk per [GITFLOW](GITFLOW.md); `v1` only for 1.x release-line work; hotfixes from `main`).
- [ ] Rebase or merge latest base branch if the PR has been open a while.
- [ ] Diff is scoped to the task — no drive-by refactors.
- [ ] **No secrets** in the diff (`.env`, `.env.local`, API keys, tokens).
- [ ] **Do not commit** generated artifacts: `playwright-report/`, `test-results/`, `coverage/` (unless task requires).
- [ ] Env templates use placeholders only (`*.example`, `config/environments/*.env.example`).
- [ ] Deploy/auth PRs: update [PRODUCTION_CONFIG_SYNC](PRODUCTION_CONFIG_SYNC.md) changelog if env/build/auth contract changed.
- [ ] Lockfile in sync: if you changed `package.json`, run `npm install` and commit `package-lock.json`.

---

## 2. Local CI parity (required)

### One command (matches blocking CI jobs)

```bash
npm run verify:ci
```

**Prerequisites:**
- Docker running (ephemeral `postgres-ci` on `localhost:5436`)
- Port **4000 free** (stop `npm run dev` — Playwright starts its own server)
- Dependencies installed (`npm ci` recommended before verify, same as CI)

**What it runs** (see `scripts/verify-ci-local.sh`):
1. `npm run lint`
2. `npm run build` (CI placeholder env: `AUTH_SECRET`, `RESEND_API_KEY`, etc.)
3. `npx vitest run --coverage`
4. `npm run validate:compose`
5. `npm audit --audit-level=critical`
6. Docker `postgres-ci` → `prisma db push` → `tests/ci-smoke.spec.ts` with `CI=true`

Optional: if `SONAR_TOKEN` is in env or `.env.local`, also runs `npm run sonar:local`.

### Area-specific (when you touched that area)

| Area | Additional command |
|------|-------------------|
| Auth / login / signup / subscriptions | `CI=1 npx playwright test tests/unified-auth.spec.ts --project=chromium` |
| Navigation / session | `CI=1 npx playwright test tests/navigation-auth.spec.ts --project=chromium` |
| Dashboard | `CI=1 npx playwright test tests/dashboard.spec.ts --project=chromium` |
| Stripe / billing | `npm run test:unit -- tests/unit/stripe-webhook-handlers.test.ts` |
| Broad UI / routing | `CI=1 npm run test:ci:chromium` |

`npm run verify:pr` is an alias for `npm run verify:ci`.

---

## 3. After pushing — confirm, don't discover

Local green → push → CI should **confirm**, not **surprise**.

```bash
git push -u origin HEAD
gh pr checks --watch
```

If GitHub fails after local `verify:ci` passed:
1. Compare the failed job to `scripts/verify-ci-local.sh` — update the script if CI drifted.
2. Reproduce with the exact command from the workflow file.
3. Fix and re-run `npm run verify:ci` before pushing again.

---

## 4. PR description template

```markdown
## Summary
- <1–3 bullets>

## Test plan
- [ ] `npm run verify:ci` passed locally
- [ ] <area-specific tests if any>
- [ ] CI checks green on GitHub (confirming, not first run)
- [ ] Vercel Preview reviewed (human, for PRs → main)
```

Auth/subscription PRs: see `.cursor/rules/auth-subscription.mdc`.

---

## 5. Common failure modes

| Symptom | Fix |
|---------|-----|
| Port 4000 in use | Stop manual dev server before `verify:ci` |
| postgres-ci not ready | Ensure Docker is running; port 5436 free |
| Smoke login stuck on `/login` | Fixed in tests (cookie banner); re-run with `CI=true` via verify:ci |
| Google auth tests 500 | Don't reuse `npm run dev`; use `CI=1` / `verify:ci` |
| Build fails on `RESEND_API_KEY` | verify:ci sets CI placeholder — mirror that locally |
| Sonar fails only on GitHub | Run `npm run sonar:local:full` with `SONAR_TOKEN` before PR |

---

## 6. Definition of done (agents)

1. `npm run verify:ci` passes locally.
2. Area-specific tests pass when applicable.
3. Committed with clear message; no secrets/artifacts in diff.
4. PR opened with test plan showing local verify.
5. `gh pr checks --watch` green (confirms local, not first discovery).
6. Human preview approval noted for PRs → `main`.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-25 | Local-first principle; `verify:ci` mirrors all blocking CI jobs including postgres-ci + coverage + compose + audit. |
| 2026-05-25 | Initial agent PR checklist. |
