import { TOOL_CONTENT } from "../content/index.js";
import { CATEGORIES, TOOLS } from "../registry.js";
import { buildPath } from "./routes.js";

function normalize(value) {
  return String(value).normalize("NFKC").toLocaleLowerCase().trim();
}

function scoreText(query, name, aliases, values) {
  const normalizedName = normalize(name);
  const normalizedAliases = aliases.map(normalize);
  let score = 0;
  if (normalizedName === query) score += 120;
  if (normalizedName.startsWith(query)) score += 80;
  if (normalizedName.includes(query)) score += 50;
  if (normalizedAliases.some(alias => alias === query)) score += 100;
  if (normalizedAliases.some(alias => alias.includes(query))) score += 45;
  for (const value of values) {
    if (normalize(value).includes(query)) score += 10;
  }
  return score;
}

export function searchTools(query, lang, limit = 12) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return TOOLS.map(tool => {
    const content = TOOL_CONTENT[tool.id][lang];
    const category = CATEGORIES.find(item => item.id === tool.category);
    const name = tool.text[lang].name;
    const categoryName = category?.text[lang].name ?? "";
    const score = scoreText(normalizedQuery, name, content.aliases, [
      ...content.keywords,
      content.summary,
      ...content.useCases,
      categoryName,
      category?.text[lang].description ?? "",
    ]);
    return {
      toolId: tool.id,
      name,
      category: categoryName,
      summary: content.summary,
      path: buildPath({ kind: "tool", lang, toolId: tool.id }),
      score,
      order: tool.order,
    };
  })
    .filter(result => result.score > 0)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .slice(0, limit)
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
