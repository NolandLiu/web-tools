import { CATEGORIES, TOOLS } from "../registry.js";
import { createToolBindingResolver } from "../tool-bindings.js";

export const PILOT_TOOL_BINDING_IDS = Object.freeze([
  "ipv4-network-toolbox",
  "irr-calculator",
  "password-generator",
]);

const LOCALES = ["en", "zh-CN", "zh-TW"];

function diagnostic(code, resourceId, path, message) {
  return { code, resourceId, path, message };
}

function sortDiagnostics(diagnostics) {
  return [...diagnostics].sort((left, right) => {
    const codeOrder = left.code.localeCompare(right.code, "en");
    if (codeOrder !== 0) return codeOrder;
    const resourceOrder = left.resourceId.localeCompare(right.resourceId, "en");
    if (resourceOrder !== 0) return resourceOrder;
    return left.path.localeCompare(right.path, "en");
  });
}

function localesByResource(artifact) {
  const map = new Map();
  for (const locale of artifact.records.locales) {
    const values = map.get(locale.resourceId) ?? {};
    values[locale.locale] = locale;
    map.set(locale.resourceId, values);
  }
  return map;
}

export function buildCatalogToolProjection(artifact, bindings, options = {}) {
  const pilotToolBindingIds = new Set(options.pilotToolBindingIds ?? []);
  const resolver = createToolBindingResolver(bindings);
  const localeMap = localesByResource(artifact);
  const diagnostics = [];
  const tools = [];

  for (const resource of artifact.records.resources) {
    if (resource.type !== "tool") continue;
    if (resource.status !== "published") continue;
    if (!pilotToolBindingIds.has(resource.toolBindingId)) continue;

    const binding = resolver.resolveToolBinding(resource.toolBindingId);
    if (!binding || binding.publicationState !== "published") {
      diagnostics.push(diagnostic(
        "catalog-pilot-binding-unavailable",
        resource.id,
        "toolBindingId",
        `pilot binding is not available for public projection: ${resource.toolBindingId}`,
      ));
      continue;
    }

    const locales = localeMap.get(resource.id) ?? {};
    const missingLocale = LOCALES.find(locale => !locales[locale]);
    if (missingLocale) {
      diagnostics.push(diagnostic(
        "catalog-pilot-locale-missing",
        resource.id,
        "locales",
        `missing locale for pilot projection: ${missingLocale}`,
      ));
      continue;
    }

    tools.push({
      provenance: "catalog-pilot",
      resourceId: resource.id,
      toolBindingId: resource.toolBindingId,
      registryToolId: binding.registryToolId,
      canonicalSlug: resource.canonicalSlug,
      categoryId: resource.primaryCategoryId.replace(/^cat_/, ""),
      catalogCategoryId: resource.primaryCategoryId,
      kind: binding.kind,
      icon: binding.icon,
      componentKey: binding.componentKey,
      locales,
    });
  }

  return {
    tools: tools.sort((left, right) => left.toolBindingId.localeCompare(right.toolBindingId, "en")),
    diagnostics: sortDiagnostics(diagnostics),
  };
}

function compareField(diagnostics, tool, legacyTool, field, catalogValue, legacyValue) {
  if (catalogValue !== legacyValue) {
    diagnostics.push(diagnostic(
      `catalog-registry-${field}-conflict`,
      tool.resourceId,
      field,
      `Catalog ${field} ${catalogValue} does not match registry ${legacyValue}`,
    ));
  }
}

export function compareCatalogProjectionToRegistry(projection, registry = { tools: TOOLS, categories: CATEGORIES }) {
  const diagnostics = [...projection.diagnostics];
  const toolsById = new Map(registry.tools.map(tool => [tool.id, tool]));
  const categoryIds = new Set(registry.categories.map(category => category.id));

  for (const tool of projection.tools) {
    const legacyTool = toolsById.get(tool.registryToolId);
    if (!legacyTool) {
      diagnostics.push(diagnostic(
        "catalog-registry-tool-missing",
        tool.resourceId,
        "registryToolId",
        `legacy registry tool is missing: ${tool.registryToolId}`,
      ));
      continue;
    }

    compareField(diagnostics, tool, legacyTool, "slug", tool.canonicalSlug, legacyTool.slug);
    compareField(diagnostics, tool, legacyTool, "category", tool.categoryId, legacyTool.category);
    compareField(diagnostics, tool, legacyTool, "kind", tool.kind, legacyTool.kind);

    if (!categoryIds.has(tool.categoryId)) {
      diagnostics.push(diagnostic(
        "catalog-registry-category-missing",
        tool.resourceId,
        "categoryId",
        `legacy registry category is missing: ${tool.categoryId}`,
      ));
    }

    for (const locale of LOCALES) {
      const catalogLocale = tool.locales[locale];
      const legacyText = legacyTool.text[locale];
      compareField(diagnostics, tool, legacyTool, `locale.${locale}.name`, catalogLocale.name, legacyText.name);
      compareField(diagnostics, tool, legacyTool, `locale.${locale}.summary`, catalogLocale.summary, legacyText.description);
    }
  }

  return {
    diagnostics: sortDiagnostics(diagnostics),
  };
}
