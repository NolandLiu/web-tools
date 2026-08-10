# Catalog and CMS Migration Strategy

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

## Rollback contract

Each migration task records the last stable Catalog snapshot, affected routes, generated artifact checksum, and restoration command or feature flag. A failed CMS cutover restores the previous Catalog snapshot without reverting executable tool code.
