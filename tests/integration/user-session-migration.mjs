import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import pg from "pg"

// Opt-in, mutating integration test. Requires an approved disposable local
// main-schema fixture with no UserSession table or Supabase roles yet.
const connectionString = process.env.DATABASE_URL
const url = new URL(connectionString ?? "postgresql://invalid")
assert(["localhost", "127.0.0.1"].includes(url.hostname) && url.port === "5436",
  "This migration fixture must use the disposable localhost:5436 database")
const client = new pg.Client({ connectionString })
const migration = async (name) => readFile(fileURLToPath(new URL(
  `../../prisma/migrations/${name}/migration.sql`, import.meta.url,
)), "utf8")
const createSessions = await migration("20261031120000_add_user_sessions")
const hardenSessions = await migration("20261031130000_harden_user_session_rls")
const hardenExisting = await migration("20261102120000_reenable_public_rls")

await client.connect()
try {
  assert.equal((await client.query("SELECT to_regclass('public.\"UserSession\"') AS name")).rows[0].name, null)
  assert.equal((await client.query("SELECT count(*)::int AS n FROM pg_roles WHERE rolname IN ('anon', 'authenticated')")).rows[0].n, 0)

  // Plain Postgres must work without either Supabase role.
  await client.query("BEGIN")
  await client.query(createSessions)
  await client.query(hardenSessions)
  assert.equal((await client.query("SELECT relrowsecurity FROM pg_class WHERE oid = 'public.\"UserSession\"'::regclass")).rows[0].relrowsecurity, true)
  await client.query("ROLLBACK")

  await client.query("BEGIN")
  await client.query("CREATE ROLE anon; CREATE ROLE authenticated")
  // Reproduce an environment that already applied blanket hardening.
  await client.query(hardenExisting)
  await client.query(createSessions)
  assert.equal((await client.query("SELECT relrowsecurity FROM pg_class WHERE oid = 'public.\"UserSession\"'::regclass")).rows[0].relrowsecurity, false,
    "Regression must reproduce disabled RLS before the targeted fix")
  await client.query(hardenSessions)
  await client.query(hardenSessions) // Safe if applied to an already hardened table.
  const flags = (await client.query("SELECT relrowsecurity, relforcerowsecurity FROM pg_class WHERE oid = 'public.\"UserSession\"'::regclass")).rows[0]
  assert.deepEqual(flags, { relrowsecurity: true, relforcerowsecurity: false })
  const policies = (await client.query("SELECT policyname, permissive, qual, with_check FROM pg_policies WHERE schemaname = 'public' AND tablename = 'UserSession' ORDER BY policyname")).rows
  assert.equal(policies.length, 2)
  for (const policy of policies) {
    assert.equal(policy.permissive, "RESTRICTIVE")
    assert.equal(policy.qual, "false")
    assert.equal(policy.with_check, "false")
  }
  for (const role of ["anon", "authenticated"]) {
    for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
      assert.equal((await client.query("SELECT has_table_privilege($1, 'public.\"UserSession\"', $2) AS allowed", [role, privilege])).rows[0].allowed, false)
    }
  }

  await client.query("SAVEPOINT behavior")
  await client.query("INSERT INTO public.\"User\" (id, email, \"updatedAt\") VALUES ('migration-fixture', 'migration-fixture@example.com', now())")
  await client.query("INSERT INTO public.\"UserSession\" (id, \"userId\", \"expiresAt\") VALUES ('fixture-session', 'migration-fixture', now() + interval '1 day')")
  assert.equal((await client.query("SELECT count(*)::int AS n FROM public.\"UserSession\"")).rows[0].n, 1)
  assert.equal((await client.query("UPDATE public.\"UserSession\" SET \"revokedAt\" = now() WHERE id = 'fixture-session'")).rowCount, 1)
  // Even an accidental later permissive grant must not reveal session rows.
  await client.query('GRANT USAGE ON SCHEMA public TO anon, authenticated; GRANT SELECT ON public."UserSession" TO anon, authenticated')
  await client.query('CREATE POLICY fixture_allow ON public."UserSession" FOR SELECT TO anon, authenticated USING (true)')
  for (const role of ["anon", "authenticated"]) {
    await client.query(`SET LOCAL ROLE ${role}`)
    assert.equal((await client.query('SELECT count(*)::int AS n FROM public."UserSession"')).rows[0].n, 0)
    await client.query("RESET ROLE")
  }
  await client.query("ROLLBACK TO SAVEPOINT behavior")
  await client.query("COMMIT")
  console.log("PASS: missing-role compatibility, before/after RLS, API grants/deny policies, owner create/read/revoke, and API-role isolation")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  await client.end()
}
