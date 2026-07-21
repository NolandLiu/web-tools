# Workflow

Work on feature branches, not `main`. Before editing product code, identify an approved task source:

- linked GitHub Issue;
- ignored local `TASK.local.md`;
- explicit user-approved specification in the current conversation.

Private task files are never committed or quoted in public PR content. Before committing, verify:

```bash
git check-ignore -v TASK.local.md
git ls-files TASK.local.md
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
