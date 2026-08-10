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
