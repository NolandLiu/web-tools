import { searchResources } from "./search-ranking.js";

export function searchTools(query, lang, limit = 12) {
  return searchResources(query, lang, { limit, types: ["tool"] })
    .map(result => ({
      toolId: result.toolId,
      name: result.name,
      category: result.category,
      summary: result.summary,
      path: result.path,
      score: result.score,
    }));
}

export function moveSearchSelection(current, direction, count) {
  if (count <= 0) return -1;
  if (direction === "previous") return current <= 0 ? count - 1 : current - 1;
  return current < 0 || current >= count - 1 ? 0 : current + 1;
}
