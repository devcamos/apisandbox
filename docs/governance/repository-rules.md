# Repository rules — apisandbox

## Product application
Preserve API contracts, server authorization, tenant/household isolation, billing boundaries and synthetic test identities. Shared standards do not authorize new features or infrastructure changes.

## Verification
Current commands (package.json is authoritative):

```text
npm run verify:ci:strict
npm run test:unit:ci
npm run lint
npm run typecheck
npm run build
npm run test:ci:smoke
```

## Boundaries and evidence
Local PostgreSQL uses npm run dev:db:up (5435), app port 4000. Read docs/AGENT_ONBOARDING.md and docs/AGENT_PR_CHECKLIST.md. Never use prisma db push/reset as an automatic fallback after failed migrations; obtain approval for the exact action/environment.

Use feature PRs; no direct main push, auto-merge, gate bypass or unapproved merge/release. Shared timing/permissions apply with only explicit scoped exceptions. Preserve stricter existing controls. Documentation-only changes check links/paths/commands; they do not change runtime behavior, gates, credentials or migrations.
