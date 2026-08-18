# GoDeskHub Catalog Layout

This directory is the Git-backed source layout for public-content data only.
Do not place private plans, unpublished requirements, user inputs, credentials,
or operational secrets in this Catalog.

## Authority Files

Each entity uses one authority record per ID. A reviewer should be able to find
the canonical record from the entity ID without searching generated artifacts.

- `resources/` stores resource authority records such as tools, websites, and guides.
- `taxonomy/categories/` stores category authority records.
- `taxonomy/tags/` stores tag authority records.
- `collections/` stores curated or rule-backed collection authority records.
- `locales/` stores localized public copy for resources and supported entities.
- `faq/` stores reusable FAQ records and their resource placements.
- `relations/` stores resource-to-resource relationship records.
- `health/` stores public validation and health evidence records.

## Naming Rules

- Files use readable type prefixes, for example `res_tool_ipv4-network.yml`.
- Locale files use the authority ID plus locale code, for example
  `res_tool_ipv4-network.zh-CN.yml`.
- Duplicate `.yml` and `.yaml` authority files for the same ID are invalid.
- Unknown YAML paths are invalid and must be fixed before publication.

## Fixture Publication Notes

Representative fixtures include both published and hidden resources. Hidden IP
lookup and RDAP resources document the known capability boundary without adding
published routes, Sitemap entries, or public discovery surfaces.

## Collections publication policy

Collections remain a Catalog capability, but they are not a public Discover
surface in the current information architecture. Published collection authority
records may support internal validation or future planning, but they must not
create Discover navigation entries, public routes, Sitemap URLs, search entries,
or static HTML until a new approved task explicitly reactivates Collections.

## Data Boundary

Catalog records describe published or publishable public content. They must not
contain analytics payloads, tool inputs, generated outputs, passwords, private
task details, Cloudflare credentials, API tokens, or other sensitive data.
