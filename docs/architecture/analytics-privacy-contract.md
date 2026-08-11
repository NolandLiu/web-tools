# Analytics and Privacy Contract

## Purpose

This contract applies to Tools, future Discover surfaces, shared Catalog consumers, and Operations reporting. ADR-024 is authoritative. No frontend, CMS, worker, or reporting task may introduce an analytics event or field outside its allowlist.

## Current and target state

The current Tools build embeds a standard Google tag that sends provider-default page views. That is a recorded migration gap. The target state uses Basic Consent Mode semantics, loads no Google code before an affirmative choice, and sends only application-validated events through one adapter.

Browser-local tool popularity is local personalization rather than remote analytics. It remains independent of Google Analytics and contains only tool binding ID, count, and last-opened time.

## Approved remote contract

The only event approved for initial implementation is `page_view` with `schema_version`, canonical query-free and fragment-free `page_location`, generated `page_title`, closed-enum `page_type`, and supported `locale`.

`tool_open`, `resource_open`, `outbound_resource_open`, and aggregate `search_summary` shapes are reserved by ADR-024 but disabled. Each requires a separate approved task before transmission. Raw and hashed search terms are prohibited.

## Consent and provider settings

Google tags remain blocked until analytics consent is granted. Refusal sends no Google request and never affects a tool. Advertising-related consent remains denied. Visitors can change their choice through a three-language footer setting.

The site owner maintains the Google Analytics property with two-month event/user retention, retention reset disabled, automatic unapproved events disabled, and advertising, Signals, account links, User-ID, demographics, remarketing, and unapproved exports disabled.

## Data minimization

Tool input, output, files, passwords, amounts, cash flows, QR content, Logos, filenames, clipboard/download data, free text, feedback bodies, input-derived errors, arbitrary URL parameters, raw or hashed search terms, and custom identity fields are prohibited. An adapter accepts closed schemas only and drops unknown events or fields without logging their payloads.

## Failure and rollback

Analytics is optional infrastructure. Consent-state uncertainty, validation failure, vendor failure, or configuration drift produces no event and cannot break product behavior. If the approved boundary cannot be verified, disable analytics rather than restore the unconditional tag.

## Verification ownership

Every event implementation includes schema tests, sensitive-value sentinel tests, canonical URL tests, three-language content tests, and real browser request inspection. The owner reviews Dashboard settings before each event expansion and at least every six months; private evidence must exclude account identifiers, credentials, and personal data.
