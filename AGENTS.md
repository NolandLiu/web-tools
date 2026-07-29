# AGENTS.md

## Project

Privacy-first multilingual online tools website.

## Product requirements

- Hosting target: Cloudflare Pages
- Supported languages: English, Simplified Chinese, Traditional Chinese
- Tool input must remain in the browser
- Never send calculator, converter, text, or file content to analytics
- Only record anonymous aggregated tool-open events
- Do not add AdSense code until explicitly approved

## Required workflow

1. Identify the active approved task source before editing product code.
2. Assign a `TASK-xxx` number before editing product code.
3. Write an implementation plan before implementation.
4. Create a feature branch from the latest main.
5. Write or update tests before implementation where applicable.
6. Keep changes within the approved task scope.
7. Run all required checks, including `npm run verify`.
8. Review the diff before committing.
9. Push or create a Draft Pull Request only after user approval.
10. Never merge or deploy without user approval.

## Task authorization

Before editing product code, Codex must have one of the following approved task sources:

1. A linked GitHub Issue;
2. A local private task file matching `tasks/**/TASK-xxx-*.md`;
3. An explicit task specification approved by the user in the current conversation.

A public GitHub Issue is not required when an approved local task brief or explicit user-approved specification exists.

Before implementation, Codex must:

- identify the active task source;
- summarize the scope and acceptance criteria;
- confirm that the task was approved by the user;
- keep implementation within that scope.

For this repository, detailed requirements should default to the ignored local
`tasks/` board unless the user explicitly asks to create a GitHub Issue.

If an approved conversation task has no number yet, create its local task file
before editing product code. Scan existing numbers first and allocate the next
continuous `TASK-xxx` identifier; identifiers are permanent and are never
reused.

## Private task files

- `tasks/` contains private local requirements and status history.
- The entire directory must remain ignored, untracked, and unpushed.
- Do not quote complete task content in commits, public PR descriptions, logs, screenshots, or GitHub comments.
- PR descriptions should contain only the minimum public technical summary necessary to review the code.
- Before committing, verify that `tasks/` is ignored and no task file is tracked.

## Task rules

- Allowed task types: `epic`, `feature`, `bug`, `tech-debt`, `test`, `content`, and `ops`.
- Allowed statuses: `backlog`, `ready`, `in-progress`, `blocked`, `completed`, and `cancelled`.
- Except for `cancelled`, the task directory and frontmatter status must match.
- Every status change updates `status` and `updated`, moves the file, and appends a dated status-history entry.
- Completed tasks record checked acceptance criteria and actual verification commands and results.
- New defects receive their own task number. A defect that blocks current acceptance may join the current development batch but remains separately numbered.
- Non-blocking defects go to `backlog`; do not silently expand the active scope.
- Branches, commits, test reports, and delivery summaries reference the relevant task number.

## Required checks

Run before reporting completion:

```bash
npm run lint
npm run test
npm run build
npm run verify
```
All commands must pass without errors.

# Git conventions

## Branch names:

- feature/issue-<number>-<short-name>
- fix/issue-<number>-<short-name>
- docs/issue-<number>-<short-name>
- feat/<short-name>
- fix/<short-name>
- docs/<short-name>
- task/TASK-xxx
- feat/TASK-xxx-<short-name>

## Commit messages:

- feat: ...
- fix: ...
- docs: ...
- test: ...
- chore: ...

Task-related commits must include the task number, for example:

- `feat(TASK-004): add localized tool routes`
- `fix(TASK-003): align canonical domain metadata`
- `test(TASK-010): verify generated SEO routes`

## Pull Request requirements

Every PR must include:

- Linked Issue, local task reference, or explicit approved task source
- Summary
- Files or modules changed
- Testing performed
- Screenshots for visual changes
- Privacy impact
- Deployment impact

## Public PR description

Public PR descriptions must be concise technical summaries. Do not paste or closely paraphrase the complete private task brief, full acceptance document, private discussion, or internal planning notes.

Use this structure by default:

```markdown
## Summary

- Add multilingual tool pages
- Add unit and format converters
- Add QR Code generation
- Add local usage-based tool ordering
- Improve SEO and policy pages

## Verification

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify`

## Deployment

Compatible with the existing Cloudflare Pages Vite configuration.
```

Do not include:

- long-term business planning;
- traffic or growth strategy;
- unreleased feature roadmap;
- AdSense account details;
- internal priority labels or private priority rankings;
- complete acceptance documents;
- personal information or private discussion details.

## Prohibited actions

- Do not commit .env files or secrets.
- Do not force-push main.
- Do not merge directly into main.
- Do not disable tests to make checks pass.
- Do not perform unrelated refactoring.
- Do not add new third-party tracking without approval.
- Do not push, create a Pull Request, merge, or deploy without explicit user approval.
