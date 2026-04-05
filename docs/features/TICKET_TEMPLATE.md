# Jira-Style Ticket Template

Use this template for epics, stories, and technical tasks.

---

## Epic Template

**Title**
`[EPIC] <feature or initiative name>`

**Summary**
One paragraph describing the business or user outcome.

**Problem Statement**
- What is broken, missing, or unclear today?
- Why does it matter now?

**Goals**
- Goal 1
- Goal 2

**Non-Goals**
- Explicitly out-of-scope item
- Explicitly out-of-scope item

**Success Metrics**
- Metric or observable outcome
- Metric or observable outcome

**User Impact**
- Who is affected?
- What changes for them?

**Dependencies**
- Product or design dependency
- Backend or infra dependency

**Risks**
- Risk
- Mitigation

**Refinement Required**
- [ ] Break into implementation stories
- [ ] Identify E2E test coverage needs
- [ ] Identify CI/CD or deployment work
- [ ] Confirm rollout and rollback plan

**Definition of Ready for Epic Breakdown**
- [ ] Problem is clear
- [ ] Outcome is clear
- [ ] Scope boundaries exist
- [ ] Stakeholders identified

---

## Story Template

**Title**
`[STORY] <specific user-facing increment>`

**User Story**
As a `<user type>`, I want `<capability>` so that `<outcome>`.

**Context**
- Relevant screens, services, or flows
- Links to architecture, docs, or parent epic

**Scope**
- In scope item
- In scope item

**Out of Scope**
- Out of scope item
- Out of scope item

**Acceptance Criteria**
- [ ] Clear user-visible behavior
- [ ] Edge case behavior defined
- [ ] Error state behavior defined
- [ ] Analytics, logging, or operational expectations defined if needed

**Technical Notes**
- Expected files or areas likely to change
- Data model, API, auth, or infra impact

**Test Plan**
- Unit or component validation
- Integration validation
- E2E validation

**E2E Requirement**
- [ ] New E2E test required
- [ ] Existing E2E test must be updated
- [ ] No E2E change needed

If no E2E change is needed, explain why:

`<reason>`

**CI/CD Requirement**
- [ ] Pipeline change required
- [ ] Environment/config change required
- [ ] Migration or deployment sequencing required
- [ ] No CI/CD change needed

If no CI/CD change is needed, explain why:

`<reason>`

**Gitflow Plan**
- Base branch: `staging`
- Feature branch: `codex/<short-name>`
- PR target: `staging`

### Definition of Ready

- [ ] Acceptance criteria are testable
- [ ] Scope is small enough for one PR or clearly split
- [ ] Dependencies are known
- [ ] Test plan exists
- [ ] E2E impact is decided
- [ ] CI/CD impact is decided
- [ ] Branching plan is stated

### Definition of Done

- [ ] Code implemented
- [ ] Relevant docs updated
- [ ] Tests added or updated
- [ ] E2E coverage added or explicitly justified
- [ ] CI/CD changes completed or explicitly justified
- [ ] Verified locally or in staging as appropriate
- [ ] PR opened against `staging`

---

## Technical Task Template

**Title**
`[TASK] <technical change>`

**Why this task exists**
- Link to parent story or epic
- Explain what this unlocks

**Deliverable**
- Concrete technical output

**Implementation Notes**
- Files, services, or systems likely to change

**Validation**
- Command or test to run
- Expected result

**Definition of Ready**
- [ ] Parent story exists
- [ ] Deliverable is concrete
- [ ] Validation path is known

**Definition of Done**
- [ ] Deliverable completed
- [ ] Validation completed
- [ ] Parent story updated

---

## Standard Subtasks to Consider

For most user-facing work, ask whether you also need:

- `[TASK] UI implementation`
- `[TASK] API or backend implementation`
- `[TASK] Data or migration update`
- `[TASK] E2E coverage`
- `[TASK] CI/CD or deployment update`
- `[TASK] Documentation update`
