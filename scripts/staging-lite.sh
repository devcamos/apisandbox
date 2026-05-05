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
  local port="${2:-5434}"

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
echo "API Sandbox - Staging"
echo "Runs the full staging stack: postgres-staging + app-staging via Docker Compose."
echo ""

if ! docker info >/dev/null 2>&1; then
  log_error "Docker is required for the staging environment."
  exit 1
fi

if is_port_in_use 4000; then
  log_warning "Port 4000 is already in use. The staging app container may fail to bind."
  log_warning "Stop the local dev server first: kill \$(lsof -ti:4000)"
fi

log_info "Starting staging containers (postgres-staging + app-staging)"
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

if wait_for_db localhost 5434; then
  log_success "postgres-staging is ready on localhost:5434"
else
  log_error "postgres-staging did not become ready on localhost:5434"
  docker compose -f docker-compose.yml -f docker-compose.staging.yml logs postgres-staging
  exit 1
fi

log_info "Applying Prisma migrations to staging database"
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/apisandbox_staging" npx prisma migrate deploy

log_success "Staging stack is running"
echo ""
echo "  App:      http://localhost:4000"
echo "  Postgres: localhost:5434  (apisandbox_staging)"
echo ""
echo "  Logs:     npm run staging:logs"
echo "  Stop:     npm run staging:down"
echo ""
