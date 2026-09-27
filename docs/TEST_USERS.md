# Test users by environment

Test accounts are environment-specific. The committed local credentials are not automatically created in Preview, staging, or production databases.

| Environment | Test-user policy |
|-------------|------------------|
| Local | Use the two default users below. They are created only when the `User` table is empty. |
| CI | Tests register a unique temporary user. There is no reusable CI password. |
| Preview | Register a user on that preview, use configured Google sign-in, or explicitly provision the optional demo user. Do not assume local credentials exist. |
| Staging | Use explicitly provisioned, environment-owned accounts with passwords stored outside the repository. |
| Production | Do not seed the local test users. Use real accounts or the explicitly enabled demo-user flow. |

## Local development

Create the default local users:

```bash
npm run db:ensure-test-users
```

| Email | Password |
|-------|----------|
| `test@example.com` | `Test1234!@#$` |
| `qa@example.com` | `QaTest1234!@#$` |

The command:

- creates both users only when the entire `User` table is empty;
- does nothing when any user already exists;
- refuses to run when `NODE_ENV=production`;
- supports `ENSURE_TEST_USERS_PASSWORD` and `ENSURE_TEST_USERS_PASSWORD_QA` overrides.

Typical setup:

```bash
npm install
npm run db:migrate
npm run db:ensure-test-users
npm run dev
```

## Preview deployments

Each PR preview uses its associated Neon branch. A preview database may be copied from another branch, but the local test-user command is not automatically run during deployment. This means `test@example.com` and `qa@example.com` commonly do not exist in Preview.

For routine preview testing:

1. Confirm the browser is on the intended preview hostname.
2. Create an account through **Sign up**, or use Google sign-in when that preview origin is configured.
3. Use the same login method later. A Google-only account may not have a password credential.

For a reusable shared Preview account, use the demo-user flow below and keep its password in Vercel Preview environment variables. Do not commit shared-environment passwords.

## CI

The CI smoke test creates a unique account through `/api/auth/register` and then signs in. CI does not depend on a persistent test user or on the local default passwords.

## Staging

Staging accounts must be provisioned intentionally against the staging database. Store credentials in the team's approved secret manager and rotate them when access changes. Do not use the committed local passwords on a shared environment.

## Production

The local seed command is blocked in production. Production testing should use real accounts or the optional demo-user flow with its explicit production guard.

## Optional demo login (Phase 1 only)

Demo login creates an **ephemeral FREE user** per visitor (`demo.<id>@apisandbox.demo`) with full Phase 1 access. Later phases, billing, API tokens, and profile edits are blocked on the server. Expired demos are deleted on the next demo login (default TTL 24h).

No shared password seed is required.

1. Set `NEXT_PUBLIC_FF_DEMO_LOGIN=true` to show **Try the demo** on `/login` and `/start`.
2. On production deploys, also set `ALLOW_DEMO_LOGIN_IN_PRODUCTION=true`.
3. Optional: `DEMO_USER_TTL_HOURS` (default `24`) and `npm run db:ensure-demo-user` for an explicit cleanup of expired demos.

The UI calls `POST /api/auth/demo` (rate-limited). The response is a normal auth session for the new demo user.

**Migration note:** This flow does **not** add a Prisma migration. Preview (Supabase) and production (Neon) only need the existing schema. PR #43 (skip migrate on Preview) does not affect this feature.

## Invalid login credentials

If a documented user cannot sign in:

1. Check which environment and hostname the browser is using.
2. Do not use the local default credentials outside Local unless that user was explicitly created there.
3. Check whether the account was registered with email/password or Google; use the matching login method.
4. Confirm the target database contains the user before changing passwords or reseeding.

`/forgot-password` explains recovery options (Google sign-in, demo claim, support email). Automated reset email is not implemented yet.


## Sign-in lockout and throttling

- Each account gets **5 failed password attempts**. All 5 are checked normally and return
  `401 Invalid email or password`. The 5th failure starts a **30-minute lock**, so the 6th
  attempt (even with the right password) returns `423` with
  `Account locked after 5 failed sign-in attempts. Try again in N minutes.`
- A successful sign-in resets the counter. When a lock expires the account gets a fresh 5 attempts.
- The optional Upstash throttle on `/api/auth/login` (`NEXT_PUBLIC_FF_RATE_LIMITING=true`) is keyed per
  IP + email at 20 requests / 15 min, so it never fires before the per-account lock.

## Demo account on the sign-in page (life-world-os model)

`/login` shows a demo panel with **Try the demo** and the public credentials
`demo@apisandbox.demo` / `try-the-demo`. Either path creates a fresh ephemeral FREE,
Phase-1-only demo user (no shared account, no seeding). It is on by default for Local, CI
and Vercel Preview; set `NEXT_PUBLIC_FF_DEMO_LOGIN=false` to hide it. On the production target
it needs `NEXT_PUBLIC_FF_DEMO_LOGIN=true` **and** `ALLOW_DEMO_LOGIN_IN_PRODUCTION=true`.
