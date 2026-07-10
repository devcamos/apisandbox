# Provision the self-hosted Architecture Intelligence runner

This package prepares a dedicated Ubuntu machine for trusted Architecture Intelligence jobs using Ollama. Read [REQUIREMENTS.md](./REQUIREMENTS.md) before provisioning.

The bootstrap installs host dependencies and Ollama, creates an unprivileged runner account, prepares `/opt/actions-runner`, binds Ollama to localhost, and downloads `qwen2.5-coder:7b`. It deliberately does not configure SSH/firewall rules, register the GitHub runner, accept credentials, or modify workflow triggers.

## 1. Create and isolate the host

Provision an Ubuntu 24.04 x64 machine meeting the documented CPU, memory, and disk requirements.

Before running the bootstrap:

1. Restrict SSH to your IP or private management network.
2. Deny other inbound traffic.
3. Place the host outside networks containing production databases or personal devices.
4. Do not copy application secrets, SSH keys, `.env` files, or cloud credentials onto it.

Do not automate firewall activation until SSH access has been tested; an incorrect rule can lock you out of a remote host.

## 2. Copy and review the provisioning package

Copy this directory to the host using your approved administration channel. Review the script before running it:

```bash
less provision-ubuntu.sh
less REQUIREMENTS.md
```

The script supports this optional environment override:

| Variable | Default |
|----------|---------|
| `AI_RUNNER_MODEL` | `qwen2.5-coder:7b` |

## 3. Provision Ubuntu

Run from this directory:

```bash
sudo bash ./provision-ubuntu.sh
```

The script stops before changing the machine when Ubuntu, CPU, memory, or disk requirements are not met.

Verify the services:

```bash
systemctl status ollama --no-pager
curl --fail http://127.0.0.1:11434/api/tags | jq .
ollama run qwen2.5-coder:7b "Reply exactly: runner ready"
```

Port 11434 must respond through `127.0.0.1` and must not be reachable from another machine.

## 4. Register the GitHub runner

Open the repository:

**Settings → Actions → Runners → New self-hosted runner → Linux → x64**

GitHub displays version-specific download, extraction, and registration commands plus a temporary token. Run those generated commands as the unprivileged account:

```bash
sudo -iu actions
cd /opt/actions-runner
# Skip GitHub's mkdir/cd line because this directory already exists.
# Paste its download, checksum, extract, and config commands here.
```

Use these configuration values when prompted:

| Setting | Value |
|---------|-------|
| Runner name | `apisandbox-ai-01` |
| Additional labels | `ollama,ai-review` |
| Work directory | `_work` |

Do not run `config.sh` with `sudo`. Do not paste the temporary registration token into chat, source control, shell scripts, or documentation.

Exit the `actions` shell, then install and start the generated runner service:

```bash
exit
cd /opt/actions-runner
sudo ./svc.sh install actions
sudo ./svc.sh start
sudo ./svc.sh status
```

Confirm **Settings → Actions → Runners** shows `apisandbox-ai-01` as **Idle** with the `ollama` and `ai-review` labels.

## 5. Keep public PR code off the runner

Do not change an unrestricted public `pull_request` job to `runs-on: self-hosted`. The initial workflow must use only manual dispatch or pushes to a protected branch:

```yaml
on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  architecture-review:
    runs-on: [self-hosted, linux, x64, ollama, ai-review]
```

Keep public PR lint, build, unit, Sonar, and smoke jobs on GitHub-hosted runners. Enable the self-hosted workflow only after the runner is registered and the repository workflow has Ollama provider support; otherwise jobs will remain queued or continue calling OpenAI.

## 6. Validate and operate

On the host:

```bash
sudo ./svc.sh status
systemctl is-active ollama
curl --fail http://127.0.0.1:11434/api/tags
journalctl -u ollama --since today
```

In GitHub, run the trusted workflow manually and verify:

- the job selects `apisandbox-ai-01`;
- the Ollama health check passes;
- no hosted-provider API key is required after Ollama provider support is enabled;
- `pr-review.md` is uploaded;
- the workspace is cleaned after the job.

## Maintenance

- Apply Ubuntu security updates regularly.
- Re-run the official Ollama installer to update Ollama.
- Keep the GitHub runner application within GitHub's supported version window.
- Monitor `/opt/actions-runner/_diag` and `journalctl -u ollama`.
- Monitor disk use under `/opt/actions-runner/_work` and `/usr/share/ollama/.ollama/models`.
- Stop the runner service before snapshots or maintenance.

References: [GitHub adding runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners), [GitHub runner service](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application?platform=linux), [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use#hardening-for-self-hosted-runners), and [Ollama Linux installation](https://docs.ollama.com/linux).
