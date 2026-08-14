# Discover Collections publication policy

Collections are not a public Discover surface in the current information
architecture.

## Current rule

- The Catalog schema may keep collection authority records.
- Discover navigation must not link to Collections.
- Discover route parsing must return not-found for `/collections/`.
- Discover Sitemap generation must not include collection URLs.
- Discover search and browse pages must not expose collection entries.

## Rationale

The current Discover IA uses Tools, Websites, Guides, and AI Skills as the
primary resource surfaces. Collections were removed to reduce navigation
complexity and avoid maintaining an under-specified browse model.

## Future reactivation

Future reactivation requires a new approved task. That task must define:

- collection page purpose;
- public route shape;
- localized metadata and structured data;
- search behavior;
- Sitemap behavior;
- migration and rollback checks.
