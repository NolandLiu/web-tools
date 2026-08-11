# Catalog Phase 0 And Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining Phase 0 migration baseline and the Phase 1
CMS-neutral Catalog foundation without changing current product runtime
behavior.

**Architecture:** Phase 0 produces a migration and rollback contract on top of
the repository migration inventory. Phase 1 adds an additive schema package,
Catalog layout, loader, validator, fixtures, normalized artifact, and CI gate
that are not consumed by the production website until later migration phases.

**Tech Stack:** TypeScript, Node test runner, Zod if dependency review is
accepted in the schema package task, Vite root build, existing `npm run verify`.

## Global Constraints

- Do not change current public routes, tool algorithms, or Cloudflare
  deployment behavior.
- Keep tool input privacy boundaries unchanged.
- Keep `tasks/` ignored and untracked.
- Use one local task ID per implementation slice: `TASK-105` through
  `TASK-117`.
- Commit each task independently when it has its own verified deliverable.
- Do not push, create PRs, merge, or deploy without explicit approval.
- Use TDD for implementation tasks: write failing tests first, then implement.

---

## File Responsibility Map

- `docs/architecture/migration-strategy.md` defines migration batch gates,
  comparison gates, snapshots, rollback, and authority stages.
- `docs/planning/godeskhub-task-backlog.md` and
  `docs/planning/godeskhub-platform-roadmap.md` record public task status and
  evidence.
- `packages/schema/` owns CMS-neutral domain schemas and their tests.
- `catalog/` owns early Git/YAML public-content fixtures and layout examples.
- `packages/catalog-loader/` or the approved equivalent owns deterministic
  Catalog loading and normalization.
- `scripts/catalog-validate.*` owns CLI validation entrypoints.
- `tests/catalog*.test.*` owns schema, loader, validator, fixture, artifact, and
  CI regression coverage.
- `.github/workflows/ci.yml` owns CI integration only after validation commands
  exist.

---

## Task Sequence

### Task 105: Approve Incremental Migration And Rollback Baseline

**Files:**

- Create or modify: `docs/architecture/migration-strategy.md`
- Modify: `docs/planning/godeskhub-task-backlog.md`
- Modify: `docs/planning/godeskhub-platform-roadmap.md`

**Interfaces:**

- Consumes: generated migration inventory summary and findings.
- Produces: migration batch gate vocabulary and rollback checklist used by all
  later Catalog migration tasks.

- [ ] Move `TASK-105` to `in-progress`.
- [ ] Write documentation tests or static assertions for required strategy
  sections if existing test style supports docs invariants.
- [ ] Add migration strategy with entry gates, exit gates, rollback gates,
  source-of-truth stages, snapshot rules, and tabletop rollback exercise.
- [ ] Update backlog and roadmap status for `ARCH-P0-008`.
- [ ] Run targeted docs/static tests and `git diff --check`.
- [ ] Complete `TASK-105` and commit:
  `docs(TASK-105): define migration rollback baseline`.

### Task 106: Bootstrap CMS-Neutral Schema Package

**Files:**

- Create: `packages/schema/`
- Modify: root `package.json`
- Modify: lockfile only if dependency installation changes it
- Test: schema package smoke tests

**Interfaces:**

- Produces: public schema package exports and a minimal schema parse helper.

- [ ] Move `TASK-106` to `in-progress`.
- [ ] Write failing smoke tests for importing the package and parsing a minimal
  schema value.
- [ ] Add package scaffold, TypeScript config, exports, build script, and root
  script integration.
- [ ] If adding Zod, record dependency purpose, license, maintenance, and
  privacy impact.
- [ ] Run package tests, root typecheck, and `git diff --check`.
- [ ] Complete `TASK-106` and commit:
  `feat(TASK-106): bootstrap catalog schema package`.

### Task 107: Resource, Locale, And Publication Schemas

**Files:**

- Modify: `packages/schema/src/`
- Test: schema valid and invalid fixture tests
- Docs: schema field reference

**Interfaces:**

- Consumes: schema package exports from `TASK-106`.
- Produces: `Resource`, `ResourceLocale`, resource type, publication status,
  and URL policy schemas.

- [ ] Move `TASK-107` to `in-progress`.
- [ ] Write failing tests for valid website, tool, and guide resources.
- [ ] Write failing tests for invalid type-field combinations, unsafe URL
  schemes, and lifecycle values.
- [ ] Implement minimal schemas and inferred types.
- [ ] Document field reference.
- [ ] Run targeted schema tests and root typecheck.
- [ ] Complete `TASK-107` and commit:
  `feat(TASK-107): implement resource locale publication schemas`.

### Task 108: Taxonomy, Tag, And Collection Schemas

**Files:**

- Modify: `packages/schema/src/`
- Test: taxonomy and collection tests
- Docs: taxonomy authoring reference

**Interfaces:**

- Consumes: core schema package.
- Produces: category, tag, and collection schema modules.

- [ ] Move `TASK-108` to `in-progress`.
- [ ] Write failing tests for category hierarchy, tag records, collection modes,
  cycles, duplicate membership, and invalid mode fields.
- [ ] Implement schema modules and validation helpers.
- [ ] Document hierarchy depth and v1 automatic rule operators.
- [ ] Run targeted tests and root typecheck.
- [ ] Complete `TASK-108` and commit:
  `feat(TASK-108): implement taxonomy collection schemas`.

### Task 109: FAQ, Relation, And Health Schemas

**Files:**

- Modify: `packages/schema/src/`
- Test: FAQ, relation, and health tests
- Docs: relation and health reference

**Interfaces:**

- Produces: FAQ, relation, and health schema modules.

- [ ] Move `TASK-109` to `in-progress`.
- [ ] Write failing tests for reusable FAQ, relation identity and direction,
  health state, and secret-like evidence rejection.
- [ ] Implement schemas.
- [ ] Document relation vocabulary and health evidence policy.
- [ ] Run targeted tests and root typecheck.
- [ ] Complete `TASK-109` and commit:
  `feat(TASK-109): implement faq relation health schemas`.

### Task 110: Git/YAML Catalog Layout

**Files:**

- Create: `catalog/`
- Create or modify: Catalog authoring guide
- Test: Catalog discovery tests

**Interfaces:**

- Consumes: schemas from `TASK-107` to `TASK-109`.
- Produces: file layout contract consumed by the loader.

- [ ] Move `TASK-110` to `in-progress`.
- [ ] Write failing discovery tests for unknown paths and duplicate authority
  files.
- [ ] Create fixture-only Catalog layout with public-content examples.
- [ ] Add authoring guide for file naming, ordering, comments, and one authority
  record per ID.
- [ ] Run targeted tests and `git diff --check`.
- [ ] Complete `TASK-110` and commit:
  `docs(TASK-110): establish catalog yaml layout`.

### Task 111: Deterministic Catalog Loader

**Files:**

- Create: `packages/catalog-loader/` or approved equivalent
- Test: loader tests
- Docs: loader API reference

**Interfaces:**

- Consumes: Catalog layout and schemas.
- Produces: `loadCatalog()` deterministic normalized output.

- [ ] Move `TASK-111` to `in-progress`.
- [ ] Write failing tests for valid load, malformed YAML, schema errors, and
  deterministic ordering.
- [ ] Implement file discovery, YAML parse, schema parse, normalization, and
  diagnostics.
- [ ] Document YAML parser choice and safety limits.
- [ ] Run targeted loader tests and root typecheck.
- [ ] Complete `TASK-111` and commit:
  `feat(TASK-111): implement deterministic catalog loader`.

### Task 112: Core Catalog Validation CLI

**Files:**

- Create or modify: `scripts/catalog-validate.*`
- Modify: `package.json`
- Test: CLI integration tests
- Docs: validation command reference

**Interfaces:**

- Consumes: `loadCatalog()`.
- Produces: `npm run catalog:validate`.

- [ ] Move `TASK-112` to `in-progress`.
- [ ] Write failing CLI tests for valid exit 0 and invalid nonzero diagnostics.
- [ ] Implement command entry, deterministic diagnostics, and exit codes.
- [ ] Add package script.
- [ ] Document command usage.
- [ ] Run CLI tests and `npm run catalog:validate`.
- [ ] Complete `TASK-112` and commit:
  `feat(TASK-112): add catalog validation cli`.

### Task 113: Cross-Record And Tool-Binding Validation

**Files:**

- Modify: validator modules
- Test: graph and binding tests
- Docs: validation rule catalog

**Interfaces:**

- Consumes: loader, validator CLI, and migration inventory tool IDs.
- Produces: graph validation and injected tool-binding resolver interface.

- [ ] Move `TASK-113` to `in-progress`.
- [ ] Write failing tests for unknown IDs, relation targets, cycles, mandatory
  locales, duplicate locales, collection membership, and invalid tool binding.
- [ ] Implement graph validation and binding resolver interface.
- [ ] Document diagnostic codes.
- [ ] Run targeted validator tests and `npm run catalog:validate`.
- [ ] Complete `TASK-113` and commit:
  `feat(TASK-113): validate catalog graph and bindings`.

### Task 114: Representative Valid Catalog Fixtures

**Files:**

- Create or modify: `catalog/fixtures/valid/`
- Test: fixture consumption tests
- Docs: fixture purpose notes

**Interfaces:**

- Consumes: schemas, layout, loader, validator.
- Produces: representative valid fixtures.

- [ ] Move `TASK-114` to `in-progress`.
- [ ] Write failing tests requiring representative valid fixture coverage.
- [ ] Add synthetic fixtures for the named representative tools and capability
  states.
- [ ] Document fixture purpose and publication-status notes.
- [ ] Run loader and validator tests.
- [ ] Complete `TASK-114` and commit:
  `test(TASK-114): add representative valid catalog fixtures`.

### Task 115: Invalid Catalog Fixture Matrix

**Files:**

- Create or modify: `catalog/fixtures/invalid/`
- Test: invalid fixture matrix tests
- Docs: validation examples

**Interfaces:**

- Consumes: validator rule codes.
- Produces: one-principal-failure invalid fixture matrix.

- [ ] Move `TASK-115` to `in-progress`.
- [ ] Write failing parameterized tests for required invalid fixture categories.
- [ ] Add invalid fixtures with one principal failure each.
- [ ] Document validation examples.
- [ ] Run invalid fixture tests.
- [ ] Complete `TASK-115` and commit:
  `test(TASK-115): add invalid catalog fixture matrix`.

### Task 116: Versioned Normalized Catalog Artifact

**Files:**

- Create or modify: Catalog build script
- Test: artifact determinism tests
- Docs: artifact contract

**Interfaces:**

- Consumes: loader and validator.
- Produces: deterministic versioned normalized artifact contract.

- [ ] Move `TASK-116` to `in-progress`.
- [ ] Write failing tests for byte-stable output, checksum, unsupported schema
  versions, and public-field-only artifact content.
- [ ] Implement artifact generation and compatibility policy.
- [ ] Document output commit or ignore policy.
- [ ] Run artifact tests and `npm run catalog:validate`.
- [ ] Complete `TASK-116` and commit:
  `feat(TASK-116): produce normalized catalog artifact`.

### Task 117: Catalog Validation In Production CI

**Files:**

- Modify: `.github/workflows/ci.yml`
- Modify: `package.json` if a composed command is needed
- Docs: contributor or workflow guide
- Test: local CI command sequence

**Interfaces:**

- Consumes: schema package, loader, validator, fixture matrix, artifact build.
- Produces: CI validation gate.

- [ ] Move `TASK-117` to `in-progress`.
- [ ] Write or update tests/assertions for CI command presence if existing test
  style supports workflow checks.
- [ ] Add Catalog validation before frontend build in CI.
- [ ] Verify invalid fixture injection fails locally without committing that
  injected invalid state.
- [ ] Run full verification.
- [ ] Complete `TASK-117` and commit:
  `ci(TASK-117): add catalog validation gate`.

---

## Final Verification

- [ ] `npm run catalog:validate`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run verify`
- [ ] `git diff --check`
- [ ] `git ls-files 'tasks/**'` returns no task files
- [ ] Confirm no push, PR, merge, or deployment occurred
