#!/usr/bin/env bash
# Local mirror of .github/workflows/ci.yml blocking jobs.
# Principle: GitHub should only surface surprises we cannot run here (preview approval, Vercel env, PR-only dependency diff).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32mOK\033[0m %s\n' "$*"; }

# --- CI env (matches workflow env + e2e-smoke job) ---
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=6144}"
export NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
export AUTH_SECRET="${AUTH_SECRET:-github-actions-ci-placeholder-secret-min-32-chars}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-$AUTH_SECRET}"
export RESEND_API_KEY="${RESEND_API_KEY:-github-actions-ci-resend-placeholder}"
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-http://127.0.0.1:4000}"
export CI=true

BUILD_DATABASE_URL="${BUILD_DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:5432/_build_placeholder}"
E2E_DATABASE_URL="${E2E_DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:5436/apisandbox_ci}"

cleanup_ci_postgres() {
  docker compose -f docker-compose.yml -f docker-compose.ci.yml --profile ci down -v >/dev/null 2>&1 || true
}
trap cleanup_ci_postgres EXIT

if lsof -nP -iTCP:4000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 4000 is in use. Stop npm run dev before verify:ci (Playwright starts its own server)."
  exit 1
fi

log "lint-and-build (job: lint-and-build)"
export DATABASE_URL="$BUILD_DATABASE_URL"
npm run typecheck
npm run lint
npm run build
ok "typecheck + lint + build"

log "unit-tests with coverage (job: unit-tests)"
mkdir -p reports
npx vitest run --coverage --reporter=default
ok "unit tests + coverage"

log "docker-compose-validate (job: docker-compose-validate)"
npm run validate:compose
ok "compose config"

log "dependency audit (approximates dependency-review critical gate)"
npm audit --audit-level=critical
ok "npm audit (critical)"

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo "Docker is required for e2e-smoke parity (postgres-ci on localhost:5436)."
  exit 1
fi

log "e2e-smoke (job: e2e-smoke)"
docker compose -f docker-compose.yml -f docker-compose.ci.yml --profile ci up -d postgres-ci

ready=0
for _ in $(seq 1 30); do
  if docker compose -f docker-compose.yml -f docker-compose.ci.yml --profile ci exec -T postgres-ci pg_isready -U postgres -d apisandbox_ci >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done
if [[ "$ready" -ne 1 ]]; then
  echo "postgres-ci did not become ready on localhost:5436"
  exit 1
fi

export DATABASE_URL="$E2E_DATABASE_URL"
npx prisma db push --accept-data-loss
npx playwright install chromium --with-deps >/dev/null 2>&1 || npx playwright install chromium

export CI_E2E_USE_PROD_SERVER=1
export PLAYWRIGHT_WORKERS=3
bash scripts/prepare-smoke-standalone.sh
PLAYWRIGHT_JSON_OUTPUT_NAME=reports/playwright-smoke.json \
PLAYWRIGHT_JUNIT_OUTPUT_NAME=reports/playwright-smoke-junit.xml \
  npx playwright test tests/ci-smoke.spec.ts --project=chromium --reporter=line

ok "e2e smoke"

if [[ -n "${SONAR_TOKEN:-}" ]] && command -v docker >/dev/null 2>&1; then
  log "sonarcloud (optional — job: sonarcloud, when SONAR_TOKEN is set)"
  npm run sonar:local
  ok "sonar local scan"
else
  log "sonarcloud skipped (set SONAR_TOKEN to mirror CI Sonar job locally)"
fi

log "All local CI parity checks passed."
echo ""
echo "GitHub-only steps (not duplicated here):"
echo "  - Preview approved (Vercel) — human reviewer"
echo "  - Vercel Preview deploy — hosted build/env"
echo "  - dependency-review — PR dependency diff (run npm audit above for critical vulns)"
