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

## Typical Setup Flow

```bash
npm install
npm run db:migrate
npm run db:ensure-test-users
npm run dev
```

## Live demo user (optional)

For a **shared PREMIUM demo** on a real deployment (or local with flags on):

1. Set **`DEMO_USER_PASSWORD`** (≥ 12 characters) and optionally **`DEMO_USER_EMAIL`** (default `demo@apisandbox.demo`) in the environment (e.g. Vercel **server** env — do not commit).
2. Set **`NEXT_PUBLIC_DEMO_USER_EMAIL`** to the **same** email as `DEMO_USER_EMAIL` so the UI can show the “demo session” banner.
3. Set **`NEXT_PUBLIC_FF_DEMO_LOGIN=true`** so **Try live demo** appears on `/login` and `/start`.
4. Run once against that database:

   ```bash
   DEMO_USER_PASSWORD='your-strong-secret' npm run db:ensure-demo-user
   ```

   In **production**, also set **`DEMO_ALLOW_PRODUCTION_SEED=true`** for that single run, then remove it.

5. Visitors use **Try live demo** → session is the demo user → **Exit demo** (banner) or normal **logout** ends the session.

`POST /api/auth/demo` uses the password from **`DEMO_USER_PASSWORD`** only on the server; it is never sent to the browser.
