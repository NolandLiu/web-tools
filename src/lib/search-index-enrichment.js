import { TOOL_CONTENT } from "../content/index.js";
import { CATEGORIES } from "./catalog-data.js";
import { TOOLS_FRONTEND_POLICY } from "./catalog-seo.js";
import { createToolBindingResolver, listToolCodeBindings } from "../tool-bindings.js";

export function createCatalogSearchDocumentOptions({
  frontendPolicy = TOOLS_FRONTEND_POLICY,
  bindings = listToolCodeBindings(),
} = {}) {
  const resolver = createToolBindingResolver(bindings);

  return {
    frontendPolicy,
    extraRankingText(resource, locale) {
      if (resource.type !== "tool") return [];
      const binding = resolver.resolveToolBinding(resource.toolBindingId);
      const content = binding ? TOOL_CONTENT[binding.registryToolId]?.[locale] : null;
      return content ? [content.summary, ...content.useCases] : [];
    },
    categoryText(resource, locale) {
      const categoryId = resource.primaryCategoryId?.replace(/^cat_/, "");
      return CATEGORIES.find(category => category.id === categoryId)?.text[locale]?.name ?? null;
    },
  };
}
