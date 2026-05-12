# Feature and backlog management

**Agents:** setup and verification → [Agent onboarding](AGENT_ONBOARDING.md). URLs and MCP view links → [Agent workspace map](AGENT_WORKSPACES.md).

**Notion is the source of truth** for what we build, in what order, and delivery status. This repo does **not** use `docs/features/` or a second backlog in markdown.

---

## Two Notion surfaces (no overlap)

| Surface | URL | Purpose |
|---------|-----|--------|
| **Repo hub** | [Open hub](https://www.notion.so/3417233a96ec81ddbae4dcd29a68b775) | Orientation: how we work, links, context. **Not** the canonical backlog list. |
| **Work tracker** | [Open tracker](https://www.notion.so/6ea1b2867262468fbb15da5984602d5b) | **Single backlog:** every feature, fix, chore, spike. One row = one work item. |

If content exists in both hub and tracker, **tracker wins** for status and ownership; the hub should only **link** to the tracker or summarise themes.

---

## Backlog workflow (status) — live Notion schema

The **API Sandbox Work Tracker** database uses two related fields. **Do not** invent a third lifecycle column.

### Board Status (canonical workflow)

**Board Status** is the source of truth for the board and reviews. Allowed values:

| Board Status | Meaning |
|--------------|--------|
| **Backlog** | Not ready to pull; may be ungroomed. |
| **Ready** | Groomed; clear enough for someone to start. |
| **In Progress** | Actively being implemented. |
| **In Review** | PR open or awaiting review / QA. |
| **Blocked** | Cannot proceed until an external dependency clears. |
| **Done** | Merged and verified (or intentionally wont-do / superseded). |

### Status (compact tri-state — keep in sync)

**Status** is Notion’s built-in tri-state: **Not started**, **In progress**, **Done**. It exists for simple filters and summaries. Keep it aligned with **Board Status**:

| Board Status | Status should be |
|--------------|------------------|
| Backlog, Ready | Not started |
| In Progress, In Review, Blocked | In progress |
| Done | Done |

If you use a board **and** a table, they must be **views on the same database**, not two databases with copied rows.

---

## Work tracker properties (current)

These are the columns on **API Sandbox Work Tracker** after the 2026-05-08 cleanup sync:

| Property | Role |
|----------|------|
| **Title** | Name of the work item (title column). |
| **Board Status** | Canonical workflow (see table above). |
| **Status** | Compact tri-state; mirror Board Status per rules above. |
| **Work Type** | `Feature` \| `Maintenance` \| `Process`. |
| **Priority** | `High` \| `Medium` \| `Low`. |
| **Notes** | Scope, AC, PR links, blockers—**one** primary narrative (avoid duplicating the same text on the subpage unless the subpage is the source of truth). |
| **External ticket** | Optional URL for Jira, Linear, etc. (renamed from “Jira Ticket” for clarity). |
| **Ticket Ref** | Short repo / internal reference slug when useful. |

**Optional next improvement:** add a single **PR link** (URL) property when you want it filterable; until then, put the GitHub PR URL in **Notes**.

**Avoid**

- Duplicating Git state (branch + PR + deploy URL) when one PR link in **Notes** (or a future PR field) is enough.
- “Priority” **and** manual sort order **and** Board Status all meaning the same urgency story—pick **one** primary ordering mechanism for **Ready**.
- A second “Done” checkbox when **Board Status = Done** already exists.

---

## How to work (process)

1. **Search the work tracker** before starting a feature, fix, or maintenance task.
2. **If no row exists**, create one in the work tracker (correct **Work Type**, **Board Status**, and aligned **Status**).
3. **Keep a single narrative** for the item: update **Notes** (and/or the row’s subpage) with scope changes, blockers, verification notes, and links to PRs/commits—do not maintain a parallel spec in this repo unless it is permanent technical reference (then link from Notion into `docs/`).
4. **Close the loop:** when shipped, set **Board Status** to **Done**, **Status** to **Done**, and ensure a **PR link** is recorded in **Notes** (or in a dedicated PR field if you add one).

---

## Backlog status review

A **status review** is a short pass over the [work tracker](https://www.notion.so/6ea1b2867262468fbb15da5984602d5b) to keep **Board Status** (and mirrored **Status**) accurate and the queue honest. It does not replace delivery work; it prevents drift (stale **In Progress**, empty **Ready**, **Done** rows missing PR info in **Notes**).

### When

- **Standing (recommended):** ~15–30 minutes on a fixed cadence (e.g. start of week), owner rotates or is fixed per team habit.
- **Async:** Anyone may correct status or add a note when they notice drift; the standing slot still reconciles the board.

### Checklist (run top to bottom)

| Focus | Ask |
|--------|-----|
| **Backlog** | Still valid? Merge or archive duplicates and abandoned ideas. Anything groomed enough to move to **Ready**? |
| **Ready** | Top items ordered for next pull? Scope / AC in one place (**Notes** or subpage)? |
| **In Progress** | Each row has an owner and is truly active? Stale ones → **Ready** (parked) or **Backlog** with a note. |
| **In Review** | PR URL in **Notes** (or PR field)? Waiting on reviewer or CI? Long-stuck → note blocker or split follow-up row. |
| **Done** | Recent **Done** rows have PR info in **Notes** (or explicit “N/A”)? Optional: tag release / deploy in **Notes** for audit. |

### Status hygiene (rules of thumb)

- **In Review** without a PR in **Notes** → add link or move back to **In Progress** / **Ready** until a PR exists.
- **In Progress** with no activity for a long period → decide: continue, hand off, or demote to **Ready** / **Backlog** and note why.
- **Ready** should stay a **small** set of well-defined items; everything else stays **Backlog** until groomed.
- When you change **Board Status**, update **Status** using the mapping in [Backlog workflow](#backlog-workflow-status--live-notion-schema).

### Notion views (optional but helpful)

Create saved **views** on the same work-tracker database (not a second database), for example:

- **Review queue:** `Board Status` = In Review  
- **Ready next:** `Board Status` = Ready, sorted by Priority or manual order  
- **WIP:** `Board Status` = In Progress  

Paste **Copy link to view** URLs into [AGENT_WORKSPACES](AGENT_WORKSPACES.md) if agents or MCP should use them.

**One printable session:** use [Backlog status review — one session](BACKLOG_STATUS_REVIEW_ONE_SESSION.md) (date, facilitator, checkboxes).

---

## Automation (MCP / Codex)

Tools that target a **database view** need a URL with **`?v=<view_id>`**. Canonical view URLs live in [AGENT_WORKSPACES](AGENT_WORKSPACES.md) once pasted; do not use bare `notion.so/<id>` links for those tools.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-07 | Clarified hub vs tracker, single status workflow, minimal properties, anti-redundancy rules. |
| 2026-05-07 | Backlog status review: cadence, checklist, hygiene rules, optional Notion views. |
| 2026-05-07 | Link to one-session runbook [BACKLOG_STATUS_REVIEW_ONE_SESSION](BACKLOG_STATUS_REVIEW_ONE_SESSION.md). |
| 2026-05-08 | Synced with live Notion: **Jira Ticket** → **External ticket**; documented **Board Status** + **Status** mirror rules; checklist uses Board Status. |
