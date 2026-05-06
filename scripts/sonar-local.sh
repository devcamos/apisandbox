#!/usr/bin/env bash
# Run the same SonarCloud analysis as CI, using repo-root sonar-project.properties.
# Prerequisites: Docker, SONAR_TOKEN, and coverage/lcov.info (see npm run sonar:local:full).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Install Docker, or run sonar-scanner-cli manually against https://sonarcloud.io"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not running."
  exit 1
fi

if [[ -z "${SONAR_TOKEN:-}" ]]; then
  for f in .env.local .env; do
    if [[ -f "$f" ]] && grep -qE '^[[:space:]]*SONAR_TOKEN=' "$f"; then
      line="$(grep -E '^[[:space:]]*SONAR_TOKEN=' "$f" | head -1)"
      val="${line#*=}"
      val="${val%%#*}"
      val="$(echo "$val" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
      export SONAR_TOKEN="$val"
      break
    fi
  done
fi

if [[ -z "${SONAR_TOKEN:-}" ]]; then
  echo "Set SONAR_TOKEN (SonarCloud → My Account → Security)."
  echo "Tip: add SONAR_TOKEN=... to .env.local (gitignored)."
  exit 1
fi

if [[ ! -f coverage/lcov.info ]]; then
  echo "Missing coverage/lcov.info. Run: npm run test:unit -- --coverage"
  exit 1
fi

BRANCH="${SONAR_BRANCH_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
SCANNER_IMAGE="${SONAR_SCANNER_IMAGE:-sonarsource/sonar-scanner-cli:latest}"

EXTRA_ARGS=()
if [[ -f sonar-project.local.properties ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// /}" ]] && continue
    if [[ "$line" =~ ^[[:space:]]*([^=]+)=(.*)$ ]]; then
      key="$(echo "${BASH_REMATCH[1]}" | tr -d '[:space:]')"
      val="${BASH_REMATCH[2]}"
      val="${val%%#*}"
      val="$(echo "$val" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
      EXTRA_ARGS+=("-D${key}=${val}")
    fi
  done < sonar-project.local.properties
fi

echo "Using scanner image: ${SCANNER_IMAGE}"
echo "Branch for analysis: ${BRANCH}"

run_scanner() {
  exec docker run --rm \
    -e SONAR_TOKEN \
    -v "${ROOT}:/usr/src" \
    "${SCANNER_IMAGE}" \
    -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.projectBaseDir=/usr/src \
    -Dsonar.branch.name="${BRANCH}" \
    -Dsonar.branch.target="${SONAR_BRANCH_TARGET:-main}" \
    "$@"
}

# Bash 3.2 + set -u: "${EMPTY_ARRAY[@]}" errors when the array has no elements.
if [[ ${#EXTRA_ARGS[@]} -gt 0 ]]; then
  run_scanner "${EXTRA_ARGS[@]}" "$@"
else
  run_scanner "$@"
fi
