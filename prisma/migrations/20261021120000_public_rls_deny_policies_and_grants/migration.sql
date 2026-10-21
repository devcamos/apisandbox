-- Follow-up to 20261008120000_enable_public_rls.
--
-- Why: Supabase's security advisor (17 Oct 2026) still flags
-- apisandbox-preview-db for `rls_disabled_in_public` and
-- `sensitive_columns_exposed` (e.g. "User"."passwordHash", "Account" OAuth
-- tokens, "ApiToken"."tokenHash", "VerificationToken"."token"). Preview builds
-- skip `prisma migrate deploy` (see scripts/migrate-on-production.mjs), so the
-- 8 Oct hardening was never applied there. This migration is idempotent and
-- can be applied to Preview manually (`npm run db:check-rls:database`) and
-- runs on Production through the normal migrate deploy.
--
-- What it adds on top of 20261008120000:
--   1) Re-enables RLS on every public table (covers any table created since).
--   2) Explicit RESTRICTIVE deny-all policies for the Supabase API roles
--      (anon, authenticated) so intent is visible and the advisor's
--      "RLS enabled, no policy" note is answered. Prisma connects as the table
--      owner, which bypasses RLS, so the app is unaffected.
--   3) Re-revokes anon/authenticated table, sequence and function privileges,
--      and explicitly revokes column privileges on the sensitive columns.
--   4) Default privileges FOR ROLE postgres (the Supabase role that creates
--      tables via the dashboard / migrations), not only the current role.
--
-- Supabase 30 Oct 2026 change: new tables in "public" no longer get automatic
-- Data API grants. That matches this app's design: we deliberately add NO
-- grants to anon/authenticated for new tables. Prisma (owner) needs none.
-- Any future table meant for the Data API must GRANT explicitly in the same
-- migration that creates it, with matching RLS policies.

-- 1) RLS on, and 2) deny-all policies for API roles.
DO $$
DECLARE
  r RECORD;
  has_anon boolean := EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon');
  has_auth boolean := EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated');
  roles text;
BEGIN
  roles := concat_ws(', ',
    CASE WHEN has_anon THEN 'anon' END,
    CASE WHEN has_auth THEN 'authenticated' END);

  FOR r IN
    SELECT c.relname AS tablename
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);

    IF roles <> '' THEN
      EXECUTE format('DROP POLICY IF EXISTS deny_supabase_api_roles ON public.%I', r.tablename);
      EXECUTE format(
        'CREATE POLICY deny_supabase_api_roles ON public.%I AS RESTRICTIVE FOR ALL TO %s USING (false) WITH CHECK (false)',
        r.tablename,
        roles
      );
    END IF;
  END LOOP;
END $$;

-- 3) Revoke API-role privileges (tables, sequences, functions, sensitive columns).
DO $$
DECLARE
  role_name text;
  col RECORD;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', role_name);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', role_name);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', role_name);

      FOR col IN
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND (table_name, column_name) IN (
            ('User', 'passwordHash'),
            ('User', 'email'),
            ('Account', 'access_token'),
            ('Account', 'refresh_token'),
            ('Account', 'id_token'),
            ('Session', 'sessionToken'),
            ('ApiToken', 'tokenHash'),
            ('VerificationToken', 'token')
          )
      LOOP
        EXECUTE format(
          'REVOKE ALL (%I) ON public.%I FROM %I',
          col.column_name, col.table_name, role_name
        );
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- 4) Future objects: revoke defaults for the current role and for postgres.
DO $$
DECLARE
  role_name text;
  owner_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', role_name);
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', role_name);
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', role_name);

      FOREACH owner_name IN ARRAY ARRAY['postgres'] LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = owner_name)
           AND owner_name <> current_user
           AND pg_has_role(current_user, owner_name, 'MEMBER') THEN
          EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM %I', owner_name, role_name);
          EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', owner_name, role_name);
          EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', owner_name, role_name);
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END $$;
