#!/usr/bin/env bash

set -euo pipefail

readonly RUNNER_USER="actions"
readonly RUNNER_HOME="/opt/actions-runner"
readonly MODEL="${AI_RUNNER_MODEL:-qwen2.5-coder:7b}"
readonly MIN_MEMORY_KIB=15000000
readonly MIN_DISK_KIB=25000000

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

if [[ "${EUID}" -ne 0 ]]; then
  fail "Run this script with sudo on the dedicated Ubuntu host."
fi
[[ "${MODEL}" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*(:[A-Za-z0-9._-]+)?$ ]] || fail "AI_RUNNER_MODEL contains unsupported characters."

[[ -r /etc/os-release ]] || fail "Cannot identify the operating system."
# shellcheck disable=SC1091
source /etc/os-release
[[ "${ID:-}" == "ubuntu" ]] || fail "This bootstrap supports Ubuntu only."
dpkg --compare-versions "${VERSION_ID:-0}" ge "22.04" || fail "Ubuntu 22.04 or newer is required."

cpu_count="$(getconf _NPROCESSORS_ONLN)"
memory_kib="$(awk '/MemTotal:/ { print $2 }' /proc/meminfo)"
disk_kib="$(df -Pk / | awk 'NR == 2 { print $4 }')"

(( cpu_count >= 4 )) || fail "At least 4 CPU cores are required; found ${cpu_count}."
(( memory_kib >= MIN_MEMORY_KIB )) || fail "At least 16 GB RAM is required."
(( disk_kib >= MIN_DISK_KIB )) || fail "At least 25 GB free disk is required."

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
  build-essential \
  ca-certificates \
  curl \
  git \
  gzip \
  jq \
  tar \
  xz-utils

if ! getent group "${RUNNER_USER}" >/dev/null 2>&1; then
  groupadd "${RUNNER_USER}"
fi
if ! id -u "${RUNNER_USER}" >/dev/null 2>&1; then
  useradd --create-home --gid "${RUNNER_USER}" --shell /bin/bash "${RUNNER_USER}"
fi
install -d -m 0750 -o "${RUNNER_USER}" -g "${RUNNER_USER}" "${RUNNER_HOME}"

if ! command -v ollama >/dev/null 2>&1; then
  installer="$(mktemp)"
  trap 'rm -f "${installer:-}"' EXIT
  curl --fail --silent --show-error --location https://ollama.com/install.sh --output "${installer}"
  sh "${installer}"
fi

install -d -m 0755 /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/ai-runner.conf <<'EOF'
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_CONTEXT_LENGTH=32768"
EOF
chmod 0644 /etc/systemd/system/ollama.service.d/ai-runner.conf

systemctl daemon-reload
systemctl enable --now ollama

for attempt in {1..20}; do
  if curl --fail --silent http://127.0.0.1:11434/api/tags >/dev/null; then
    break
  fi
  if [[ "${attempt}" -eq 20 ]]; then
    fail "Ollama did not become healthy. Inspect: journalctl -u ollama"
  fi
  sleep 1
done

ollama pull "${MODEL}"
curl --fail --silent http://127.0.0.1:11434/api/tags >/dev/null

printf '\nHost provisioning complete.\n'
printf 'Runner directory: %s (owner: %s)\n' "${RUNNER_HOME}" "${RUNNER_USER}"
printf 'Ollama endpoint: http://127.0.0.1:11434\n'
printf 'Model: %s\n' "${MODEL}"
printf '\nNext: follow README.md to register the GitHub runner. Do not pass a token to this script.\n'
