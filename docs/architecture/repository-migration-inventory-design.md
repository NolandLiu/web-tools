# Repository Migration Inventory Design

## Status and authority

- Status: Approved design; implementation not started
- Date: 2026-08-11
- Program task: `ARCH-P0-002`
- Depends on: `ARCH-P0-001`, ADR-022, ADR-023, and ADR-025
- Baseline source: `main@21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee`

This document defines how the current GoDeskHub Tools repository will be
inventoried before Catalog migration. It does not create Catalog entities,
change runtime behavior, or move current metadata or content.

## Objective

Generate one deterministic machine-readable inventory and one matching human
review document from the current repository. The inventory must expose every
published page, compatibility route, implementation binding, content owner,
and retained unpublished capability needed to preserve behavior during later
migration.

The generated files are evidence snapshots. Existing source and the accepted
baseline commit remain authoritative until a separately approved migration
changes ownership.

## Scope

The inventory covers the complete migration surface in three exposure classes:

1. `published-page` for current canonical public pages;
2. `redirect-only` for compatibility routes;
3. `unpublished-source` for retained implementation that has no public
   projection.

The expected logical inventory contains:

| Current kind | Logical records | Route evidence |
| --- | ---: | ---: |
| Site projection | 1 | 3 canonical routes |
| Tool page | 27 | 81 canonical routes |
| Category projection | 5 | 15 canonical routes |
| Public information page | 4 | 12 canonical routes |
| Compatibility route | 4 | 12 localized redirects |
| Unpublished capability | 1 | 0 public routes; 2 retained API source paths |
| **Total** | **42** | **111 canonical routes plus 12 redirects** |

The unpublished capability groups `IpInfoTool`, IP Lookup Function, RDAP
Function, their shared client/API contracts, content source, and tests. It is
one retained capability cluster rather than three public resources.

## Explicit non-goals

- Do not modify `src/registry.js` or any runtime registry.
- Do not move content into `catalog/` or define Catalog YAML.
- Do not allocate formal Catalog identities.
- Do not classify About, Privacy, Terms, or Contact as Guides.
- Do not change routes, redirects, SEO, Sitemap, search, tools, or Cloudflare.
- Do not publish IP Lookup or RDAP.
- Do not create a second manually maintained source of truth.

## Current-page classification

Current pages are inventoried by what they are today, not forced into the
future Resource model:

| Current surface | `currentKind` | Migration target |
| --- | --- | --- |
| Localized home page | `site-projection` | `projection` |
| Registered tool page | `tool-page` | `resource` |
| Registered category page | `category-projection` | `category` |
| About, Privacy, Terms, Contact | `public-info-page` | `unresolved` |
| Legacy localized tool route | `compatibility-route` | `projection` |
| Retained IP information code | `unpublished-capability` | `unresolved` |

The four information-page targets remain unresolved because ADR-023 v1
defines only Website, Tool, and Guide Resources. The inventory records this
schema gap instead of misrepresenting policy and contact pages as Guides.

## Generation architecture

Use a source-driven dual-output generator:

```text
accepted repository source
          |
          v
read-only extraction and validation
          |
          +----> repository-migration-inventory.json
          |
          +----> repository-migration-inventory.md
```

The planned generator is:

```text
scripts/generate-migration-inventory.mjs
```

The planned outputs are:

```text
docs/architecture/repository-migration-inventory.json
docs/architecture/repository-migration-inventory.md
```

The planned command is:

```text
npm run inventory:generate
```

The generator builds the complete model in memory, validates it, and only then
writes both outputs. It does not emit partial files after a fatal error.

## Source extraction

The generator reads or imports these current authorities:

| Concern | Evidence source |
| --- | --- |
| Tools, categories, locales, information pages | `src/registry.js` |
| Canonical routes and compatibility redirects | `src/lib/routes.js` |
| Tool and category content | `src/content/index.js` and its source modules |
| Embedded FAQ | localized tool content |
| Behavior contracts | `src/lib/tool-contracts.js` |
| Component bindings | `src/components/ToolWorkspace.tsx` |
| Calculator sub-bindings | `src/tools/CalculatorTools.tsx` |
| Executable implementations | `src/tools/*` and shared `src/lib/*` modules |
| SEO and JSON-LD | `src/lib/seo.js` |
| Static rendering | `src/lib/static-content.js` |
| Client information-page bodies | `src/App.tsx` |
| Cloudflare publication boundary | `public/_routes.json` and `functions/` |
| Search projection | `src/lib/search.js` |

JavaScript data modules are imported directly. TSX bindings are inspected by a
controlled source adapter because Node does not execute TSX in this project.
The adapter must resolve every registered `tool.kind`, every calculator
sub-binding, and each shared implementation family exactly once. An unknown,
duplicate, or unresolved binding is fatal.

This adapter is audit logic only. It is not imported by the application and it
does not add migration fields to the current runtime registry.

## Machine-readable model

The JSON document uses a versioned top-level contract:

```json
{
  "schemaVersion": 1,
  "baseline": {
    "sourceCommit": "21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee",
    "evidenceDate": "2026-08-11"
  },
  "summary": {},
  "items": [],
  "findings": []
}
```

No wall-clock generation timestamp is included because it would make identical
source generate different bytes. Items are sorted deterministically by current
kind, registry order, and stable inventory key.

Each item includes at least:

| Field | Meaning |
| --- | --- |
| `inventoryKey` | Stable key inside this inventory; not a Catalog identity |
| `currentKind` | Current surface or implementation classification |
| `observedExposure` | `published-page`, `redirect-only`, or `unpublished-source` |
| `currentIdentity` | Current IDs, slug, binding, category, and order where applicable |
| `localizedRoutes` | Canonical or legacy paths for all supported locales |
| `ownership` | Repository-relative source locations by concern |
| `coverage` | Locale, content, FAQ, SEO, route, contract, and implementation checks |
| `migrationTarget` | `resource`, `category`, `projection`, or `unresolved` |
| `targetIdCandidate` | ADR-022-compatible suggestion, or `null` |
| `notes` | Current limitations and migration considerations |

`inventoryKey` is not a new product ID. A `targetIdCandidate` is checked for
ADR-022 syntax and uniqueness but is not formally allocated by this task.
Current public exposure and future ADR-023 publication state remain separate
concepts.

## Human review document

The Markdown output is rendered from the same in-memory model as JSON and
contains:

1. baseline and count summary;
2. published tool table;
3. home, category, and information-page table;
4. compatibility redirect table;
5. unpublished source table;
6. ownership and coverage findings;
7. unresolved migration decisions;
8. current validation summary and nonfatal migration warnings.

The review document must make it possible to answer, without reading every
source file:

- where each current field, locale body, FAQ, route, SEO projection, contract,
  and executable binding is owned;
- which URL behavior must survive migration;
- which records can map directly to an approved future entity kind;
- which records still need a schema decision;
- which retained code is not a public capability.

## Validation and findings

### Fatal errors

Fatal errors prevent output replacement:

- duplicate registry IDs or slugs;
- missing or duplicate canonical routes;
- a published tool missing any required locale, content, FAQ, SEO projection,
  behavior contract, category, or component binding;
- an invalid category reference;
- a compatibility redirect with no valid target or anchor contract;
- an unpublished capability appearing in the public registry, canonical route
  list, search, Sitemap, or Cloudflare Functions include list;
- duplicate or invalid ADR-022 target ID candidates;
- divergence between the JSON and Markdown source model.

### Migration warnings

Warnings remain visible without pretending that current migration gaps are
generation failures:

- information pages have no approved target entity type;
- information-page body ownership is split between client and static output
  sources;
- the IP information implementation and tests exist but are unpublished;
- content or projection ownership is spread across multiple source modules;
- target ID candidates have not been formally allocated.

Findings are structured with a stable code, severity, affected inventory keys,
source locations, and a concise remediation owner. They do not contain stack
traces, provider payloads, secrets, or user data.

## Testing

The planned test is:

```text
tests/migration-inventory.test.mjs
```

It regenerates the model and outputs in memory and compares them with the
committed JSON and Markdown. This makes hand edits and source drift fail the
existing `npm run test` and therefore `npm run verify` flows.

Tests cover:

- exactly 42 logical items in the accepted baseline grouping;
- exactly 111 canonical localized routes and 12 localized redirects;
- round-trip route parsing and uniqueness;
- complete three-locale coverage for every public tool and category;
- valid content, FAQ, SEO, contract, category, and implementation references;
- valid information-page source ownership;
- unpublished IP information exclusion from every public projection;
- ADR-022 candidate format and uniqueness;
- deterministic item ordering and byte-identical repeated output;
- absence of tokens, secrets, environment values, user input, and production
  request data.

No new npm dependency or test framework is required.

## Implementation boundaries

Implementation may add only:

- the read-only generator;
- the generator command in `package.json`;
- the migration inventory test;
- the generated JSON and Markdown files;
- `ARCH-P0-002` status, evidence, and roadmap documentation updates.

It must not change product runtime modules, content, public routes, Cloudflare,
analytics, or the approved Catalog model.

## Completion and verification

After implementation and validation, the program task becomes:

```text
Completed — Migration Inventory Generated
```

Required evidence is:

```text
npm run inventory:generate
npm run lint
npm run test
npm run build
npm run verify
git diff --check
```

The final review confirms the current registry and route counts dynamically,
checks that generated files match the generator, verifies that `tasks/` remains
ignored and untracked, and confirms that the product-code diff is empty.

## Rollback

Rollback removes the generator, its test, both generated outputs, and the
`inventory:generate` package script, then restores the planning status. Because
no runtime consumer imports the inventory, rollback has no application,
Cloudflare, URL, or production-data effect.
