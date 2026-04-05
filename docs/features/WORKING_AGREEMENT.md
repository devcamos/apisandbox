# Agent Working Agreement

This document sets the default expectations for agents working in this repo.

## Delivery model

- Work from `staging`
- Create short-lived feature branches
- Open PRs into `staging`
- Treat `main` as release-only

## Ticket discipline

- Do not implement vague tickets directly
- Refine high-level work before coding
- Use the templates in this folder
- Confirm DoR before starting
- Validate DoD before calling work complete

## E2E and CI/CD discipline

- User-visible changes should usually have E2E implications
- Delivery-risk changes should usually have CI/CD implications
- Do not bury E2E and CI/CD work as implicit side effects
- Create explicit tickets for them when they matter

## Recommended ticket set for any meaningful feature

- one parent epic or story
- one implementation ticket for UI or behavior
- one E2E ticket
- one CI/CD or deployment ticket if release mechanics are affected
- one documentation ticket if developer workflows change

## PR discipline

- keep PRs narrow
- describe what changed and how it was verified
- target `staging`
- call out remaining risk honestly

## Default review questions

Before marking work ready, ask:

- Is the ticket actually ready?
- Is the scope still coherent?
- Do we have browser-level confidence?
- Do we know whether CI/CD needs to change?
- Is the branch and PR targeting `staging`?
