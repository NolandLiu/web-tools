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
2. Create a feature branch from the latest main.
3. Write or update tests before implementation where applicable.
4. Keep changes within the approved task scope.
5. Run all required checks.
6. Review the diff before committing.
7. Create a Pull Request only after user approval.
8. Never merge the Pull Request without user approval.

## Task authorization

Before editing product code, Codex must have one of the following approved task sources:

1. A linked GitHub Issue;
2. A local private task brief named `TASK.local.md`;
3. An explicit task specification approved by the user in the current conversation.

A public GitHub Issue is not required when an approved local task brief or explicit user-approved specification exists.

Before implementation, Codex must:

- identify the active task source;
- summarize the scope and acceptance criteria;
- confirm that the task was approved by the user;
- keep implementation within that scope.

For this repository, detailed requirements should default to `TASK.local.md` unless the user explicitly asks to create a GitHub Issue.

## Private task files

- `TASK.local.md` contains private local requirements.
- It must never be committed or pushed.
- Do not quote its complete content in commits, public PR descriptions, logs, screenshots, or GitHub comments.
- PR descriptions should contain only the minimum public technical summary necessary to review the code.
- Before committing, verify that `TASK.local.md` is ignored and untracked.

## Required checks

Run before reporting completion:

```bash
npm run lint
npm run test
npm run build
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

## Commit messages:

- feat: ...
- fix: ...
- docs: ...
- test: ...
- chore: ...

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
