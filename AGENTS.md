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

1. Read the linked GitHub Issue before editing.
2. Create a feature branch from the latest main.
3. Write or update tests before implementation where applicable.
4. Keep changes within the Issue scope.
5. Run all required checks.
6. Review the diff before committing.
7. Create a Pull Request.
8. Never merge the Pull Request without user approval.

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

## Commit messages:

- feat: ...
- fix: ...
- docs: ...
- test: ...
- chore: ...

## Pull Request requirements

Every PR must include:

- Linked Issue
- Summary
- Files or modules changed
- Testing performed
- Screenshots for visual changes
- Privacy impact
- Deployment impact

## Prohibited actions

- Do not commit .env files or secrets.
- Do not force-push main.
- Do not merge directly into main.
- Do not disable tests to make checks pass.
- Do not perform unrelated refactoring.
- Do not add new third-party tracking without approval.

