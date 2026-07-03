# CI pipeline — PR checks and local parity

Every blocking GitHub Actions job on a pull request has a local equivalent. Run `npm run verify:ci` before push so PR CI only surfaces what you cannot run locally (Vercel preview approval, hosted deploy env, PR-only dependency diff).

## PR pipeline map

| GitHub job | Local command | What it catches |
|------------|---------------|-----------------|
| **lint-and-build** → Typecheck | `npm run typecheck` | Unused locals/parameters, type errors (`tsc --noEmit`) |
| **lint-and-build** → Lint | `npm run lint` | Unused imports/vars, `readonly` class fields, `Number.parseInt` / `Number.isNaN` (see ESLint rules in `eslint.config.mjs`) |
| **lint-and-build** → Build | `npm run build` | Next.js production compile + Prisma generate |
| **unit-tests** | `npm run test:unit:ci` | Vitest unit tests + LCOV coverage for Sonar |
| **docker-compose-validate** | `npm run validate:compose` | Staging compose secrets / interpolation |
| **dependency-review** | `npm audit --audit-level=critical` | Critical vulnerabilities in lockfile (PR also runs diff-based review, warn-only except critical) |
| **e2e-smoke** | `verify:ci` (Docker postgres-ci on **5436**) | Playwright smoke: auth, signup, core routes against real Postgres |
| **SonarQube Cloud** | `npm run sonar:local:full` (needs `SONAR_TOKEN`) | Cognitive complexity, duplication, security hotspots, coverage on new code |
| **Preview approved (Vercel)** | — | Human reviewer only |

**One command:** `npm run verify:ci` runs all rows except Sonar (optional with token) and the Vercel preview gate.

## What should fail in CI vs Sonar

| Issue class | Caught by | Examples |
|-------------|-----------|----------|
| Unused imports | **Lint** (`@typescript-eslint/no-unused-vars`) | `isFeatureEnabled` imported but unused |
| Useless assignments | **Typecheck** (`noUnusedLocals`) | `const isVercel = …` never read |
| `parseInt` / `isNaN` | **Lint** (`no-restricted-globals`) | Prefer `Number.parseInt`, `Number.isNaN` |
| Unreassigned class fields | **Sonar** | `private listeners` → `private readonly listeners` |
| High cognitive complexity | **Sonar** | Large functions needing refactor |
| Nested ternaries / duplication | **Sonar** | Structural maintainability |
| New dependency CVEs (critical) | **dependency-review** + `npm audit` | Lockfile vulnerabilities |
| Auth / signup regressions | **e2e-smoke** | Login flow, protected routes |
| Business logic regressions | **unit-tests** | `lib/**` unit coverage |

Sonar is for maintainability and security analysis that ESLint does not model. **Quick wins should never reach Sonar** — they should fail `npm run lint` or `npm run typecheck` on the PR.

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
