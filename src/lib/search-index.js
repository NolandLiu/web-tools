import generatedSearchIndex from "../../catalog/artifacts/search-index.v1.mjs";

export {
  SEARCH_INDEX_SIZE_BUDGET_GZIP_BYTES,
  SEARCH_INDEX_VERSION,
  assertSearchIndexSizeBudget,
  buildLocalizedSearchIndex,
  buildSearchDocuments,
  normalizeSearchQuery,
} from "./search-index-core.js";

export const searchIndex = generatedSearchIndex;
