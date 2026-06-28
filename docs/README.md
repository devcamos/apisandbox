# Developer documentation

Essential docs for onboarding and shipping changes. Product learning content lives in the app (`/phase-*`, `/docs/java`, `/docs/architecture`).

| Doc | Use when |
|-----|----------|
| [AGENT_ONBOARDING.md](./AGENT_ONBOARDING.md) | **Start here** — setup, URLs, verify, conventions |
| [GITFLOW.md](./GITFLOW.md) | Branching (`main` trunk, `v1` release line, tags) |
| [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md) | Before every PR (`npm run verify:ci`) |
| [TEST_USERS.md](./TEST_USERS.md) | Local / demo login credentials |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel env, Prisma on deploy, Google OAuth origins |
| [KNOWN_ERRORS.md](./KNOWN_ERRORS.md) | Repeatable deployment failures and recovery runbooks |
| [SAAS.md](./SAAS.md) | Production SaaS flags, Stripe, rate limits, health probe |
| [STRIPE_LOCAL.md](./STRIPE_LOCAL.md) | Real Stripe Checkout in Test mode + webhook forwarding |
| [EDUCATION_SYSTEM.md](./EDUCATION_SYSTEM.md) | Learning progress domain, premium model boundary, dependency integration map |

**Templates (not prose):** `config/environments/*.env.example`, `.env.example`, `sonar-project.properties`
