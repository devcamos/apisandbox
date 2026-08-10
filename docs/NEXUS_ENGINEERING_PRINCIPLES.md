# Nexus Motivus engineering principles

**Status:** Normative project standard
**Applies to:** Human engineers, coding agents, applications, services, automation, and reusable resources created by MotivusLabs in support of Nexus Motivus.

## Purpose and operating model

For this project, use these definitions:

- **Nexus Motivus** owns the outcomes, product direction, platform guardrails, and trust placed in the resulting applications.
- **MotivusLabs** turns those outcomes into applications and reusable engineering resources.
- **Application** means a user-facing product, API, service, worker, integration, or internal tool.
- **Resource** means reusable code, a component, service, template, workflow, dataset, runbook, learning asset, or decision record.

Nexus sets the destination and constraints. MotivusLabs supplies evidence-backed delivery. A resource is valuable only when it helps Nexus applications become safer, clearer, faster to operate, or easier to change.

## Decision priority

When principles compete, decide in this order:

1. Protect people, credentials, privacy, and data integrity.
2. Preserve correct domain behaviour and contractual obligations.
3. Preserve reliability, recoverability, and operational visibility.
4. Keep the experience accessible and understandable.
5. Keep the system maintainable and changeable.
6. Optimise delivery speed, infrastructure cost, and convenience.

Escalate decisions that would trade a higher priority for a lower one. Record material, cross-cutting decisions in an architecture decision record (ADR).

## Engineering principles

### 1. Outcomes before output

- Start with the user or operational outcome, acceptance evidence, constraints, and owner.
- Measure completed behaviour, not files changed, tickets closed, or code generated.
- Do not build a platform abstraction without a current consumer or a well-supported near-term need.

**Evidence:** acceptance criteria, named owner, success signal, and explicit non-goals.

### 2. Clear ownership and boundaries

- Give every deployable system, data store, contract, and shared resource an accountable owner.
- Organise code around domain responsibility; keep UI, domain, persistence, and integration concerns separable.
- Prefer explicit dependencies and narrow interfaces over shared mutable state or hidden coupling.

**Evidence:** ownership metadata, dependency direction, and documented system boundaries.

### 3. Contract-first integration

- Define inputs, outputs, validation, errors, authentication, timeouts, retries, and compatibility before implementation.
- Treat public APIs, events, schemas, URLs, environment variables, and persisted data as versioned contracts.
- Make write retries safe with idempotency or an equivalent deduplication strategy.
- Never silently reinterpret an established contract.

**Evidence:** schemas or types, contract tests, failure examples, and a compatibility or migration plan.

### 4. Secure and private by default

- Use least privilege, deny by default, server-side authorization, and short-lived or scoped credentials.
- Keep secrets and personal or production data out of source, logs, fixtures, screenshots, prompts, and generated artifacts.
- Validate at trust boundaries and encode or sanitise at output boundaries.
- Identify abuse cases, not only expected user paths.

**Evidence:** threat review proportional to risk, secret scanning, dependency review, authorization tests, and a data classification.

### 5. Operability is a feature

- A production feature is incomplete without enough telemetry to know whether it works.
- Use structured logs, correlation identifiers, meaningful metrics, traces where useful, and actionable health checks.
- Define service objectives for important paths and alert on user impact rather than incidental noise.
- Provide a runbook for predictable failure and recovery operations.

**Evidence:** dashboards or queries, health probes, ownership, service objectives, alerts, and runbooks.

### 6. Design for failure and recovery

- Set explicit timeouts; bound retries with backoff and jitter; prevent retry storms.
- Isolate failure domains, degrade non-essential capabilities, and preserve data integrity.
- Backups count only when restoration is tested.
- Every risky release needs a rollback, roll-forward, or containment plan.

**Evidence:** failure-path tests, restore or game-day results, and recovery objectives where data or availability matters.

### 7. Treat data as a governed product

- Define the source of truth, ownership, lifecycle, retention, deletion, residency, and access policy.
- Evolve schemas through reviewed, reversible migrations with compatibility windows when needed.
- Minimise collected data and make derived data traceable to its origin.
- Audit sensitive state changes without exposing sensitive values.

**Evidence:** data model, migration and rollback plan, retention policy, backup/restore evidence, and audit events.

### 8. Deliver small, reversible changes

- Prefer short-lived branches, focused pull requests, and independently testable increments.
- Separate refactoring from behaviour changes when doing so improves review and rollback safety.
- Use feature flags for controlled exposure, not as permanent branches in the architecture.
- Keep the deployable trunk healthy.

**Evidence:** scoped diff, explicit rollout plan, green checks, and removable flags with owners and expiry dates.

### 9. Test at the cheapest reliable layer

- Use static checks and unit tests for logic, contract and integration tests for boundaries, and a small number of end-to-end tests for critical journeys.
- Test failure, authorization, concurrency, and recovery paths—not only happy paths.
- Keep tests deterministic, isolated, and meaningful; do not weaken assertions to make a build green.
- Reproduce CI locally whenever the repository provides an equivalent command.

**Evidence:** risk-aligned tests, coverage of changed logic, local verification, and production-like smoke evidence.

### 10. Build inclusive, understandable experiences

- Meet WCAG 2.2 AA for user-facing interfaces unless a stricter contract applies.
- Support keyboard use, semantic structure, readable states, responsive layouts, and reduced motion.
- Make loading, empty, success, partial, and failure states explicit.
- Use plain language and never rely on colour alone to convey meaning.

**Evidence:** accessibility checks, keyboard review, responsive tests, and content review.

### 11. Make resources portable and replaceable

- Put provider-specific details behind a clear boundary when portability has credible value.
- Prefer open formats, exportable data, and documented integration contracts.
- Record why a managed service or vendor is used, its limits, failure modes, exit path, and cost driver.
- Avoid a generic abstraction that hides essential provider behaviour.

**Evidence:** dependency record, adapter or boundary where justified, export path, and cost/limit documentation.

### 12. Improve from evidence

- Use incidents, support signals, performance data, security findings, and user research to prioritise improvement.
- Run blameless reviews that produce owned, time-bound actions.
- Remove obsolete code, flags, resources, dashboards, and documentation.
- Prefer a small measured experiment over a large speculative rewrite.

**Evidence:** baseline, change hypothesis, measured result, and follow-up decision.

## MotivusLabs resource contract

A resource may be presented as reusable within Nexus only when it includes the information below.

| Requirement | Minimum evidence |
|---|---|
| Purpose | Problem solved, intended consumers, and non-goals |
| Ownership | Accountable owner and support or escalation path |
| Contract | Inputs, outputs, errors, trust boundaries, and stable interface |
| Versioning | Version policy, compatibility range, and change history |
| Usage | One maintained example and the smallest successful setup |
| Quality | Automated tests, static checks, and known limitations |
| Security and data | Threats, permissions, data classification, and secret handling |
| Operations | Service objectives, telemetry, runbook, limits, and recovery when runtime-operated |
| Economics | Material cost drivers, quotas, and cleanup responsibilities |
| Lifecycle | Release, deprecation, migration, and retirement path |

### Resource lifecycle

1. **Propose:** identify consumers, owner, outcome, risks, and whether reuse is justified.
2. **Build:** keep the public surface small; include tests, examples, and security controls.
3. **Publish:** version the contract and record compatibility and release notes.
4. **Operate:** measure adoption, reliability, cost, and support burden.
5. **Retire:** announce deprecation, provide migration guidance, and remove abandoned infrastructure.

Do not call copied code a shared resource. Promote it only after its common contract is understood and an owner accepts its lifecycle.

## Nexus application baseline

Every MotivusLabs application supporting Nexus should address these concerns proportionally to risk:

- **Architecture:** bounded responsibilities, dependency diagram, critical flows, and ADRs for consequential choices.
- **API and events:** schemas, authentication and authorization, validation, idempotency, rate limits, errors, timeouts, and compatibility.
- **Data:** ownership, classification, migrations, retention/deletion, backups, restore evidence, and auditability.
- **User experience:** accessibility, responsive behaviour, clear state handling, and no sensitive client-side persistence without justification.
- **Operations:** structured telemetry, health checks, service objectives, alert ownership, runbooks, and incident learning.
- **Delivery:** reproducible local setup, pinned dependency graph, CI parity, preview or staging evidence, rollout, and recovery.
- **Cost:** tagged ownership, budgets or limits where material, cleanup for ephemeral resources, and a known scaling driver.

## AI-assisted engineering

Coding agents increase throughput; they do not reduce the evidence required for trust.

- Humans remain accountable for product intent, risk acceptance, access decisions, and production impact.
- Agents must read project guidance, inspect existing patterns, preserve concurrent work, and make the smallest coherent change.
- Never place secrets, private customer data, production records, or proprietary material into an unapproved model or tool.
- Treat generated code and advice as untrusted until reviewed, tested, scanned, and traced to acceptable dependencies and licences.
- Keep generated answers, explanations, and fixtures out of client bundles when they reveal protected logic.
- Record meaningful assumptions and distinguish observed facts from inference.
- An agent must not bypass a quality, security, review, or deployment gate to declare completion.

## Ready and done gates

### Definition of ready

Work is ready to implement when it has:

- an outcome, owner, acceptance evidence, and explicit non-goals;
- known consumers and affected contracts;
- security, privacy, data, accessibility, reliability, and cost risks classified;
- dependencies and rollout constraints identified;
- a verification and recovery approach.

### Definition of done

Work is done when:

- acceptance criteria are demonstrated;
- relevant static, unit, integration, and journey checks pass;
- authorization and important failure paths are verified;
- telemetry and operational ownership exist for production behaviour;
- contracts, runbooks, examples, and decision records are current;
- rollout and recovery are safe;
- reusable resources satisfy the resource contract;
- repository-specific CI and review gates are green.

## Adoption and exceptions

- New work follows this standard immediately.
- Existing systems are not rewritten solely for compliance; touched areas should move toward the standard in proportion to risk.
- A justified exception must name the principle, reason, risk, compensating control, owner, review date, and removal plan.
- Repeated exceptions indicate a platform or resource gap for MotivusLabs to solve centrally.

For API Sandbox implementation commands and repository-specific gates, also follow [AGENT_ONBOARDING.md](./AGENT_ONBOARDING.md) and [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md).
