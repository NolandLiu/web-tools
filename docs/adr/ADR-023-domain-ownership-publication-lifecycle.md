# ADR-023: Domain Ownership and Publication Lifecycle

- Status: Accepted
- Date: 2026-08-11
- Decision task: `ARCH-P0-005`
- Supersedes: none

## Context

The current Tools site effectively treats every registered tool, category, locale record, FAQ, route, and SEO projection as public. Its content tests already require complete `en`, `zh-CN`, and `zh-TW` records for every registered tool and category. A shared Catalog needs explicit entity ownership, revision behavior, publication gates, deprecation semantics, and public-versus-restricted projections before schemas or a CMS can implement them.

The model must preserve the current three-language commitment, keep executable tool behavior in code, and allow an editor to prepare a new version without withdrawing the last approved public version.

## Decision

Separate entity identity, authored revisions, publication state, public projection, and operational health. Every public Resource, Category, Tag, Collection, and FAQ requires complete English, Simplified Chinese, and Traditional Chinese content and must pass publication validation. Draft and review revisions remain private. The last approved published revision remains public while a replacement revision is edited or reviewed.

## Core entities and ownership

| Entity | Owns | Does not own |
| --- | --- | --- |
| `Resource` | global identity, resource type, slug policy, classification, publication state | localized body, executable tool behavior |
| `ResourceLocale` | localized name, summary, body, SEO text, search terms, review date | identity, slug, binding, relations |
| `Category` and locale records | primary browse hierarchy and localized category content | tags or editorial collections |
| `Tag` and locale records | reusable many-to-many facets | primary navigation hierarchy |
| `Collection` and locale records | editorial, automatic, or hybrid grouping and ordering | resource identity or primary category |
| `FAQ` and locale records | reusable localized question and answer | resource body ownership |
| `ResourceRelation` | typed directional links between canonical resource IDs | slug redirects or inferred name matches |
| `ResourceHealth` | operational check state and restricted evidence | automatic publication or deletion decisions |
| `PublicationStatus` | revision/publication semantics | audit history or operational health |

## Resource type boundaries

Resource v1 supports `website`, `tool`, and `guide`.

- A website resource may own a reviewed HTTPS destination and public source attributes.
- A tool resource owns a `toolBindingId` that must resolve to exactly one code registry entry. Algorithms, formulas, validation, URL-state policy, clipboard/download behavior, and accessibility behavior remain code-owned.
- A guide resource owns structured content and reviewed source/author information. Its rendered rich content follows the platform sanitization contract.

Resource type is immutable. A type change creates a new Resource and an explicit relation rather than mutating the canonical ID.

## Authored and computed fields

Catalog-authored global fields include canonical ID, type, canonical slug and aliases, primary category, tags, publication status, ordering configuration, reviewed destination URL, and tool binding ID where applicable.

Locale-authored fields include name, summary, introduction or body, SEO title, SEO description, search aliases, search keywords, content review date, and localized disclaimers.

Computed public fields include canonical URL, alternate-language URLs, hreflang, `x-default`, JSON-LD, Sitemap membership, search documents, relation projections, translation completeness, and publication readiness. These are generated from validated source fields rather than separately authored copies.

Restricted operational fields include working revisions, review comments, editor/reviewer identity, audit events, raw health responses, stack traces, migration evidence, security notes, and CMS/database internal IDs.

## Taxonomy and collection rules

- Every published Resource has exactly one published primary Category.
- Category parent links are optional but cannot form a cycle.
- Published Tag references must resolve to published Tags.
- Collection membership and order belong to the Collection, not to duplicate arrays on Resource records.
- An unpublished Collection does not block publication of its member Resources; it only suppresses the Collection projection.
- A Category cannot be hidden while published Resources still depend on it without an approved reassignment or migration.

## FAQ ownership

FAQ is an independent entity with localized question and answer records. Resource-to-FAQ placement is an ordered association. A published FAQ is complete in all three locales, and a public page or FAQ JSON-LD projection includes only FAQ records visibly rendered on that page.

Tool publication profiles may retain the current requirement for two to four FAQs. Website and guide profiles may make FAQ optional. Hidden FAQ records are excluded from public pages and structured data.

## Resource relations

The initial relation vocabulary is `related`, `alternative`, `prerequisite`, `successor`, and `replaces`. Relations are directional, reference canonical IDs only, reject self-reference and duplicate source/type/target triples, and may carry an explicit display order.

A `successor` or `replaces` relation does not create a redirect automatically. Route migration and redirects require a separately reviewed slug or route change.

## Health model

Resource health uses `unknown`, `healthy`, `warning`, and `failing`. Checks may cover external links, tool bindings, locale completeness, content review dates, SEO completeness, relation integrity, and built-route reachability.

Health results create operational review signals. A failing check never automatically deletes, hides, or deprecates a Resource. Raw provider responses and internal failure evidence remain restricted.

## Publication statuses

### `draft`

Draft revisions may be incomplete. They do not enter public APIs, static pages, search, Sitemap, canonical metadata, or JSON-LD. Authorized previews identify missing content explicitly and never disguise fallback text as a completed translation.

### `review`

Review revisions await approval and remain outside the public projection. Rejection returns the revision to draft with a reason. If a prior published revision exists, that last approved revision continues to serve publicly.

### `published`

Published revisions have passed every publication gate and enter public static pages, search, Sitemap, canonical metadata, hreflang, and applicable JSON-LD.

### `deprecated`

Deprecated Resources retain a self-canonical public URL that returns `200` and shows a localized deprecation or replacement notice. They are removed from Sitemap, primary discovery, recommendation, and popularity surfaces and use `noindex,follow`. A reviewed successor link may be shown. Deprecation does not imply an automatic redirect.

### `hidden`

Hidden entities have no public projection. Their routes resolve through the existing not-found behavior, and they are absent from Sitemap, search, JSON-LD, taxonomy pages, and public APIs. Internal identity, aliases, revisions, and audit evidence remain retained.

## Allowed transitions

```text
draft → review
review → draft
review → published
published → review
published → deprecated
published → hidden
deprecated → review
deprecated → hidden
hidden → draft
```

Direct `draft → published` and `hidden → published` transitions are rejected. Emergency hiding is an explicit audited action from published or deprecated state. Republishing a hidden or deprecated entity requires a new draft/review cycle.

Publication status applies to revisions. A consumer reads the latest approved public projection rather than an unapproved working revision.

## Three-locale publication gate

Every published Resource, Category, Tag, Collection, and FAQ has complete `en`, `zh-CN`, and `zh-TW` required fields. Public rendering never silently substitutes another locale. A missing or invalid locale keeps the working revision in draft or review.

Locale records share canonical entity identity, slug, relations, and lifecycle meaning. FAQ translations remain attached to one FAQ identity. Draft previews may report missing locales but do not generate indexable routes.

## Publication validation

Publication is blocked unless all applicable gates pass:

1. schema and canonical naming validation;
2. three-locale required-field completeness;
3. route namespace and slug/alias uniqueness;
4. published primary Category and valid Tags;
5. valid ordered FAQ and Resource relations;
6. unique resolvable tool binding for Tool resources;
7. allowed HTTPS destination for Website resources;
8. complete SEO source fields and no placeholders;
9. successful canonical, hreflang, JSON-LD, Sitemap, search, and static-route projection;
10. required privacy and security checks.

Publication errors are blocking, structured, and actionable. They are never downgraded to warnings merely to produce a public build.

## Deletion and rollback

Previously published entities cannot be hard-deleted. They first become deprecated or hidden. A never-published unreferenced draft may be deleted, but its canonical ID and used slugs remain reserved and cannot be reused.

Rollback restores the previous approved public projection, not an unapproved working revision. During a source-of-truth migration only one authoritative writer may publish at a time.

## Representative validation scenarios

- A Tool draft missing `zh-TW` fails review publication; after all three locales and its binding validate, it publishes.
- Editing a published Tool creates a working review revision while the previous approved revision remains public.
- A Website whose external health check fails remains published until an editor explicitly deprecates or hides it.
- A Guide rejected for a missing locale returns to draft and cannot appear through public fallback content.
- An emergency-hidden Resource returns to draft, passes review, and only then republishes.

## Consequences

The model preserves existing three-language quality and stable public behavior while allowing safe editorial work. It adds revision and projection concepts beyond a single status flag, but avoids the more damaging behavior of withdrawing approved content during editing. Health, CMS workflow, static generation, and public APIs now share one explicit contract without giving the CMS authority over executable tool code.
