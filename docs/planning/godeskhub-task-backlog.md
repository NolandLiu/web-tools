# GoDeskHub Platform Architecture Task Backlog

## Rules

- IDs in this document are permanent and must never be reused or renumbered.
- Every task is sized for one implementation and review session.
- Status is `Planned` until separately approved work begins. An architecture decision task may become `Completed` after its ADR is reviewed and accepted without starting product implementation.
- Every implementation preserves stable URLs, static SEO, Cloudflare compatibility, privacy, and a tested rollback path.
- Phase 8 tasks are explicitly Future / Not MVP.

---

# Phase 0 — Architecture Baseline

## ARCH-P0-001 — Freeze Repository Architecture Baseline

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — Baseline Frozen
### Priority
P0
### Goal
Create an evidence-backed snapshot of the current application, build, deployment, routes, registries, analytics, and tests.
### Why
Future migration comparisons need a stable, reviewable starting point.
### Scope
Record module ownership, 27 tools, 5 categories, 3 locales, 111 routes, Cloudflare settings, CI, scripts, package/runtime versions, and verification totals.
### Out of Scope
Changing runtime code or resolving recorded gaps.
### Dependencies
None.
### Likely Files / Areas
`README.md`, `docs/architecture/`, `package.json`, `src/registry.js`, `.github/workflows/ci.yml`, `wrangler.toml`.
### Implementation Notes
Accepted baseline: repository code and deterministic output at `main@21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee` are authoritative. Planning documents are explanatory; preview and production observations are external drift evidence. The baseline is recorded in `docs/architecture/repository-baseline.md`.
### Acceptance Criteria
- [x] Baseline facts cite source paths and commands.
- [x] Tool, category, locale, route, and test counts are generated rather than guessed.
### Tests / Validation
The source commit, local `main`, and cached `origin/main` resolved to the same SHA. A read-only registry script reported 27 tools, 5 categories, 3 locales, 4 information pages, and 111 canonical routes. `npm run lint`, `npm run test` (159/159), `npm run build` (111 pages), and `npm run verify` passed on 2026-08-11.
### Migration / Rollback Considerations
Documentation-only; revert the baseline document if inaccurate.
### Security Considerations
Do not record secrets, tokens, user data, or production request payloads.
### Documentation Updates
`docs/architecture/repository-baseline.md`, platform architecture, roadmap, and backlog status.
### Estimated Complexity
M
### Blocking Decisions
Resolved: source code and deterministic output at the accepted `main` commit are authoritative; production observations identify drift but do not redefine the repository baseline.

## ARCH-P0-002 — Build Existing Resource and Tool Migration Inventory

### Phase
Phase 0 — Architecture Baseline
### Status
Planned
### Priority
P0
### Goal
Inventory every current tool and public page with IDs, slugs, categories, locale/content/FAQ/SEO sources, implementation, route, and publication state.
### Why
Migration cannot preserve behavior or URLs without a complete source map.
### Scope
Generate a machine-readable inventory and human review table from current registries.
### Out of Scope
Moving metadata into Catalog.
### Dependencies
ARCH-P0-001.
### Likely Files / Areas
`src/registry.js`, `src/content/`, `src/tools/`, `src/lib/routes.js`, `src/lib/seo.js`, `docs/planning/`.
### Implementation Notes
Approved design: use a source-driven, deterministic generator to emit one
machine-readable JSON inventory and one matching Markdown review document.
Cover `published-page`, `redirect-only`, and `unpublished-source` surfaces.
Mark the isolated IP information implementation as an unpublished capability
rather than a public Resource. Treat Home as a site projection, categories as
category projections, and About, Privacy, Terms, and Contact as unresolved
public information pages rather than forcing them into the Guide model. See
`docs/architecture/repository-migration-inventory-design.md`.
### Acceptance Criteria
- Every registered tool and information page appears once.
- Routes and implementation bindings resolve.
- Missing or duplicated ownership is reported.
### Tests / Validation
Compare inventory IDs against registry, content, route, and behavior-contract IDs.
### Migration / Rollback Considerations
Inventory is regenerated; no runtime rollback required.
### Security Considerations
Exclude provider secrets and user inputs.
### Documentation Updates
Migration inventory appendix.
### Estimated Complexity
M
### Blocking Decisions
Resolved for design: the inventory is generated from current source and remains
a non-runtime evidence snapshot. Information-page target entity types remain a
reported schema warning for a later task, not an assumption in this inventory.

## ARCH-P0-003 — Decide Catalog Repository and Package Topology

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — ADR-021 Accepted
### Priority
P0
### Goal
Select the initial ownership and distribution boundary for `packages/schema/` and `catalog/`.
### Why
Schema imports, CI, Discover consumption, and later CMS adapters depend on this boundary.
### Scope
Compare same-repository packages, npm-workspace monorepo, and separate Catalog repository; record an ADR and transition triggers.
### Out of Scope
Moving the Tools app or creating Discover.
### Dependencies
ARCH-P0-001.
### Likely Files / Areas
`docs/adr/`, `docs/architecture/platform-architecture.md`, `package.json`.
### Implementation Notes
Accepted decision: same repository, private internal npm workspace package, no immediate Tools-directory move, and no initial package publication. See ADR-021.
### Acceptance Criteria
- [x] Decision covers ownership, versioning, builds, CI, and rollback.
- [x] A future split path is documented without speculative tooling.
### Tests / Validation
Architecture review completed against ADR-002, ADR-009, ADR-010, ADR-017, and ADR-019. ADR-021 records the accepted decision.
### Migration / Rollback Considerations
Decision must preserve the existing root Vite build until an approved migration task changes it.
### Security Considerations
Define who may publish or modify Catalog artifacts.
### Documentation Updates
`docs/adr/ADR-021-catalog-repository-package-topology.md` and the ADR register.
### Estimated Complexity
S
### Blocking Decisions
Resolved: incremental npm workspace in the existing repository.

## ARCH-P0-004 — Define Identifier, Slug, Locale, and Task Naming Conventions

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — ADR-022 Accepted
### Priority
P0
### Goal
Freeze durable naming rules for all domain entities and migration tasks.
### Why
IDs and slugs become long-lived references across YAML, code, CMS, routes, and analytics.
### Scope
Define resource/category/tag/collection/FAQ/relation IDs, locale codes, slug character rules, collision scopes, aliases, and deprecation rules.
### Out of Scope
Renaming current public slugs.
### Dependencies
ARCH-P0-002, ARCH-P0-003.
### Likely Files / Areas
`docs/architecture/catalog-domain-model.md`, `docs/adr/`, Catalog authoring conventions.
### Implementation Notes
Accepted decision: use globally unique readable typed immutable canonical IDs; preserve current tool IDs as binding IDs and preserve existing English canonical slugs. See ADR-022.
### Acceptance Criteria
- [x] Every entity namespace has syntax and collision rules.
- [x] Locale mapping explicitly relates `zh-CN` to `/zh-cn/` and `zh-TW` to `/zh-tw/`.
### Tests / Validation
ADR-022 records valid and invalid fixtures for future schema tests. The current registry was checked for existing IDs, slugs, locale mappings, and cross-namespace collisions.
### Migration / Rollback Considerations
Existing route slugs remain unchanged.
### Security Considerations
Reject path traversal, control characters, and unsafe URL forms.
### Documentation Updates
`docs/adr/ADR-022-identifier-slug-locale-task-naming.md`, ADR register, and Catalog domain-model naming section.
### Estimated Complexity
S
### Blocking Decisions
Resolved: globally unique readable typed prefixes.

## ARCH-P0-005 — Finalize Domain Entities and Publication Semantics

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — ADR-023 Accepted
### Priority
P0
### Goal
Approve field ownership and lifecycle behavior for the complete core domain.
### Why
Schema, validation, search, SEO, CMS, and operations must share the same meanings.
### Scope
Resource, locales, taxonomy, collections, FAQ, relations, health, and `draft/review/published/deprecated/hidden` transitions.
### Out of Scope
Payload collection configuration.
### Dependencies
ARCH-P0-003, ARCH-P0-004.
### Likely Files / Areas
`docs/architecture/catalog-domain-model.md`, `docs/adr/`.
### Implementation Notes
Accepted decision: separate authored revisions, last approved public projection, operational health, and code-owned tool behavior; require complete three-locale content for every published entity. See ADR-023.
### Acceptance Criteria
- [x] Each entity has responsibility, identity, relations, and lifecycle rules.
- [x] CMS-neutral ownership is explicit.
### Tests / Validation
ADR-023 records representative Tool, Website, Guide, and hidden-recovery transition scenarios and blocking publication gates for future schema tests.
### Migration / Rollback Considerations
Map current published tools without changing public behavior.
### Security Considerations
Define fields safe for public output and fields restricted to operations.
### Documentation Updates
`docs/adr/ADR-023-domain-ownership-publication-lifecycle.md`, ADR register, Catalog domain model, and CMS publication flow.
### Estimated Complexity
M
### Blocking Decisions
Resolved: every published entity requires complete `en`, `zh-CN`, and `zh-TW` content.

## ARCH-P0-006 — Reconcile Analytics and Privacy Policy

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — ADR-024 Accepted
### Priority
P0
### Goal
Define an approved event taxonomy and privacy boundary before Discover and Operations analytics expand.
### Why
The current standard Google page-view tag and repository policy are not expressed through one governed contract.
### Scope
Audit page views, local popular-tool stats, tool-open events, future search/resource events, retention, consent assumptions, and forbidden payloads.
### Out of Scope
Adding or changing analytics providers.
### Dependencies
ARCH-P0-001.
### Likely Files / Areas
`AGENTS.md`, `index.html`, privacy content, `src/lib/core.js`, analytics tests, future event schema docs.
### Implementation Notes
Accepted decision: preserve page-view measurement only as a canonical, query-free, consent-gated event through a fail-closed adapter. Basic Consent Mode blocks Google tags before approval; local popularity remains local; future events remain disabled until separately approved. See ADR-024.
### Acceptance Criteria
- [x] Approved event names and fields are allowlisted.
- [x] Current behavior and policy differences have an owner and resolution path.
### Tests / Validation
ADR-024 records static, schema, sensitive-sentinel, consent, canonical URL, and real browser network validation requirements. The current tag, privacy text, local popularity implementation, and privacy tests were audited.
### Migration / Rollback Considerations
No provider changes in this task. The future implementation first constrains the property, then replaces the unconditional tag. Any privacy or consent failure rolls back to analytics disabled, never to automatic page views.
### Security Considerations
Data minimization, retention, IP handling, and vendor disclosure.
### Documentation Updates
`docs/adr/ADR-024-governed-analytics-consent-privacy.md`, ADR register, security architecture, analytics privacy contract, and roadmap.
### Estimated Complexity
M
### Blocking Decisions
Resolved: page views remain approved only as controlled, canonical, query-free events after affirmative Basic Consent Mode choice; event/user retention is two months.

## ARCH-P0-007 — Repair Documentation and Private Board Drift

### Phase
Phase 0 — Architecture Baseline
### Status
Completed — ADR-025 Accepted
### Priority
P1
### Goal
Align counts, architecture statements, and task authority records with actual repository state.
### Why
Outdated route/tool counts and duplicate local task IDs undermine migration evidence.
### Scope
Correct 31/123 and 93-route references, classify duplicate task support documents, and resolve the abandoned TASK-078 status without reusing IDs.
### Out of Scope
Rewriting Git history or reopening completed work.
### Dependencies
ARCH-P0-001, ARCH-P0-002.
### Likely Files / Areas
`README.md`, `docs/architecture.md`, `docs/product-requirements.md`, ignored `tasks/`.
### Implementation Notes
Accepted decision: preserve permanent task IDs, keep one authority file per ID in a status directory, and move supporting design and plan documents under `tasks/artifacts/TASK-xxx/`. Public counts are registry-derived or dated snapshots. The abandoned TASK-078 program is cancelled without deleting or merging its local branch. See ADR-025.
### Acceptance Criteria
- [x] Public docs derive counts or state their snapshot date.
- [x] Each private task ID has one authority record with status-directory consistency.
### Tests / Validation
Registry count checks, public-doc assertions, a task-ID authority scan excluding `tasks/artifacts`, status-directory validation, `git check-ignore`, `git ls-files`, and the full repository verification suite are required and recorded in the private board.
### Migration / Rollback Considerations
Documentation and ignored-board changes are independently reversible.
### Security Considerations
Do not expose private task content in tracked docs.
### Documentation Updates
`README.md`, `docs/architecture.md`, `docs/product-requirements.md`, `AGENTS.md`, ADR-025, the ADR register, and the platform roadmap.
### Estimated Complexity
S
### Blocking Decisions
Resolved: registry data is authoritative; snapshots must be dated; support documents are artifacts rather than authority task files; abandoned local implementation history is retained but not merged or treated as current.

## ARCH-P0-008 — Approve Incremental Migration and Rollback Baseline

### Phase
Phase 0 — Architecture Baseline
### Status
Planned
### Priority
P0
### Goal
Turn ADR-010 into concrete batch, compatibility, snapshot, and rollback gates.
### Why
Catalog adoption must not become a big-bang rewrite.
### Scope
Define batch sizes, compatibility adapters, output comparisons, deployment gates, snapshot retention, and rollback evidence.
### Out of Scope
Migrating a tool.
### Dependencies
ARCH-P0-002, ARCH-P0-005.
### Likely Files / Areas
`docs/architecture/migration-strategy.md`, `docs/adr/`, release templates.
### Implementation Notes
Require route/SEO diffing and behavior regression for each batch.
### Acceptance Criteria
- Every migration batch has entry, exit, and rollback gates.
- One authoritative source is defined at each stage.
### Tests / Validation
Tabletop rollback exercise using a representative tool Catalog fixture.
### Migration / Rollback Considerations
This task defines the rollback contract.
### Security Considerations
Snapshots must exclude secrets and user data.
### Documentation Updates
Migration strategy and release checklist.
### Estimated Complexity
M
### Blocking Decisions
None.

---

# Phase 1 — Catalog Foundation

## CAT-P1-001 — Bootstrap CMS-Neutral Schema Package

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Create `packages/schema/` with TypeScript, Zod, build, test, and public exports.
### Why
All producers and consumers need one runtime-validatable domain contract.
### Scope
Package structure, compiler config, Zod dependency review, exports, versioning, and package tests.
### Out of Scope
Entity implementation beyond a minimal smoke schema.
### Dependencies
ARCH-P0-003, ARCH-P0-004, ARCH-P0-005.
### Likely Files / Areas
`packages/schema/`, root `package.json`, lockfile, TypeScript config.
### Implementation Notes
Keep the root Vite build working; record dependency size, license, and maintenance.
### Acceptance Criteria
- Package builds and imports from Node and frontend code.
- Runtime and static types originate from the same schemas.
### Tests / Validation
Package unit test, root typecheck, existing verify.
### Migration / Rollback Considerations
No existing runtime consumes it yet; remove package and dependency to roll back.
### Security Considerations
Schema parsing rejects unknown or unsafe fields according to explicit policy.
### Documentation Updates
Schema developer guide.
### Estimated Complexity
M
### Blocking Decisions
Repository topology ADR accepted.

## CAT-P1-002 — Implement Resource, Locale, and Publication Schemas

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Define `Resource`, `ResourceLocale`, resource type, and publication lifecycle schemas.
### Why
These are the minimum common records for website, tool, and guide content.
### Scope
IDs, resource type, binding/external URL fields, locale fields, slugs, summaries, SEO fields, status, timestamps, and visibility invariants.
### Out of Scope
Taxonomy and CMS fields.
### Dependencies
CAT-P1-001.
### Likely Files / Areas
`packages/schema/src/resource.ts`, locale and publication modules, schema tests.
### Implementation Notes
Use discriminated unions for resource-type-only fields; tool binding is required only for tool resources.
### Acceptance Criteria
- Valid website, tool, and guide fixtures parse.
- Invalid type-field combinations and lifecycle values fail with useful paths.
### Tests / Validation
Table-driven valid/invalid schema tests in all three locales.
### Migration / Rollback Considerations
Additive package change until Catalog adoption.
### Security Considerations
URLs require HTTPS policy exceptions to be explicit; reject executable schemes.
### Documentation Updates
Domain field reference.
### Estimated Complexity
M
### Blocking Decisions
Publication locale minimum.

## CAT-P1-003 — Implement Category, Tag, and Collection Schemas

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Encode distinct taxonomy and collection concepts with localized records.
### Why
Discover navigation and editorial grouping cannot share the current flat category model.
### Scope
Category hierarchy/order, tags, manual/automatic/hybrid collections, locale records, and membership/rule shapes.
### Out of Scope
Drag-and-drop UI and rule execution.
### Dependencies
CAT-P1-001, ARCH-P0-005.
### Likely Files / Areas
`packages/schema/src/taxonomy.ts`, `collection.ts`, tests.
### Implementation Notes
Limit hierarchy depth in v1 and keep automatic rule grammar small and typed.
### Acceptance Criteria
- Concepts cannot be substituted accidentally.
- Cycles, duplicate membership, and invalid collection mode fields fail.
### Tests / Validation
Hierarchy, localization, and collection-mode fixture tests.
### Migration / Rollback Considerations
Current categories map one-to-one without route changes.
### Security Considerations
Automatic rules cannot execute arbitrary code.
### Documentation Updates
Taxonomy and collection authoring rules.
### Estimated Complexity
M
### Blocking Decisions
Maximum category depth and v1 automatic-rule operators.

## CAT-P1-004 — Implement FAQ, Relation, and Health Schemas

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Define reusable FAQ, typed resource relations, and operational health records.
### Why
Embedded FAQ and inferred related tools cannot support shared content or operations.
### Scope
Localized FAQ, relation types/direction/order, health check type/status/time/evidence, and ownership links.
### Out of Scope
Link-check execution.
### Dependencies
CAT-P1-001, CAT-P1-002.
### Likely Files / Areas
`packages/schema/src/faq.ts`, `relation.ts`, `health.ts`, tests.
### Implementation Notes
Keep health observations separate from authored resource content.
### Acceptance Criteria
- FAQ can attach to multiple resources without duplication.
- Relations and health records have stable identities and typed states.
### Tests / Validation
Schema and cross-record fixture tests.
### Migration / Rollback Considerations
No runtime consumers until loader integration.
### Security Considerations
Health evidence must not include secrets or full sensitive response bodies.
### Documentation Updates
FAQ, relation, and health reference.
### Estimated Complexity
M
### Blocking Decisions
Approved relation-type vocabulary.

## CAT-P1-005 — Establish Git/YAML Catalog Layout

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Create the early authoritative `catalog/` directory and file conventions.
### Why
Content authors need reviewable data files before a CMS exists.
### Scope
`resources/`, `taxonomy/`, `collections/`, `locales/`, `faq/`, relation/health inputs, file naming, ordering, and comments policy.
### Out of Scope
Migrating all current tools.
### Dependencies
CAT-P1-002, CAT-P1-003, CAT-P1-004.
### Likely Files / Areas
`catalog/`, sample files, `.gitignore`, authoring docs.
### Implementation Notes
Prefer one authority record per ID and deterministic file ordering; avoid locale duplication inside executable code.
### Acceptance Criteria
- Directory ownership maps cleanly to schemas.
- A reviewer can locate every entity and locale record by ID.
### Tests / Validation
Catalog discovery test rejects unknown paths and duplicate authority files.
### Migration / Rollback Considerations
Initial fixture-only Catalog is removable without affecting Tools.
### Security Considerations
Catalog is public-content data only; secret fields are prohibited.
### Documentation Updates
Catalog authoring guide.
### Estimated Complexity
S
### Blocking Decisions
One-file-per-entity versus bounded grouped files.

## CAT-P1-006 — Implement Deterministic Catalog Loader

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Implement `loadCatalog()` returning normalized resources, categories, tags, collections, locales, FAQ, relations, and health.
### Why
Consumers need one stable, typed view independent of YAML layout.
### Scope
File discovery, YAML parse, schema parse, normalization, deterministic order, diagnostics, and readonly output contract.
### Out of Scope
Caching API or CMS reads.
### Dependencies
CAT-P1-005.
### Likely Files / Areas
`packages/catalog-loader/` or approved package path, loader tests, YAML dependency review.
### Implementation Notes
Diagnostics include source file and field path but never environment data.
### Acceptance Criteria
- Output exposes all required collections under documented names.
- Reordering source files does not change normalized semantics.
### Tests / Validation
Snapshot-free structural tests, malformed YAML, schema errors, deterministic order.
### Migration / Rollback Considerations
No production consumer until adapter task.
### Security Considerations
Reject aliases or parser features that can create unsafe object graphs.
### Documentation Updates
Loader API documentation.
### Estimated Complexity
L
### Blocking Decisions
Approved YAML parser.

## CAT-P1-007 — Implement Core Catalog Validation CLI

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Add `npm run catalog:validate` for IDs, slugs, URLs, status, and duplicate records.
### Why
Invalid Catalog changes must fail before build or publication.
### Scope
Command entry, exit codes, human-readable diagnostics, duplicate ID/slug, URL, status, and locale-record validation.
### Out of Scope
Cross-record relation and tool-binding rules.
### Dependencies
CAT-P1-006.
### Likely Files / Areas
`scripts/catalog-validate.*`, package scripts, validator tests.
### Implementation Notes
Sort diagnostics deterministically for local and CI parity.
### Acceptance Criteria
- Valid Catalog exits 0.
- Every required invalid case exits nonzero with source and rule.
### Tests / Validation
CLI integration tests using temporary fixture directories.
### Migration / Rollback Considerations
Command is additive until CI integration.
### Security Considerations
Do not echo full environment variables or secret-like values.
### Documentation Updates
Validation command reference.
### Estimated Complexity
M
### Blocking Decisions
None.

## CAT-P1-008 — Implement Cross-Record and Tool-Binding Validation

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Validate taxonomy references, collections, relations, locale completeness, and tool implementation bindings.
### Why
Schema-valid records can still form an invalid Catalog graph.
### Scope
Unknown IDs, relation targets, cycles, mandatory locales, duplicate locales, collection membership/rules, and tool-binding resolution.
### Out of Scope
Runtime rendering.
### Dependencies
CAT-P1-007 and the stable current tool-ID inventory from ARCH-P0-002.
### Likely Files / Areas
Catalog validator graph modules, tool-binding adapter, invalid fixtures.
### Implementation Notes
Define a minimal injected binding-resolver interface so the domain package does not import React/tool code; Phase 2 implements the production resolver.
### Acceptance Criteria
- Every required graph failure has a dedicated diagnostic code.
- Published tool resources require exactly one valid code binding.
### Tests / Validation
Invalid graph fixture matrix and clean representative Catalog.
### Migration / Rollback Considerations
Rules can be feature-gated until pilot data is ready, then become blocking.
### Security Considerations
Relations never resolve executable URLs or dynamic imports from content.
### Documentation Updates
Validation rule catalog.
### Estimated Complexity
L
### Blocking Decisions
Mandatory locale and category cardinality rules.

## CAT-P1-009 — Add Representative Valid Catalog Fixtures

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P1
### Goal
Create valid fixtures for IP Lookup, IP WHOIS/RDAP, Subnet Calculator, IRR Calculator, and Password Generator.
### Why
These examples exercise unpublished/network, consolidated-tool, financial, and security-sensitive boundaries.
### Scope
Synthetic resource, locale, FAQ, relation, taxonomy, and publication records for the five named tools.
### Out of Scope
Publishing previously isolated IP tools.
### Dependencies
CAT-P1-005, CAT-P1-008.
### Likely Files / Areas
`catalog/fixtures/valid/`, fixture documentation.
### Implementation Notes
Model IP Lookup and IP WHOIS as hidden/deprecated or fixture-only where they are not currently public.
### Acceptance Criteria
- Fixtures validate and preserve actual current route/publication facts.
- No real API keys, IP logs, passwords, or financial inputs are included.
### Tests / Validation
Loader and validator tests consume each fixture.
### Migration / Rollback Considerations
Fixtures are non-production and clearly separated.
### Security Considerations
Use synthetic values only.
### Documentation Updates
Fixture purpose and publication-status notes.
### Estimated Complexity
M
### Blocking Decisions
None.

## CAT-P1-010 — Add Invalid Catalog Fixture Matrix

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P1
### Goal
Prove every validation rule fails for the intended reason.
### Why
Validator coverage needs negative evidence, not only valid snapshots.
### Scope
Duplicate IDs/slugs/locales, invalid URLs/status, unknown taxonomy, missing relations, missing locale, invalid tool binding, cycles, and unsafe content cases.
### Out of Scope
Fuzzing the YAML parser.
### Dependencies
CAT-P1-007, CAT-P1-008.
### Likely Files / Areas
`catalog/fixtures/invalid/`, validator tests.
### Implementation Notes
Keep one principal failure per fixture so diagnostics are unambiguous.
### Acceptance Criteria
- Every required validation category has a failing fixture.
- Tests assert diagnostic code and source path.
### Tests / Validation
Parameterized invalid-fixture test suite.
### Migration / Rollback Considerations
Test-only.
### Security Considerations
Include unsafe URL and rich-text samples as inert strings only.
### Documentation Updates
Validation examples.
### Estimated Complexity
M
### Blocking Decisions
None.

## CAT-P1-011 — Produce Versioned Normalized Catalog Artifact

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P1
### Goal
Generate a deterministic versioned artifact for frontend builds and future API adapters.
### Why
Discover and Tools need a stable consumption contract without reading arbitrary YAML at runtime.
### Scope
Artifact schema version, content checksum, deterministic JSON output, build location, and compatibility policy.
### Out of Scope
Public network API hosting.
### Dependencies
CAT-P1-006, CAT-P1-008.
### Likely Files / Areas
Catalog build script, generated-output ignore policy, artifact tests.
### Implementation Notes
Do not commit generated artifacts unless the topology ADR explicitly requires snapshots.
### Acceptance Criteria
- Identical input produces byte-stable output and checksum.
- Consumers reject unsupported schema versions.
### Tests / Validation
Determinism, schema-version, and round-trip tests.
### Migration / Rollback Considerations
Retain the previous stable artifact for batch rollback.
### Security Considerations
Artifact contains public fields only.
### Documentation Updates
Artifact contract and compatibility policy.
### Estimated Complexity
M
### Blocking Decisions
Artifact commit/publish location.

## CAT-P1-012 — Add Catalog Validation to Production CI

### Phase
Phase 1 — Catalog Foundation
### Status
Planned
### Priority
P0
### Goal
Make schema, loader, validation, and artifact checks required before build and merge.
### Why
Catalog cannot be authoritative if invalid changes can pass CI.
### Scope
CI steps, caching, diagnostics artifacts, package scripts, and branch protection recommendation.
### Out of Scope
Changing GitHub protection without separate approval.
### Dependencies
CAT-P1-007, CAT-P1-008, CAT-P1-011.
### Likely Files / Areas
`.github/workflows/ci.yml`, `package.json`, CI documentation.
### Implementation Notes
Run validation before expensive frontend build; retain current lint/test/build gates.
### Acceptance Criteria
- Invalid fixture injection demonstrates a CI failure locally.
- Valid Catalog completes the full existing pipeline.
### Tests / Validation
Workflow lint/review plus local exact command sequence.
### Migration / Rollback Considerations
Remove the additive CI step if it blocks due to infrastructure, not data validity.
### Security Considerations
CI permissions remain read-only and no secrets are required.
### Documentation Updates
Workflow and contributor guide.
### Estimated Complexity
S
### Blocking Decisions
None.

---

# Phase 2 — Existing Tools Migration

## TOOLS-P2-001 — Define Explicit Tool Code Registry
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P0
### Goal
Create a stable `tool-id → implementation` registry independent of Catalog content.
### Why
CMS content must never select arbitrary executable modules.
### Scope
Binding interface, allowed component factories, capability metadata needed by routing, and validation resolver.
### Out of Scope
Moving tool algorithms or adding tools.
### Dependencies
ARCH-P0-004, CAT-P1-002, CAT-P1-008.
### Likely Files / Areas
`src/tools/`, new tool-code registry, `src/App.tsx`, binding tests.
### Implementation Notes
Bindings are code-authored and use a closed allowlist; Catalog stores only the stable binding ID.
### Acceptance Criteria
- Every published tool resolves exactly once.
- Unknown or duplicate bindings fail validation.
### Tests / Validation
Registry coverage derived from Catalog and current tool components.
### Migration / Rollback Considerations
Keep the existing rendering switch as an adapter until all tools migrate.
### Security Considerations
No dynamic module path or executable content comes from YAML/CMS.
### Documentation Updates
Tool binding contract.
### Estimated Complexity
M
### Blocking Decisions
None.

## TOOLS-P2-002 — Build Current Registry Compatibility Adapter
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P0
### Goal
Expose current tool/category/content records through the normalized Catalog contract during migration.
### Why
Consumers need one interface before the source of truth moves.
### Scope
Read-only adapter, provenance marker, output comparison, and feature flag for pilot resources.
### Out of Scope
Deleting `src/registry.js`.
### Dependencies
CAT-P1-006, CAT-P1-011, TOOLS-P2-001.
### Likely Files / Areas
Catalog adapter module, `src/registry.js`, comparison tests.
### Implementation Notes
The adapter must not merge conflicting values silently; report ownership differences.
### Acceptance Criteria
- Existing and normalized outputs compare field by field.
- Current routes render unchanged with the adapter disabled or enabled for zero pilot records.
### Tests / Validation
Contract, route, SEO, content, and build regression tests.
### Migration / Rollback Considerations
Single feature flag restores legacy source reads.
### Security Considerations
Public fields only; no user state enters Catalog.
### Documentation Updates
Compatibility and rollback guide.
### Estimated Complexity
L
### Blocking Decisions
None.

## TOOLS-P2-003 — Migrate Representative Tool Pilot
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P0
### Goal
Migrate Subnet Calculator, IRR Calculator, Password Generator, and non-public IP fixture metadata through Catalog.
### Why
The pilot tests diverse routing, content, finance, privacy, and publication states before broad migration.
### Scope
Catalog records, locale records, taxonomy links, FAQ links, SEO, code binding, and provenance comparison.
### Out of Scope
Changing tool UI or algorithms; publishing isolated IP tools.
### Dependencies
TOOLS-P2-002, CAT-P1-009.
### Likely Files / Areas
`catalog/`, compatibility adapter, registry/content tests.
### Implementation Notes
Each resource flips independently and retains existing stable tool ID and slug.
### Acceptance Criteria
- Pilot pages are byte/semantic equivalent for route and SEO contracts.
- Algorithms, privacy, and accessibility tests remain unchanged and pass.
### Tests / Validation
Targeted tool tests, static HTML comparison, full verify.
### Migration / Rollback Considerations
Per-resource flag returns ownership to legacy registries.
### Security Considerations
No passwords, financial cash flows, or queried IPs enter Catalog fixtures.
### Documentation Updates
Pilot migration report.
### Estimated Complexity
L
### Blocking Decisions
None.

## TOOLS-P2-004 — Migrate Unit Converter Metadata Batch
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Move all eight unit converter public metadata and content ownership to Catalog.
### Why
This cohesive batch has shared category and behavior contracts.
### Scope
Names, summaries, descriptions, icon IDs, keywords, locales, FAQ, related records, order, and SEO.
### Out of Scope
Conversion formulas and UI redesign.
### Dependencies
TOOLS-P2-003.
### Likely Files / Areas
Catalog resources/locales/FAQ, compatibility adapter, unit tests.
### Implementation Notes
Unit definitions remain code-owned.
### Acceptance Criteria
- All eight pages retain paths, content meaning, metadata, and behavior.
- No duplicate unit metadata remains authoritative.
### Tests / Validation
Unit, content, route, SEO, static build, and full regression tests.
### Migration / Rollback Considerations
Batch flag and previous Catalog artifact.
### Security Considerations
Browser-local input contract remains unchanged.
### Documentation Updates
Migration inventory status.
### Estimated Complexity
M
### Blocking Decisions
None.

## TOOLS-P2-005 — Migrate Developer and Text Tool Metadata Batch
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Migrate JSON, Base64, URL, UUID, timestamp, case, word count, color, and password metadata/content.
### Why
These tools share strict local-text privacy requirements.
### Scope
Catalog public content, taxonomy, FAQ, search fields, ordering, relations, and SEO.
### Out of Scope
Text processing, random generation, or persistence behavior changes.
### Dependencies
TOOLS-P2-003.
### Likely Files / Areas
Catalog records, developer content modules, privacy tests.
### Implementation Notes
Keep privacy statements consistent with actual code contracts.
### Acceptance Criteria
- Every page retains localized content and search discoverability.
- Free text and generated passwords remain absent from URLs, analytics, and Catalog.
### Tests / Validation
Text/password/privacy/SEO/static build regression.
### Migration / Rollback Considerations
Batch ownership flag and artifact restore.
### Security Considerations
No sample secrets or real text fixtures.
### Documentation Updates
Migration inventory status.
### Estimated Complexity
L
### Blocking Decisions
None.

## TOOLS-P2-006 — Migrate Calculator and Finance Metadata Batch
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Migrate percentage, discount, BMI, compound interest, date interval, IRR, and cheque resources.
### Why
Financial and health wording requires controlled, localized content ownership.
### Scope
Catalog metadata, FAQ, references, disclaimers, relations, search, and SEO.
### Out of Scope
Formula or input-domain changes.
### Dependencies
TOOLS-P2-003.
### Likely Files / Areas
Catalog calculator resources, current content modules, calculator tests.
### Implementation Notes
Retain medical and investment disclaimers and exact cheque terminology.
### Acceptance Criteria
- Content remains aligned with behavior contracts in all locales.
- No financial inputs or results enter content or analytics.
### Tests / Validation
Calculator, IRR, cheque, privacy, content, and build tests.
### Migration / Rollback Considerations
Batch ownership flag and snapshot.
### Security Considerations
Only synthetic reference examples.
### Documentation Updates
Migration inventory status.
### Estimated Complexity
L
### Blocking Decisions
None.

## TOOLS-P2-007 — Migrate QR and Network Metadata Batch
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Migrate QR, IPv4 toolbox, and IPv6 toolbox public Catalog records while retaining hidden network API records.
### Why
These resources have specialized capability, privacy, and legacy-route constraints.
### Scope
Metadata, content, FAQ, relations, legacy aliases, publication status, search, and SEO.
### Out of Scope
QR rendering, IP algorithms, provider activation, or Cloudflare Functions changes.
### Dependencies
TOOLS-P2-003.
### Likely Files / Areas
Catalog network/QR resources, legacy route map, static build tests.
### Implementation Notes
Explicitly model IP lookup/RDAP as hidden or deprecated until separately approved.
### Acceptance Criteria
- Consolidated network routes and redirects remain exact.
- Hidden resources never enter Sitemap or public search.
### Tests / Validation
Network, QR, route, search, privacy, and generated-artifact tests.
### Migration / Rollback Considerations
Batch flag and route inventory snapshot.
### Security Considerations
No QR content, logos, IP queries, or provider configuration in Catalog.
### Documentation Updates
Publication and migration notes.
### Estimated Complexity
L
### Blocking Decisions
None.

## TOOLS-P2-008 — Make Homepage and Tool Cards Catalog-Driven
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Render homepage listings and cards from normalized Catalog resources.
### Why
Hardcoded tool-card metadata would preserve a second source of truth.
### Scope
Published tool filtering, order, featured/popular display fields, localized card content, and existing local popularity adapter.
### Out of Scope
Discover homepage or visual redesign.
### Dependencies
TOOLS-P2-004 through TOOLS-P2-007.
### Likely Files / Areas
`src/App.tsx`, `src/components/ToolCard.tsx`, Catalog selector modules.
### Implementation Notes
Separate authored order/featured state from local anonymous usage ranking.
### Acceptance Criteria
- No card metadata is maintained outside Catalog.
- Hidden/deprecated resources follow explicit display policy.
### Tests / Validation
Homepage, sorting, localization, accessibility, and static content tests.
### Migration / Rollback Considerations
Selector feature flag restores legacy data view.
### Security Considerations
Local usage remains validated and browser-only.
### Documentation Updates
Frontend Catalog-consumption guide.
### Estimated Complexity
M
### Blocking Decisions
Popular-versus-editorial ordering precedence.

## TOOLS-P2-009 — Make Navigation and Category Pages Catalog-Driven
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Use Catalog taxonomy as the sole category/navigation source.
### Why
Sidebar, homepage, and category pages must not maintain separate classification data.
### Scope
Category order, localized labels/descriptions, membership, routes, sidebar, mobile navigation, and category pages.
### Out of Scope
Tag and collection UI.
### Dependencies
TOOLS-P2-004 through TOOLS-P2-007, CAT-P1-003.
### Likely Files / Areas
Category components, `src/lib/ui.js`, route selectors, static rendering.
### Implementation Notes
Preserve the existing five category slugs until redirect policy is approved.
### Acceptance Criteria
- One taxonomy source drives all category consumers.
- Membership mismatch tests fail before build.
### Tests / Validation
Navigation, route, category, mobile, and static build tests.
### Migration / Rollback Considerations
Compatibility selector restores legacy categories.
### Security Considerations
No executable navigation target comes from unvalidated content.
### Documentation Updates
Taxonomy migration report.
### Estimated Complexity
M
### Blocking Decisions
None.

## TOOLS-P2-010 — Migrate FAQ to Independent Catalog Entities
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Replace embedded tool FAQ arrays with independent localized FAQ records and attachments.
### Why
FAQ must be reusable, governable, and consistent with visible and JSON-LD output.
### Scope
FAQ extraction, stable IDs, resource links/order, locale records, rendering adapter, and JSON-LD mapping.
### Out of Scope
Rewriting FAQ copy.
### Dependencies
CAT-P1-004, TOOLS-P2-004 through TOOLS-P2-007.
### Likely Files / Areas
`src/content/*`, Catalog FAQ, content/SEO/static renderers.
### Implementation Notes
Preserve exact visible question/answer semantics and ordering during extraction.
### Acceptance Criteria
- Visible FAQ and FAQPage JSON-LD use the same independent records.
- No embedded authoritative FAQ remains.
### Tests / Validation
FAQ parity, localization, JSON-LD, and build tests.
### Migration / Rollback Considerations
Adapter can read legacy arrays until every tool is migrated.
### Security Considerations
Sanitize future rich text; current content remains plain structured text.
### Documentation Updates
FAQ authoring guide.
### Estimated Complexity
L
### Blocking Decisions
FAQ reuse and override policy.

## TOOLS-P2-011 — Migrate SEO, Relations, Featured, and Ordering Metadata
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P1
### Goal
Move remaining public metadata ownership to Catalog and remove category-inferred relations.
### Why
SEO and discovery fields cannot remain distributed after tool migration.
### Scope
SEO titles/descriptions, keywords, explicit relations, featured flags, authored order, icons, and deprecation metadata.
### Out of Scope
Phase 3 SEO engine redesign.
### Dependencies
TOOLS-P2-008, TOOLS-P2-009, TOOLS-P2-010.
### Likely Files / Areas
Catalog resource/relations, `src/lib/seo.js`, related-tool selectors.
### Implementation Notes
Keep derived fields derived and record provenance for authored overrides.
### Acceptance Criteria
- Catalog owns every migrated public metadata field.
- Related resources use validated relation records.
### Tests / Validation
Metadata ownership scan, SEO parity, related-resource tests.
### Migration / Rollback Considerations
Legacy field reads remain behind a temporary adapter only.
### Security Considerations
External resource URLs pass scheme and host validation.
### Documentation Updates
Metadata ownership matrix.
### Estimated Complexity
M
### Blocking Decisions
Relation types and editorial ordering precedence.

## TOOLS-P2-012 — Remove Duplicate Legacy Metadata Sources and Close Migration
### Phase
Phase 2 — Existing Tools Migration
### Status
Planned
### Priority
P0
### Goal
Remove or reduce legacy registries to explicit compatibility exports after parity is proven.
### Why
Catalog is not the single source of truth while duplicate writable metadata remains.
### Scope
Dead-source audit, adapter simplification, ownership enforcement, migration report, and rollback snapshot.
### Out of Scope
Deleting tool implementations or behavior contracts.
### Dependencies
TOOLS-P2-008 through TOOLS-P2-011.
### Likely Files / Areas
`src/registry.js`, `src/catalog.ts`, `src/content/*`, ownership tests.
### Implementation Notes
Retain only generated or code-specific views with clear comments.
### Acceptance Criteria
- Editing legacy metadata cannot change public output.
- All 27 tools pass route, content, behavior, privacy, SEO, and static build regression.
### Tests / Validation
Full verify, artifact comparison, source ownership test, browser acceptance checklist.
### Migration / Rollback Considerations
Tag the last legacy-backed Catalog artifact and keep a documented revert path.
### Security Considerations
No privacy or network behavior changes.
### Documentation Updates
Phase 2 completion and rollback report.
### Estimated Complexity
L
### Blocking Decisions
None.

---

# Phase 3 — Localization, SEO, and Search

## I18N-P3-001 — Define Shared Locale Contract and Resolver
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P0
### Goal
Provide one locale contract and resolver for Catalog, Tools, Discover, static generation, and future CMS adapters.
### Why
Locale identity and route casing must not diverge across frontends.
### Scope
`en`, `zh-CN`, `zh-TW`, path mapping, HTML language, hreflang, normalization, and unsupported-locale behavior.
### Out of Scope
Translating content.
### Dependencies
CAT-P1-002, TOOLS-P2-012.
### Likely Files / Areas
Schema locale module, `src/lib/routes.js`, shared locale package/tests.
### Implementation Notes
Keep canonical IDs BCP 47 and map route segments explicitly.
### Acceptance Criteria
- Every consumer resolves identical locale semantics.
- Unknown locale never silently publishes a wrong-language page.
### Tests / Validation
Resolver, route, language-switch, and static HTML tests.
### Migration / Rollback Considerations
Compatibility export retains current route API.
### Security Considerations
Reject locale strings used to construct arbitrary paths.
### Documentation Updates
Locale contract.
### Estimated Complexity
M
### Blocking Decisions
None.

## I18N-P3-002 — Approve Locale Fallback and Publication Policy
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P0
### Goal
Define field fallback, missing-translation display, and publication readiness rules.
### Why
Uncontrolled fallback can publish mixed-language or misleading pages.
### Scope
Required locales by entity/status, fallback order, UI labels, SEO fields, FAQ, and hidden/deprecated behavior.
### Out of Scope
Machine translation.
### Dependencies
I18N-P3-001, ARCH-P0-005.
### Likely Files / Areas
Locale ADR, validation rules, operator guidance.
### Implementation Notes
Recommended default: all three locales required for published public resources; draft/review may be incomplete.
### Acceptance Criteria
- Every localized field class has explicit rules.
- Published pages cannot mix locale content silently.
### Tests / Validation
Publication fixture matrix for complete and incomplete locales.
### Migration / Rollback Considerations
Existing three-language tools already satisfy the strict policy.
### Security Considerations
Fallback does not expose internal draft content.
### Documentation Updates
Localization and publication policy.
### Estimated Complexity
S
### Blocking Decisions
Mandatory locale minimum.

## I18N-P3-003 — Migrate Resource Locale Consumption
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P1
### Goal
Make localized resource fields resolve from separate ResourceLocale records.
### Why
Nested locale objects couple identity and translations.
### Scope
Names, summaries, descriptions, slugs/aliases, long-form content, and UI selectors for Tools.
### Out of Scope
Discover pages.
### Dependencies
I18N-P3-001, I18N-P3-002, TOOLS-P2-012.
### Likely Files / Areas
Catalog selectors, tool/category components, static content renderer.
### Implementation Notes
Do not duplicate components per locale.
### Acceptance Criteria
- Current three-language output is preserved.
- Missing locale behavior follows policy and fails publication where required.
### Tests / Validation
Locale coverage, route, static content, and component source tests.
### Migration / Rollback Considerations
Selector adapter can fall back to normalized legacy output during one release.
### Security Considerations
Only published locale records reach public artifacts.
### Documentation Updates
Frontend localization guide.
### Estimated Complexity
M
### Blocking Decisions
None.

## I18N-P3-004 — Localize Taxonomy, Collections, Relations, and FAQ
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P1
### Goal
Resolve all discovery content through typed locale records.
### Why
Resource localization alone leaves navigation and supporting content inconsistent.
### Scope
Category/tag/collection names and descriptions, FAQ text, relation labels, and operational completeness.
### Out of Scope
CMS translation UI.
### Dependencies
I18N-P3-003, CAT-P1-003, CAT-P1-004.
### Likely Files / Areas
Catalog selectors, category/FAQ renderers, locale validation.
### Implementation Notes
Relation identity is locale-neutral; only labels/context are localized.
### Acceptance Criteria
- All public taxonomy and FAQ text is complete in three locales.
- No source maintains independent navigation translations.
### Tests / Validation
Completeness and rendered-output tests.
### Migration / Rollback Considerations
Use Catalog snapshot rollback.
### Security Considerations
Draft translations do not leak.
### Documentation Updates
Translator field guide.
### Estimated Complexity
M
### Blocking Decisions
None.

## I18N-P3-005 — Build Translation Completeness CLI
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P1
### Goal
Report missing, stale, fallback, and unpublished translations by entity and field.
### Why
Operators need actionable evidence before publication.
### Scope
CLI output, status codes, reviewed-at/version comparison, machine-readable report, and CI policy.
### Out of Scope
Automatic translation.
### Dependencies
I18N-P3-002, I18N-P3-004.
### Likely Files / Areas
Catalog validation CLI, reports, tests.
### Implementation Notes
Separate missing from intentionally locale-neutral fields.
### Acceptance Criteria
- Report identifies exact entity, locale, and field.
- Published missing content fails according to policy.
### Tests / Validation
Complete, partial, stale, and exempt fixture tests.
### Migration / Rollback Considerations
Additive CI rule; exemption format is reviewed and versioned.
### Security Considerations
Reports contain public content metadata only.
### Documentation Updates
Translation QA guide.
### Estimated Complexity
M
### Blocking Decisions
Definition of stale translation.

## I18N-P3-006 — Add Cross-Frontend Locale Regression Suite
### Phase
Phase 3 — Localization
### Status
Planned
### Priority
P0
### Goal
Verify locale routes, switch semantics, HTML language, content, and fallbacks across Tools and future Discover.
### Why
Shared schemas still need consumer-level proof.
### Scope
Contract tests, static HTML, language switching, 404, accessibility names, and mixed-language detection.
### Out of Scope
Human translation quality review.
### Dependencies
I18N-P3-003, I18N-P3-004, I18N-P3-005.
### Likely Files / Areas
Route/content tests, build verifier, future Discover tests.
### Implementation Notes
Drive expectations from Catalog rather than a second hand-maintained resource list.
### Acceptance Criteria
- Every published route passes three-language checks.
- Unknown locale and missing locale behavior are deterministic.
### Tests / Validation
Unit, integration, generated HTML, and browser locale smoke checks.
### Migration / Rollback Considerations
No runtime migration.
### Security Considerations
No draft locale appears in public test artifacts.
### Documentation Updates
Localization test matrix.
### Estimated Complexity
M
### Blocking Decisions
None.

## SEO-P3-001 — Build Catalog-Driven Page Metadata Resolver
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P0
### Goal
Resolve title, description, canonical input, and social metadata from Resource and locale records.
### Why
SEO must use the same source as visible content.
### Scope
Home, resource, taxonomy, collection, information, and 404 metadata contracts.
### Out of Scope
Discover rendering.
### Dependencies
I18N-P3-003, TOOLS-P2-011.
### Likely Files / Areas
Shared SEO package, `src/lib/seo.js`, schema SEO fields.
### Implementation Notes
Keep canonical origin supplied by frontend configuration, not authored content.
### Acceptance Criteria
- Metadata is unique and locale-consistent.
- Tool-site output remains equivalent.
### Tests / Validation
Resolver unit tests and current route parity tests.
### Migration / Rollback Considerations
Compatibility resolver can restore current SEO module.
### Security Considerations
Escape all authored metadata and JSON serialization.
### Documentation Updates
SEO field ownership guide.
### Estimated Complexity
M
### Blocking Decisions
None.

## SEO-P3-002 — Define Canonical, Hreflang, and Origin Policy
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P0
### Goal
Define cross-frontend canonical and language-alternate behavior.
### Why
Discover and Tools share resources but must not create duplicate canonical pages.
### Scope
Domain ownership, route-to-resource mapping, x-default, aliases, redirects, and shared-resource presentation.
### Out of Scope
Changing DNS or apex redirect.
### Dependencies
SEO-P3-001, ARCH-P0-003.
### Likely Files / Areas
SEO ADR, route schemas, frontend configuration.
### Implementation Notes
A tool canonical remains on `tools.godeskhub.com`; Discover cards link there unless a separate detail page has distinct value.
### Acceptance Criteria
- Every page type has one canonical owner.
- Hreflang sets contain only final 200 URLs.
### Tests / Validation
Canonical matrix and duplicate-URL audit.
### Migration / Rollback Considerations
Preserve current tool canonicals and redirects.
### Security Considerations
Origins are allowlisted configuration.
### Documentation Updates
Canonical and routing ADR.
### Estimated Complexity
M
### Blocking Decisions
Whether Discover has tool detail pages or direct links only.

## SEO-P3-003 — Map Resource Types to Structured Data
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P1
### Goal
Generate valid JSON-LD graphs for websites, tools, guides, taxonomy, collections, FAQ, and breadcrumbs.
### Why
The current graph supports only tool-site page types.
### Scope
Schema.org mapping, stable entity IDs, visible-content parity, and graph deduplication.
### Out of Scope
Ratings, reviews, prices, or other unsupported claims.
### Dependencies
SEO-P3-001, CAT-P1-004.
### Likely Files / Areas
Shared structured-data module, SEO tests, static renderer.
### Implementation Notes
FAQPage includes only visible published FAQ.
### Acceptance Criteria
- JSON parses and matches page language, canonical, and visible content.
- No false rating, offer, user-count, or review data.
### Tests / Validation
Per-page-type graph tests and generated HTML parse.
### Migration / Rollback Considerations
Existing tool graphs remain the compatibility baseline.
### Security Considerations
Serialize safely; never include user input or private health fields.
### Documentation Updates
Structured-data mapping.
### Estimated Complexity
M
### Blocking Decisions
None.

## SEO-P3-004 — Generate Catalog-Driven Localized Sitemaps
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P0
### Goal
Generate frontend-specific Sitemaps from published Catalog routes.
### Why
Sitemap must follow publication status and canonical ownership.
### Scope
Tools and Discover Sitemap generation, locale alternates if selected, escaping, deduplication, and final-200 filtering.
### Out of Scope
Submitting Sitemaps to search engines.
### Dependencies
SEO-P3-002, I18N-P3-005.
### Likely Files / Areas
Static generators, Sitemap module, build verifier.
### Implementation Notes
Hidden, draft, review, deprecated-with-redirect, and alias URLs follow explicit policy.
### Acceptance Criteria
- Every URL is unique, HTTPS, canonical, published, and expected to return 200.
- Current tool Sitemap remains exact during migration.
### Tests / Validation
Catalog-route equality and generated XML tests.
### Migration / Rollback Considerations
Restore previous generator with the last stable artifact.
### Security Considerations
No admin, preview, or draft URLs.
### Documentation Updates
Sitemap ownership guide.
### Estimated Complexity
M
### Blocking Decisions
Localized alternate XML strategy.

## SEO-P3-005 — Implement Robots and Publication Indexing Policy
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P1
### Goal
Map lifecycle state and page type to index/follow behavior and robots output.
### Why
Draft, hidden, deprecated, missing, and preview content require deterministic treatment.
### Scope
Meta robots, robots.txt, preview headers, 404/410/redirect policy, and admin exclusion.
### Out of Scope
Search-engine console operations.
### Dependencies
ARCH-P0-005, SEO-P3-002.
### Likely Files / Areas
SEO policy module, static generator, Cloudflare headers if needed.
### Implementation Notes
Deprecated resources may redirect or remain indexed only when the resource-specific migration plan justifies it.
### Acceptance Criteria
- Every publication state has defined HTTP and indexing behavior.
- Preview/admin never index.
### Tests / Validation
Status matrix and built-header/HTML tests.
### Migration / Rollback Considerations
Current published and 404 behavior remains baseline.
### Security Considerations
Robots is not access control; protected content still requires authentication.
### Documentation Updates
Indexing lifecycle policy.
### Estimated Complexity
M
### Blocking Decisions
Deprecated-resource default: redirect versus 410.

## SEO-P3-006 — Add SEO and Static Artifact Regression Gate
### Phase
Phase 3 — SEO
### Status
Planned
### Priority
P0
### Goal
Verify raw HTML, metadata, structured data, Sitemap, redirects, 404, and assets for all Catalog routes.
### Why
Client-only checks cannot prove search-engine-visible output.
### Scope
Tools and future Discover generated artifacts, duplicates, stale assets, and source/visible/JSON-LD consistency.
### Out of Scope
External search ranking measurement.
### Dependencies
SEO-P3-003, SEO-P3-004, SEO-P3-005.
### Likely Files / Areas
Build verifier, CI, static fixture tests.
### Implementation Notes
Drive expected counts from Catalog and frontend route policies.
### Acceptance Criteria
- Invalid metadata or missing static content fails CI.
- Current 111 tool-site routes remain verified until Catalog changes the count.
### Tests / Validation
Build and parse every generated page.
### Migration / Rollback Considerations
No runtime changes.
### Security Considerations
Check artifacts for secrets, test data, and user content.
### Documentation Updates
SEO verification runbook.
### Estimated Complexity
L
### Blocking Decisions
None.

## SEARCH-P3-001 — Define Unified Search Document Schema
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P0
### Goal
Define the normalized search document for tools, websites, and guides.
### Why
Current results cannot represent shared Resource types.
### Scope
`id`, `type`, `locale`, `name`, `description`, `category`, `tags`, `keywords`, `url`, publication fields, and ranking inputs.
### Out of Scope
Search UI or SaaS selection.
### Dependencies
CAT-P1-002, CAT-P1-003, I18N-P3-002.
### Likely Files / Areas
Schema package, search architecture docs, tests.
### Implementation Notes
Exclude raw private queries and non-public operational fields.
### Acceptance Criteria
- All three resource types map without type-specific ambiguity.
- Hidden or nonpublished resources cannot enter public indexes.
### Tests / Validation
Schema fixtures for each resource type and locale.
### Migration / Rollback Considerations
Current tool-search result adapter remains available.
### Security Considerations
Only public Catalog content is indexed.
### Documentation Updates
Search document contract.
### Estimated Complexity
S
### Blocking Decisions
None.

## SEARCH-P3-002 — Build Deterministic Local Search Index
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P0
### Goal
Generate a compact static search index from the normalized Catalog.
### Why
Phase 3 should remain low-cost and avoid premature search SaaS.
### Scope
Index builder, locale partitioning, normalization, size report, versioning, and static artifact output.
### Out of Scope
Fuzzy-search dependency unless evidence requires it.
### Dependencies
SEARCH-P3-001, CAT-P1-011.
### Likely Files / Areas
Search builder package/script, generated artifact, tests.
### Implementation Notes
Preserve English case-insensitive and Chinese substring matching.
### Acceptance Criteria
- Index contains all and only published resources for each locale.
- Build is deterministic and within an approved size budget.
### Tests / Validation
Index equality, duplicate, locale, and size tests.
### Migration / Rollback Considerations
Current runtime tool index remains until consumer migration.
### Security Considerations
No draft, health evidence, user query, or tool input.
### Documentation Updates
Index build contract.
### Estimated Complexity
M
### Blocking Decisions
Initial index size budget.

## SEARCH-P3-003 — Implement Localized Multi-Resource Ranking
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P1
### Goal
Rank names, aliases, descriptions, categories, tags, keywords, and use cases consistently by locale.
### Why
Different resource types need comparable but explainable local ranking.
### Scope
Field weights, exact/prefix/substring matches, locale normalization, deterministic tie-breaks, and result-type labels.
### Out of Scope
Personalization and recommendation models.
### Dependencies
SEARCH-P3-002.
### Likely Files / Areas
Shared search library, ranking fixtures, benchmark tests.
### Implementation Notes
Do not use local usage history to reorder results unless separately approved.
### Acceptance Criteria
- Known queries return intended resource types and language routes.
- Ranking is deterministic and explainable.
### Tests / Validation
Three-language query evaluation set and regression thresholds.
### Migration / Rollback Considerations
Feature flag between current and unified ranking.
### Security Considerations
Queries remain local and are not logged by default.
### Documentation Updates
Ranking policy.
### Estimated Complexity
M
### Blocking Decisions
Whether editorial boosts are allowed in Phase 3.

## SEARCH-P3-004 — Migrate Tools Search to Unified Index
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P1
### Goal
Make the existing search dialog consume unified Resource results while preserving current tool behavior.
### Why
The Tools frontend is the first production consumer of the new index.
### Scope
Adapter, result rendering, tool navigation, type/category labels, keyboard behavior, and no-result state.
### Out of Scope
Displaying unpublished websites/guides before Discover launches.
### Dependencies
SEARCH-P3-003.
### Likely Files / Areas
`src/components/SearchDialog.tsx`, search adapter/tests.
### Implementation Notes
Feature-gate non-tool result display until corresponding routes exist.
### Acceptance Criteria
- Current tool queries and keyboard actions remain correct.
- Results link to the current locale canonical route.
### Tests / Validation
Search, UI, keyboard, route, and mobile tests.
### Migration / Rollback Considerations
Switch back to current `searchTools` adapter.
### Security Considerations
No external requests or query persistence.
### Documentation Updates
Tools search migration note.
### Estimated Complexity
M
### Blocking Decisions
None.

## SEARCH-P3-005 — Define Search Privacy and Analytics Contract
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P1
### Goal
Define allowed aggregate search signals without collecting sensitive raw queries.
### Why
Future search analytics must respect browser-local tool and text privacy.
### Scope
Event allowlist, query classification/redaction, no-result counters, retention, sampling, and opt-out implications.
### Out of Scope
Sending analytics events.
### Dependencies
ARCH-P0-006, SEARCH-P3-001.
### Likely Files / Areas
Privacy architecture, event schema, tests.
### Implementation Notes
Default to no raw query collection; use approved categorical or count signals only.
### Acceptance Criteria
- Forbidden fields are explicit and testable.
- Privacy policy update requirements are documented.
### Tests / Validation
Threat-model review and event fixture allowlist tests.
### Migration / Rollback Considerations
No runtime effect.
### Security Considerations
Avoid accidental capture of passwords, JSON, URLs, amounts, or personal data.
### Documentation Updates
Search analytics privacy contract.
### Estimated Complexity
S
### Blocking Decisions
Whether any normalized query token may leave the browser.

## SEARCH-P3-006 — Add Search Quality and Accessibility Regression Suite
### Phase
Phase 3 — Search
### Status
Planned
### Priority
P1
### Goal
Protect relevance, locale routing, keyboard interaction, focus, and no-result behavior.
### Why
Unified search changes both data and interaction contracts.
### Scope
Evaluation queries, relevance thresholds, ARIA combobox/dialog behavior, mobile, and performance budget.
### Out of Scope
Human editorial ranking reviews beyond the fixture set.
### Dependencies
SEARCH-P3-004, SEARCH-P3-005.
### Likely Files / Areas
Search tests, accessibility tests, browser smoke checklist.
### Implementation Notes
Keep a small curated query set per locale and resource type.
### Acceptance Criteria
- No regression in current tool searches.
- Keyboard-only users can open, navigate, select, close, and return focus.
### Tests / Validation
Unit, component/static contract, and browser interaction tests.
### Migration / Rollback Considerations
No data migration.
### Security Considerations
Fixtures contain synthetic public queries only.
### Documentation Updates
Search QA guide.
### Estimated Complexity
M
### Blocking Decisions
None.

---

# Phase 4 — Discover Application

## DISC-P4-001 — Decide Discover Application Boundary and Bootstrap
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P0
### Goal
Create the `godeskhub.com` Discover frontend as a separate application consuming the shared Catalog.
### Why
Discover and Tools require independent deployment and presentation boundaries.
### Scope
Repository/app location, Vite/static setup, Catalog artifact consumption, build output, CI, and local development.
### Out of Scope
DNS cutover or production deployment.
### Dependencies
SEARCH-P3-002, SEO-P3-002, ARCH-P0-003.
### Likely Files / Areas
Approved Discover app directory/repository, package scripts, CI, deployment docs.
### Implementation Notes
Do not move the existing Tools app as a prerequisite.
### Acceptance Criteria
- Discover builds independently from the same Catalog version.
- Tools build remains unchanged.
### Tests / Validation
Fresh install, typecheck, test, build, and artifact smoke test.
### Migration / Rollback Considerations
No apex switch; deleting the new app leaves Tools intact.
### Security Considerations
No admin secrets or unpublished Catalog records in public artifacts.
### Documentation Updates
Discover architecture and developer setup.
### Estimated Complexity
L
### Blocking Decisions
Same repository versus separate repository.

## DISC-P4-002 — Build Discover Global Shell
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Implement responsive header, footer, locale switcher, navigation, search entry, and semantic page shell.
### Why
Every Discover page needs a consistent accessible frame.
### Scope
Desktop/mobile navigation, focus management, skip link, locale preservation, footer links, and error boundary.
### Out of Scope
Copying the full Tools UI.
### Dependencies
DISC-P4-001, I18N-P3-001, SEARCH-P3-004.
### Likely Files / Areas
Discover shell components, shared tokens, accessibility tests.
### Implementation Notes
Share brand tokens, typography, spacing, radius, and icons; allow resource-discovery-specific layouts.
### Acceptance Criteria
- Shell works at supported breakpoints and 200% zoom.
- Locale switch preserves page semantics where an alternate exists.
### Tests / Validation
Component, keyboard, screen-reader-name, responsive, and browser tests.
### Migration / Rollback Considerations
Independent app.
### Security Considerations
External links use safe attributes and validated URLs.
### Documentation Updates
Discover UI conventions.
### Estimated Complexity
L
### Blocking Decisions
None.

## DISC-P4-003 — Build Shared Resource Card System
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Render website, tool, and guide resources with shared semantics and type-appropriate presentation.
### Why
One Catalog does not require one visually identical card.
### Scope
Card contract, icons/images, category/tags, summaries, badges, external/internal links, status filtering, and compact/list variants.
### Out of Scope
User ratings or fabricated popularity.
### Dependencies
DISC-P4-002, CAT-P1-002, CAT-P1-003.
### Likely Files / Areas
Discover ResourceCard components, design tokens, tests.
### Implementation Notes
Tool cards link to canonical Tools pages; website cards disclose external navigation.
### Acceptance Criteria
- All resource types are distinguishable and accessible.
- Hidden/draft resources never render publicly.
### Tests / Validation
Per-type component, link, localization, and contrast tests.
### Migration / Rollback Considerations
Independent component.
### Security Considerations
Validate external URL schemes and never execute authored HTML.
### Documentation Updates
Resource presentation guide.
### Estimated Complexity
M
### Blocking Decisions
Image/media policy for website cards.

## DISC-P4-004 — Build Discover Homepage
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Create Catalog-driven Hero/Search, Popular, Recommended, New, Categories, and Collections sections.
### Why
The apex domain needs a useful discovery entry point rather than a redirect.
### Scope
Section selectors, editorial ordering, empty states, localized content, static rendering, and responsive layout.
### Out of Scope
Personalized recommendations.
### Dependencies
DISC-P4-003, SEARCH-P3-003.
### Likely Files / Areas
Discover homepage, Catalog selectors, static page generator.
### Implementation Notes
Popular may use approved aggregate signals plus editorial override only after data governance exists; use editorial data initially.
### Acceptance Criteria
- Every section is Catalog-driven and has deterministic fallback behavior.
- Main content exists in raw built HTML.
### Tests / Validation
Selector, static HTML, locale, empty-state, and responsive tests.
### Migration / Rollback Considerations
Do not switch apex until deployment task passes.
### Security Considerations
No user profiling or raw query data.
### Documentation Updates
Homepage content operations guide.
### Estimated Complexity
L
### Blocking Decisions
Initial editorial sets for Popular and Recommended.

## DISC-P4-005 — Build Category and Tag Browse Pages
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Implement localized category routes and tag-filtered discovery.
### Why
Taxonomy must become navigable beyond homepage sections.
### Scope
`/{locale}/category/{slug}`, category content, child categories if enabled, resource lists, tags, pagination policy, breadcrumbs, and SEO.
### Out of Scope
Operator ordering UI.
### Dependencies
DISC-P4-003, SEO-P3-001, I18N-P3-004.
### Likely Files / Areas
Discover routes, category/tag pages, selectors, static generation.
### Implementation Notes
Use validated Catalog slugs and explicit canonical policy.
### Acceptance Criteria
- Every published category has three-language static pages.
- Empty and unknown categories use defined noindex/404 behavior.
### Tests / Validation
Route, SEO, localization, filtering, pagination, and build tests.
### Migration / Rollback Considerations
Independent routes not yet linked from production apex.
### Security Considerations
Filter parameters are allowlisted and bounded.
### Documentation Updates
Category/tag URL guide.
### Estimated Complexity
L
### Blocking Decisions
Tag pages as routes versus filter state in v1.

## DISC-P4-006 — Build Website Resource Detail Pages
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Create `/{locale}/site/{slug}` pages with trustworthy website summaries and outbound navigation.
### Why
Website resources need value beyond a bare directory card.
### Scope
Localized metadata/content, taxonomy, FAQ, relations, health disclosure, external link action, breadcrumbs, and SEO.
### Out of Scope
Embedding third-party websites or proxying their content.
### Dependencies
DISC-P4-005, SEO-P3-003.
### Likely Files / Areas
Discover website page, static renderer, health selector.
### Implementation Notes
Show last-reviewed or health status only when meaningful and not misleading.
### Acceptance Criteria
- Page content and JSON-LD come from published Catalog records.
- External destination is clear before navigation.
### Tests / Validation
Static HTML, external-link, FAQ, relation, locale, and SEO tests.
### Migration / Rollback Considerations
Remove routes before apex cutover if necessary.
### Security Considerations
No arbitrary iframe/script; validate URL and rich text.
### Documentation Updates
Website resource authoring guide.
### Estimated Complexity
M
### Blocking Decisions
Website structured-data type policy.

## DISC-P4-007 — Build Guide Pages
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Create `/{locale}/guide/{slug}` static guide pages from Catalog content.
### Why
Guides are a first-class Resource v1 type.
### Scope
Structured body content, headings, references, FAQ, relations, breadcrumbs, SEO, and reading layout.
### Out of Scope
Collaborative rich-text editing; handled in CMS phases.
### Dependencies
DISC-P4-005, SEO-P3-003.
### Likely Files / Areas
Guide renderer, content schema adapter, static generation.
### Implementation Notes
Start with safe structured blocks or sanitized Markdown selected by an ADR.
### Acceptance Criteria
- Main guide content is available without JavaScript.
- Heading hierarchy, links, tables, and code blocks are accessible.
### Tests / Validation
Sanitization, static HTML, locale, SEO, and accessibility tests.
### Migration / Rollback Considerations
Guide publication can remain disabled until content is ready.
### Security Considerations
No arbitrary script, embed, or unsafe URL.
### Documentation Updates
Guide content format.
### Estimated Complexity
L
### Blocking Decisions
Structured blocks versus restricted Markdown for Git/YAML stage.

## DISC-P4-008 — Build Collection Pages
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Render manual, automatic, and hybrid collections with stable localized routes.
### Why
Collections are the editorial layer for cross-category resource discovery.
### Scope
Collection route, localized introduction, membership resolution, ordering, filters, related collections, breadcrumbs, and SEO.
### Out of Scope
Collection editor UI.
### Dependencies
DISC-P4-003, CAT-P1-003, SEO-P3-003.
### Likely Files / Areas
Discover collection pages/selectors, rule evaluator, tests.
### Implementation Notes
Automatic rules use the small validated grammar defined in Phase 1.
### Acceptance Criteria
- Mode semantics are deterministic and duplicates are removed.
- Invalid or empty collections follow publication policy.
### Tests / Validation
Mode, ordering, locale, route, SEO, and static build tests.
### Migration / Rollback Considerations
Disable individual collections by publication status.
### Security Considerations
Rules are data, never executable expressions.
### Documentation Updates
Collection behavior guide.
### Estimated Complexity
M
### Blocking Decisions
None.

## DISC-P4-009 — Add Related Resources and Unified Search Experience
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P1
### Goal
Use explicit relations and the unified index across all Discover pages.
### Why
Cross-resource discovery is a core platform benefit.
### Scope
Related-resource selectors, result type filters, search page/dialog, keyboard behavior, no-result suggestions, and canonical links.
### Out of Scope
Recommendation engine or personalization.
### Dependencies
DISC-P4-006, DISC-P4-007, DISC-P4-008, SEARCH-P3-006.
### Likely Files / Areas
Discover search/related components and selectors.
### Implementation Notes
Editorial relations take precedence over deterministic fallback rules.
### Acceptance Criteria
- Tools, websites, and guides appear correctly by locale and type.
- Search remains local/static in Phase 4.
### Tests / Validation
Search quality, relation, route, keyboard, and mobile tests.
### Migration / Rollback Considerations
Disable unified sections independently.
### Security Considerations
No raw-query analytics unless later approved.
### Documentation Updates
Discovery/search UX guide.
### Estimated Complexity
L
### Blocking Decisions
None.

## DISC-P4-010 — Add Discover Static SEO, Accessibility, and Performance Gates
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P0
### Goal
Make Discover independently release-ready on Cloudflare Pages.
### Why
Routes are incomplete until raw HTML, accessibility, performance, and HTTP behavior are verified.
### Scope
Static generation, Sitemap, robots, 404, assets, deep links, keyboard, screen reader, 200% zoom, bundle budgets, and Core Web Vitals targets.
### Out of Scope
Production deployment.
### Dependencies
DISC-P4-004 through DISC-P4-009, SEO-P3-006.
### Likely Files / Areas
Discover build/verify scripts, CI, accessibility/E2E tests, deployment checklist.
### Implementation Notes
Use Catalog-driven expected routes and retain a browser acceptance checklist.
### Acceptance Criteria
- All automated gates pass and manual browser evidence is recorded.
- No draft content or user data appears in output.
### Tests / Validation
Lint, typecheck, unit, integration, build, verify, a11y, E2E, performance audit.
### Migration / Rollback Considerations
No DNS switch until this task passes.
### Security Considerations
Artifact secret scan and dependency audit.
### Documentation Updates
Discover deployment and rollback guide.
### Estimated Complexity
L
### Blocking Decisions
Performance budgets and browser matrix.

## DISC-P4-011 — Prepare Apex Cutover and Rollback Plan
### Phase
Phase 4 — Discover
### Status
Planned
### Priority
P0
### Goal
Prepare, but do not automatically execute, the transition from apex redirect to Discover.
### Why
The domain change affects routing, SEO, Cloudflare, and rollback.
### Scope
Preview verification, DNS/redirect inventory, canonical checks, cache plan, monitoring, rollback triggers, and owner approval checklist.
### Out of Scope
Changing Cloudflare DNS or production rules without explicit approval.
### Dependencies
DISC-P4-010.
### Likely Files / Areas
Deployment runbook, Cloudflare checklist, monitoring plan.
### Implementation Notes
Treat production change as a separate approval-gated operations task.
### Acceptance Criteria
- Exact manual steps, verification URLs, rollback steps, and decision owner are documented.
- Tools subdomain remains unaffected.
### Tests / Validation
Preview HTTP matrix and dry-run checklist.
### Migration / Rollback Considerations
Restore apex redirect and last stable Discover deployment.
### Security Considerations
No credentials in documentation.
### Documentation Updates
Apex deployment runbook.
### Estimated Complexity
M
### Blocking Decisions
Final production approval and Cloudflare account access.

---

# Phase 5 — Payload CMS Proof of Concept

## CMS-P5-001 — Bootstrap Independent Payload PoC Application
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Create an isolated Payload application for schema and operator evaluation.
### Why
ADR-017 prohibits forcing a full-stack CMS into the Pages frontend.
### Scope
Project bootstrap, version pinning, local environment template, tests, build, and repository boundary.
### Out of Scope
Production deployment or real Catalog import.
### Dependencies
CAT-P1-011, ARCH-P0-003.
### Likely Files / Areas
Approved CMS app directory/repository, package config, example environment, CI.
### Implementation Notes
No secrets or production data; record package licenses and runtime requirements.
### Acceptance Criteria
- CMS starts locally and builds independently.
- Public frontend builds do not require CMS availability.
### Tests / Validation
Install, typecheck, test, build, admin smoke test.
### Migration / Rollback Considerations
Delete isolated PoC without affecting Catalog or frontends.
### Security Considerations
Use synthetic credentials and ignored environment files.
### Documentation Updates
PoC setup and boundary notes.
### Estimated Complexity
M
### Blocking Decisions
Payload major version and PoC hosting shortlist.

## CMS-P5-002 — Create Synthetic PoC Dataset
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P1
### Goal
Prepare 10 websites, 5 tools, 3 categories, 3 collections, 3 locales, FAQ, and relations.
### Why
The PoC needs realistic breadth without production content risk.
### Scope
Synthetic YAML/source fixtures, expected counts, localization, workflow states, and reconciliation manifest.
### Out of Scope
Copying private or production-only records.
### Dependencies
CAT-P1-009, CMS-P5-001.
### Likely Files / Areas
PoC fixtures, expected-manifest tests.
### Implementation Notes
Include valid and intentionally incomplete draft records for workflow tests.
### Acceptance Criteria
- Dataset validates against domain schemas.
- Expected counts and relations are deterministic.
### Tests / Validation
Catalog validate and checksum manifest.
### Migration / Rollback Considerations
Synthetic dataset can be reseeded from scratch.
### Security Considerations
No real users, secrets, or private business notes.
### Documentation Updates
Dataset description.
### Estimated Complexity
M
### Blocking Decisions
None.

## CMS-P5-003 — Map Resource and Publication Schemas to Payload
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Represent website, tool, guide, stable IDs, bindings, and publication states without distorting the domain model.
### Why
Resource mapping is the primary CMS fit test.
### Scope
Payload collections, validation hooks/adapters, status mapping, immutable IDs, and public-field projection.
### Out of Scope
Taxonomy, locales, and production migrations.
### Dependencies
CMS-P5-001, CAT-P1-002.
### Likely Files / Areas
Payload resource collection, domain adapters, mapping tests.
### Implementation Notes
Document every Payload-specific field or status translation.
### Acceptance Criteria
- All Resource v1 types round-trip to the CMS-neutral contract.
- CMS cannot author executable module paths.
### Tests / Validation
Create/read/update/round-trip and invalid-state tests.
### Migration / Rollback Considerations
PoC database can be reset and reseeded.
### Security Considerations
Closed tool-binding allowlist and public-field projection.
### Documentation Updates
Schema mapping matrix.
### Estimated Complexity
L
### Blocking Decisions
Payload draft-status mapping to domain `review`.

## CMS-P5-004 — Map Localization to Payload
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Validate English, Simplified Chinese, and Traditional Chinese authoring and completeness.
### Why
Payload localization must support separate domain locale records and workflow evidence.
### Scope
Locale configuration, required fields, locale projections, fallback prevention, translation status, and preview.
### Out of Scope
Automatic translation.
### Dependencies
CMS-P5-003, I18N-P3-002.
### Likely Files / Areas
Payload locale config, adapter, admin labels, tests.
### Implementation Notes
Keep domain locale IDs canonical even if Payload uses internal locale keys.
### Acceptance Criteria
- All three locales round-trip without overwriting each other.
- Published completeness follows domain policy.
### Tests / Validation
Locale CRUD, incomplete draft, publish rejection, and API projection tests.
### Migration / Rollback Considerations
Mapping remains PoC-only.
### Security Considerations
Unpublished translations are excluded from public reads.
### Documentation Updates
Localization mapping.
### Estimated Complexity
L
### Blocking Decisions
None.

## CMS-P5-005 — Map Taxonomy and Collections to Payload
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Validate category, tag, and manual/automatic/hybrid collection editing.
### Why
The CMS must preserve distinct domain semantics and relations.
### Scope
Collections, hierarchy, localized labels, membership, rule adapter, order, and integrity hooks.
### Out of Scope
Drag-and-drop polish.
### Dependencies
CMS-P5-003, CAT-P1-003.
### Likely Files / Areas
Payload taxonomy/collection collections, adapters, tests.
### Implementation Notes
Automatic collection rules remain validated data, not CMS-evaluated JavaScript.
### Acceptance Criteria
- Domain records round-trip without semantic loss.
- Cycles and invalid memberships are blocked.
### Tests / Validation
CRUD, hierarchy, collection-mode, and projection tests.
### Migration / Rollback Considerations
Reseed PoC database.
### Security Considerations
No arbitrary query or code fields.
### Documentation Updates
Taxonomy/collection mapping.
### Estimated Complexity
L
### Blocking Decisions
None.

## CMS-P5-006 — Map FAQ, Relations, SEO, and Health Views
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P1
### Goal
Validate supporting content and operational visibility in the CMS.
### Why
Operators need more than the primary Resource form.
### Scope
FAQ, relation ordering, SEO fields, health read views, public projection, and validation.
### Out of Scope
Automated health checks.
### Dependencies
CMS-P5-003, CAT-P1-004.
### Likely Files / Areas
Payload collections/views, adapters, tests.
### Implementation Notes
Health observations are system-owned; editors may acknowledge or annotate but not falsify check results.
### Acceptance Criteria
- FAQ and relations round-trip and project correctly.
- SEO and health fields follow ownership rules.
### Tests / Validation
CRUD, relation integrity, public projection, and permission tests.
### Migration / Rollback Considerations
PoC reset.
### Security Considerations
Sanitize rich text and exclude internal health evidence publicly.
### Documentation Updates
Supporting entity mapping.
### Estimated Complexity
M
### Blocking Decisions
Rich-text format for FAQ and guides.

## CMS-P5-007 — Configure PostgreSQL Adapter and Migration Workflow
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Prove database schema generation, versioned migrations, rollback behavior, and local reset.
### Why
Production feasibility depends on repeatable database changes.
### Scope
Local PostgreSQL, adapter config, migration commands, seed/reset, schema diff review, and CI migration test.
### Out of Scope
Choosing the final managed provider.
### Dependencies
CMS-P5-003 through CMS-P5-006.
### Likely Files / Areas
Payload database config, migrations, seed scripts, test setup.
### Implementation Notes
Every schema change creates a reviewed migration; no auto-sync in production mode.
### Acceptance Criteria
- Empty database migrates and seeds deterministically.
- Forward and rollback/recovery paths are demonstrated.
### Tests / Validation
Migration-up, seed, count, and clean-database repeat tests.
### Migration / Rollback Considerations
PoC snapshots and database recreation.
### Security Considerations
Credentials remain in ignored/local secret storage.
### Documentation Updates
Migration developer guide.
### Estimated Complexity
L
### Blocking Decisions
Local PostgreSQL execution method.

## CMS-P5-008 — Configure Draft, Review, Preview, and Publish Workflow
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Map domain lifecycle states to a usable editorial workflow.
### Why
Payload defaults may not represent `review` and `hidden` exactly.
### Scope
Transitions, validation gates, preview token/context, publication projection, and mapping documentation.
### Out of Scope
Advanced approvals or scheduled publishing.
### Dependencies
CMS-P5-004, CMS-P5-007.
### Likely Files / Areas
Payload hooks/access rules, preview adapter, workflow tests.
### Implementation Notes
Do not alter domain states to match Payload convenience; implement an adapter.
### Acceptance Criteria
- Invalid transitions are blocked.
- Preview shows drafts only to authorized users.
- Published public reads exclude draft/review/hidden.
### Tests / Validation
Transition, role, preview, and public API tests.
### Migration / Rollback Considerations
PoC feature can be reset with database.
### Security Considerations
Preview URLs are scoped, expiring, and nonindexable.
### Documentation Updates
Workflow mapping and operator steps.
### Estimated Complexity
L
### Blocking Decisions
Review-state implementation strategy.

## CMS-P5-009 — Implement RBAC PoC
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Validate Owner, Editor, Translator, and Reviewer least-privilege roles.
### Why
Operator usability is irrelevant if permissions are unsafe or impractical.
### Scope
Collection/field access, locale restrictions, workflow transitions, user administration, and denial tests.
### Out of Scope
Cloudflare Access integration.
### Dependencies
CMS-P5-008.
### Likely Files / Areas
Payload auth/access modules, role fixtures, tests.
### Implementation Notes
Translator edits only assigned locale content; Reviewer approves but does not manage users.
### Acceptance Criteria
- Role capability matrix is enforced by API and admin UI.
- Privilege escalation attempts fail.
### Tests / Validation
Role CRUD/transition/API denial integration tests.
### Migration / Rollback Considerations
PoC users are synthetic and resettable.
### Security Considerations
Password policy, session settings, and bootstrap-owner handling.
### Documentation Updates
RBAC matrix.
### Estimated Complexity
L
### Blocking Decisions
Translator assignment granularity.

## CMS-P5-010 — Apply Minimal Admin Branding and Usability Labels
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P2
### Goal
Add GoDeskHub identity and clear operator terminology without rebuilding Payload Admin.
### Why
Operators need recognizable navigation and domain language for the usability test.
### Scope
Logo, brand name, basic tokens, collection labels, help text, and locale names.
### Out of Scope
Custom admin design system or layout rewrite.
### Dependencies
CMS-P5-006, CMS-P5-009.
### Likely Files / Areas
Payload admin config, static assets, label localization.
### Implementation Notes
Prefer built-in extension points.
### Acceptance Criteria
- Core entities and workflow actions are understandable to a non-Git operator.
- Upgrades are not blocked by invasive overrides.
### Tests / Validation
Admin smoke test and accessibility spot check.
### Migration / Rollback Considerations
Remove branding config to restore defaults.
### Security Considerations
No remote logo or injected script.
### Documentation Updates
Admin customization boundary.
### Estimated Complexity
S
### Blocking Decisions
None.

## CMS-P5-011 — Run Cloudflare Deployment Architecture Spike
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P1
### Goal
Validate viable independent hosting for `admin.godeskhub.com` and public Catalog reads.
### Why
Payload is full-stack and must not be assumed to fit the existing Pages app.
### Scope
Runtime compatibility, build/deploy prototype, database connectivity, preview/API path, cost estimate, logs, and rollback plan.
### Out of Scope
Production DNS, real secrets, or final provider commitment.
### Dependencies
CMS-P5-007, CMS-P5-008.
### Likely Files / Areas
PoC deployment config, architecture report, example variables.
### Implementation Notes
Compare Cloudflare-compatible options and a conventional Node host; record hard evidence.
### Acceptance Criteria
- One viable path is demonstrated or the PoC records a clear No-Go reason.
- Tools/Discover deployment remains independent.
### Tests / Validation
Preview deployment health, auth, database, API, and rollback checks.
### Migration / Rollback Considerations
Destroy PoC infrastructure after evidence capture if not retained.
### Security Considerations
No production data; secrets stored only in platform configuration.
### Documentation Updates
CMS deployment options report.
### Estimated Complexity
XL
### Blocking Decisions
Approved PoC host and budget.

## CMS-P5-012 — Run Operator Usability Test and Go/No-Go Review
### Phase
Phase 5 — Payload CMS PoC
### Status
Planned
### Priority
P0
### Goal
Prove a non-Git operator can create, localize, classify, preview, and publish a website resource.
### Why
Operator success is the decisive CMS PoC criterion.
### Scope
Scripted journey, observer rubric, errors/time, role handoff, data reconciliation, findings, and Go/No-Go recommendation.
### Out of Scope
Fixing every usability issue in the same task.
### Dependencies
CMS-P5-002 through CMS-P5-011.
### Likely Files / Areas
Usability script, results report, PoC decision ADR.
### Implementation Notes
Journey: create website → category → tags → collection → three locales → FAQ → SEO → preview → publish.
### Acceptance Criteria
- Operator completes the journey without Git or database access.
- Published record matches the domain manifest.
- Blocking issues and follow-up tasks are numbered.
### Tests / Validation
Recorded test evidence, Catalog projection validation, and stakeholder review.
### Migration / Rollback Considerations
No production migration begins without explicit Go approval.
### Security Considerations
Use synthetic accounts and data; remove recordings containing credentials.
### Documentation Updates
PoC final report and decision ADR.
### Estimated Complexity
M
### Blocking Decisions
Human operator availability and explicit Go/No-Go approval.

---

# Phase 6 — Production CMS Migration and Security

## CMS-P6-001 — Freeze Production CMS Schema and Compatibility Version
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Promote the approved PoC mapping into a reviewed production schema version.
### Why
Migration tooling and databases need a fixed contract.
### Scope
Schema version, Payload adapters, migrations, public projection, compatibility window, and change process.
### Out of Scope
Provisioning production infrastructure.
### Dependencies
CMS-P5-012 Go decision.
### Likely Files / Areas
Schema package, CMS collections, migration files, ADR.
### Implementation Notes
Resolve all PoC exceptions explicitly; no silent domain-model drift.
### Acceptance Criteria
- Domain-to-CMS mapping is complete and versioned.
- CI blocks unreviewed schema changes.
### Tests / Validation
Round-trip, migration, public projection, and compatibility tests.
### Migration / Rollback Considerations
Tag the PoC schema and production baseline separately.
### Security Considerations
Production-only fields are classified and access-controlled.
### Documentation Updates
Production schema reference.
### Estimated Complexity
L
### Blocking Decisions
Explicit Phase 5 Go approval.

## CMS-P6-002 — Select and Provision Production Runtime and PostgreSQL
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Provision reviewed production, staging, and backup environments for CMS and database.
### Why
The full-stack CMS requires independent reliable infrastructure.
### Scope
Provider evaluation, network topology, environments, storage, cost, observability, IaC/config review, and data residency.
### Out of Scope
DNS cutover and data import.
### Dependencies
CMS-P6-001, SEC-P6-001.
### Likely Files / Areas
Infrastructure config, deployment docs, secret references.
### Implementation Notes
Prefer low-cost infrastructure only when recovery and security requirements remain satisfied.
### Acceptance Criteria
- Staging and production are isolated.
- Database is not publicly exposed.
- Backup and restore prerequisites exist.
### Tests / Validation
Connectivity, TLS, least-privilege, fail/restart, and cost review.
### Migration / Rollback Considerations
Infrastructure is disposable before import; retain exportable backups.
### Security Considerations
Private network, encryption, access logs, secret rotation.
### Documentation Updates
Infrastructure architecture and provider decision.
### Estimated Complexity
XL
### Blocking Decisions
Final providers, region, budget, and owner approval.

## CMS-P6-003 — Build YAML-to-CMS Import Tool
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Implement validate → transform → import with idempotent stable IDs.
### Why
Manual production re-entry would lose evidence and relations.
### Scope
Dry run, schema-version check, upsert policy, transactions/batches, diagnostics, resume, and audit manifest.
### Out of Scope
Cutover or deleting YAML.
### Dependencies
CMS-P6-001, CAT-P1-011.
### Likely Files / Areas
Migration package/scripts, CMS API adapter, tests.
### Implementation Notes
Import normalized Catalog output, not raw YAML parser internals.
### Acceptance Criteria
- Repeated import is idempotent.
- Invalid or partial batches fail safely with a clear manifest.
### Tests / Validation
Empty DB, repeat, interruption/resume, invalid relation, and rollback tests.
### Migration / Rollback Considerations
Transaction rollback or checkpoint restore; preserve source snapshot.
### Security Considerations
Scoped service credentials, redacted logs, no public endpoint.
### Documentation Updates
Import command and recovery guide.
### Estimated Complexity
XL
### Blocking Decisions
Batch/transaction limits of chosen provider.

## CMS-P6-004 — Run Staging Import and Full Data Reconciliation
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Prove record counts, IDs, slugs, locales, relations, taxonomy, collections, and FAQ match the source snapshot.
### Why
Successful import commands do not prove semantic completeness.
### Scope
Reconciliation manifest, checksum/diff, public projection, generated routes, and issue classification.
### Out of Scope
Production import.
### Dependencies
CMS-P6-003, CMS-P6-002.
### Likely Files / Areas
Reconciliation scripts/reports, staging database, build pipeline.
### Implementation Notes
Compare normalized records and resulting public artifacts.
### Acceptance Criteria
- Every expected entity and locale reconciles or has an approved exception.
- No new routes, redirects, or SEO changes appear unexpectedly.
### Tests / Validation
Counts, IDs, graph integrity, route/SEO build, and sampled content review.
### Migration / Rollback Considerations
Reset staging and rerun from source snapshot.
### Security Considerations
Reports exclude secrets and internal auth data.
### Documentation Updates
Staging reconciliation report.
### Estimated Complexity
L
### Blocking Decisions
None.

## CMS-P6-005 — Implement Controlled Dual-Read Comparison
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P1
### Goal
Compare YAML and CMS normalized outputs without allowing two authoritative writers.
### Why
A short verification window can reduce cutover risk while preserving SSoT.
### Scope
Read adapters, deterministic diff, shadow comparison, alert/report, and one-writer policy.
### Out of Scope
Long-term dual source or automatic conflict merging.
### Dependencies
CMS-P6-004.
### Likely Files / Areas
Catalog source adapter, comparison job, feature flags.
### Implementation Notes
YAML remains the writer until cutover; CMS edits are disabled or treated as test-only.
### Acceptance Criteria
- Equivalent outputs compare cleanly.
- Drift blocks cutover and identifies the exact record/field.
### Tests / Validation
Injected drift, locale, ordering, relation, and status tests.
### Migration / Rollback Considerations
Disable CMS read path instantly.
### Security Considerations
Comparison logs use IDs and field paths, not sensitive content.
### Documentation Updates
Dual-read policy.
### Estimated Complexity
L
### Blocking Decisions
Whether dual-read is needed after staging evidence.

## CMS-P6-006 — Execute Production Import and Cutover
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Import the approved snapshot and switch the authoritative Catalog read path.
### Why
This establishes the CMS as the Catalog editor and source of truth.
### Scope
Change freeze, backup, import, reconciliation, publication projection, frontend build, monitoring, and approval gates.
### Out of Scope
Unrelated content edits or UI changes.
### Dependencies
CMS-P6-004, optional CMS-P6-005, SEC-P6-002 through SEC-P6-010.
### Likely Files / Areas
Production CMS/database, frontend Catalog configuration, cutover runbook.
### Implementation Notes
Require explicit owner approval for import, read-path switch, frontend deploy, and DNS/config changes.
### Acceptance Criteria
- Reconciliation is exact and public frontends pass regression.
- Only CMS-authorized publication changes public output after cutover.
### Tests / Validation
Full verify, preview/staging parity, production smoke, monitoring, and security checks.
### Migration / Rollback Considerations
Restore last stable YAML artifact/read path and database snapshot on trigger.
### Security Considerations
Least-privilege migration credentials and audited operator actions.
### Documentation Updates
Cutover evidence and incident contacts.
### Estimated Complexity
XL
### Blocking Decisions
Explicit production approvals and maintenance window.

## CMS-P6-007 — Validate Production Rollback and Snapshot Restore
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P0
### Goal
Demonstrate rollback to the last stable Catalog snapshot and database restore.
### Why
Rollback is not credible until exercised.
### Scope
Trigger criteria, frontend source switch, artifact restore, database point restore, reconciliation, and recovery timing.
### Out of Scope
Chaos testing unrelated services.
### Dependencies
CMS-P6-006, SEC-P6-010.
### Likely Files / Areas
Rollback scripts/runbook, backup system, staging rehearsal.
### Implementation Notes
Run full rehearsal in staging and a non-destructive production readiness check.
### Acceptance Criteria
- Recovery meets defined RTO/RPO.
- Restored frontends preserve URLs and SEO.
### Tests / Validation
Timed restore exercise and post-restore verification.
### Migration / Rollback Considerations
This task is the rollback proof.
### Security Considerations
Restore access is limited and audited.
### Documentation Updates
Recovery runbook and evidence.
### Estimated Complexity
L
### Blocking Decisions
RTO and RPO targets.

## CMS-P6-008 — Retire Git/YAML as Authoritative Editor
### Phase
Phase 6 — Production CMS Migration
### Status
Planned
### Priority
P1
### Goal
Close the dual-source window and document CMS authority.
### Why
Single Source of Truth requires removal of competing writable paths.
### Scope
Disable YAML publication workflow, retain read-only snapshots/export, update contributor docs/CI, and archive migration tooling responsibly.
### Out of Scope
Deleting historical Git records.
### Dependencies
CMS-P6-007 and stable production observation period.
### Likely Files / Areas
Catalog workflow, CI, docs, snapshot/export jobs.
### Implementation Notes
Keep schema/migrations in Git and support CMS-to-portable export for recovery.
### Acceptance Criteria
- YAML edits cannot publish.
- CMS export validates against the domain schema.
### Tests / Validation
Publication-path denial and export validation tests.
### Migration / Rollback Considerations
Last stable YAML snapshot remains available for emergency rollback per retention policy.
### Security Considerations
Exports are access-controlled and scrub internal fields.
### Documentation Updates
Source-of-truth and contributor guides.
### Estimated Complexity
M
### Blocking Decisions
Observation period before retirement.

## SEC-P6-001 — Produce CMS Threat Model
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Identify assets, actors, trust boundaries, abuse cases, and required controls for Admin, API, database, media, preview, and migration.
### Why
Security tasks need risk-based acceptance rather than a checklist alone.
### Scope
Data flow diagrams, STRIDE-style analysis, severity, mitigations, residual risk, and owners.
### Out of Scope
Penetration testing.
### Dependencies
CMS-P5-012.
### Likely Files / Areas
`docs/architecture/security-architecture.md`, threat-model artifacts.
### Implementation Notes
Include compromised editor, stolen session, malicious content, import abuse, and supply chain scenarios.
### Acceptance Criteria
- Every trust boundary and P0 threat has an owner and control.
### Tests / Validation
Security review workshop and traceability matrix.
### Migration / Rollback Considerations
Blocks production provisioning until accepted.
### Security Considerations
This task defines them.
### Documentation Updates
Threat model.
### Estimated Complexity
M
### Blocking Decisions
Accepted residual risks.

## SEC-P6-002 — Protect Admin with Cloudflare Access
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Require Cloudflare Access before any Admin or privileged preview surface.
### Why
ADR-014 mandates an external identity perimeter before CMS authentication.
### Scope
Access application, identity provider policy, groups, session duration, service tokens, break-glass, and audit.
### Out of Scope
CMS RBAC.
### Dependencies
SEC-P6-001, CMS-P6-002.
### Likely Files / Areas
Cloudflare configuration/runbook; no credentials in Git.
### Implementation Notes
Apply policy to admin and privileged APIs without blocking public Catalog reads.
### Acceptance Criteria
- Unauthenticated requests cannot reach CMS login.
- Authorized users and approved service flows work.
### Tests / Validation
Access allow/deny, session expiry, group removal, and break-glass rehearsal.
### Migration / Rollback Considerations
Document emergency disable/restore with owner approval.
### Security Considerations
Least privilege, MFA/IdP policy, audit retention.
### Documentation Updates
Access operations guide.
### Estimated Complexity
M
### Blocking Decisions
Identity provider and access groups.

## SEC-P6-003 — Harden CMS Authentication and Sessions
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Configure secure CMS login, session, password/reset, and bootstrap-owner behavior.
### Why
Access is one layer and does not replace application authentication.
### Scope
Cookie flags, TTL, rotation, reset, lockout, MFA support assessment, owner bootstrap, and logout.
### Out of Scope
Cloudflare Access.
### Dependencies
SEC-P6-002, CMS-P5-009.
### Likely Files / Areas
Payload auth config, tests, incident runbook.
### Implementation Notes
Do not expose whether an account exists during reset/login errors.
### Acceptance Criteria
- Sessions are secure, revocable, and expire predictably.
- Bootstrap credentials are rotated and not stored in Git.
### Tests / Validation
Auth integration, fixation, expiry, reset, lockout, and logout tests.
### Migration / Rollback Considerations
Maintain a controlled recovery path.
### Security Considerations
Credential policy and audit logging.
### Documentation Updates
Authentication operations guide.
### Estimated Complexity
M
### Blocking Decisions
MFA requirement and session TTL.

## SEC-P6-004 — Enforce Production RBAC and Field-Level Permissions
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Promote the PoC role matrix with API, collection, field, locale, and workflow enforcement.
### Why
UI-only role restrictions are insufficient.
### Scope
Owner, Editor, Translator, Reviewer, service roles, assignment rules, and escalation review.
### Out of Scope
Enterprise SSO provisioning automation.
### Dependencies
SEC-P6-003, CMS-P5-009.
### Likely Files / Areas
CMS access rules, role tests, admin labels.
### Implementation Notes
Deny by default and centralize permission predicates.
### Acceptance Criteria
- Every role passes allowed actions and fails forbidden actions through API and UI.
### Tests / Validation
Permission matrix integration suite and privilege-escalation tests.
### Migration / Rollback Considerations
Role mapping migration and emergency owner recovery.
### Security Considerations
Least privilege and separation of duties.
### Documentation Updates
Production RBAC matrix.
### Estimated Complexity
L
### Blocking Decisions
Assignment model and reviewer quorum.

## SEC-P6-005 — Secure Database Network and Credentials
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Prevent public database exposure and constrain runtime/migration access.
### Why
Catalog and audit records become critical production data.
### Scope
Private connectivity, TLS, database roles, connection limits, rotation, audit, and environment separation.
### Out of Scope
Application RBAC.
### Dependencies
CMS-P6-002, SEC-P6-001.
### Likely Files / Areas
Provider/network config, database role scripts, runbook.
### Implementation Notes
Use separate runtime, migration, backup, and read-only credentials.
### Acceptance Criteria
- Public connection attempts fail.
- Each role can perform only required operations.
### Tests / Validation
Network allow/deny, TLS, role, rotation, and environment-isolation checks.
### Migration / Rollback Considerations
Credential rollback and tested connection drain.
### Security Considerations
Encryption in transit/at rest and least privilege.
### Documentation Updates
Database security guide.
### Estimated Complexity
M
### Blocking Decisions
Provider network features.

## SEC-P6-006 — Establish Secret Management and Rotation
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Store, distribute, rotate, and audit CMS, database, preview, migration, and backup secrets safely.
### Why
Secrets in Git or shared long-lived credentials would compromise all layers.
### Scope
Secret inventory, platform storage, environment separation, rotation schedule, leak response, and CI access.
### Out of Scope
Building a custom secrets service.
### Dependencies
CMS-P6-002, SEC-P6-005.
### Likely Files / Areas
Platform secret settings, `.env.example`, runbook, secret scan CI.
### Implementation Notes
Example files contain names only, never values.
### Acceptance Criteria
- No production secret is tracked or printed.
- Rotation is rehearsed without downtime where required.
### Tests / Validation
Git/CI secret scans, revoked-secret test, rotation exercise.
### Migration / Rollback Considerations
Dual-key overlap only during controlled rotation.
### Security Considerations
This task defines them.
### Documentation Updates
Secret inventory and rotation runbook.
### Estimated Complexity
M
### Blocking Decisions
Platform secret store.

## SEC-P6-007 — Sanitize Rich Text and Validate Media
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Prevent script injection, unsafe embeds, hostile files, and unbounded media uploads.
### Why
CMS-authored content reaches public frontends.
### Scope
Allowed nodes/attributes/URLs, server-side sanitization, MIME/signature, size/dimensions, filenames, storage, and SVG policy.
### Out of Scope
General malware scanning unless provider evidence requires it.
### Dependencies
CMS-P6-001, SEC-P6-001.
### Likely Files / Areas
CMS field config/hooks, public renderer, media adapter, tests.
### Implementation Notes
Store structured content and sanitize again at public rendering boundaries.
### Acceptance Criteria
- Script/event/unsafe URL payloads are rejected or neutralized.
- Unsupported/oversized media fails recoverably.
### Tests / Validation
XSS corpus, MIME spoof, oversized image, filename, and renderer tests.
### Migration / Rollback Considerations
Quarantine invalid legacy content; do not publish silently altered content.
### Security Considerations
Content security and resource exhaustion.
### Documentation Updates
Content/media security policy.
### Estimated Complexity
L
### Blocking Decisions
Allowed rich-text and media formats.

## SEC-P6-008 — Add Rate Limits and Abuse Controls
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P1
### Goal
Protect login, CMS API, preview, import, and public read endpoints from abuse.
### Why
Authentication and APIs create new denial-of-service and brute-force surfaces.
### Scope
Per-route limits, identity/IP keys, retry responses, upstream protections, monitoring, and false-positive handling.
### Out of Scope
WAF redesign for unrelated domains.
### Dependencies
SEC-P6-002, SEC-P6-003, CMS-P6-002.
### Likely Files / Areas
Cloudflare rules/runtime middleware, tests, runbook.
### Implementation Notes
Use platform controls where possible and application controls for identity-aware cases.
### Acceptance Criteria
- High-risk endpoints have measured limits and clear recovery.
- Normal operator workflows are not blocked.
### Tests / Validation
Burst, sustained, authenticated, service-token, and bypass tests.
### Migration / Rollback Considerations
Rules have staged rollout and disable procedure.
### Security Considerations
Avoid logging sensitive request bodies.
### Documentation Updates
Rate-limit matrix.
### Estimated Complexity
M
### Blocking Decisions
Expected traffic and acceptable operator limits.

## SEC-P6-009 — Implement Administrative Audit Trail
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Record who, when, action, resource, before, and after for material changes.
### Why
Publication and security decisions require accountability and recovery evidence.
### Scope
Create/update/delete, status, role, login/security events, schema/version, retention, access, and export.
### Out of Scope
Recording tool-user activity.
### Dependencies
SEC-P6-004, CMS-P6-001.
### Likely Files / Areas
CMS hooks, audit collection/storage, admin viewer, tests.
### Implementation Notes
Redact secrets and large content while retaining meaningful diffs.
### Acceptance Criteria
- Every material action emits an immutable, attributable event.
- Unauthorized users cannot alter or read restricted audit data.
### Tests / Validation
Coverage matrix, tamper denial, redaction, and retention tests.
### Migration / Rollback Considerations
Audit continuity is preserved across rollback.
### Security Considerations
Integrity, retention, privacy, and restricted access.
### Documentation Updates
Audit policy and investigation guide.
### Estimated Complexity
L
### Blocking Decisions
Retention duration and immutable storage approach.

## SEC-P6-010 — Implement Backup, Retention, and Restore Tests
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Create scheduled encrypted backups and prove restoration.
### Why
Backups without restore evidence do not protect the Catalog.
### Scope
Database/media/config backups, schedule, retention, encryption, monitoring, restore environment, RPO/RTO, and ownership.
### Out of Scope
Cross-cloud disaster recovery unless risk review requires it.
### Dependencies
CMS-P6-002, SEC-P6-005, SEC-P6-006.
### Likely Files / Areas
Provider backup config, restore scripts/runbook, tests.
### Implementation Notes
Restore into isolated staging and reconcile Catalog outputs.
### Acceptance Criteria
- Backup jobs are monitored and restore completes within targets.
- Restored data reconciles with expected snapshot.
### Tests / Validation
Scheduled backup evidence and quarterly restore drill design.
### Migration / Rollback Considerations
Supports CMS-P6-007.
### Security Considerations
Encrypted backups, access control, deletion/retention policy.
### Documentation Updates
Backup and restore runbook.
### Estimated Complexity
L
### Blocking Decisions
RPO, RTO, and retention targets.

## SEC-P6-011 — Establish Security Dependency and Patch Policy
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P1
### Goal
Govern CMS, frontend, database adapter, and infrastructure dependency risk.
### Why
The CMS materially expands the supply-chain surface.
### Scope
Inventory, update cadence, severity SLA, lockfiles, advisories, CI scanning, exception process, and emergency patching.
### Out of Scope
Automatic major-version upgrades.
### Dependencies
CMS-P6-001, SEC-P6-001.
### Likely Files / Areas
Package manifests, CI security workflow, policy docs.
### Implementation Notes
Separate runtime vulnerabilities from development-only findings and require evidence for exceptions.
### Acceptance Criteria
- Critical/high findings have owners and response deadlines.
- Production dependencies and licenses are inventoried.
### Tests / Validation
Audit/scanner baseline, exception expiry test, upgrade rehearsal.
### Migration / Rollback Considerations
Dependency upgrades retain tested rollback versions and database compatibility.
### Security Considerations
Supply-chain integrity and minimum CI permissions.
### Documentation Updates
Dependency security policy.
### Estimated Complexity
M
### Blocking Decisions
Scanner and SLA values.

## SEC-P6-012 — Create Incident Response and Emergency Rollback Procedure
### Phase
Phase 6 — Security Track
### Status
Planned
### Priority
P0
### Goal
Define detection, containment, credential rotation, publication freeze, rollback, recovery, and communication.
### Why
Admin compromise or malicious content requires coordinated action across Access, CMS, database, and frontends.
### Scope
Severity levels, contacts, evidence handling, break-glass access, content freeze, key rotation, restore, postmortem, and exercises.
### Out of Scope
Public disclosure language for hypothetical incidents.
### Dependencies
SEC-P6-002 through SEC-P6-011, CMS-P6-007.
### Likely Files / Areas
Incident runbook, contact matrix, exercise records.
### Implementation Notes
Include compromised editor, leaked secret, malicious content, database loss, and dependency compromise scenarios.
### Acceptance Criteria
- Named owners can execute a tabletop scenario end to end.
- Rollback and evidence preservation steps are unambiguous.
### Tests / Validation
Tabletop exercise and timed credential/publication containment drill.
### Migration / Rollback Considerations
This task defines emergency rollback.
### Security Considerations
Restrict runbook details and keep secrets out of documents.
### Documentation Updates
Incident response runbook.
### Estimated Complexity
M
### Blocking Decisions
Incident roles and communication owner.

---

# Phase 7 — Operations Platform

## OPS-P7-001 — Build Catalog Operations Dashboard
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Show Draft, Review, Published, Deprecated, broken links, and missing translations.
### Why
Operators need a prioritized overview of Catalog state.
### Scope
Count cards, filters, drill-down links, role access, freshness, and empty/error states.
### Out of Scope
Analytics ranking.
### Dependencies
CMS-P6-008, SEC-P6-004, ResourceHealth model.
### Likely Files / Areas
CMS admin dashboard extensions, queries, tests.
### Implementation Notes
Use indexed aggregate queries and display data freshness.
### Acceptance Criteria
- Counts reconcile with underlying records.
- Each state links to an actionable filtered queue.
### Tests / Validation
Query, permission, stale-data, and accessibility tests.
### Migration / Rollback Considerations
Dashboard is additive and removable.
### Security Considerations
Do not expose restricted drafts or health evidence to unauthorized roles.
### Documentation Updates
Operations dashboard guide.
### Estimated Complexity
L
### Blocking Decisions
None.

## OPS-P7-002 — Add Category Ordering Workflow
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P2
### Goal
Allow accessible drag-and-drop plus keyboard ordering for categories.
### Why
Editorial navigation order should not require code changes.
### Scope
Order field, optimistic/concurrent update behavior, keyboard alternative, validation, preview, and audit.
### Out of Scope
Category hierarchy redesign.
### Dependencies
OPS-P7-001, SEC-P6-009.
### Likely Files / Areas
CMS admin component, taxonomy API/hooks, tests.
### Implementation Notes
Use stable sparse/order strategy and conflict detection.
### Acceptance Criteria
- Mouse and keyboard users can reorder and preview.
- Concurrent edits do not silently overwrite.
### Tests / Validation
Ordering, concurrency, permission, audit, and accessibility tests.
### Migration / Rollback Considerations
Restore prior order from audit history.
### Security Considerations
Only authorized editors can reorder.
### Documentation Updates
Category ordering guide.
### Estimated Complexity
M
### Blocking Decisions
Ordering algorithm.

## OPS-P7-003 — Add Resource Ordering Workflow
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P2
### Goal
Manage resource order within categories and curated surfaces.
### Why
Editorial control must coexist with algorithmic signals.
### Scope
Manual order, scope, keyboard reordering, preview, conflicts, and audit.
### Out of Scope
Recommendation engine.
### Dependencies
OPS-P7-002.
### Likely Files / Areas
CMS resource order UI, selectors, tests.
### Implementation Notes
Keep global default order distinct from collection/category overrides.
### Acceptance Criteria
- Orders are deterministic by scope.
- Removing an override restores computed/default order.
### Tests / Validation
Scope, fallback, concurrency, and accessibility tests.
### Migration / Rollback Considerations
Audit-based restore.
### Security Considerations
Permission and audit enforcement.
### Documentation Updates
Resource ordering guide.
### Estimated Complexity
M
### Blocking Decisions
Override precedence.

## OPS-P7-004 — Build Collection Editor
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Provide safe manual, automatic, and hybrid collection authoring.
### Why
Collections are a primary editorial discovery tool.
### Scope
Membership search, ordering, validated rule builder, preview, deduplication, locale content, and audit.
### Out of Scope
Arbitrary query language.
### Dependencies
OPS-P7-003, CAT-P1-003.
### Likely Files / Areas
CMS collection admin, rule adapter, preview, tests.
### Implementation Notes
Rule UI emits only the approved typed grammar.
### Acceptance Criteria
- Operators can create all three modes without Git.
- Preview exactly matches public selector output.
### Tests / Validation
Mode, rule, duplicate, permission, audit, and accessibility tests.
### Migration / Rollback Considerations
Version/audit restores previous membership/rules.
### Security Considerations
No executable expressions or unbounded queries.
### Documentation Updates
Collection operator guide.
### Estimated Complexity
L
### Blocking Decisions
None.

## OPS-P7-005 — Implement External Link Health Worker
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Check external website resources for 2xx, 3xx, 4xx, 5xx, timeout, TLS, and final URL.
### Why
Resource quality needs current operational evidence.
### Scope
Scheduler, bounded fetch, SSRF protection, redirects, timeout, response limits, health writes, retries, and cost controls.
### Out of Scope
Automatic deletion or content scraping.
### Dependencies
SEC-P6-001, ResourceHealth schema, CMS-P6-002.
### Likely Files / Areas
Independent worker/job, health API, tests, deployment config.
### Implementation Notes
Block private/reserved targets, validate every redirect, and identify requests with an approved user agent.
### Acceptance Criteria
- Statuses are reproducible and failures enter review.
- Broken resources are never auto-deleted.
### Tests / Validation
Mock upstream matrix, SSRF, redirect loop, timeout, TLS, and scheduler tests.
### Migration / Rollback Considerations
Disable scheduler; retain last observations with freshness labels.
### Security Considerations
SSRF, resource exhaustion, and response-data minimization.
### Documentation Updates
Health-check operations guide.
### Estimated Complexity
XL
### Blocking Decisions
Runtime, schedule, timeout, and rate budget.

## OPS-P7-006 — Build Health Review Queue
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Turn health failures into triage, retry, acknowledge, update, deprecate, or dismiss workflows.
### Why
Automated checks need human judgment.
### Scope
Queue filters, evidence, history, retry, assignment, decision reasons, and audit.
### Out of Scope
Automatic resource deletion.
### Dependencies
OPS-P7-005, SEC-P6-009.
### Likely Files / Areas
CMS health queue UI/API, tests.
### Implementation Notes
Preserve historical observations and distinguish transient from persistent failures.
### Acceptance Criteria
- Operators can resolve each failure without editing raw data.
- Decisions are attributable and reversible where appropriate.
### Tests / Validation
Queue lifecycle, permissions, retry, audit, and accessibility tests.
### Migration / Rollback Considerations
Disable queue UI without altering resource publication.
### Security Considerations
Sanitize upstream evidence and URLs.
### Documentation Updates
Health triage playbook.
### Estimated Complexity
L
### Blocking Decisions
Escalation thresholds.

## OPS-P7-007 — Build Translation Completeness Queue
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Expose missing and stale translations as assignable work.
### Why
CLI reports need an operator workflow after CMS adoption.
### Scope
Filters, locale/field drill-down, assignment, source-change markers, review, and publication readiness integration.
### Out of Scope
Machine translation.
### Dependencies
I18N-P3-005, OPS-P7-001, SEC-P6-004.
### Likely Files / Areas
CMS translation dashboard, queries, tests.
### Implementation Notes
Do not overwrite translator edits when source content changes.
### Acceptance Criteria
- Queue matches CLI completeness rules.
- Translator and reviewer permissions are enforced.
### Tests / Validation
Staleness, assignment, role, publish-gate, and accessibility tests.
### Migration / Rollback Considerations
Queue is derived; no content rollback needed.
### Security Considerations
Draft access follows locale and resource permissions.
### Documentation Updates
Translation operations guide.
### Estimated Complexity
M
### Blocking Decisions
Staleness model accepted in Phase 3.

## OPS-P7-008 — Build Publish Readiness and Broken Relation Checks
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Provide one prepublication checklist for validation, locales, relations, SEO, health, and preview.
### Why
Operators need actionable blockers rather than failed builds after publication.
### Scope
Readiness evaluator, broken relations, warnings/errors, deep links, override governance, and audit.
### Out of Scope
Bypassing schema or security failures.
### Dependencies
OPS-P7-006, OPS-P7-007, SEO-P3-005.
### Likely Files / Areas
CMS readiness service/UI, validator adapters, tests.
### Implementation Notes
Reuse the same validation rules as CI and public build.
### Acceptance Criteria
- Readiness output matches CI for the same snapshot.
- Hard blockers cannot be overridden silently.
### Tests / Validation
Error/warning fixture matrix, relation failure, role, and audit tests.
### Migration / Rollback Considerations
Disable UI while retaining server validation.
### Security Considerations
Overrides are privileged and audited.
### Documentation Updates
Publish readiness guide.
### Estimated Complexity
L
### Blocking Decisions
Warning override policy.

## OPS-P7-009 — Implement Governed Search Analytics
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P2
### Goal
Measure aggregate search usage and no-result patterns within the approved privacy contract.
### Why
Search quality needs evidence without collecting sensitive raw queries.
### Scope
Approved events, aggregation, dashboard, retention, sampling, no-result categories, and quality feedback loop.
### Out of Scope
Raw query logs or user profiling.
### Dependencies
SEARCH-P3-005, ARCH-P0-006, SEC-P6-006.
### Likely Files / Areas
Analytics adapter, event validation, dashboard, privacy tests.
### Implementation Notes
Prefer counts by approved resource/type/category or locally classified query buckets.
### Acceptance Criteria
- Event payload allowlist is enforced.
- Dashboard cannot reconstruct individual tool input or user behavior.
### Tests / Validation
Event schema, forbidden payload, retention, and aggregation tests.
### Migration / Rollback Considerations
Kill switch and provider-independent adapter.
### Security Considerations
Data minimization and access control.
### Documentation Updates
Analytics operations and privacy disclosure.
### Estimated Complexity
L
### Blocking Decisions
Approved analytics provider and retention.

## OPS-P7-010 — Implement Resource and Tool Analytics
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P2
### Goal
Measure anonymous aggregate opens and outbound resource actions without content capture.
### Why
Editorial decisions need resource-level signals.
### Scope
Tool-open, resource-detail, outbound-click categories, event adapter, dashboards, retention, and bot/filter policy.
### Out of Scope
Tool input/output, account profiles, or cross-site tracking.
### Dependencies
OPS-P7-009, ARCH-P0-006.
### Likely Files / Areas
Frontend analytics adapter, event schema, operations dashboard, tests.
### Implementation Notes
Use stable resource IDs and locale/type; never transmit input, result, URL query, or file content.
### Acceptance Criteria
- Only approved aggregate fields leave the browser.
- Tools work identically when analytics is blocked.
### Tests / Validation
Network/event audits, forbidden-field tests, consent/blocked-provider behavior.
### Migration / Rollback Considerations
Global kill switch and remove adapter without product impact.
### Security Considerations
Vendor disclosure, retention, and minimization.
### Documentation Updates
Privacy policy and event catalog.
### Estimated Complexity
L
### Blocking Decisions
Provider, consent model, and retention.

## OPS-P7-011 — Build Popular Ranking with Editorial Override
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P2
### Goal
Combine approved aggregate signals with transparent editorial ordering.
### Why
Popularity should be useful without becoming opaque or easily manipulated.
### Scope
Signal normalization, time window, bot controls, editorial pin/boost, deterministic fallback, explanation, and preview.
### Out of Scope
Personalized recommendations.
### Dependencies
OPS-P7-010, OPS-P7-003.
### Likely Files / Areas
Ranking service/selectors, CMS controls, tests.
### Implementation Notes
Keep formula versioned and audit overrides.
### Acceptance Criteria
- Ranking is deterministic for a snapshot.
- Editorial overrides are visible, bounded, and reversible.
### Tests / Validation
Cold start, ties, manipulation, override, and version tests.
### Migration / Rollback Considerations
Fall back to authored order.
### Security Considerations
Abuse/bot resistance and no user profiling.
### Documentation Updates
Ranking policy.
### Estimated Complexity
L
### Blocking Decisions
Signal formula and minimum sample threshold.

## OPS-P7-012 — Complete Operator, Deployment, and Support Documentation
### Phase
Phase 7 — Operations
### Status
Planned
### Priority
P1
### Goal
Publish complete internal guidance for daily operations and incident-free changes.
### Why
The platform is not operable if knowledge remains only in implementation sessions.
### Scope
Operator guide, developer guide, deployment, migration, health triage, translation, publishing, analytics, backup, and incident links.
### Out of Scope
Public marketing documentation.
### Dependencies
OPS-P7-001 through OPS-P7-011, SEC-P6-012.
### Likely Files / Areas
`docs/operations/`, architecture indexes, runbook links.
### Implementation Notes
Use role-based task flows and exact commands/screens, with owners and review dates.
### Acceptance Criteria
- A new operator completes core workflows using docs only.
- Commands and screenshots match current releases.
### Tests / Validation
Documentation walkthrough and link/command checks.
### Migration / Rollback Considerations
Version docs with platform releases.
### Security Considerations
Keep sensitive response details in restricted locations.
### Documentation Updates
This task owns the final operations documentation set.
### Estimated Complexity
L
### Blocking Decisions
Documentation storage/access for restricted runbooks.

---

# Phase 8 — Growth — Future / Not MVP

## GROWTH-P8-001 — Add Website Submission Intake
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Allow visitors to propose a website without directly publishing Catalog content.
### Why
Submissions may expand coverage after editorial operations are mature.
### Scope
Form, validation, consent, anti-abuse, duplicate hints, acknowledgement, and queue record.
### Out of Scope
Automatic publication or accounts.
### Dependencies
OPS-P7-008, SEC-P6-008.
### Likely Files / Areas
Discover form, submission API/storage, CMS queue.
### Implementation Notes
Treat all submitted text and URLs as untrusted.
### Acceptance Criteria
- Submission cannot publish or execute content.
- Privacy and abuse controls are documented and tested.
### Tests / Validation
Validation, duplicate, rate-limit, spam, privacy, and accessibility tests.
### Migration / Rollback Considerations
Disable intake and retain/delete queue per policy.
### Security Considerations
XSS, SSRF-safe review, spam, PII retention.
### Documentation Updates
Submission policy.
### Estimated Complexity
L
### Blocking Decisions
Business approval, retention, and anti-abuse method.

## GROWTH-P8-002 — Build Submission Review Queue
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Let editors triage, deduplicate, reject, or convert submissions into drafts.
### Why
Public input requires controlled editorial review.
### Scope
Queue status, assignment, duplicate merge, safe URL preview, decision reasons, conversion, and audit.
### Out of Scope
Automatic approval.
### Dependencies
GROWTH-P8-001, SEC-P6-009.
### Likely Files / Areas
CMS submission queue, conversion service, tests.
### Implementation Notes
Conversion creates a new draft Resource through normal validation.
### Acceptance Criteria
- Reviewer decisions are auditable.
- Submitted content never bypasses schema or publish workflow.
### Tests / Validation
Queue lifecycle, role, duplicate, conversion, and security tests.
### Migration / Rollback Considerations
Revert converted draft without altering original submission evidence.
### Security Considerations
Untrusted content isolation and limited retention.
### Documentation Updates
Submission review guide.
### Estimated Complexity
M
### Blocking Decisions
None.

## GROWTH-P8-003 — Design and Implement User Accounts
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Add end-user identity only after a separate product and privacy approval.
### Why
Favorites and user collections may require durable identity.
### Scope
Requirements, auth provider, profile minimums, consent, deletion/export, sessions, abuse, and support.
### Out of Scope
Admin identity or social features.
### Dependencies
SEC-P6-001, explicit product approval.
### Likely Files / Areas
Future account service, Discover UI, privacy docs.
### Implementation Notes
Evaluate accountless/local alternatives before collecting personal data.
### Acceptance Criteria
- Data lifecycle and threat model are approved before implementation.
- Users can delete/export account data.
### Tests / Validation
Auth, authorization, privacy, deletion, accessibility, and abuse tests.
### Migration / Rollback Considerations
Account feature flag and export/deletion plan.
### Security Considerations
Credentials, takeover, privacy, and child/minor considerations if applicable.
### Documentation Updates
Account product/security spec.
### Estimated Complexity
XL
### Blocking Decisions
Product need, provider, jurisdiction, and privacy approval.

## GROWTH-P8-004 — Add Favorites
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Allow users to save Resources with clear local/account semantics.
### Why
Frequent visitors may want a personal shortlist.
### Scope
Save/remove, sync policy, ordering, unavailable-resource behavior, export, and privacy.
### Out of Scope
Recommendations.
### Dependencies
GROWTH-P8-003 or an approved local-only design.
### Likely Files / Areas
Discover favorites UI/service, account/local storage adapter.
### Implementation Notes
Prefer local-only if cross-device sync is not a validated requirement.
### Acceptance Criteria
- Favorites never alter Catalog publication.
- Hidden/deprecated resources have defined display behavior.
### Tests / Validation
Persistence, sync/conflict if applicable, locale, privacy, and accessibility tests.
### Migration / Rollback Considerations
Export or preserve local data before schema changes.
### Security Considerations
Minimize behavioral profile data.
### Documentation Updates
Favorites privacy and UX spec.
### Estimated Complexity
M
### Blocking Decisions
Local-only versus account sync.

## GROWTH-P8-005 — Add User Collections
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Let users create private resource lists distinct from editorial Collections.
### Why
Personal organization may increase return use.
### Scope
Create/rename/delete, membership/order, privacy default, sharing decision, export, and unavailable resources.
### Out of Scope
Editorial Catalog collections or public collaboration.
### Dependencies
GROWTH-P8-003, GROWTH-P8-004.
### Likely Files / Areas
User collection service/UI, schemas, tests.
### Implementation Notes
Use a separate domain name to avoid confusing user lists with Catalog Collection.
### Acceptance Criteria
- Private by default and access-controlled.
- Catalog updates do not corrupt user references.
### Tests / Validation
Authorization, lifecycle, stale references, export, and accessibility tests.
### Migration / Rollback Considerations
Versioned user-data migration and export.
### Security Considerations
Private-list access and sharing abuse.
### Documentation Updates
User collection spec.
### Estimated Complexity
L
### Blocking Decisions
Sharing scope and retention.

## GROWTH-P8-006 — Add Personalization Controls
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Offer transparent, user-controlled discovery preferences.
### Why
Personalization must not become hidden tracking.
### Scope
Opt-in preferences, explanation, reset, storage, consent, and nonpersonalized fallback.
### Out of Scope
Recommendation model implementation.
### Dependencies
GROWTH-P8-003, explicit privacy approval.
### Likely Files / Areas
Preference service/UI, privacy settings, tests.
### Implementation Notes
Use coarse explicit preferences before behavioral inference.
### Acceptance Criteria
- Users can inspect and reset every personalization input.
- Core site works without personalization.
### Tests / Validation
Consent, reset, fallback, privacy, and accessibility tests.
### Migration / Rollback Considerations
Disable and delete stored preferences per policy.
### Security Considerations
Profiling, data minimization, and access control.
### Documentation Updates
Personalization transparency notice.
### Estimated Complexity
L
### Blocking Decisions
Legal/privacy review and preference model.

## GROWTH-P8-007 — Build Recommendation Engine
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Recommend Resources using approved Catalog, relation, editorial, and optional user signals.
### Why
Recommendations may improve discovery after sufficient governed data exists.
### Scope
Objective, offline evaluation, cold start, diversity, editorial controls, transparency, abuse, and rollback.
### Out of Scope
AI-generated content.
### Dependencies
OPS-P7-011 and optional GROWTH-P8-006.
### Likely Files / Areas
Recommendation service/selectors, evaluation datasets, UI.
### Implementation Notes
Start with deterministic relation/taxonomy heuristics before ML.
### Acceptance Criteria
- Offline metrics and qualitative review beat the existing related-resource baseline.
- Users can understand why an item appears.
### Tests / Validation
Evaluation, cold-start, diversity, manipulation, privacy, and performance tests.
### Migration / Rollback Considerations
Fall back to explicit relations/editorial order.
### Security Considerations
No sensitive profiling or unreviewed third-party data.
### Documentation Updates
Recommendation model card.
### Estimated Complexity
XL
### Blocking Decisions
Objective, data sufficiency, and privacy approval.

## GROWTH-P8-008 — Add AI-Assisted Summaries and Metadata Drafting
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Assist editors with draft summaries, keywords, and SEO metadata while preserving human approval.
### Why
AI may reduce repetitive authoring only after content governance is mature.
### Scope
Provider evaluation, source grounding, draft labels, human review, provenance, cost, privacy, and quality evaluation.
### Out of Scope
Automatic publication or tool-input processing.
### Dependencies
OPS-P7-008, explicit AI approval.
### Likely Files / Areas
CMS assistant integration, evaluation set, audit, policy.
### Implementation Notes
Generated text remains draft and records model/source/version.
### Acceptance Criteria
- No generated content publishes without reviewer approval.
- Evaluation demonstrates acceptable factual and multilingual quality.
### Tests / Validation
Grounding, hallucination, locale, prompt-injection, cost, audit, and fallback tests.
### Migration / Rollback Considerations
Disable provider and retain reviewed human content only.
### Security Considerations
No secrets, unpublished sensitive notes, or user tool input sent to models.
### Documentation Updates
AI content policy and model card.
### Estimated Complexity
XL
### Blocking Decisions
Provider, data processing terms, budget, and review policy.

## GROWTH-P8-009 — Add Sponsored Resources
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Support clearly disclosed sponsorship without corrupting editorial trust or ranking.
### Why
Monetization requires explicit separation from organic discovery.
### Scope
Business rules, labels, placement caps, targeting limits, dates, audit, reporting, and SEO attributes.
### Out of Scope
AdSense or behavioral advertising.
### Dependencies
OPS-P7-003, legal/business approval.
### Likely Files / Areas
Catalog sponsorship schema, CMS workflow, Discover presentation, policy.
### Implementation Notes
Sponsored state is explicit, time-bounded, and never disguised as popularity.
### Acceptance Criteria
- Sponsorship is visually and semantically disclosed in all locales.
- Organic ranking remains independently testable.
### Tests / Validation
Disclosure, expiry, ordering, accessibility, SEO, and audit tests.
### Migration / Rollback Considerations
Expiration/kill switch removes placements without deleting Resources.
### Security Considerations
Contract access, fraud, unsafe destination review.
### Documentation Updates
Sponsorship policy.
### Estimated Complexity
L
### Blocking Decisions
Commercial, legal, and disclosure approval.

## GROWTH-P8-010 — Add Editorial Collaboration and Advanced Workflows
### Phase
Phase 8 — Growth — Future / Not MVP
### Status
Planned
### Priority
P3
### Goal
Support comments, assignments, scheduled publication, multi-review, and workflow automation when team scale requires it.
### Why
Advanced workflow should respond to observed operator needs, not precede them.
### Scope
Requirements evidence, comments, mentions, assignment, scheduling, approval policy, notifications, audit, and escalation.
### Out of Scope
Replacing CMS authentication or building a general project manager.
### Dependencies
OPS-P7-012 and measured operator demand.
### Likely Files / Areas
CMS workflow extensions, notification service, audit, tests.
### Implementation Notes
Implement capabilities in separate reviewable slices after this design task.
### Acceptance Criteria
- Each capability has a documented operator problem and security model.
- Notifications and schedules fail safely and are auditable.
### Tests / Validation
Workflow state, concurrency, timezone, permissions, audit, and notification tests.
### Migration / Rollback Considerations
Feature flags and state migration for each capability.
### Security Considerations
Comment privacy, mention abuse, scheduled-action authorization.
### Documentation Updates
Advanced workflow specification.
### Estimated Complexity
XL
### Blocking Decisions
Team/process evidence and notification provider.
