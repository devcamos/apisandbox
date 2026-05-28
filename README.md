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

## In-app content

Learning material is in the UI: `/dashboard`, `/phase-0` … `/phase-8`, `/docs/java`, `/docs/architecture`.

## License

MIT
