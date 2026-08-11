import { LocaleCode } from "./resource.js";
import type { Resource } from "./resource.js";
import type { Collection } from "./taxonomy.js";
import type { LoadedCatalog } from "./loader.js";

export type CatalogGraphDiagnosticCode =
  | "unknown-primary-category"
  | "missing-tool-binding-resolver"
  | "unknown-tool-binding"
  | "duplicate-tool-binding"
  | "missing-resource-locale"
  | "duplicate-resource-locale"
  | "unknown-collection-resource"
  | "unknown-collection-rule-category"
  | "unknown-collection-rule-tag"
  | "unknown-faq-placement-resource"
  | "unknown-relation-source"
  | "unknown-relation-target"
  | "unknown-health-resource";

export interface ToolBindingResolver {
  hasToolBinding(toolBindingId: string): boolean;
}

export interface CatalogGraphValidationOptions {
  toolBindingResolver?: ToolBindingResolver;
}

export interface CatalogGraphDiagnostic {
  code: CatalogGraphDiagnosticCode;
  sourcePath: string;
  path: string;
  message: string;
}

function sourceFor(catalog: LoadedCatalog, key: string): string {
  return catalog.sources[key] ?? ".";
}

function diagnostic(
  code: CatalogGraphDiagnosticCode,
  sourcePath: string,
  path: string,
  message: string,
): CatalogGraphDiagnostic {
  return {
    code,
    sourcePath,
    path,
    message,
  };
}

function sortDiagnostics(diagnostics: CatalogGraphDiagnostic[]): CatalogGraphDiagnostic[] {
  return [...diagnostics].sort((left, right) => {
    const sourceOrder = left.sourcePath.localeCompare(right.sourcePath, "en");
    if (sourceOrder !== 0) return sourceOrder;
    const codeOrder = left.code.localeCompare(right.code, "en");
    if (codeOrder !== 0) return codeOrder;
    return left.path.localeCompare(right.path, "en");
  });
}

function validateCollectionRules(
  collection: Collection,
  catalog: LoadedCatalog,
  categoryIds: Set<string>,
  tagIds: Set<string>,
  diagnostics: CatalogGraphDiagnostic[],
): void {
  if (!("rules" in collection)) {
    return;
  }

  for (const [index, rule] of collection.rules.entries()) {
    if (rule.field === "categoryId" && !categoryIds.has(rule.value)) {
      diagnostics.push(diagnostic(
        "unknown-collection-rule-category",
        sourceFor(catalog, `collection:${collection.id}`),
        `rules.${index}.value`,
        `unknown category rule value: ${rule.value}`,
      ));
    }

    if (rule.field === "tagId" && !tagIds.has(rule.value)) {
      diagnostics.push(diagnostic(
        "unknown-collection-rule-tag",
        sourceFor(catalog, `collection:${collection.id}`),
        `rules.${index}.value`,
        `unknown tag rule value: ${rule.value}`,
      ));
    }
  }
}

function validateToolBinding(
  resource: Resource & { type: "tool" },
  catalog: LoadedCatalog,
  options: CatalogGraphValidationOptions,
  seenToolBindings: Map<string, string>,
  diagnostics: CatalogGraphDiagnostic[],
): void {
  const sourcePath = sourceFor(catalog, `resource:${resource.id}`);

  if (resource.status !== "published") {
    return;
  }

  const existingResourceId = seenToolBindings.get(resource.toolBindingId);
  if (existingResourceId && existingResourceId !== resource.id) {
    diagnostics.push(diagnostic(
      "duplicate-tool-binding",
      sourcePath,
      "toolBindingId",
      `duplicate tool binding ${resource.toolBindingId} also used by ${existingResourceId}`,
    ));
  } else {
    seenToolBindings.set(resource.toolBindingId, resource.id);
  }

  if (!options.toolBindingResolver) {
    diagnostics.push(diagnostic(
      "missing-tool-binding-resolver",
      sourcePath,
      "toolBindingId",
      "published tool resources require an injected tool binding resolver",
    ));
    return;
  }

  if (!options.toolBindingResolver.hasToolBinding(resource.toolBindingId)) {
    diagnostics.push(diagnostic(
      "unknown-tool-binding",
      sourcePath,
      "toolBindingId",
      `unknown tool binding: ${resource.toolBindingId}`,
    ));
  }
}

export function validateCatalogGraph(
  catalog: LoadedCatalog,
  options: CatalogGraphValidationOptions = {},
): CatalogGraphDiagnostic[] {
  const diagnostics: CatalogGraphDiagnostic[] = [];
  const resourceIds = new Set(catalog.records.resources.map((resource) => resource.id));
  const categoryIds = new Set(catalog.records.categories.map((category) => category.id));
  const tagIds = new Set(catalog.records.tags.map((tag) => tag.id));
  const seenToolBindings = new Map<string, string>();

  for (const resource of catalog.records.resources) {
    const sourcePath = sourceFor(catalog, `resource:${resource.id}`);
    if (resource.type === "tool") {
      if (!categoryIds.has(resource.primaryCategoryId)) {
        diagnostics.push(diagnostic(
          "unknown-primary-category",
          sourcePath,
          "primaryCategoryId",
          `unknown primary category: ${resource.primaryCategoryId}`,
        ));
      }

      validateToolBinding(resource, catalog, options, seenToolBindings, diagnostics);
    }

    const localesForResource = catalog.records.locales.filter((locale) => locale.resourceId === resource.id);
    const seenLocales = new Set<string>();
    for (const locale of localesForResource) {
      if (seenLocales.has(locale.locale)) {
        diagnostics.push(diagnostic(
          "duplicate-resource-locale",
          sourceFor(catalog, `locale:${locale.resourceId}:${locale.locale}`),
          "locale",
          `duplicate locale for resource: ${locale.locale}`,
        ));
      }
      seenLocales.add(locale.locale);
    }

    for (const locale of LocaleCode) {
      if (!seenLocales.has(locale)) {
        diagnostics.push(diagnostic(
          "missing-resource-locale",
          sourcePath,
          "locales",
          `missing required resource locale: ${locale}`,
        ));
      }
    }
  }

  for (const collection of catalog.records.collections) {
    if ("resourceIds" in collection) {
      for (const [index, resourceId] of collection.resourceIds.entries()) {
        if (!resourceIds.has(resourceId)) {
          diagnostics.push(diagnostic(
            "unknown-collection-resource",
            sourceFor(catalog, `collection:${collection.id}`),
            `resourceIds.${index}`,
            `unknown collection resource: ${resourceId}`,
          ));
        }
      }
    }

    validateCollectionRules(collection, catalog, categoryIds, tagIds, diagnostics);
  }

  for (const faq of catalog.records.faqs) {
    for (const [index, placement] of faq.placements.entries()) {
      if (!resourceIds.has(placement.resourceId)) {
        diagnostics.push(diagnostic(
          "unknown-faq-placement-resource",
          sourceFor(catalog, `faq:${faq.id}`),
          `placements.${index}.resourceId`,
          `unknown FAQ placement resource: ${placement.resourceId}`,
        ));
      }
    }
  }

  for (const relation of catalog.records.relations) {
    if (!resourceIds.has(relation.sourceId)) {
      diagnostics.push(diagnostic(
        "unknown-relation-source",
        sourceFor(catalog, `relation:${relation.id}`),
        "sourceId",
        `unknown relation source: ${relation.sourceId}`,
      ));
    }

    if (!resourceIds.has(relation.targetId)) {
      diagnostics.push(diagnostic(
        "unknown-relation-target",
        sourceFor(catalog, `relation:${relation.id}`),
        "targetId",
        `unknown relation target: ${relation.targetId}`,
      ));
    }
  }

  for (const health of catalog.records.health) {
    if (!resourceIds.has(health.resourceId)) {
      diagnostics.push(diagnostic(
        "unknown-health-resource",
        sourceFor(catalog, `health:${health.id}`),
        "resourceId",
        `unknown health resource: ${health.resourceId}`,
      ));
    }
  }

  return sortDiagnostics(diagnostics);
}
