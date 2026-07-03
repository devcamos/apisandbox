# CI pipeline — PR checks and local parity

Every blocking GitHub Actions job on a pull request has a local equivalent. Run `npm run verify:ci` before push so PR CI only surfaces what you cannot run locally (Vercel preview approval, hosted deploy env, PR-only dependency diff).

## PR pipeline map

| GitHub job | Local command | What it catches |
|------------|---------------|-----------------|
| **lint-and-build** → Typecheck | `npm run typecheck` | Unused locals/parameters, type errors (`tsc --noEmit`) |
| **lint-and-build** → Lint | `npm run lint` | Sonar parity rules — see [SONAR_LINT_MAP.md](./SONAR_LINT_MAP.md) |
| **lint-and-build** → Build | `npm run build` | Next.js production compile + Prisma generate |
| **unit-tests** | `npm run test:unit:ci` | Vitest unit tests + LCOV coverage for Sonar |
| **docker-compose-validate** | `npm run validate:compose` | Staging compose secrets / interpolation |
| **dependency-review** | `npm audit --audit-level=critical` | Critical vulnerabilities in lockfile (PR also runs diff-based review, warn-only except critical) |
| **e2e-smoke** | `verify:ci` (Docker postgres-ci on **5436**) | Playwright smoke: auth, signup, core routes against real Postgres |
| **SonarQube Cloud** | `npm run sonar:local:full` (needs `SONAR_TOKEN`) | Cognitive complexity, duplication, security hotspots, coverage on new code |
| **Preview approved (Vercel)** | — | Human reviewer only |

**One command:** `npm run verify:ci` runs all rows except Sonar (optional with token) and the Vercel preview gate.

## What should fail in CI vs Sonar

See **[SONAR_LINT_MAP.md](./SONAR_LINT_MAP.md)** for the full Sonar rule ID → ESLint rule table.

| Issue class | Caught by | ESLint / TS rule (examples) |
|-------------|-----------|----------------------------|
| Unused imports | **Lint** | `sonarjs/unused-import`, `@typescript-eslint/no-unused-vars` |
| Useless assignments | **Lint** + **Typecheck** | `sonarjs/no-dead-store`, `noUnusedLocals` |
| Nested ternaries | **Lint** | `sonarjs/no-nested-conditional` |
| Cognitive complexity | **Lint** | `sonarjs/cognitive-complexity` (threshold 15) |
| `parseInt` / `isNaN` | **Lint** | `unicorn/prefer-number-properties` |
| `globalThis` vs `window` | **Lint** | `unicorn/prefer-global-this` |
| Multiple `.push()` | **Sonar** | S7778 — no ESLint 9–compatible rule |
| `readonly` members | **Lint** | `@typescript-eslint/prefer-readonly` |
| Ignored catch blocks | **Lint** | `sonarjs/no-ignored-exceptions` |
| Skipped tests | **Lint** | `sonarjs/no-skipped-tests` |
| Duplication on new code | **Sonar** | CPD engine only |
| New dependency CVEs (critical) | **dependency-review** + `npm audit` | Lockfile vulnerabilities |
| Auth / signup regressions | **e2e-smoke** | Login flow, protected routes |
| Business logic regressions | **unit-tests** | `lib/**` unit coverage |

Sonar is for duplication, security hotspots, and coverage gates that ESLint does not model. **All mapped Sonar code smells should fail `npm run lint` or `npm run typecheck` on the PR** — see [SONAR_LINT_MAP.md](./SONAR_LINT_MAP.md).

## Area-specific integration tests (not in default CI)

Run when you touch the matching subsystem:

| Area | Command |
|------|---------|
| Auth / subscriptions | `CI=1 npx playwright test tests/unified-auth.spec.ts --project=chromium` |
| Navigation / session | `CI=1 npx playwright test tests/navigation-auth.spec.ts --project=chromium` |
| Dashboard | `CI=1 npx playwright test tests/dashboard.spec.ts --project=chromium` |

## After push

```bash
gh pr checks --watch   # includes SonarQube Cloud
```

Optional: `npm run sonar:status` with `SONAR_TOKEN` in `.env.local`.

See also: [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md), `.cursor/rules/green-builds.mdc`.
