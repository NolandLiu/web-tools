# GoDeskHub Platform Architecture

## Status

Planning baseline. No runtime migration is implemented by this document.

## Platform model

GoDeskHub is planned as a Resource Discovery & Tools Platform with three public content surfaces:

- Discover at `godeskhub.com`;
- Tools at `tools.godeskhub.com`;
- Guides under the Discover content surface unless a later ADR assigns a separate frontend.

The frontends consume one normalized Catalog contract. The Catalog owns public resource metadata and content; executable browser-tool behavior remains in application code.

```text
Discover ─┐
Tools ────┼── Catalog API / normalized catalog ── Catalog editor
Guides ───┘                  │
                            ├── Resources and localization
                            ├── Taxonomy and collections
                            ├── FAQ and relations
                            └── publication and health state
```

## Current baseline

The current repository is a single React 19 + TypeScript + Vite application deployed as static Cloudflare Pages output. `src/registry.js` is the current tool-site registry for 27 published tools, 5 categories, 3 locales, and 4 information pages. The build creates 111 canonical localized HTML routes. Tool guidance, FAQ, category content, SEO, search, routing, and static rendering derive from several code registries rather than a CMS-neutral Catalog package.

The evidence boundary, source ownership, build and Cloudflare configuration,
privacy state, verification totals, and known gaps are frozen in
[`repository-baseline.md`](./repository-baseline.md).

## Target boundaries

1. `packages/catalog-schema/` is a private internal npm workspace package that defines CMS-neutral domain schemas, loaders, normalization, and validation.
2. `catalog/` is the early Git/YAML source of truth.
3. A loader produces one normalized, typed Catalog contract.
4. The Tools app retains tool implementations and binds Catalog tool resources to code through stable tool IDs.
5. The Discover app renders website, tool, guide, category, tag, and collection discovery experiences.
6. A future Payload + PostgreSQL application edits the same domain model through an independent runtime.
7. Public frontends remain static-first and Cloudflare Pages compatible.

## Repository and package topology

ADR-021 keeps the Catalog in this repository for the initial phases. The current Tools application remains at the root, `catalog/` contains authoritative Git/YAML content, and `packages/catalog-schema/` provides the controlled consumer interface. The package is not published to a registry. A future Discover frontend or independently deployed CMS may consume the same contract without forcing an immediate Catalog repository split.

## Evolution rule

Migration is incremental. Existing routes, static SEO, privacy boundaries, and tool behavior remain deployable after every batch. A CMS cannot modify executable tool code, and a CMS product cannot redefine the domain model.
