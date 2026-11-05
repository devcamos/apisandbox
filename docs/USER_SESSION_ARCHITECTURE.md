# Nexus user-session architecture

**Status:** Version 1.0, implemented in API Sandbox  
**Owner:** Nexus Motivus product owner; MotivusLabs maintains the reference implementation  
**Consumers:** Nexus web applications and browser-based APIs that need persistent, per-device sign-in  
**Support path:** Authentication owner → application on-call → MotivusLabs platform support

## Purpose

Keep a user signed in on each browser or device for up to 30 days while allowing the user or support team to revoke one device without logging out every other device.

This architecture is for interactive application sessions. It is not a replacement for scoped personal API tokens, OAuth provider tokens, or service-to-service credentials.

## Contract

### Login

1. Validate the identity and account state.
2. Create one UserSession row with device metadata, last-used time, and an expiry.
3. Issue a signed JWT containing sub, email, and sid (the UserSession.id).
4. Set the JWT in the HttpOnly, Secure in production, SameSite=Lax auth_token cookie.
5. Return the same token to the existing client auth response for compatibility. New clients should use the cookie and must not persist the token in localStorage.

Every independent browser profile or device login creates a separate row.

### Authenticated request

- Verify the JWT signature and expiry.
- Load UserSession by sid and userId.
- Reject the request when the session is missing, expired, or revoked.
- Touch lastUsedAt at most once every five minutes.

Server-rendered premium gates also validate the persisted session before returning
protected HTML/RSC content. A refresh with an existing sid must reuse an active
session or fail; it must never replace a revoked session with a new active row.

Tokens without sid remain temporarily accepted for backwards compatibility. A successful /api/auth/me response upgrades the browser to a session-bound token.

### Session management

| Operation | Endpoint | Result |
|---|---|---|
| List active devices | GET /api/auth/sessions | Device name, masked IP, last use, expiry, and current-device marker |
| Revoke one device | DELETE /api/auth/sessions/:id | Invalidates only that device; current-device revocation clears its cookie |
| Sign out other devices | DELETE /api/auth/sessions | Revokes every active session except the current one |
| Sign out current device | POST /api/auth/logout | Revokes the current session and clears the cookie |

All endpoints require server-side authentication and authorization by userId. Session IDs are not sufficient to access another user’s records.

## Data and security

UserSession stores:

- userId, timestamps, expiry, and revocation state;
- a coarse device label and truncated user agent;
- an IP address for security visibility, masked before it is returned to the user.

The database stores no bearer token or password. JWT signing still requires AUTH_JWT_SECRET (or its documented fallback). Keep AUTH_JWT_SECRET stable across instances and deployments so sessions do not fail over unpredictably.

Threat controls:

- HttpOnly cookies reduce script access to the browser session.
- SameSite=Lax, origin checks where required, and existing CSRF protections protect cookie-authenticated writes.
- Rate limiting remains on login and signup.
- A revoked session fails on the next request even if the JWT has not reached its expiry.
- User agents and IPs are bounded and are not used as authentication factors.
- API tokens continue to use their own scopes and lifecycle; website session cookies are rejected by /api/v1.

## Configuration

- AUTH_SESSION_MAX_AGE_SECONDS: database session lifetime; default 2592000 (30 days).
- AUTH_JWT_EXPIRES_IN_SECONDS: signed-token lifetime; default 2592000 (30 days).
- AUTH_IDLE_EXPIRES_IN_SECONDS: optional shorter inactivity lifetime; default is 30 days to support persistent login. Set a shorter value when the application’s risk profile requires it.

The JWT lifetime must not exceed the database session lifetime unless the application intentionally accepts an unusable tail period.

## Operations

Monitor:

- login success/failure rate;
- session validation failures by reason;
- active sessions per user;
- revoke-all and unusual multi-device activity;
- cleanup of expired/revoked rows.

Expired and revoked rows should be periodically deleted after the application’s audit-retention period. Until a cleanup job exists, the list endpoint hides them and indexes support expiry/user lookups.

Incident response:

1. Revoke the affected user’s sessions, or all sessions globally if signing material is compromised.
2. Rotate AUTH_JWT_SECRET if token forgery is suspected; this invalidates all JWTs.
3. Review authentication and session-management logs without logging tokens or passwords.
4. Redeploy and verify login, /api/auth/me, device listing, and revoke flows.

## Compatibility and rollout

1. Apply the UserSession creation and successor RLS-hardening migrations before enabling session-bound validation. Preview builds skip migrations; a Ready build alone does not establish schema readiness. Obtain approval for the exact database and migration action before applying either migration. Never use the Production database for Preview.
2. Deploy code that accepts legacy JWTs and upgrades them through /api/auth/me.
3. Confirm new logins create rows and revocation works in preview/staging.
4. Remove legacy-token acceptance only after the maximum old JWT lifetime has elapsed and all consumers have upgraded.

Rollback is code-reversible while retaining the table. Do not drop UserSession until all deployments and tokens using sid have expired.

### Preview schema readiness

When registration returns HTTP 503 with `Authentication service is temporarily unavailable`, inspect the exact deployed response and Prisma error evidence. This response maps missing-table/column errors (`P2021`/`P2022`); it does not identify the missing object. Check migration history and the expected `UserSession` columns on the confirmed isolated Preview database before applying a fix. A health check using `SELECT 1` is insufficient.

Inspect the existing migration baseline before choosing the approved execution command. This repository retains SQLite-era historical SQL; replaying its entire migration chain against a fresh PostgreSQL database is not a verified rollout path. Use `npm run db:migrate:deploy` only after confirming a compatible PostgreSQL baseline/history. Otherwise prepare the narrowly scoped PostgreSQL session SQL and its migration-history handling for separate review and approval on the confirmed Preview database. Retain history; do not rewrite previously applied migrations, use `db push` as a fallback, or move Preview migrations into the Vercel build. Inspect `UserSession` RLS, restrictive API-role policies and effective grants before running any remediation helper: `npm run db:check-rls:database` changes the database and can hide a migration-order defect.

Verify registration, login, `/api/auth/me`, two independent sessions and revocation on the exact Preview revision, then rerun the deployed E2E check. If the migration is blocked, retain the failing check and pause rollout; do not silently fall back to unrevocable sessions. Code rollback keeps the new table and its protection in place.

## Quality gates

The reference implementation must pass:

- typecheck and lint;
- unit tests for token claims, active/revoked/expired session validation, ownership checks, and logout;
- route tests for list, single revoke, and revoke-all;
- an authenticated browser smoke test covering two independent sessions and revoking one.

## Non-goals

- Device fingerprinting as an identity proof;
- storing raw refresh tokens;
- sharing a session between devices;
- replacing OAuth, MFA, password reset, or API-token policy;
- silently logging out every device after an ordinary password login.
