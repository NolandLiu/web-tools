# ADR-022: Identifier, Slug, Locale, and Task Naming

- Status: Accepted
- Date: 2026-08-11
- Decision task: `ARCH-P0-004`
- Supersedes: none

## Context

The current Tools registry separates short internal IDs such as `json` from public slugs such as `json-tools`. IDs are unique only inside their current arrays; for example, the tool and category registries both contain `qr`. A shared Catalog needs durable cross-entity references for Git/YAML, CMS relations, search, analytics, migrations, and future frontends without changing existing tool bindings or public URLs.

The platform also needs one explicit mapping between internal locale keys and URL segments, plus a stable relationship between program backlog IDs and the repository's private `TASK-xxx` workflow.

## Decision

Use globally unique, readable, typed, immutable canonical IDs. Keep executable binding IDs, canonical slugs, localized display names, locale keys, and task IDs as separate concepts with separate validation rules.

## Canonical entity IDs

Canonical IDs use lowercase ASCII type prefixes:

| Entity | Pattern | Example |
| --- | --- | --- |
| Website resource | `res_website_<key>` | `res_website_cloudflare` |
| Tool resource | `res_tool_<key>` | `res_tool_json` |
| Guide resource | `res_guide_<key>` | `res_guide_ipv4-subnet-basics` |
| Category | `cat_<key>` | `cat_units` |
| Tag | `tag_<key>` | `tag_privacy` |
| Collection | `col_<key>` | `col_featured-tools` |
| FAQ | `faq_<key>` | `faq_base64-not-encryption` |
| Resource relation | `rel_<key>` | `rel_json-related-base64` |

Resource IDs satisfy:

```text
^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$
```

Other entity IDs satisfy:

```text
^(cat|tag|col|faq|rel)_[a-z0-9]+(?:-[a-z0-9]+)*$
```

The maximum ID length is 96 ASCII characters. IDs are immutable, never reused, and never regenerated when names, taxonomy, ownership, or slugs change. A resource type change creates a new resource rather than mutating the type segment of an existing ID.

Locale and health records use composite identities instead of additional authored IDs:

- `ResourceLocale`: resource ID and locale;
- `CategoryLocale`: category ID and locale;
- `TagLocale`: tag ID and locale;
- `CollectionLocale`: collection ID and locale;
- `ResourceHealth`: resource ID and check type.

## Existing Tools migration

Existing short tool IDs remain executable binding IDs. They do not become public URLs or cross-entity Catalog IDs.

```yaml
id: res_tool_json
type: tool
toolBindingId: json
canonicalSlug: json-tools
```

The same rule preserves `ipv4-network` as a binding while using `res_tool_ipv4-network` as the Catalog identity and `ipv4-network-toolbox` as its public slug. Existing category IDs may be retained as migration metadata, for example `legacyId: qr`, while the Catalog uses `cat_qr`.

## Slugs and route namespaces

Canonical slugs use lowercase ASCII kebab-case:

```text
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

The maximum slug length is 80 ASCII characters. Slugs do not contain spaces, underscores, Unicode characters, repeated hyphens, dots, slash characters, backslashes, control characters, or percent-encoded path separators.

A display-name change never changes a slug automatically. All supported locales initially share the same canonical English slug. Localized canonical slugs are outside this decision and require a later ADR.

Slug uniqueness is enforced within:

```text
surface + route namespace + canonical slug
```

Examples of route namespaces include Tools resources, Discover websites, Discover guides, categories, tags, and collections. This permits identical words in independent route namespaces without permitting ambiguous routes.

When an approved migration changes a canonical slug:

1. retain the old slug as a permanent alias;
2. generate a permanent redirect to the new canonical route;
3. exclude the alias from Sitemap and canonical metadata;
4. never allocate the old slug to another entity;
5. update hreflang, JSON-LD, search, and route tests together;
6. retain the alias mapping during rollback.

Unknown or invalid slugs resolve to the existing not-found behavior and never silently resolve to the home page.

## Locale contract

Catalog locale keys use strict BCP 47 casing:

| Catalog locale | URL segment | HTML `lang` | `hreflang` |
| --- | --- | --- | --- |
| `en` | `en` | `en` | `en` |
| `zh-CN` | `zh-cn` | `zh-CN` | `zh-CN` |
| `zh-TW` | `zh-tw` | `zh-TW` | `zh-TW` |

English remains the default locale and `x-default` points to the English canonical route. Catalog records reject `cn`, `tw`, `zh`, and lowercase `zh-cn` or `zh-tw` as internal locale keys. Browser-language detection may map `zh-Hans` to `zh-CN` and `zh-Hant` to `zh-TW` outside the Catalog.

Switching locale changes localized fields and the route language segment; it does not change an entity ID, canonical slug, binding ID, or relation.

## Localized names

Localized display names belong only to locale records. They are not ID or slug inputs after an entity is created. Translating or editing a name therefore does not change relations, CMS foreign keys, analytics identifiers, tool bindings, or URLs.

## Relations

Catalog relations reference canonical IDs only:

```yaml
id: rel_json-related-base64
sourceId: res_tool_json
type: related
targetId: res_tool_base64
```

Slugs, display names, array positions, component filenames, URLs, and tool binding IDs are not valid Catalog foreign keys.

## Security validation

Validators reject path traversal, dot segments, slash characters, backslashes, encoded separators, control characters, leading or trailing whitespace, mixed-case IDs, unsupported Unicode, over-length values, normalization collisions, and reserved prototype keys including `__proto__`, `prototype`, and `constructor`.

IDs and slugs are data. They cannot select arbitrary filesystem paths, module paths, dynamic imports, scripts, or network destinations.

## Program and execution task IDs

Platform backlog IDs use:

```text
<DOMAIN>-P<PHASE>-<THREE-DIGIT-SEQUENCE>
```

Accepted domains are `ARCH`, `CAT`, `TOOLS`, `I18N`, `SEO`, `SEARCH`, `DISC`, `CMS`, `SEC`, `OPS`, and `GROWTH`. Examples include `ARCH-P0-004` and `CAT-P1-001`. These IDs are permanent; phase and status changes never renumber them.

Repository execution tasks continue to use one global monotonic `TASK-xxx` sequence. A private task may associate itself with platform work through:

```yaml
program_refs:
  - ARCH-P0-004
```

Branches, commits, verification evidence, and concise PR references continue to use `TASK-xxx` under repository governance. Architecture documents and dependency graphs use program backlog IDs. One execution task should normally implement one program item; an approved combined batch lists every `program_refs` entry explicitly.

Existing duplicate private-ledger IDs are not renumbered by this ADR. Their reconciliation remains under `ARCH-P0-007` and must preserve historical identity.

## Valid fixtures

```text
res_tool_json
res_guide_ipv6-address-format
cat_network-ip
tag_browser-local
col_featured-tools
faq_qr-logo-privacy
json-tools
zh-CN
ARCH-P0-004
TASK-097
```

## Invalid fixtures

```text
resource_json
res_Tool_JSON
res_tool_中文
res_tool_../json
cat_qr/code
JSON Tools
json_tools
zh-cn          # invalid as a Catalog locale key
ARCH-0-4
TASK-97
```

## Consequences

The Catalog gains globally unambiguous, reviewable identities without changing current code bindings or public routes. IDs are longer than the existing local registry keys, and authors must distinguish identity from URLs, but validators and explicit mapping make that cost visible and testable. Existing routes and tool behavior remain unchanged until separately approved migration tasks consume the convention.
