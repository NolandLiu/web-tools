# Catalog Domain Model

## Status

Target model for planning. Exact TypeScript and Zod definitions are deferred to Catalog Foundation tasks.

## Entities

| Entity | Responsibility | Stable identity |
| --- | --- | --- |
| `Resource` | Shared record for `website`, `tool`, and `guide` | immutable resource ID |
| `ResourceLocale` | Locale-specific name, summary, body, SEO, search terms, and review date | resource ID + locale |
| `Category` / `CategoryLocale` | Primary hierarchical browse classification | category ID |
| `Tag` / `TagLocale` | Reusable many-to-many facets | tag ID |
| `Collection` / `CollectionLocale` | Editorial, automatic, or hybrid resource grouping | collection ID |
| `FAQ` | Reusable localized question and answer content | FAQ ID |
| `ResourceRelation` | Typed directional relation between resources | relation ID |
| `ResourceHealth` | Link checks, translation completeness, and operational health | resource ID + check type |
| `PublicationStatus` | Lifecycle state | `draft`, `review`, `published`, `deprecated`, `hidden` |

## Resource v1

Supported resource types are `website`, `tool`, and `guide`. A tool resource stores public metadata and a stable tool binding ID; executable implementation, validation, and client-side behavior remain in code.

ADR-023 separates global authored fields, localized authored fields, computed public projections, restricted operational evidence, and code-owned tool behavior. Resource type is immutable. A Website owns a reviewed HTTPS destination, a Tool owns a binding to code, and a Guide owns structured reviewed content.

## Localization

Supported locales are `en`, `zh-CN`, and `zh-TW`. Entity identity is locale-neutral. Localized fields are separate records keyed by entity ID and locale. Initial canonical slugs are shared across locales and are unique within their surface and route namespace under ADR-022.

## Naming contract

ADR-022 defines globally unique readable canonical IDs such as `res_tool_json`, `cat_units`, and `faq_base64-not-encryption`. Existing executable tool IDs remain separate `toolBindingId` values, and current public route slugs remain separate `canonicalSlug` values. Locale keys use `en`, `zh-CN`, and `zh-TW`, while URL segments use `en`, `zh-cn`, and `zh-tw`.

Canonical IDs are immutable and never reused. Initial canonical slugs are stable ASCII kebab-case shared across locales; a changed slug retains its predecessor as a permanent redirect alias. Relations reference canonical IDs rather than slugs, names, URLs, or binding IDs.

## Taxonomy rules

- Category represents a primary browse hierarchy.
- Tag represents reusable facets and may cross categories.
- Collection represents curated or rule-derived groupings.
- These concepts are not interchangeable and must not share IDs or authoring semantics.
- Every published Resource has exactly one published primary Category.
- Collection membership and ordering belong to Collection records rather than duplicate Resource arrays.

## FAQ, relations, and health

FAQ is an independent three-locale entity connected to Resources through ordered associations. Initial Resource relation types are `related`, `alternative`, `prerequisite`, `successor`, and `replaces`; relations use canonical IDs and never create redirects automatically.

ResourceHealth reports `unknown`, `healthy`, `warning`, or `failing` operational checks. Health failures enter review and never automatically hide, deprecate, or delete public content.

## Publication lifecycle

- `draft`: private and potentially incomplete;
- `review`: private working revision awaiting approval;
- `published`: latest approved public projection;
- `deprecated`: public `200` route with localized notice, `noindex,follow`, and no primary discovery or Sitemap membership;
- `hidden`: no public projection and existing not-found behavior.

All published Resource, Category, Tag, Collection, and FAQ records require complete `en`, `zh-CN`, and `zh-TW` content. Public pages never silently fall back to another locale. Editing or reviewing a previously published entity does not withdraw its last approved public revision.

## Catalog invariants

- Canonical IDs are immutable, never reused, and globally unique across the Catalog through typed prefixes.
- Published records satisfy mandatory locale and relation rules.
- Publication requires complete `en`, `zh-CN`, and `zh-TW` fields and all applicable projection gates.
- Every relation target exists and uses an allowed relation type.
- Every tool binding resolves to exactly one code registry entry.
- Catalog validation runs before build, import, or publication.
- Catalog is the single source of truth for public metadata after each migration batch.
