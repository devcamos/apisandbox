# Gitflow: Dev = Staging

This project uses a **Gitflow-style workflow** where **`dev` is the staging branch**.

## Branch roles

| Branch   | Role       | Deploy target              | Run locally                          |
|----------|------------|----------------------------|--------------------------------------|
| `main`   | Production | Production (e.g. Vercel)   | N/A                                  |
| `dev`    | Staging    | Staging (Docker / Vercel)  | Docker staging stack (see below)     |
| `feature/*` | Features | —                          | Branch from `dev`, merge back to `dev` |

## Workflow

1. **Develop on feature branches** from `dev`:
   ```bash
   git checkout dev && git pull
   git checkout -b feature/your-feature
   # ... work ...
   git add . && git commit -m "feat: ..."
   git push -u origin feature/your-feature
   ```

2. **Merge into `dev`** (staging) via PR; deploy staging from `dev`.

3. **Release to production**: merge `dev` → `main` when ready; deploy production from `main`.

## Running staging locally (Docker)

Staging runs as Docker containers so it matches the staging environment.

```bash
# From repo root (apisandbox)
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

- **App (staging):** http://localhost:4000  
- **Postgres (staging):** port 5434 (DB: `apisandbox_staging`)

Stop:

```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml down
```

**Migrations:** If your DB is fresh and you use PostgreSQL in `prisma/schema.prisma`, ensure `prisma/migrations/migration_lock.toml` has `provider = "postgresql"` (not `sqlite`). Then run migrations from the host once:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/apisandbox_staging" npx prisma migrate deploy
```

**Google OAuth (staging):** To enable “Sign in with Google” in staging, add your staging credentials. In the `apisandbox` directory create a `.env` file (or add to an existing one, and ensure it’s in `.gitignore`) with:

```env
GOOGLE_CLIENT_ID=your-staging-client-id
GOOGLE_CLIENT_SECRET=your-staging-client-secret
```

Then start the stack with `docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d`. The app container will receive these env vars and the Google provider will be enabled. See `config/environments/staging.env.example` for a full template. For Google Cloud Console setup and redirect URIs, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md).

**Test staging:** With the staging stack running, from the `apisandbox` directory run:

```bash
npm run test:staging
```

This runs Playwright smoke tests against the live staging app (homepage, dashboard, login page, start page) without starting the dev server.

## Task: Adopt Gitflow (dev = staging)

- **Feature:** Gitflow with dev as staging branch.  
- **Deliverables:** This doc, staging Docker setup, branch policy (staging deploys from `dev`).  
- **Amend to gitflow:** Use `dev` for all staging work and deployments; keep `main` for production only.
