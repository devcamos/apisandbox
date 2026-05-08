#!/usr/bin/env bash
# Fail if staging compose is invalid or secret interpolation breaks (regression gate).
set -euo pipefail
: "${AUTH_SECRET:?AUTH_SECRET must be set (min 32 chars). For local: export AUTH_SECRET=...}"
docker compose -f docker-compose.yml -f docker-compose.staging.yml config >/dev/null
echo "docker compose config: OK"
