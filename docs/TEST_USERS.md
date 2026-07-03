# Test users by environment

Test accounts are environment-specific. The committed local credentials are **not** automatically created in Preview, staging, or production databases.

| Environment | Test-user policy |
|-------------|------------------|
| Local | Use the two default users below. They are created only when the `User` table is empty. |
| CI | Tests register a unique temporary user. There is no reusable CI password. |
| Preview | Register a user on that preview, use configured Google sign-in, or explicitly provision the optional demo user. Do not assume local credentials exist. |
| Staging | Use explicitly provisioned, environment-owned accounts with passwords stored outside the repository. |
| Production | Do not seed the local test users. Use real accounts or the explicitly enabled demo-user flow. |

Env templates: [local.env.example](../config/environments/local.env.example), [preview.env.example](../config/environments/preview.env.example), [prod.env.example](../config/environments/prod.env.example).

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

Each PR preview uses its associated database branch. The local test-user command is **not** run during deployment, so `test@example.com` and `qa@example.com` commonly do not exist in Preview.

For routine preview testing:

1. Confirm the browser is on the intended preview hostname.
2. Create an account through **Sign up**, or use Google sign-in when that preview origin is configured in Google Cloud.
3. Use the same login method later. A Google-only account may not have a password credential.

For a reusable shared Preview account, use the demo-user flow below and keep its password in Vercel **Preview** environment variables. Do not commit shared-environment passwords.

Verify auth is configured:

```bash
curl -sS "https://<preview-host>/api/health/auth" | jq '.data.jwtSecretConfigured'
```

## CI

The CI smoke test creates a unique account through `/api/auth/register` and then signs in. CI does not depend on a persistent test user or on the local default passwords.

## Staging

Staging accounts must be provisioned intentionally against the staging database. Store credentials in the team's approved secret manager. Do not use the committed local passwords on a shared environment.

## Production

The local seed command is blocked in production. Production testing should use real accounts or the optional demo-user flow with its explicit production guard.

## Optional demo user

The demo flow signs in server-side, so its password is never sent to the browser.

1. Set `DEMO_USER_PASSWORD` (at least 12 characters) and optionally `DEMO_USER_EMAIL` (default `demo@apisandbox.demo`) in the target environment.
2. Set `NEXT_PUBLIC_FF_DEMO_LOGIN=true` to show **Try live demo** on `/login` and `/start`.
3. Run once against the target database:

   ```bash
   DEMO_USER_PASSWORD='your-strong-secret' npm run db:ensure-demo-user
   ```

   For production only, also set `DEMO_ALLOW_PRODUCTION_SEED=true` for that single run, then remove it.

The UI calls `POST /api/auth/demo`; the server reads `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD` and creates the session.

## Invalid login credentials

If a documented user cannot sign in:

1. Check which environment and hostname the browser is using.
2. Do not use the local default credentials outside Local unless that user was explicitly created there.
3. Check whether the account was registered with email/password or Google; use the matching login method.
4. Confirm the target database contains the user before changing passwords or reseeding.

Password-reset pages are not currently implemented, so the login screen's **Forgot password** link is not a recovery path yet.
