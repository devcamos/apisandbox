# Refinement Workflow

Use this flow whenever a ticket starts too high level to implement safely.

## Trigger for refinement

Refinement is required if the ticket says things like:

- "improve onboarding"
- "make search better"
- "add CI/CD"
- "support end to end testing"
- "clean up auth"

These are not implementation-ready on their own.

## Refinement outcome

A refined ticket set must produce:

1. One parent epic or story with clear scope
2. Implementation stories or tasks small enough to review
3. Explicit E2E coverage tasks where user behavior changes
4. Explicit CI/CD tasks where delivery mechanics change
5. A gitflow plan based on `staging`

## Refinement checklist

### 1. Clarify the outcome

Answer:

- What user or developer problem are we solving?
- What does success look like?
- What will be visibly different?

### 2. Find the affected surfaces

Identify:

- pages
- components
- APIs
- auth or subscription flows
- database or migrations
- deployment or environment config

### 3. Split the work

Create separate tickets when the work spans multiple concerns:

- user-facing behavior
- backend/API behavior
- data model or migration work
- E2E validation
- CI/CD or deployment plumbing

### 4. Force E2E planning

Create an E2E task if any of the following are true:

- a page or workflow changes
- auth behavior changes
- navigation changes
- gating or access control changes
- user-visible error handling changes
- deployment confidence depends on browser verification

Good E2E ticket titles:

- `[TASK] Add E2E coverage for upgraded search flow`
- `[TASK] Update staging smoke tests for new auth branch`

### 5. Force CI/CD planning

Create a CI/CD task if any of the following are true:

- new test commands are required in CI
- environment variables change
- staging/prod behavior diverges
- migrations need deployment sequencing
- release or rollback steps change
- Docker, Vercel, GitHub Actions, or staging stack behavior changes

Good CI/CD ticket titles:

- `[TASK] Add Playwright smoke run to staging pipeline`
- `[TASK] Document migration sequencing for staging rollout`

### 6. Add branch strategy

Every refined ticket should say:

- base branch: `staging`
- feature branch naming convention
- PR target: `staging`

## Example refinement

### High-level ticket

`[EPIC] Improve onboarding`

### Refined output

- `[STORY] Simplify signup form messaging`
- `[STORY] Add clearer post-signup redirect behavior`
- `[TASK] Add E2E coverage for signup to dashboard flow`
- `[TASK] Update staging smoke suite for onboarding path`
- `[TASK] Review env/config impact for auth flow changes`

## Refined ticket quality bar

A ticket is ready for implementation only if:

- the outcome is clear
- acceptance criteria are testable
- E2E impact is decided
- CI/CD impact is decided
- the work can be completed without inventing scope mid-flight

If those are missing, refine first and do not start implementation.
