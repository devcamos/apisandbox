# Trunk-based development (with `v1` release line)

This repo uses **trunk-based workflow**: `main` is the integration trunk. All work merges to `main` via short-lived branches and PRs.

## Branch roles

| Branch / ref | Purpose | Deployment |
|--------------|---------|------------|
| **`main`** | Trunk — always deployable | Vercel **Production** |
| **`v1`** | Release line for 1.x (patches, docs, refactors) | Same as `main` when merged; tag releases on `v1` |
| **`feature/*`**, **`fix/*`**, **`codex/*`** | Short-lived work | Vercel **Preview** on PR |

Legacy `dev` is **deprecated** — do not open new PRs targeting `dev`.

## Git tags

Releases are marked with **annotated tags** on the release line:

```bash
git checkout v1
git pull
git tag -a v1.0.0 -m "Release 1.0.0 — trunk baseline + principle refactor"
git push origin v1.0.0
```

Tag format: `v1.0.0`, `v1.0.1`, … (semver on the `v1` line).

List tags: `git tag -l 'v1.*'`

## Daily workflow

1. Sync trunk:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Branch for work (from `main` or `v1` if maintaining the 1.x line):
   ```bash
   git checkout -b fix/short-description
   ```
3. Commit in small chunks; run `npm run verify:ci` before push.
4. Open PR → **`main`** (default) or **`v1`** when explicitly doing 1.x release work.
5. After merge, delete the feature branch.

## Hotfix workflow

1. Branch from `main` (or `v1` if patching a tagged 1.x release):
   ```bash
   git checkout main && git pull
   git checkout -b hotfix/issue-summary
   ```
2. PR to `main`; cherry-pick or merge to `v1` if the release line needs the same fix.
3. Tag patch on `v1` when applicable: `v1.0.1`.

## Naming convention

- Feature/fix: `feature/<scope>-<description>` or `fix/<scope>-<description>`
- Agent work: `codex/<scope>-<description>`
- Release line: branch `v1`, tags `v1.x.y`

Examples:

- `fix/auth-session-cookie`
- `feature/phase-5-quiz`
- Tag: `v1.0.0`

## Required PR checks

- `npm run verify:ci` locally
- No secrets in diff; no `playwright-report/` / `test-results/` committed
- Prisma migrations reviewed when schema changes
- Update [DEPLOYMENT.md](./DEPLOYMENT.md) changelog when deploy/env contracts change

## Related docs

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md)
