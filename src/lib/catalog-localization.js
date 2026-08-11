import { SUPPORTED_LOCALES } from "./locale.js";

const requiredLocaleFields = ["name", "summary", "seoTitle", "seoDescription"];

function localesByResourceId(catalogArtifact) {
  const output = new Map();
  for (const locale of catalogArtifact.records.locales ?? []) {
    const records = output.get(locale.resourceId) ?? new Map();
    records.set(locale.locale, locale);
    output.set(locale.resourceId, records);
  }
  return output;
}

function sortDiagnostics(left, right) {
  return (
    left.resourceId.localeCompare(right.resourceId, "en")
    || left.locale.localeCompare(right.locale, "en")
    || left.field.localeCompare(right.field, "en")
    || left.code.localeCompare(right.code, "en")
  );
}

export function validateTranslationCompleteness(catalogArtifact) {
  const localeRecords = localesByResourceId(catalogArtifact);
  const diagnostics = [];

  for (const resource of catalogArtifact.records.resources ?? []) {
    if (resource.status !== "published") continue;
    const locales = localeRecords.get(resource.id) ?? new Map();
    for (const locale of SUPPORTED_LOCALES) {
      const record = locales.get(locale);
      if (!record) {
        diagnostics.push({
          code: "missing-published-locale",
          resourceId: resource.id,
          locale,
          field: "locale",
          severity: "error",
        });
        continue;
      }
      for (const field of requiredLocaleFields) {
        if (!String(record[field] ?? "").trim()) {
          diagnostics.push({
            code: "empty-published-locale-field",
            resourceId: resource.id,
            locale,
            field,
            severity: "error",
          });
        }
      }
    }
  }

  diagnostics.sort(sortDiagnostics);
  return {
    ok: diagnostics.length === 0,
    diagnostics,
  };
}
