# Git Branching Strategy (Gitflow: `dev` = staging)

This repo uses a practical Gitflow model:
- `main` is production
- `dev` is staging/integration
- all work ships through short-lived feature branches

## Branch Roles

| Branch | Purpose | Deployment |
|---|---|---|
| `main` | Production-ready, release history | Production |
| `dev` | Integration branch for accepted features | Staging |
| `feature/*` or `codex/*` | Day-to-day implementation work | None (PR into `dev`) |
| `release/*` | Stabilize release candidate from `dev` | Optional pre-prod |
| `hotfix/*` | Emergency fix from `main` | Production patch |

## Branch Rules

1. Never commit directly to `main`.
2. Do not commit directly to `dev` unless it is a controlled release merge.
3. Open PRs from feature branches into `dev`.
4. Promote `dev` to `main` only via release PR.
5. Hotfixes branch from `main`, then merge into both `main` and `dev`.

## Naming Convention

- Feature: `feature/<scope>-<short-description>`
- Agent/automation work: `codex/<scope>-<short-description>`
- Release: `release/<version-or-date>`
- Hotfix: `hotfix/<incident-or-ticket>`

Examples:
- `feature/auth-jwt-session`
- `codex/phase4-lesson-tracker`
- `release/2026-04-15`
- `hotfix/login-timeout-500`

## Daily Workflow

1. Sync and branch from `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/your-change
   ```
2. Commit small, reviewable chunks:
   ```bash
   git add <files>
   git commit -m "feat(auth): unify jwt login flow"
   ```
3. Push and open PR to `dev`:
   ```bash
   git push -u origin feature/your-change
   ```
4. After PR approval + checks, merge into `dev`.

## Release Workflow

1. Create release branch from `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b release/<version>
   ```
2. Run final validation (tests, migrations, smoke checks).
3. PR `release/*` -> `main`.
4. After merge, back-merge `main` into `dev`.

## Hotfix Workflow

1. Branch from `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/<issue>
   ```
2. Ship fix via PR to `main`.
3. Merge the same fix back into `dev`.

## Required PR Checks

- Type-check: `npx tsc --noEmit`
- Tests relevant to changed area
- Prisma migration review when schema changes
- No test artifacts in commits (`test-results`, generated reports)

## Local Staging (Docker)

Create a `.env` file in the repo root (Compose loads it automatically) with at least **`AUTH_SECRET`** (32+ random characters). Staging Postgres and the app listen on **127.0.0.1** only (`5434` and `4000`).

```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

- App: `http://localhost:4000`
- Postgres: `localhost:5434` (`apisandbox_staging`)

Stop:
```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml down
```

Run staging smoke tests:
```bash
npm run test:staging
```
