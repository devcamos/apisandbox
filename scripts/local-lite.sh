#!/bin/bash

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

is_port_in_use() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

wait_for_db() {
  local retries=30
  local host="${1:-localhost}"
  local port="${2:-5435}"

  for _ in $(seq 1 "$retries"); do
    if command -v pg_isready >/dev/null 2>&1; then
      pg_isready -h "$host" -p "$port" -U postgres >/dev/null 2>&1 && return 0
    elif command -v nc >/dev/null 2>&1; then
      nc -z "$host" "$port" >/dev/null 2>&1 && return 0
    else
      (echo > /dev/tcp/"$host"/"$port") >/dev/null 2>&1 && return 0
    fi
    sleep 1
  done
  return 1
}

echo ""
echo "API Sandbox - Local Dev"
echo "Starts postgres-dev (Docker) + Next.js dev server."
echo "For the staging stack use: npm run staging:lite"
echo ""

# ── Env file ──────────────────────────────────────────────────────────────────
if [ ! -f ".env.local" ]; then
  cp config/environments/local.env.example .env.local
  log_success "Created .env.local from local.env.example"
else
  log_info ".env.local already exists"
fi

# Guard: refuse to run local dev against the staging database
if grep -q 'localhost:5434' .env.local || grep -q 'apisandbox_staging' .env.local; then
  log_error ".env.local points at the staging database (port 5434 / apisandbox_staging)."
  log_error "Local dev must use the dev database on port 5433."
  log_error "Fix: run  npm run env:local  to reset, or edit .env.local manually."
  exit 1
fi

# ── Port check ────────────────────────────────────────────────────────────────
if is_port_in_use 4000; then
  log_error "Port 4000 is already in use. Free it before running local-lite."
  exit 1
fi

# ── Database ──────────────────────────────────────────────────────────────────
if grep -q 'localhost:5435/apisandbox_dev' .env.local; then
  if ! docker info >/dev/null 2>&1; then
    log_error "Docker is required (.env.local targets localhost:5435) but Docker is not available."
    exit 1
  fi

  log_info "Starting postgres-dev container on localhost:5435"
  npm run dev:db:up >/dev/null

  if wait_for_db localhost 5435; then
    log_success "postgres-dev is ready on localhost:5435"
  else
    log_error "postgres-dev did not become ready on localhost:5435"
    exit 1
  fi
else
  log_warning ".env.local does not target localhost:5435. Skipping Docker DB start."
fi

# ── Migrations & seed ─────────────────────────────────────────────────────────
log_info "Applying Prisma migrations"
npx prisma migrate deploy

log_info "Ensuring default test users exist"
node scripts/ensure-test-users.js

# ── Dev server ────────────────────────────────────────────────────────────────
log_success "Starting Next.js dev server on http://localhost:4000"
exec npm run dev
