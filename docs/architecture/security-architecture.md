# Security Architecture

## Trust boundaries

- Public Discover and Tools frontends are untrusted-input surfaces and remain static-first.
- `admin.godeskhub.com` requires Cloudflare Access before CMS authentication.
- The CMS API, database, media pipeline, and migration runner are separate protected boundaries.
- Tool input remains browser-local unless a tool explicitly documents an approved network operation.

## Admin controls

The production control stack is Cloudflare Access + CMS authentication + least-privilege RBAC. Planned roles are Owner, Editor, Translator, and Reviewer. Database services must not be directly public, and secrets must use deployment-platform secret storage rather than Git.

## Content controls

Rich text is sanitized against arbitrary scripts and unsafe embeds. Media is validated by type, size, dimensions, and storage policy. Public read APIs, login, preview, and administrative APIs receive rate limits appropriate to their risk.

## Audit and recovery

Material administrative actions record actor, time, action, resource, before state, and after state. Backups use defined schedules and retention, and restore tests are acceptance criteria rather than documentation-only claims.

## Privacy and analytics

ADR-024 and the analytics privacy contract govern every Tools, Discover, Catalog, and Operations signal. Controlled page views remain approved only after affirmative Basic Consent Mode choice. Before consent or after refusal, no Google tag or measurement request is sent. Browser-local popular-tool statistics remain local personalization and are never joined to a provider identifier.

The analytics adapter is fail-closed: only enabled event names and fields pass, page locations are canonical and stripped of query and fragment, and provider failure cannot affect product behavior. Calculator, converter, text, file, password, QR, financial, network-query, feedback, clipboard, download, raw or hashed search, and input-derived error content is forbidden. Future tool, resource, outbound, or aggregate search events require a separately approved task even when ADR-024 reserves their schema.

The site owner also owns the Google Analytics property baseline: two-month user/event retention, retention reset disabled, unapproved Enhanced Measurement events disabled, and Signals, advertising, account links, User-ID, demographics, remarketing, and unapproved exports disabled. Configuration evidence remains private and is reviewed before analytics expansion and at least every six months.
