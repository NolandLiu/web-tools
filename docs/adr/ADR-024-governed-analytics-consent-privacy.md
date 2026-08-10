# ADR-024: Governed Analytics, Consent, and Privacy Boundary

- Status: Accepted
- Date: 2026-08-11
- Decision task: `ARCH-P0-006`
- Supersedes: the unqualified statement that only anonymous aggregated tool-open events may be recorded

## Context

The current site embeds a standard Google tag in the HTML template. Its `config` command sends a `page_view` by default, and Google Analytics property settings may add browser-history page views. The application also keeps tool-open counts in browser `localStorage` to order popular tools, but those local statistics are not remote analytics events.

The repository policy permits only anonymous aggregated tool-open events, while the deployed code and privacy page explicitly describe Google Analytics page views. Google Analytics also uses first-party client identifiers and provider-controlled technical measurements after consent, so describing the service as completely anonymous is not sufficiently precise. Discover, shared Catalog, search, resource, and Operations work must not expand analytics until one enforceable contract reconciles this difference.

## Decision

Page-view analytics remain approved only as a controlled `page_view` event sent after explicit consent. The current unconditional, provider-default page-view behavior is a migration state, not the final contract. A single application-owned analytics adapter will enforce event-name, field, enum, canonical-URL, and consent allowlists and will fail closed.

The site will use Basic Consent Mode semantics: Google tags do not load and no data is sent to Google before the visitor grants analytics consent. Advertising storage, advertising user data, and advertising personalization remain denied. Refusing analytics never reduces tool functionality.

## Data classes

### Remote analytics

Remote analytics means any event or measurement sent to Google Analytics or another future provider. Only events and application-supplied fields listed in this ADR may pass the adapter.

### Local personalization

The current tool popularity state remains browser-local and contains only stable tool binding ID, open count, and last-opened timestamp. It is not uploaded, joined to a provider client identifier, or represented as a remote event. Clearing site storage deletes it. Malformed or incompatible state resets safely.

### Forbidden content

The following data never enters remote analytics, event logs, metadata, JSON-LD, feedback URLs, or analytics error reports:

- calculator, converter, text, network-query, or file inputs and outputs;
- amounts, cash flows, passwords, password options, JSON, Base64, URLs entered by a user, QR content, Logo data, filenames, and clipboard or download content;
- free text, feedback bodies, raw search queries, hashed search queries, or input-derived exception details;
- arbitrary URL query strings or fragments;
- email addresses, account identifiers, custom user IDs, custom IP-address fields, or device fingerprints.

## Event allowlist

### Enabled after the consent implementation

`page_view` is the only event approved for immediate implementation.

| Field | Contract |
| --- | --- |
| `schema_version` | fixed analytics-contract version |
| `page_location` | canonical absolute URL on `https://tools.godeskhub.com`, without query or fragment |
| `page_title` | public generated page title |
| `page_type` | `home`, `tool`, `category`, `info`, or `not_found` |
| `locale` | `en`, `zh-CN`, or `zh-TW` |

The adapter never forwards the browser's raw `location.href`. Provider-controlled technical data collected after consent must be accurately disclosed, minimized through property settings, and must not be described as completely anonymous.

### Reserved for separately approved implementation

The following event names and fields are structurally acceptable but remain disabled until a separate task adds tests, privacy review, and release approval. Listing an event here does not authorize transmission.

| Event | Allowed application fields |
| --- | --- |
| `tool_open` | `tool_id`, `category_id`, `locale`, `surface` |
| `resource_open` | `resource_id`, `resource_type`, `category_id`, `locale`, `surface` |
| `outbound_resource_open` | `resource_id`, `locale`, `surface` |
| `search_summary` | `locale`, `scope`, `result_count_bucket` |

`surface` is a closed enum such as `home`, `category`, `search`, `related`, or `direct`. `result_count_bucket` is `zero`, `one_to_five`, `six_to_twenty`, or `over_twenty`. Canonical IDs come from validated public Catalog records. A raw or hashed search term is never an allowed field.

## Consent contract

- Before a choice, do not load `gtag.js`, write Analytics cookies, or send consent or measurement pings.
- Granting analytics loads one Google tag and enables controlled events.
- Refusing analytics sends nothing to Google and does not affect any product function.
- The choice is stored only as first-party functional state and is not joined to Analytics identifiers.
- A three-language footer setting lets a visitor change or withdraw the choice.
- Grant and refuse actions have comparable visibility and clear language.
- Withdrawal stops later events. The site does not claim that withdrawal automatically deletes measurements already received by Google.
- Tag-loading, provider, or adapter failures degrade to no analytics and never affect a tool.

The consent decision is a product privacy baseline rather than jurisdiction-specific legal advice. A material change in audience, commercial model, or applicable law requires a separate review.

## Google Analytics property baseline

The site owner is both the Analytics configuration owner and repository policy owner. The property baseline is:

- user-level and event-level retention: two months;
- reset retention on new activity: disabled;
- Google Signals: disabled;
- advertising personalization: disabled;
- Google Ads linking: disabled;
- User-ID, demographics, interests, remarketing, and BigQuery export: disabled;
- data sharing: minimum required to operate the approved measurement service;
- Enhanced Measurement browser-history page views and all unapproved automatic events: disabled;
- development and internal verification traffic: excluded from production measurement.

Dashboard evidence is stored only in private task artifacts without credentials, account identifiers, or personal information. The owner rechecks the property before adding any event and at least every six months. A repository/Dashboard mismatch blocks analytics expansion and receives its own defect task.

## Adapter behavior

The future analytics adapter validates, in order:

1. consent is granted;
2. the event name is allowlisted and enabled;
3. no unknown field is present;
4. IDs and enum values are valid;
5. page URLs are canonical, first-party, and stripped of query and fragment.

An invalid event is dropped. The adapter does not throw into product flows, log the rejected payload, retry indefinitely, or fall back to an uncontrolled provider call. Development builds do not send production analytics by default.

## Migration sequence

1. Configure the Google Analytics property to the approved baseline.
2. Replace the unconditional HTML tag with three-language consent and a single adapter-controlled loader.
3. Enable only controlled `page_view` after consent.
4. Update `AGENTS.md` and the three privacy-page sources to reflect the exact behavior.
5. Verify real browser network requests with non-sensitive fixtures before release.
6. Consider future events only through separately numbered tasks.

The current Google tag and privacy text are owned migration gaps. They remain visible until the implementation task completes and must not be copied into Discover as the target pattern.

## Validation contract

Future automated and browser tests must prove:

- no Google tag or request before a choice or after refusal;
- one tag and one controlled page view after consent;
- navigation does not duplicate or omit an intended page view;
- every page location is canonical and contains no query or fragment;
- unknown events, fields, IDs, and enums fail closed;
- sensitive sentinel values and raw or hashed search terms never enter a payload;
- local tool statistics make no network request;
- withdrawal stops later events;
- provider failure does not affect tools;
- consent and privacy content is complete in all three locales;
- routes, SEO, JSON-LD, Sitemap, static output, and existing privacy tests do not regress.

Source-string checks are necessary but not sufficient. Browser tests inspect actual network requests.

## Rollback

If consent, deduplication, URL sanitization, field validation, or property configuration cannot be proven correct, analytics is disabled completely. Rollback never restores the unconditional automatic tag. Product availability and tool functionality take priority over measurement continuity.

## Consequences

The platform retains useful page trends without treating provider defaults as the privacy contract. Consent reduces measured traffic and adds a small settings surface, but gives visitors a clear choice and makes the approved boundary testable. Future tool, resource, outbound, and search signals have stable names while remaining disabled until separately approved. Local popularity ordering remains private and independent of remote analytics.

## References

- [Google Analytics: Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google Tag Platform: Consent mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Google Tag Platform: Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent)
- [Google Analytics: Data collection](https://support.google.com/analytics/answer/11593727?hl=en)
- [Google Analytics: Regional data collection](https://support.google.com/analytics/answer/11598602?hl=en)
- [Google Analytics: Data retention](https://support.google.com/analytics/answer/7667196?hl=en)
