# Git Workflow

This repo now uses a simple staging-first workflow:

- `main` is the production branch
- `staging` is the integration branch
- feature work happens on short-lived `codex/*` or `feature/*` branches created from `staging`

## Branch roles

| Branch | Purpose | Notes |
| --- | --- | --- |
| `main` | Production-ready history | Only promote here from a validated staging change set |
| `staging` | Shared integration branch | All feature PRs should target this branch |
| `codex/*` or `feature/*` | Short-lived feature branches | Branch from `staging`, merge back into `staging`, then delete |

## Standard flow

```bash
# Start from the integration branch
git checkout staging
git pull origin staging

# Create a feature branch
git checkout -b codex/your-change

# Work, test, commit
git add <files>
git commit -m "Describe the change"

# Publish and open a PR into staging
git push -u origin codex/your-change
```

After review:

1. Merge the feature branch into `staging`
2. Verify the app in staging
3. Promote `staging` into `main` when the release is ready

## Rules for this repo

- Do not work directly on `main`
- Do not merge feature branches directly into `main`
- Base new feature work on `staging`
- Keep feature branches focused and delete them after merge

## Local cleanup

After a branch is merged:

```bash
git checkout staging
git pull origin staging
git branch -d codex/your-change
git fetch --prune
```

If a branch was superseded and will never merge, it is fine to delete it with `git branch -D ...` once the replacement branch or PR exists.

## Staging environment

Run the staging stack locally when you want production-like verification:

```bash
npm run staging:up
```

Useful commands:

```bash
npm run staging:logs
npm run test:staging
npm run staging:down
```

The staging stack uses the templates in [`config/environments/staging.env.example`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/config/environments/staging.env.example).
