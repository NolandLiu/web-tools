# Catalog and CMS Migration Strategy

## Status And Authority

- Status: Approved migration and rollback baseline
- Date: 2026-08-11
- Program task: `ARCH-P0-008`
- Implementation task: `TASK-105`
- Baseline inventory:
  `docs/architecture/repository-migration-inventory.json`

This document defines the reversible migration contract for moving from the
current executable registries to a validated Catalog and, later, a CMS-backed
editor. It does not migrate a tool, change public routes, or change deployment
behavior.

## Principles

- Preserve existing public URLs, canonical metadata, hreflang, Sitemap, and Cloudflare Pages behavior.
- Keep every migration batch independently deployable and reversible.
- Introduce compatibility adapters before removing existing registries.
- Compare generated outputs before changing the source of truth.
- Never combine tool-code rewrites with content migration.

## Stages

1. Audit the current registries and freeze stable IDs and routes.
2. Introduce CMS-neutral schemas and a validated Git/YAML Catalog.
3. Bind a small representative tool batch through a compatibility adapter.
4. Migrate remaining tool metadata, taxonomy, FAQ, SEO, and search in reviewable batches.
5. Build Discover against the same normalized Catalog.
6. Run an independent Payload + PostgreSQL PoC.
7. If approved, dry-run YAML import and reconcile every entity count, ID, slug, locale, and relation.
8. Cut over with a feature flag or snapshot pointer and retain the last stable Catalog artifact for rollback.

## Source Of Truth By Stage

| Stage | Authoritative source | Generated or comparison output | Cutover rule |
| --- | --- | --- | --- |
| Current repository baseline | Existing registries remain authoritative: `src/registry.js`, content modules, route modules, SEO modules, and behavior contracts | `repository-migration-inventory.json` is evidence only | No Catalog output may replace production behavior |
| Git/YAML Catalog foundation | Git/YAML Catalog is authoritative for fixture and pilot Catalog records only | Loader and validator output are non-runtime checks | Tools production still reads existing registries |
| Compatibility adapter pilot | Existing registries remain authoritative for production; Catalog-backed output is compare-only for the selected batch | Route, SEO, Sitemap, search documents, JSON-LD, and content projections are compared | Cutover requires exact approved diff evidence |
| Catalog-backed production batch | Git/YAML Catalog is authoritative for the approved migrated batch | Current registries remain rollback adapter inputs for the batch | A failed batch reverts the adapter or snapshot pointer |
| CMS controlled dual-read | Git/YAML or the last approved snapshot remains publication authority while CMS output is reconciled | CMS export is compared to normalized Catalog artifact | CMS cannot publish until reconciliation passes |
| CMS production editor | CMS becomes authoritative for approved Catalog content after import, reconciliation, and rollback validation | Versioned normalized artifacts remain publication evidence | Rollback restores the last stable Catalog artifact or previous CMS snapshot |

Only one source authorizes publication at a time. Generated artifacts and
snapshots support review, build, comparison, and rollback, but they do not
become separate authoring sources.

## Migration Batch Contract

Every migration batch records:

- batch ID and owning `TASK-xxx`;
- affected Resource, Category, Tag, Collection, FAQ, Relation, and Health IDs;
- affected canonical routes and compatibility redirects;
- source-of-truth stage before and after the batch;
- last stable Catalog artifact or registry baseline;
- generated artifact checksum;
- entry gate evidence;
- exit gate evidence;
- rollback gate evidence;
- restoration command or feature flag / snapshot pointer change;
- reviewer-visible behavior and SEO comparison notes.

The default batch size is one to five Resource records plus directly attached
locale, FAQ, relation, SEO, and search records. A larger batch needs a written
reason and a narrower rollback boundary. Tool-code rewrites, algorithm changes,
Cloudflare configuration changes, and content-source migration do not share one
batch unless a later architecture task explicitly approves that coupling.

## Entry Gates

A migration batch may start only when all entry gates pass:

1. the current branch contains the latest accepted migration inventory or a
   documented successor inventory;
2. every affected ID appears in the inventory or in a schema-valid new Catalog
   fixture;
3. current canonical routes, legacy redirects, Sitemap membership, hreflang,
   JSON-LD, metadata, search documents, and visible content are captured as
   pre-change evidence;
4. behavior regression tests exist for affected tools and pages;
5. the last stable Catalog artifact, registry baseline, or snapshot pointer is
   recorded;
6. rollback command or feature flag path is written before implementation;
7. privacy review confirms no secrets, no user tool input, and no generated
   user results enter Catalog data, snapshots, analytics, or logs.

## Exit Gates

A migration batch can be marked complete only when all exit gates pass:

1. route comparison proves canonical routes and approved redirects are
   preserved or intentionally changed by a reviewed alias contract;
2. SEO comparison proves canonical URL, hreflang, Open Graph URL, title,
   description, JSON-LD, robots policy, and Sitemap output remain correct;
3. search documents remain localized and do not include private user input;
4. behavior regression proves tool algorithms, validation, URL-state privacy,
   clipboard/download behavior, and accessibility contracts did not regress;
5. static artifact comparison proves generated pages are byte-stable except
   approved Catalog-backed fields;
6. `npm run lint`, `npm run test`, `npm run build`, and `npm run verify` pass;
7. the generated artifact checksum and snapshot pointer are recorded;
8. rollback gates have been tested or table-top verified for the batch.

## Rollback Gates

Rollback is allowed and expected when any exit gate fails, production smoke
checks fail, or a reviewer identifies an unapproved public-behavior change.

Every rollback must prove:

- the previous authoritative source can be restored without editing executable
  tool code;
- the last stable Catalog artifact or registry adapter remains available;
- the snapshot pointer or feature flag can be switched back;
- the restoration command is recorded and can run without secrets in command
  history;
- post-rollback route, metadata, Sitemap, JSON-LD, search, and behavior
  regression checks match the previous baseline.

For a CMS cutover, rollback restores the previous Catalog snapshot or CMS
database snapshot and then reruns reconciliation before another cutover attempt.
Rollback evidence is attached to the owning task and public release summary at
the level needed for review, without exposing private task details.

## Snapshot And Retention Policy

Each batch preserves:

- the previous normalized Catalog artifact;
- the new normalized Catalog artifact;
- checksums for both artifacts;
- a route and SEO comparison report;
- a behavior regression command list;
- the rollback restoration command;
- a short retention note.

Snapshots contain public Catalog fields only. They must contain no secrets, no
provider tokens, no analytics identifiers beyond approved public configuration,
no user tool input, no generated tool results, no private task text, and no
production request payloads. Retain at least the last stable artifact for the
entire migration phase. CMS database snapshots follow the later security and
backup runbooks rather than this Git evidence document.

## Output Comparison Gates

Each batch compares Catalog-backed output to the current source for:

- canonical routes;
- compatibility redirects;
- canonical metadata;
- hreflang and `x-default`;
- Open Graph URL;
- Sitemap;
- robots indexing policy;
- JSON-LD;
- localized visible content;
- FAQ visibility and FAQPage structured data;
- search documents;
- category and relation projections;
- Cloudflare Pages static output and `_routes.json` when applicable.

Comparison results are deterministic and sorted. Known intentional differences
must be listed with the approving task ID. Unknown differences block cutover.

## Tabletop Rollback Exercise

Representative exercise: migrate `res_tool_ipv4-network` metadata through a
Catalog-backed compatibility adapter while keeping the existing IPv4 tool
component and algorithms code-owned.

1. Record current `ipv4-network-toolbox` canonical routes, category membership,
   content owner, SEO metadata, Sitemap membership, JSON-LD, search document,
   and tool-binding evidence from the migration inventory.
2. Generate a Catalog candidate and normalized artifact for the same Resource.
3. Compare canonical routes, metadata, Sitemap, JSON-LD, search documents, and
   behavior regression output.
4. Simulate an error in the Catalog locale summary.
5. Confirm the batch cannot pass exit gates.
6. Restore the previous snapshot pointer or registry adapter.
7. Rerun route, SEO, Sitemap, search, and behavior regression checks.
8. Record the failed candidate checksum and the restored stable checksum.

This exercise proves the rollback path without changing production behavior.
Future implementation tasks may automate the exercise after the Catalog loader,
validator, and normalized artifact exist.
