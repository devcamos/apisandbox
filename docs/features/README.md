# Features Workspace

This folder is the delivery workspace for agents and developers working on product changes.

Use it when you need to:

- define a feature before implementation starts
- refine a high-level request into actionable tickets
- capture Definition of Ready and Definition of Done
- force E2E and CI/CD work to be planned alongside product work
- keep delivery aligned with the repo's staging-first gitflow

## Operating rules

1. Every feature starts as either an epic or a refined story.
2. High-level tickets are not implementation-ready until refinement is complete.
3. Every implementation ticket must state:
   - the user outcome
   - the technical approach
   - the test plan
   - the E2E impact
   - the CI/CD impact
   - the gitflow branch and PR plan
4. PRs target `staging`, not `main`.
5. If a ticket changes user-visible behavior, add or update E2E coverage.
6. If a ticket affects build, deployment, environment config, migrations, or release risk, create explicit CI/CD subtasks.

## Files in this folder

- [`TICKET_TEMPLATE.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/features/TICKET_TEMPLATE.md)
  Jira-style ticket template for epics, stories, and tasks.
- [`REFINEMENT_WORKFLOW.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/features/REFINEMENT_WORKFLOW.md)
  Rules for turning high-level work into delivery-ready tickets.
- [`WORKING_AGREEMENT.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/features/WORKING_AGREEMENT.md)
  Shared expectations for agents operating in this repo.

## Recommended usage

### When a request is still high level

1. Copy the epic section from [`TICKET_TEMPLATE.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/features/TICKET_TEMPLATE.md)
2. Run the refinement flow in [`REFINEMENT_WORKFLOW.md`](/Users/Devonte1/.codex/worktrees/7ca2/apisandbox/docs/features/REFINEMENT_WORKFLOW.md)
3. Break the work into stories and technical tasks
4. Add explicit E2E and CI/CD tickets if they are needed

### When work is implementation-ready

1. Confirm the ticket meets Definition of Ready
2. Branch from `staging`
3. Implement on a short-lived feature branch
4. Validate the Definition of Done
5. Open a PR into `staging`

## Minimum planning standard

No ticket is ready for implementation unless it answers:

- What outcome are we delivering?
- How will we verify it in the browser or end to end?
- What changes are required for CI/CD or deployment safety?
- What branch will the work start from and where will the PR merge?
