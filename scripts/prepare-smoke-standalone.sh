#!/usr/bin/env bash
# Copy static assets into Next standalone output so smoke tests can use node server.js.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .next/standalone/server.js ]]; then
  echo "Missing .next/standalone/server.js — run npm run build first."
  exit 1
fi

mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
if [[ -d public ]]; then
  cp -r public .next/standalone/public
else
  mkdir -p .next/standalone/public
fi
