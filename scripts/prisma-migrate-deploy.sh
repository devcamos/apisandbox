#!/usr/bin/env bash
# Prisma migrate deploy with DIRECT_URL fallback.
# Schema declares directUrl = env("DIRECT_URL"). Until Preview sets a dedicated
# direct/session URL, reuse DATABASE_URL so Vercel builds keep working without
# changing dashboard secrets.
set -euo pipefail

if [[ -z "${DIRECT_URL:-}" ]]; then
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "DATABASE_URL is required for prisma migrate deploy" >&2
    exit 1
  fi
  export DIRECT_URL="$DATABASE_URL"
fi

exec npx prisma migrate deploy "$@"
