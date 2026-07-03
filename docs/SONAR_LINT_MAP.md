# SonarCloud rule → ESLint / TypeScript mapping

CI runs these **before** SonarCloud so open-issue smells fail on the PR at `npm run lint` / `npm run typecheck`, not only in Sonar.

Source of truth for SonarJS ↔ ESLint parity: [SonarJS rules README](https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md).

## Open issues on `main` (mapped)

| Sonar rule | Sonar message (summary) | CI gate | ESLint / TS rule | Config |
|------------|-------------------------|---------|------------------|--------|
| **S1128** | Remove unused import | `npm run lint` | `sonarjs/unused-import` | `eslint.config.mjs` |
| | | | `@typescript-eslint/no-unused-vars` | backup for non-import symbols |
| **S1854** | Remove useless assignment | `npm run lint` + `npm run typecheck` | `sonarjs/no-dead-store` | `eslint.config.mjs` |
| | | | `noUnusedLocals` | `tsconfig.json` |
| **S2486** | Handle exception or don't catch | `npm run lint` | `sonarjs/no-ignored-exceptions` | `eslint.config.mjs` |
| **S3358** | Extract nested ternary | `npm run lint` | `sonarjs/no-nested-conditional` | `eslint.config.mjs` |
| **S3776** | Cognitive complexity ≤ 15 | `npm run lint` | `sonarjs/cognitive-complexity` | `["error", 15]` |
| **S6353** | Use `\d` not `[0-9]` | `npm run lint` | `sonarjs/concise-regex` | `eslint.config.mjs` |
| **S7764** | Prefer `globalThis` over `window` | `npm run lint` | `unicorn/prefer-global-this` | per [SonarJS delegated rules](https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md) |
| **S7773** | Prefer `Number.parseInt` / `Number.isNaN` | `npm run lint` | `unicorn/prefer-number-properties` | replaces ad-hoc `no-restricted-globals` |
| **S7778** | Do not call `Array#push()` multiple times | `npm run lint` | `unicorn/prefer-single-call` | `eslint.config.mjs` |
| **S2933** | Mark unreassigned members `readonly` | `npm run lint` | `@typescript-eslint/prefer-readonly` | requires `projectService` in ESLint |
| **S1607** | Skipped test needs reason | `npm run lint` | `sonarjs/no-skipped-tests` | `tests/**`; prod smoke gated via Playwright `prod-deployment` project |

## Still Sonar-only (not duplicated in ESLint)

| Category | Why Sonar |
|----------|-----------|
| Duplication on new code (CPD) | Cross-file copy-paste; `sonar.cpd.exclusions` in `sonar-project.properties` |
| Security hotspots | Taint analysis / security engine |
| Coverage on new code | LCOV from Vitest + `sonar.javascript.lcov.reportPaths` |
| Quality Gate aggregation | SonarCloud project settings |

## Plugins

| Package | Role |
|---------|------|
| `eslint-plugin-sonarjs` | Native SonarJS rules (`sonarjs/*`) |
| `eslint-plugin-unicorn` | Delegated rules Sonar maps to `unicorn/*` |
| `typescript-eslint` | `prefer-readonly` and typed checks |
| TypeScript compiler | `noUnusedLocals`, `noUnusedParameters` |

### Scope

Sonar parity ESLint rules apply to **`sonar.sources`** (same as `sonar-project.properties`):

- `app/api/**`
- `config/**`
- `lib/**`
- `middleware.ts`

`sonarjs/no-skipped-tests` applies to `tests/**`. Demo UI under `app/**` and `components/**` is not Sonar-analyzed for these smells; nested ternaries there are not lint-gated unless added to `sonar.sources`.

## Verify locally

```bash
npm run typecheck   # S1854 via noUnusedLocals
npm run lint        # all rows above with ESLint rules
npm run verify:ci   # full PR parity
```

After push, SonarCloud should report **0 new issues** for rules already enforced in lint — only structural findings Sonar alone covers should remain.
