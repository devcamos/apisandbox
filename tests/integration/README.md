# Session migration regression

`user-session-migration.mjs` is an opt-in, mutating test for an approved disposable
PostgreSQL fixture on `localhost:5436`. Never point it at a hosted database. It
requires the pre-session main schema, no `UserSession` table and no `anon` or
`authenticated` roles. It commits the tested session schema and roles, while
rolling back synthetic behavior-test records and temporary permissive grants.

Prepare a fresh disposable database only after approval. Generate its baseline
from main before the session feature (the reviewed baseline was `ab1f441`):

```bash
git show ab1f441:prisma/schema.prisma > /tmp/apisandbox-main-schema.prisma
npx prisma migrate diff --from-empty \
  --to-schema-datamodel /tmp/apisandbox-main-schema.prisma --script \
  > /tmp/apisandbox-main-schema.sql
```

Apply that generated SQL to the approved empty local fixture using `psql`, then
run the regression with its local `DATABASE_URL` selected securely:

```bash
node tests/integration/user-session-migration.mjs
```

The test verifies plain PostgreSQL compatibility without Supabase roles,
reproduces the RLS gap when blanket hardening ran before session-table creation,
then checks targeted hardening, restrictive policies, revoked table privileges,
owner-backed session creation/read/revocation and API-role isolation even after a permissive grant.
It deliberately does not call the blanket RLS remediation helper before checking
the regression. This is a focused migration-order test, not verification of every
historical migration or the hosted database state. Reruns require another approved
fresh fixture; the test does not reset or delete an existing database.

The regular CI smoke file also covers two independent device sessions, signup
response compatibility, single-device revocation and logout invalidating retained
tokens against a real database.
