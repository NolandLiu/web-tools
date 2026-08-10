# ADR-025: Documentation Snapshots and Private Task-Board Authority

- Status: Accepted
- Date: 2026-08-11
- Decision task: `ARCH-P0-007`

## Context

The public registry is the source for tools, categories, locales, information
pages, and canonical routes, but older prose retained fixed counts from earlier
releases. The ignored private board also stored design and implementation-plan
documents beside authority task files, so filename scans found more than one
record for the same permanent task ID. An abandoned local UI experiment still
appeared active even though its branch was explicitly rejected and never
merged into the current baseline.

These inconsistencies do not change production behavior, but they weaken
architecture evidence, task-state reporting, and future migration checks.

## Decision

### Registry-derived documentation

Executable registry and route enumeration remain authoritative. Normative
requirements refer to `listCanonicalRoutes()` and registry validation rather
than embedding a permanent count. A human-readable count may be documented only
as a dated snapshot with its source named.

The accepted `2026-08-11` snapshot is:

- 27 public tools;
- 5 categories;
- 3 locales;
- 4 information pages;
- 111 canonical static routes.

Public capability descriptions must distinguish retained source code from a
published route. Pages Functions for IP Lookup and RDAP remain in the repository,
but the current `_routes.json` exposes only a disabled placeholder, so those
Functions are not a current public product capability.

### One private authority record per task ID

Every permanent `TASK-xxx` ID has exactly one authority Markdown file in a task
status directory. That file owns frontmatter, status, acceptance criteria,
verification evidence, and status history.

Supporting design notes, implementation plans, screenshots, and other artifacts
live under `tasks/artifacts/TASK-xxx/`. They do not declare an independent task
ID or status and are excluded from authority-record scans. The whole `tasks/`
tree, including artifacts, remains ignored, untracked, and private.

Cancelled authority records use `tasks/cancelled/` when the board is normalized.
Task IDs are never reused and historical completed records are not reopened to
represent new work.

### Abandoned local implementation branches

Rejecting an experiment does not rewrite Git history. Its local branch and
commits may remain as historical evidence, but its Epic and incomplete child
tasks become `cancelled`. Completed child records remain `completed` as truthful
execution history and receive a disposition note stating that their results are
not part of the current baseline.

Code from an abandoned experiment must not be restored by merging the old
branch. Any future reuse requires a new numbered task, fresh review against the
current baseline, and the normal commit and publication approvals.

## Validation contract

Board and documentation repair is verified by:

1. importing the live registry and checking tool, category, locale, information
   page, and canonical-route counts;
2. scanning only status directories for duplicate authority IDs;
3. checking authority frontmatter status against its directory;
4. confirming `tasks/` is ignored and no `tasks/**` path is tracked;
5. searching public current-state documentation for superseded fixed counts and
   withdrawn capability claims;
6. running the repository lint, test, build, and verify commands.

## Consequences

Architecture prose remains readable while automated sources stay authoritative.
Private supporting material no longer corrupts task scans, cancelled work is not
mistaken for active delivery, and rejected experiments remain recoverable
without being treated as current product code. The additional artifact
directory is a small governance cost and must be preserved by future task-board
tooling.

## Rollback

The public documentation edits and ignored-board moves can be reverted
independently. Rollback must not restore duplicate authority records or mark the
abandoned UI program active without a new approved decision.
