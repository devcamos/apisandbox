#!/usr/bin/env bash
# Print SonarCloud Quality Gate status for the current branch (or a PR).
# Use after each commit once CI has finished, or after npm run sonar:local:full.
#
# Usage:
#   npm run sonar:status
#   SONAR_PR=18 npm run sonar:status
#   SONAR_BRANCH=main npm run sonar:status
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT_KEY="${SONAR_PROJECT_KEY:-devcamos_apisandbox}"
HOST="${SONAR_HOST_URL:-https://sonarcloud.io}"

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
  echo "SONAR_TOKEN not set. Add to .env.local or export it (SonarCloud → My Account → Security)."
  echo "Without a token, use GitHub: gh pr checks --watch  (look for 'SonarQube Cloud')"
  echo "Dashboard: https://sonarcloud.io/project/overview?id=${PROJECT_KEY}"
  exit 2
fi

BRANCH="${SONAR_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"
PR="${SONAR_PR:-}"

QS_PARAMS="projectKey=${PROJECT_KEY}"
if [[ -n "$PR" ]]; then
  QS_PARAMS="${QS_PARAMS}&pullRequest=${PR}"
else
  QS_PARAMS="${QS_PARAMS}&branch=${BRANCH}"
fi

URL="${HOST}/api/qualitygates/project_status?${QS_PARAMS}"
JSON="$(curl -fsS -u "${SONAR_TOKEN}:" "$URL")"

STATUS="$(echo "$JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('projectStatus',{}).get('status','UNKNOWN'))")"

echo "SonarCloud Quality Gate — ${PROJECT_KEY}"
if [[ -n "$PR" ]]; then
  echo "  Pull request: #${PR}"
else
  echo "  Branch: ${BRANCH}"
fi
echo "  Status: ${STATUS}"
echo "  https://sonarcloud.io/project/overview?id=${PROJECT_KEY}"
echo ""

echo "$JSON" | python3 -c "
import json, sys
data = json.load(sys.stdin)
conds = data.get('projectStatus', {}).get('conditions', [])
if not conds:
    print('  (no conditions returned)')
    sys.exit(0)
for c in conds:
    key = c.get('metricKey', '?')
    st = c.get('status', '?')
    actual = c.get('actualValue', '—')
    thresh = c.get('errorThreshold', '—')
    mark = '✓' if st == 'OK' else '✗'
    print(f'  {mark} {key}: {st} (actual={actual}, threshold={thresh})')
"

if [[ "$STATUS" == "OK" ]]; then
  exit 0
fi
exit 1
