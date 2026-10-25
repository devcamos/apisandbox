# AGENTS.md

See **[docs/AGENT_ONBOARDING.md](docs/AGENT_ONBOARDING.md)** for setup, verification, and conventions.

All human and coding agents must follow the repository-owned **[Nexus Motivus engineering principles](docs/NEXUS_ENGINEERING_PRINCIPLES.md)**. Resources created by MotivusLabs for Nexus must satisfy the document's reusable-resource contract. The shared engineering foundation is an additive reference; it does not replace this repository's local safeguards.

**Cursor Cloud:** PostgreSQL via `npm run dev:db:up` (port 5435), app on port 4000, test users in [docs/TEST_USERS.md](docs/TEST_USERS.md).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Shared foundation

Read [engineering principles](https://github.com/devonte-amos-apps/pr-intelligence/blob/main/docs/engineering-principles.md) and [shared agent controls](https://github.com/devonte-amos-apps/pr-intelligence/blob/main/AGENT_RULES.md), then [this repository's rules](docs/governance/repository-rules.md). The shared controls define precedence and approval boundaries. Adoption is proposed until the prerequisite shared PR is merged; do not treat links to an unmerged document as an effective rule.
