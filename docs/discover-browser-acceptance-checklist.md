# Discover browser acceptance checklist

This checklist defines the browser acceptance pass for the Discover app. It is a
gate for release readiness, not evidence that production has been deployed.

## Keyboard

- Open `/en/`, `/zh-cn/`, and `/zh-tw/`.
- Use `Tab` from the top of the page and confirm the skip link appears first.
- Activate the skip link and confirm focus moves to the main content region.
- Navigate header links, language switcher, search input, resource cards, and
  footer links without using a pointer device.
- Confirm focus states are visible and do not trap focus.

## Search

- No analytics query should include raw search text.
- Type a query such as `WHATWG URL`, `AI skill`, and `subnet`.
- Confirm results update locally and no analytics query, raw search text, tool
  input, or generated output is sent to analytics or stored in metadata.
- Confirm the no-result state is readable in all supported locales.

## Mobile

- Test at approximately 390 px width.
- Confirm header actions remain usable, the mobile menu opens with the keyboard,
  cards stack vertically, and footer links remain visible.
- Confirm resource cards retain type, title, summary, and primary action.

## 200% zoom

- Increase browser zoom to 200%.
- Confirm horizontal scrolling is not required for the main reading flow.
- Confirm search, language switching, cards, browse pages, resource details, and
  info pages remain reachable.

## Screen reader

- Confirm the page has one main content target after the skip link.
- Confirm search results are announced politely and do not over-announce on
  every page render.
- Confirm resource type badges, external links, and language switcher names are
  understandable.

## Manual acceptance is required

Static tests verify that the hooks and checklist exist, but they do not replace
manual browser, keyboard, mobile, screen-reader, or 200% zoom acceptance.
