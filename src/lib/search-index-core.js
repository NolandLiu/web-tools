import { gzipSync } from "node:zlib";

import { SUPPORTED_LOCALES, localeToRouteSegment } from "./locale.js";

export const SEARCH_INDEX_VERSION = "search-index.v1";
export const SEARCH_INDEX_SIZE_BUDGET_GZIP_BYTES = 50 * 1024;

function localesByResourceId(catalogArtifact) {
  const output = new Map();
  for (const locale of catalogArtifact.records.locales ?? []) {
    const records = output.get(locale.resourceId) ?? new Map();
    records.set(locale.locale, locale);
    output.set(locale.resourceId, records);
  }
  return output;
}

function categoriesById(catalogArtifact) {
  return new Map((catalogArtifact.records.categories ?? []).map(category => [category.id, category]));
}

function documentUrl(resource, locale, frontendPolicy) {
  const segment = localeToRouteSegment(locale);
  if (resource.type === "tool") return `/${segment}/tools/${resource.canonicalSlug}`;
  if (resource.type === "guide") return `/${segment}/guides/${resource.canonicalSlug}`;
  if (resource.type === "website") {
    return frontendPolicy?.websiteUrlMode === "external"
      ? resource.destinationUrl
      : `/${segment}/websites/${resource.canonicalSlug}`;
  }
  return `/${segment}/${resource.canonicalSlug}`;
}

function categorySlug(resource, categories) {
  if (!resource.primaryCategoryId) return null;
  return categories.get(resource.primaryCategoryId)?.slug ?? null;
}

function categoryText(resource, categories, locale, options) {
  return options.categoryText?.(resource, locale) ?? categorySlug(resource, categories);
}

function stableDocument(left, right) {
  return (
    left.locale.localeCompare(right.locale, "en")
    || left.type.localeCompare(right.type, "en")
    || left.id.localeCompare(right.id, "en")
  );
}

export function normalizeSearchQuery(value) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase().trim();
}

export function buildSearchDocuments(catalogArtifact, options = {}) {
  const localeRecords = localesByResourceId(catalogArtifact);
  const categories = categoriesById(catalogArtifact);
  const documents = [];

  for (const resource of catalogArtifact.records.resources ?? []) {
    if (resource.status !== "published") continue;
    const locales = localeRecords.get(resource.id) ?? new Map();
    for (const locale of SUPPORTED_LOCALES) {
      const text = locales.get(locale);
      if (!text) continue;
      const extraRankingText = options.extraRankingText?.(resource, locale) ?? [];
      const category = categoryText(resource, categories, locale, options);
      documents.push({
        id: `${resource.id}:${locale}`,
        resourceId: resource.id,
        type: resource.type,
        locale,
        status: resource.status,
        name: text.name,
        description: text.summary,
        category,
        tags: [],
        aliases: text.searchAliases ?? [],
        keywords: text.searchKeywords ?? [],
        url: documentUrl(resource, locale, options.frontendPolicy),
        rankingText: [
          text.name,
          text.summary,
          ...(text.searchAliases ?? []),
          ...(text.searchKeywords ?? []),
          ...extraRankingText,
          category ?? "",
        ].filter(Boolean).map(normalizeSearchQuery),
      });
    }
  }

  return documents.sort(stableDocument);
}

export function buildLocalizedSearchIndex(documents) {
  const locales = Object.fromEntries(SUPPORTED_LOCALES.map(locale => [
    locale,
    {
      documents: documents
        .filter(document => document.locale === locale)
        .sort((left, right) => left.id.localeCompare(right.id, "en"))
        .map(document => ({
          id: document.id,
          resourceId: document.resourceId,
          type: document.type,
          locale: document.locale,
          name: document.name,
          description: document.description,
          category: document.category,
          tags: document.tags,
          aliases: document.aliases,
          keywords: document.keywords,
          url: document.url,
          rankingText: document.rankingText,
        })),
    },
  ]));

  return {
    version: SEARCH_INDEX_VERSION,
    locales,
  };
}

export function assertSearchIndexSizeBudget(index, budget = SEARCH_INDEX_SIZE_BUDGET_GZIP_BYTES) {
  const gzipBytes = gzipSync(JSON.stringify(index)).byteLength;
  return {
    ok: gzipBytes <= budget,
    gzipBytes,
    budget,
  };
}
