# Retire legacy Preview database configuration

Owner: API Sandbox / devcamos. Scope: the `apisandbox` Vercel project, Preview only.
This runbook is the separate cleanup follow-up to [PR71](https://github.com/devcamos/apisandbox/pull/71).
The migration is complete; the removals below are pending review and execution.
Merging this documentation PR does not delete cloud resources.

## Current state and evidence

- Vercel project: `prj_B0un4fVtd2kPBF0t3h7RWzifptaV`, team `team_BerIQ4WYo1yEEMYS1AmTXiIc` (`devonte-amos-projects`).
- Preview Neon: `super-butterfly-26338757`, branch `br-mute-violet-bccmzc6b` (`preview`), database `apisandbox_preview`.
- Preview runtime uses pooled `DATABASE_URL`; schema operations use unpooled `DIRECT_URL`.
- `POSTGRES_PRISMA_URL`, `POSTGRES_URL` and `POSTGRES_URL_NON_POOLING` were updated to Neon; preserve them.
- [Hosted verification](https://github.com/devcamos/apisandbox/actions/runs/42385852624) passed health, registration/login/dashboard and real Stripe TEST payment → webhook → PREMIUM at `2f72377`.
- The shared `apisandbox-billing-preview.vercel.app` webhook alias targets that Neon-backed Git deployment. Keep its existing alias protection override; unsigned GET returns405 and unsigned POST returns400.
- Metadata inspection on2026-11-07 found the13 legacy variables below scoped exclusively to Preview, with no branch override or integration configuration ID. No values were retrieved.
- A team-level Supabase Marketplace installation exists (`icfg_MASgbjNOTdPGE4fC5Qz1ljB6`), but its response lists no selected projects. That does not establish ownership or absence of other consumers. Do not uninstall the team integration as part of project-variable cleanup.

## Reviewable removal list

These names have no runtime/tooling environment lookups in this repository. Confirm the list against current source and Vercel metadata immediately before execution.

| Preview variable | Reason |
| --- | --- |
| `SUPABASE_URL` | Retired provider URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Retired browser provider URL |
| `SUPABASE_ANON_KEY` | No Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No Supabase client |
| `SUPABASE_PUBLISHABLE_KEY` | No Supabase client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No Supabase client |
| `SUPABASE_SECRET_KEY` | No Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | No Supabase client |
| `SUPABASE_JWT_SECRET` | App JWT uses `AUTH_JWT_SECRET` / existing auth secrets |
| `POSTGRES_DATABASE` | Legacy discrete credential; app resolves connection URLs |
| `POSTGRES_HOST` | Legacy discrete credential; app resolves connection URLs |
| `POSTGRES_PASSWORD` | Legacy discrete credential; app resolves connection URLs |
| `POSTGRES_USER` | Legacy discrete credential; app resolves connection URLs |

Preserve every Production/Development entry, all auth/Stripe secrets, and the five Neon connection URL settings. The same `POSTGRES_*` names also exist in Production; never delete by name without checking target scope.

## Execution and verification

1. Confirm the owner has approved this removal list. Use Vercel's project environment-variable API/dashboard to select the exact Preview-only records by ID. Abort for a mixed target, changed ownership, or new consumer; do not retrieve or log values.
2. Remove only the13 listed Preview entries. Record removed names/IDs and time in the operational handoff outside this repository. Do not uninstall a team integration or delete a database through this step.
3. Trigger a Git Preview deployment of the reviewed cleanup revision. Existing immutable deployments keep their original settings, including old credentials. Check Preview DB/auth health and run the deployed registration/login and real TEST billing suite; do not weaken checks or send live payments.
4. Verify the shared webhook ingress still uses Neon and remains publicly reachable only as already configured. Keep signature verification. Repoint it to a new reviewed Preview revision only when needed; test unsigned GET405/POST400 and actual Stripe delivery.
5. Reinspect variable metadata to confirm only the named Preview entries disappeared. Confirm Production configuration is unchanged. Record deployment SHA/URL and checks in the cleanup PR.

## Retained database and recovery

The old Supabase database is retained. Before deleting it, identify the exact provider project through the owner/provider console, check other applications, integrations and old deployment consumers, establish whether any data needs an export, and agree a retention/deletion date. None of those checks is established by an unused environment variable or a team integration listing. Obtain explicit approval for that identified database deletion; never delete by a guessed project reference.

Removing Vercel variables does not revoke provider credentials. At final retirement, invalidate credentials and remove the identified resource through the provider, after consumer/data-retention checks. Old immutable deployment URLs may still carry credentials until those deployments or credentials are retired.

For a failed cleanup rollout, keep the last verified Neon-backed Preview serving traffic and the billing alias on the same Neon database. Restore only required configuration through the provider's secure credential flow; do not copy values from logs or switch back to Supabase without an explicit data-consistency decision. Production recovery is a separate release operation.

Keep historical Prisma RLS migrations, generic PostgreSQL compatibility tests, and Supabase learning material: they are not active provider dependencies. Do not rewrite migration history or remove pooling error handling during this cleanup.
