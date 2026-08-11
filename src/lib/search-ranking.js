import searchIndex from "../../catalog/artifacts/search-index.v1.mjs";
import { TOOLS } from "../lib/catalog-data.js";

const toolBySlug = new Map(TOOLS.map(tool => [tool.slug, tool]));
const typeWeight = new Map([
  ["tool", 0],
  ["guide", 1],
  ["website", 2],
]);

export function normalizeSearchQuery(value) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase().trim();
}

function scoreField(query, value, exact, prefix, substring) {
  const normalized = normalizeSearchQuery(value);
  if (!normalized) return 0;
  if (normalized === query) return exact;
  if (normalized.startsWith(query)) return prefix;
  if (normalized.includes(query)) return substring;
  return 0;
}

export function scoreSearchDocument(query, document) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return 0;
  let score = 0;
  score += scoreField(normalizedQuery, document.name, 1200, 900, 600);
  score += scoreField(normalizedQuery, document.category, 300, 180, 90);

  for (const alias of document.aliases ?? []) {
    score += scoreField(normalizedQuery, alias, 1000, 700, 350);
  }
  for (const keyword of document.keywords ?? []) {
    score += scoreField(normalizedQuery, keyword, 800, 480, 240);
  }
  for (const tag of document.tags ?? []) {
    score += scoreField(normalizedQuery, tag, 350, 210, 100);
  }
  for (const value of document.rankingText ?? []) {
    score += normalizeSearchQuery(value).includes(normalizedQuery) ? 40 : 0;
  }
  score += scoreField(normalizedQuery, document.description, 180, 100, 60);
  return score;
}

function slugFromToolUrl(url) {
  return String(url).split("/tools/")[1]?.split(/[?#/]/)[0] ?? null;
}

function toResult(document, score) {
  const slug = slugFromToolUrl(document.url);
  const tool = slug ? toolBySlug.get(slug) : null;
  return {
    id: document.id,
    resourceId: document.resourceId,
    type: document.type,
    locale: document.locale,
    toolId: tool?.id ?? null,
    name: document.name,
    category: document.category,
    summary: document.description,
    path: document.url,
    score,
    order: tool?.order ?? Number.MAX_SAFE_INTEGER,
  };
}

export function searchResources(query, locale, options = {}) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return [];

  const {
    limit = 12,
    types = ["tool"],
    index = searchIndex,
  } = options;
  const allowedTypes = new Set(types);
  const documents = index.locales?.[locale]?.documents ?? [];

  return documents
    .filter(document => allowedTypes.has(document.type))
    .map(document => toResult(document, scoreSearchDocument(normalizedQuery, document)))
    .filter(result => result.score > 0 && (result.type !== "tool" || result.toolId))
    .sort((left, right) => (
      right.score - left.score
      || (typeWeight.get(left.type) ?? 99) - (typeWeight.get(right.type) ?? 99)
      || left.order - right.order
      || left.resourceId.localeCompare(right.resourceId, "en")
      || left.locale.localeCompare(right.locale, "en")
    ))
    .slice(0, limit);
}
