-- UserSession is created after the blanket public-schema hardening migrations.
-- Keep session metadata server-only while preserving owner-backed Prisma access.
ALTER TABLE public."UserSession" ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON public."UserSession" FROM %I', role_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public."UserSession"',
                     'deny_' || role_name);
      EXECUTE format(
        'CREATE POLICY %I ON public."UserSession" AS RESTRICTIVE FOR ALL TO %I USING (false) WITH CHECK (false)',
        'deny_' || role_name, role_name
      );
    END IF;
  END LOOP;
END $$;
