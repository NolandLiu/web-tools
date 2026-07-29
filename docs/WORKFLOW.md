# Workflow

Work on feature branches, not `main`. Before editing product code, identify an approved task source:

- linked GitHub Issue;
- ignored local `tasks/**/TASK-xxx-*.md`;
- explicit user-approved specification in the current conversation.

Every product-code change needs a permanent `TASK-xxx` identifier and a written
plan. If an approved conversation task is not numbered, allocate the next
continuous identifier in the private board before editing. See
`docs/task-management.md`.

Private task files are never committed or quoted in public PR content. Before committing, verify:

```bash
git check-ignore -v tasks/
git ls-files 'tasks/**'
git status --short
```

Required validation:

```bash
npm ci
npm run lint
npm run test
npm run build
npm run verify
npm audit
```

`npm run verify` includes lint, unit tests, TypeScript, build, and generated
route/SEO verification. Push, Draft PR creation, merge, and deployment each
remain approval-gated.
