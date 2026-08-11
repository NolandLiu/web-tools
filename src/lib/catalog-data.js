import catalogArtifact from "../../catalog/artifacts/catalog.normalized.v1.mjs";
import {
  CATEGORIES as LEGACY_CATEGORIES,
  DEFAULT_LANG,
  INFO_PAGES,
  LANGUAGES,
  SITE_ORIGIN,
  TOOLS as LEGACY_TOOLS,
} from "../registry.js";
import { createToolBindingResolver, listToolCodeBindings } from "../tool-bindings.js";

const LOCALES = ["en", "zh-CN", "zh-TW"];
const resolver = createToolBindingResolver(listToolCodeBindings());

const legacyToolsById = new Map(LEGACY_TOOLS.map(tool => [tool.id, tool]));
const legacyCategoriesById = new Map(LEGACY_CATEGORIES.map(category => [category.id, category]));
const registryToolIdByResourceId = new Map();
const resourceIdByRegistryToolId = new Map();
const localesByResourceId = new Map();

for (const locale of catalogArtifact.records.locales) {
  const value = localesByResourceId.get(locale.resourceId) ?? {};
  value[locale.locale] = locale;
  localesByResourceId.set(locale.resourceId, value);
}

function normalizeCategoryId(categoryId) {
  return categoryId.replace(/^cat_/, "");
}

function localizedTextFromCatalog(resource, fallbackText) {
  const locales = localesByResourceId.get(resource.id) ?? {};
  return Object.fromEntries(LOCALES.map(locale => {
    const catalogLocale = locales[locale];
    return [
      locale,
      {
        name: catalogLocale?.name ?? fallbackText[locale].name,
        description: catalogLocale?.summary ?? fallbackText[locale].description,
      },
    ];
  }));
}

export const CATALOG_PUBLIC_TOOL_BINDING_IDS = Object.freeze(
  catalogArtifact.records.resources
    .filter(resource => resource.type === "tool" && resource.status === "published")
    .map(resource => resource.toolBindingId)
    .sort((left, right) => left.localeCompare(right, "en")),
);

export const CATEGORIES =
  catalogArtifact.records.categories
    .filter(category => category.status === "published")
    .map(category => {
      const id = normalizeCategoryId(category.id);
      const legacyCategory = legacyCategoriesById.get(id);
      return {
        ...legacyCategory,
        id,
        slug: category.slug,
        order: category.order,
        text: legacyCategory.text,
      };
    })
    .sort((left, right) => left.order - right.order);

export const TOOLS =
  catalogArtifact.records.resources
    .filter(resource => resource.type === "tool" && resource.status === "published")
    .map(resource => {
      const binding = resolver.resolveToolBinding(resource.toolBindingId);
      const legacyTool = legacyToolsById.get(binding?.registryToolId);
      if (!binding || binding.publicationState !== "published" || !legacyTool) {
        throw new Error(`published Catalog resource does not resolve to a public code binding: ${resource.id}`);
      }
      registryToolIdByResourceId.set(resource.id, binding.registryToolId);
      resourceIdByRegistryToolId.set(binding.registryToolId, resource.id);
      return {
        ...legacyTool,
        id: binding.registryToolId,
        slug: resource.canonicalSlug,
        kind: binding.kind,
        category: normalizeCategoryId(resource.primaryCategoryId),
        icon: binding.icon,
        text: localizedTextFromCatalog(resource, legacyTool.text),
      };
    })
    .sort((left, right) => left.order - right.order);

export function getCatalogSearchFields(toolId, lang) {
  const resourceId = resourceIdByRegistryToolId.get(toolId);
  const locale = resourceId ? localesByResourceId.get(resourceId)?.[lang] : null;
  return {
    aliases: locale?.searchAliases ?? [],
    keywords: locale?.searchKeywords ?? [],
  };
}

export function getCatalogFaqsByToolId(toolId, lang) {
  const resourceId = resourceIdByRegistryToolId.get(toolId);
  if (!resourceId) return [];
  return catalogArtifact.records.faqs
    .filter(faq => faq.status === "published" && faq.placements.some(placement => placement.resourceId === resourceId))
    .sort((left, right) => {
      const leftPlacement = left.placements.find(placement => placement.resourceId === resourceId);
      const rightPlacement = right.placements.find(placement => placement.resourceId === resourceId);
      return (leftPlacement?.order ?? 0) - (rightPlacement?.order ?? 0);
    })
    .map(faq => faq.locales.find(locale => locale.locale === lang))
    .filter(Boolean)
    .map(locale => ({
      question: locale.question,
      answer: locale.answer,
    }));
}

export { DEFAULT_LANG, INFO_PAGES, LANGUAGES, SITE_ORIGIN };
