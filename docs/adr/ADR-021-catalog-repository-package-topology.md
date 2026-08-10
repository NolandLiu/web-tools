# ADR-021: Catalog Repository and Package Topology

- Status: Accepted
- Date: 2026-08-11
- Decision task: `ARCH-P0-003`
- Supersedes: none

## Context

GoDeskHub is a personal website maintained by one owner. The current repository is a single React, TypeScript, and Vite application whose root build deploys to Cloudflare Pages. The planned platform adds a CMS-neutral Catalog schema, a Git/YAML Catalog, a Discover frontend, and an independently hosted CMS.

The initial topology must give the Catalog an enforceable package boundary without forcing an early Tools move, cross-repository releases, registry authentication, or a monorepo orchestration system before the domain model is proven.

## Decision

Keep the Catalog and its schema package in the existing `web-tools` repository. Adopt an incremental npm workspace for internal packages while leaving the current Tools application at the repository root.

The initial target layout is:

```text
web-tools/
├── package.json
├── src/                         # existing Tools application
├── catalog/                     # authoritative Git/YAML content
└── packages/
    └── catalog-schema/          # domain types, schemas, loader, validator
```

The root package will eventually declare `packages/*` as npm workspaces. The Tools application is not moved to `apps/tools` by this decision. No independent Catalog repository, private package registry, Turborepo, Nx, pnpm workspace, Discover application, or CMS application is created by `ARCH-P0-003`.

## Ownership and source of truth

- `catalog/` owns early resource, localization, taxonomy, collection, FAQ, relation, and publication data.
- `packages/catalog-schema/` owns the CMS-neutral domain contract, validation, normalization, loader, and public package API.
- `src/` owns executable tool behavior and binds tool resources through stable IDs.
- Consumers must use the public schema/loader interface or a normalized Catalog snapshot; deep imports into Catalog implementation files are not supported.
- A future CMS edits the Catalog through an adapter but does not own or redefine the domain model.

The single maintainer owns changes to all three boundaries. Git review and CI, rather than separate repository permissions, provide the initial change-control boundary.

## Versioning and distribution

- The internal Catalog package remains private and is not published to an npm registry during the initial phases.
- Schema, Catalog data, migrations, and consuming adapters may change atomically in one Git commit or review batch.
- Catalog data records an explicit schema version independent of the npm package version.
- Breaking schema changes require migration logic, fixtures, validation, and CI evidence under ADR-019.
- A generated Catalog snapshot is a build artifact, not a second authoring source of truth.

## Build and CI contract

- Preserve the existing root `npm ci`, `npm run build`, and Cloudflare Pages `dist` contract until an approved migration task changes it.
- Catalog validation runs before a consumer build may publish Catalog-backed output.
- Root verification remains the operator entry point and will incorporate package and Catalog checks incrementally.
- No package publishing credential or cross-repository checkout is required.
- No monorepo task runner is introduced until measured build or coordination needs justify it.

## Migration and rollback

- Existing registries remain available behind a compatibility adapter during progressive migration.
- Catalog-backed output is compared with existing generated routes, metadata, Sitemap, search, and content before each cutover batch.
- A failed batch can switch back to the previous registry adapter or revert the atomic schema/data/consumer change.
- Existing public routes, the root Tools layout, Cloudflare Pages output, and tool algorithms are unchanged by this topology decision.

## Security and privacy

- Keeping the package private avoids registry publication credentials and package supply-chain configuration.
- Catalog data must not contain secrets, tool input, user content, or private operational data.
- The future CMS runtime remains independently deployed and protected even though its domain contract may originate from the same repository.
- Repository topology does not weaken the rule that CMS code cannot modify executable tool behavior.

## Alternatives considered

### Same repository without npm workspaces

This has the lowest initial file change but provides a weak package boundary and encourages relative or deep imports. It is rejected as the long-term initial topology.

### Move immediately to an application monorepo

Moving Tools to `apps/tools` creates a visually clean structure but changes build paths, CI, and deployment before the Catalog contract is proven. It is deferred.

### Separate Catalog repository immediately

This offers the strongest organizational and permission boundary, but a single maintainer would absorb cross-repository CI, version publication, authentication, local linking, and coordinated release costs without a present ownership benefit. It is rejected for the initial phases.

## Reconsideration triggers

Reopen this decision when at least one concrete condition exists:

- Catalog ownership or access control separates from Tools ownership.
- Catalog requires a release cadence independent from the frontends.
- External repositories need a stable, versioned Catalog package or artifact.
- Cross-application changes repeatedly block otherwise independent CI or deployment.
- Repository scale measurably harms build time or maintenance.
- Compliance requires source or content isolation.

Adding Discover or deploying the CMS independently does not by itself require a separate Catalog repository.

## Consequences

The project gains a clear internal package boundary, one lockfile, atomic migrations, one local development workflow, and low-cost CI. The trade-off is that applications and Catalog share repository lifecycle until an explicit trigger justifies separation. This is intentional for a single-maintainer personal platform.
