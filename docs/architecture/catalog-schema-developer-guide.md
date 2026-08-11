# Catalog Schema Developer Guide

## Status

- Status: Phase 1 package scaffold
- Date: 2026-08-11
- Program task: `CAT-P1-001`
- Implementation task: `TASK-106`

## Package

The CMS-neutral Catalog schema package lives at:

```text
packages/catalog-schema/
```

The package is private and exported as `@godeskhub/catalog-schema`. It is not
published to npm during Phase 1. Root verification remains the operator entry
point, and the package is additive until later Catalog consumers are approved.

## Dependency Review

`TASK-106` introduces Zod `4.4.3`.

| Field | Value |
| --- | --- |
| Package | Zod |
| Version | 4.4.3 |
| License | MIT |
| npm unpacked size | 4,558,122 bytes |
| Repository | `https://github.com/colinhacks/zod` |
| Purpose | runtime schema validation and matching TypeScript type inference |
| Privacy impact | Zod runs locally in the build, test, and browser JavaScript runtime; it does not send data over the network |

Zod is used because Catalog records need runtime validation at authoring,
loader, CI, and future CMS adapter boundaries. TypeScript types alone cannot
reject malformed YAML or CMS payloads at runtime.

## Current Smoke Contract

The initial scaffold exports:

- `CATALOG_SCHEMA_VERSION`
- `smokeSchema`
- `SmokeRecord`

The smoke schema proves that runtime parsing and static type inference originate
from the same schema package. Later tasks replace the smoke contract with the
Resource, locale, publication, taxonomy, FAQ, relation, health, loader, and
validator contracts.

## Build

```bash
npm run build --workspace @godeskhub/catalog-schema
```

The package build emits ESM JavaScript and `.d.ts` files under
`packages/catalog-schema/dist/`.

## Core Resource Field Reference

`CAT-P1-002` adds these core contracts:

| Export | Purpose |
| --- | --- |
| `ResourceType` | Literal resource types: `website`, `tool`, and `guide` |
| `PublicationStatus` | Lifecycle values: `draft`, `review`, `published`, `deprecated`, and `hidden` |
| `LocaleCode` | Required public locales: `en`, `zh-CN`, and `zh-TW` |
| `resourceSchema` | Discriminated schema for global Resource identity, slug, status, timestamps, and type-specific fields |
| `resourceLocaleSchema` | Localized name, summary, SEO text, aliases, and keywords |
| `resourceLocaleSetSchema` | Completeness validator requiring English, Simplified Chinese, and Traditional Chinese locale records |

Type-specific fields are intentionally narrow:

- `website` requires a reviewed HTTPS `destinationUrl`.
- `tool` requires a code-owned `toolBindingId` and `primaryCategoryId`.
- `guide` does not accept tool bindings or external destination URLs.

Unsafe executable URL schemes such as `javascript:` are rejected at the schema
boundary.

## Taxonomy And Collection Reference

`CAT-P1-003` adds distinct schemas for browse taxonomy, reusable tags, and
editorial collections:

| Export | Purpose |
| --- | --- |
| `categorySchema` | Primary browse hierarchy records using `cat_` IDs |
| `categorySetSchema` | Category graph validation for duplicate IDs, unknown parents, cycles, and maximum depth |
| `tagSchema` | Reusable facet records using `tag_` IDs |
| `collectionSchema` | Editorial collection records using `col_` IDs |

Category hierarchy depth is limited to three levels in v1. This is enough for
the current product and keeps navigation predictable.

Collection v1 supports:

- `manual` collections with explicit `resourceIds`;
- `automatic` collections with typed rules;
- `hybrid` collections with both explicit `resourceIds` and typed rules.

The automatic rule grammar is deliberately small and data-only. It supports
`equals` rules over `tagId`, `categoryId`, and `resourceType`; it cannot execute
arbitrary code.

## FAQ, Relation, And Health Reference

`CAT-P1-004` adds reusable support records:

| Export | Purpose |
| --- | --- |
| `faqSchema` | Reusable FAQ identity, placements, and complete three-locale question/answer text |
| `relationSchema` | Typed directional links between canonical Resource IDs |
| `healthSchema` | Operational health observations separate from authored Resource content |
| `RelationType` | `related`, `alternative`, `prerequisite`, `successor`, and `replaces` |
| `HealthStatus` | `unknown`, `healthy`, `warning`, and `failing` |

FAQ records can be placed on multiple Resources without duplicating the FAQ
identity. Relations reject self-reference and reference canonical Resource IDs
only. Relation records do not create redirects or execute dynamic imports.

Health records are review signals only. They never publish, hide, or delete a
Resource by themselves. Health evidence must stay concise and must not include
secrets, authorization headers, provider tokens, passwords, raw private
responses, or full sensitive response bodies.

## Catalog Loader Reference

`CAT-P1-006` adds `loadCatalog({ rootDir })`. The loader reads the Git/YAML
Catalog layout, parses YAML, applies the typed schemas, and returns
deterministic `records` plus source-scoped `diagnostics`.

The loader uses `yaml` `2.9.0`.

| Field | Value |
| --- | --- |
| Package | `yaml` |
| Version | 2.9.0 |
| License | ISC |
| npm unpacked size | 685,953 bytes |
| Repository | `https://github.com/eemeli/yaml` |
| Purpose | local YAML parsing for Git-authored Catalog records |
| Privacy impact | runs locally during authoring, tests, and validation; it does not send data over the network or execute Catalog content |

Loader diagnostics use relative `sourcePath` values and field `path` values.
They must not contain absolute workspace paths, environment variables, secrets,
or raw private payloads.

The normalized record collections are exposed under stable names:

- `resources`
- `categories`
- `tags`
- `collections`
- `locales`
- `faqs`
- `relations`
- `health`

Collections are sorted deterministically by ID. Locale records are sorted by
`resourceId` and then locale code.
