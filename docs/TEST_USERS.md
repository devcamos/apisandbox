# Test Users (Local Development)

Use this command to create default local test users only when the `User` table is empty:

```bash
npm run db:ensure-test-users
```

## Behavior

- If zero users exist: creates two test users.
- If one or more users already exist: does nothing.
- Refuses to run in `NODE_ENV=production`.

## Default Credentials

- `test@example.com` / `Test1234!@#$`
- `qa@example.com` / `QaTest1234!@#$`

## Demo Credentials

- Demo email: `demo@apisandbox.demo` by default
- Override email with: `DEMO_USER_EMAIL`
- Demo password source: `DEMO_USER_PASSWORD`
- Demo password is intentionally not committed to the repo

### How demo sign-in works

- UI entrypoint: **Try live demo (full app)** on `/login` and `/start`
- API route: `POST /api/auth/demo`
- Server behavior: signs in with `DEMO_USER_EMAIL` + `DEMO_USER_PASSWORD` entirely on the server
- Browser behavior: the raw demo password is never exposed to the client

### Quick reference

| Type | Email | Password |
|------|-------|----------|
| Local test user | `test@example.com` | `Test1234!@#$` |
| Local test user | `qa@example.com` | `QaTest1234!@#$` |
| Live demo user | `demo@apisandbox.demo` by default | From `DEMO_USER_PASSWORD` env var |

## Typical Setup Flow

```bash
npm install
npm run db:migrate
npm run db:ensure-test-users
npm run dev
```

## Live demo user (optional)

For a **shared PREMIUM demo** on a real deployment (or local with flags on):

1. Set **`DEMO_USER_PASSWORD`** (≥ 12 characters) and optionally **`DEMO_USER_EMAIL`** (default `demo@apisandbox.demo`) in the environment (e.g. Vercel **server** env — do not commit). The amber **demo session** banner uses this same server value (no extra public email var required).
2. Set **`NEXT_PUBLIC_FF_DEMO_LOGIN=true`** so **Try live demo** appears on `/login` and `/start`.
3. Run once against that database:

   ```bash
   DEMO_USER_PASSWORD='your-strong-secret' npm run db:ensure-demo-user
   ```

   In **production**, also set **`DEMO_ALLOW_PRODUCTION_SEED=true`** for that single run, then remove it.

4. Visitors use **Try live demo** → session is the demo user → **Exit demo** (banner) or normal **logout** ends the session.

`POST /api/auth/demo` uses the password from **`DEMO_USER_PASSWORD`** only on the server; it is never sent to the browser.
