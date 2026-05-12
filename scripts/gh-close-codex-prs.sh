#!/usr/bin/env bash
# Close stale Codex PRs (#1–#5) after SaaS merge (#6). Requires: gh auth login
set -euo pipefail
COMMENT="Superseded by main after #6 (SaaS integration). Codex branches not rebased onto current main; closing to clear the queue. Reopen or cherry-pick if we revive this work."

for n in 1 2 3 4 5; do
  gh pr close "$n" --comment "$COMMENT"
done

echo "Done. Optional: delete remote branches if unused:"
echo "  git push origin --delete codex/dashboard-learning-explorer-pr codex/guided-dashboard-paths codex/public-search-navigation-20260418 codex/search-recent-navigation-pr codex/search-recent-navigation-staging"
