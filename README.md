# API Integration Training Platform

Next.js app for learning API integrations — phases, demos, auth, and subscriptions.

## Developers

**Start here:** [docs/AGENT_ONBOARDING.md](docs/AGENT_ONBOARDING.md)

| Doc | Purpose |
|-----|---------|
| [docs/AGENT_ONBOARDING.md](docs/AGENT_ONBOARDING.md) | Setup, verify, project links |
| [docs/GITFLOW.md](docs/GITFLOW.md) | Branching and releases |
| [docs/AGENT_PR_CHECKLIST.md](docs/AGENT_PR_CHECKLIST.md) | Pre-PR checks |
| [docs/TEST_USERS.md](docs/TEST_USERS.md) | Local test credentials |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel, env, OAuth |

## Quick start

```bash
npm install
npm run env:local
npm run dev:db:up
npm run db:migrate
npm run db:ensure-test-users
npm run dev
```

Open [http://localhost:4000](http://localhost:4000). Or: `npm run local-lite`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 4000) |
| `npm run build` | Production build |
| `npm run verify:ci` | Local CI parity before PR |
| `npm run test:unit` | Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run openai:key:test` | Safely validate an OpenAI API key |

## Test an OpenAI API key

Run the project tool:

```bash
npm run openai:key:test
```

Paste the key at the hidden prompt and press Enter. Pasted characters are intentionally not displayed. The tool calls OpenAI's read-only model-list endpoint, prints only the HTTP result category, removes the key from the process environment, and never writes it to disk.

The normal command always prompts, even if `OPENAI_API_KEY` already exists. For CI or another automated environment, explicitly select the environment variable:

```bash
npm run openai:key:test -- --env
```

Use `npm run openai:key:test -- --help` to print the available modes.

Results:

- `HTTP 200`: accepted;
- `HTTP 401`: invalid, revoked, or malformed;
- `HTTP 403`: recognized but missing permission;
- `HTTP 429`: recognized but rate-limited or out of quota.

Do not put a literal key in the command, source code, `.env` files committed to Git, screenshots, chat, or logs. A key that has been exposed must be revoked and replaced.

## In-app content

Learning material is in the UI: `/dashboard`, `/phase-0` … `/phase-8`, `/docs/java`, `/docs/architecture`.

## License

MIT
