# Local Task Management

Detailed requirements are managed in the ignored `tasks/` directory. The board
uses these state folders:

```text
tasks/
├── backlog/
├── ready/
├── in-progress/
├── blocked/
└── completed/
```

Allocate the next unused continuous `TASK-xxx` identifier after scanning all
state folders. Identifiers are permanent and cover every work type; the
frontmatter `type` field distinguishes epics, features, bugs, technical debt,
tests, content, and operations.

Except for `cancelled`, a task file must live in the folder named by its
frontmatter status. A state transition updates `status` and `updated`, moves the
file, and appends a dated entry explaining the transition. Completion also
requires checked acceptance criteria and recorded verification evidence.

The task board is private and must never be committed or pushed. Before
committing, verify this with:

```bash
git check-ignore -v tasks/
git ls-files 'tasks/**'
```

Use `docs/task-template.md` when creating a work item. Public commits and pull
requests may reference the task identifier, but must not reproduce private task
details.
