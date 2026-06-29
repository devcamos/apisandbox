# Known errors

Use `gh pr checks` to identify the failing job before applying a recovery. The same symptom can have different causes in GitHub Actions and Vercel.

| Failing check or stage | Common cause | Recovery |
|------------------------|--------------|----------|
| Install dependencies | `package.json` and `package-lock.json` are out of sync | [Repair the lockfile](#npm-ci-rejects-the-lockfile) |
| `lint-and-build` | lint, type, environment validation, or Prisma generation error | [Reproduce the production build](#lint-and-build-fails) |
| `unit-tests` | failed assertion, missing mock, or coverage collection error | [Run unit CI locally](#unit-tests-or-coverage-fail) |
| `e2e-smoke` | schema, PostgreSQL, standalone server, or browser failure | [Run the full smoke environment](#e2e-smoke-fails) |
| `SonarQube Cloud` | new-code coverage, duplication, reliability, or security gate | [Inspect the quality gate](#sonarqube-cloud-quality-gate-fails) |
| Vercel | Neon preview-branch capacity is exhausted | [Check provisioning](#vercel-preview-fails-before-build-neon-branch-limit) |
| Architecture review | OpenAI configuration or PR comment permission | [Inspect review generation](#pr-architecture-intelligence-fails) |

## Vercel preview fails before build: Neon branch limit

### Symptoms

- The Vercel PR check fails immediately.
- The deployment reports `BUILD_FAILED: Resource provisioning failed`.
- Build duration is `0ms` and no application build logs exist.
- The deployment record reports `integrations.status: error`.
- Neon shows `Branch limit reached` (the Free plan currently allows 10 branches).

This is a Neon/Vercel provisioning failure, not a Next.js build failure. The Vercel integration tries to create `preview/<git-branch>` before running the application build. When Neon has no branch capacity, the deployment stops at that integration action.

### Cleanup policy

Keep the project at **no more than five total Neon branches**. This reserves capacity for new PR previews.

The cleanup command:

- always preserves `main` and every non-preview branch;
- checks each `preview/<name>` against the corresponding GitHub branch;
- only selects previews whose GitHub branch no longer exists;
- deletes oldest eligible branches first until the total is at most five;
- performs a dry run unless `--apply` is explicitly supplied.

### Run the cleanup

Create a Neon API key in the Neon Console and keep it out of the repository.

```bash
export NEON_API_KEY='<your Neon API key>'
export NEON_PROJECT_ID='shy-butterfly-04063890'

# Preview the deletion plan (no changes).
npm run neon:branches:cleanup

# Apply the reviewed plan, retaining no more than five total branches.
npm run neon:branches:cleanup -- --apply
```

`GITHUB_TOKEN` is optional for this public repository and avoids anonymous GitHub API rate limits. Override the defaults with `--max <count>`, `--repo <owner/name>`, or `--project-id <id>`.

After cleanup, redeploy the failed Vercel preview and verify the PR checks:

```bash
gh pr checks --watch
```

Do not delete branches directly unless their source Git branch or PR is confirmed closed or merged. Neon branch deletion removes that preview branch's isolated data.

## `npm ci` rejects the lockfile

### Symptoms

- Multiple jobs fail during **Install dependencies** before lint, tests, or build run.
- The log contains `EUSAGE`, `Missing ... from lock file`, or says the lockfile is not in sync.

### Recovery

Regenerate the lockfile with the repository's npm version, review the dependency changes, and commit both manifests when both changed:

```bash
npm install
npm ci
git diff -- package.json package-lock.json
```

Do not hand-edit `package-lock.json`. If only scripts changed in `package.json`, a lockfile change is normally unnecessary.

## `lint-and-build` fails

### Symptoms

- ESLint reports a file and rule, TypeScript reports an incompatible type, or Next.js fails while collecting/building routes.
- Prisma reports a missing datasource URL, incompatible engine, or client generation failure.
- The build imports a module that validates an absent environment variable.

### Recovery

Run the exact local parity command first:

```bash
npm run verify:ci
```

For a focused reproduction:

```bash
npm run lint
npm run build
```

Preserve the repository build contract: the build and postinstall commands unset `PRISMA_GENERATE_DATAPROXY` before `prisma generate`. Do not commit real credentials to make a build pass; add a non-secret CI placeholder only when the module validates configuration at build time.

## Unit tests or coverage fail

### Symptoms

- `unit-tests` reports a failed Vitest assertion, unhandled rejection, or module/mock error.
- Tests pass locally without coverage but fail while producing `coverage/lcov.info`.
- Sonar later reports insufficient coverage on new code.

### Recovery

Use the same coverage mode as CI:

```bash
npm run test:unit:ci
```

Run one affected test while iterating, then rerun the full command before pushing:

```bash
npm run test:unit -- tests/unit/<affected-test>.test.ts
npm run test:unit:ci
```

Add focused tests for changed modules already included by `vitest.config.ts`. Do not hide production files from coverage solely to clear the quality gate.

## E2E smoke fails

### Symptoms

- `e2e-smoke` fails during `prisma db push`, standalone-server preparation, login, or a Playwright assertion.
- The uploaded `playwright-smoke-report-json` or `playwright-report` contains the failing request or page state.

### Recovery

Run the full parity command; it creates the same disposable PostgreSQL service on port 5436 and prepares the standalone Next.js server:

```bash
npm run verify:ci
```

Before retrying, ensure Docker is running and port 4000 is free. Do not point smoke tests at a developer or production database. If schema synchronization fails, inspect `prisma/schema.prisma` and the PR migration together rather than bypassing the database step.

## SonarQube Cloud quality gate fails

### Symptoms

- Build and unit tests pass, but `SonarQube Cloud` fails after the scan.
- The gate reports new-code coverage, duplicated lines, reliability, maintainability, or security findings.

### Recovery

Generate coverage and run the optional local scan when `SONAR_TOKEN` is available:

```bash
npm run test:unit:ci
npm run sonar:local
```

After the GitHub scan completes, inspect its exact conditions:

```bash
npm run sonar:status
```

Fix the reported code or add meaningful tests. Do not lower the quality gate or broaden exclusions as the first response. An invalid or unauthorized Sonar token is intentionally skipped by the workflow and should not be confused with a failed quality gate.

## PR Architecture Intelligence fails

The workflow runs for PR `opened`, `synchronize`, and `reopened` events. A push to an open PR triggers `synchronize`. It also runs directly on pushes to `main`, `master`, `develop`, and `dev`, matching the CI/Sonar branch policy; push runs upload an artifact but do not post a PR comment.

### OpenAI request or secret

`Generate architecture review` fails when the required `OPENAI_API_KEY` is absent or OpenAI rejects the request. The workflow still uploads `pr-review.md` and updates the sticky PR comment. It also writes a safe error annotation and job summary with the recovery action. API keys and recognizable key fragments are redacted from those outputs.

Verify the repository Actions secret is named exactly `OPENAI_API_KEY`. The optional repository variable `OPENAI_REVIEW_MODEL` selects the model; otherwise the script uses its default.

| Reported error | Recovery |
|----------------|----------|
| HTTP 401 authentication failure | Replace `OPENAI_API_KEY` with a valid repository Actions secret. |
| HTTP 403 permission failure | Confirm the API project and key can use the configured model. |
| HTTP 404 model unavailable | Correct or remove `OPENAI_REVIEW_MODEL`; removing it uses `gpt-4.1-mini`. |
| HTTP 429 insufficient quota | Check API billing and project limits. |
| HTTP 429 rate limit | Wait for the limit window to reset and rerun the job. |
| HTTP 5xx service error | Retry, then check OpenAI service status if it persists. |

The PR metadata variables are supplied by GitHub and are not secret configuration. `OPENAI_REVIEW_MODEL` is optional, so do not add it to a required-variable check.

### Sticky comment permission

If **Post sticky pull request comment** reports `Resource not accessible by integration`, keep this workflow permission:

```yaml
permissions:
  contents: read
  pull-requests: write
```

Fork pull requests intentionally skip comment posting because their token and secret access are restricted. Do not switch the workflow to `pull_request_target` to expose secrets to untrusted PR code.

## Local push rejects a workflow file

### Symptom

GitHub rejects a push with `refusing to allow an OAuth App to create or update workflow ... without workflow scope`.

### Recovery

Use the repository's configured SSH remote, or refresh the GitHub CLI authentication with the `workflow` scope. This is a publishing credential failure, not a failure in the workflow YAML or application build.

Never remove the workflow file merely to bypass the credential check.
