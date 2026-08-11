export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = Object.freeze(["en", "zh-CN", "zh-TW"]);

export const LOCALE_ROUTE_SEGMENTS = Object.freeze({
  en: "en",
  "zh-CN": "zh-cn",
  "zh-TW": "zh-tw",
});

export const LOCALE_HTML_LANG = Object.freeze({
  en: "en",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
});

const localeByLowercase = new Map(SUPPORTED_LOCALES.map(locale => [locale.toLowerCase(), locale]));
const localeByRouteSegment = new Map(
  Object.entries(LOCALE_ROUTE_SEGMENTS).map(([locale, segment]) => [segment, locale]),
);

const requiredLocaleFields = ["name", "summary", "seoTitle", "seoDescription"];

export function normalizeLocale(value) {
  if (typeof value !== "string") return null;
  return localeByLowercase.get(value.trim().toLowerCase()) ?? null;
}

export function localeToRouteSegment(locale) {
  return LOCALE_ROUTE_SEGMENTS[locale] ?? null;
}

export function routeSegmentToLocale(segment) {
  if (typeof segment !== "string") return null;
  return localeByRouteSegment.get(segment.trim().toLowerCase()) ?? null;
}

export function htmlLangForLocale(locale) {
  return LOCALE_HTML_LANG[locale] ?? null;
}

export function assertPublishedLocaleCompleteness(catalogArtifact) {
  const localesByResourceId = new Map();
  for (const locale of catalogArtifact.records.locales ?? []) {
    const records = localesByResourceId.get(locale.resourceId) ?? new Map();
    records.set(locale.locale, locale);
    localesByResourceId.set(locale.resourceId, records);
  }

  const diagnostics = [];
  for (const resource of catalogArtifact.records.resources ?? []) {
    if (resource.status !== "published") continue;
    const locales = localesByResourceId.get(resource.id) ?? new Map();
    for (const locale of SUPPORTED_LOCALES) {
      const localeRecord = locales.get(locale);
      if (!localeRecord) {
        diagnostics.push({
          code: "missing-published-locale",
          resourceId: resource.id,
          locale,
          field: "locale",
        });
        continue;
      }
      for (const field of requiredLocaleFields) {
        if (!String(localeRecord[field] ?? "").trim()) {
          diagnostics.push({
            code: "empty-published-locale-field",
            resourceId: resource.id,
            locale,
            field,
          });
        }
      }
    }
  }

  diagnostics.sort((left, right) => (
    left.resourceId.localeCompare(right.resourceId, "en")
    || left.locale.localeCompare(right.locale, "en")
    || left.field.localeCompare(right.field, "en")
    || left.code.localeCompare(right.code, "en")
  ));
  return { ok: diagnostics.length === 0, diagnostics };
}
