import type { ToolCodeBinding } from "../tool-bindings";
import type { CATEGORIES, TOOLS } from "../registry";

export const PILOT_TOOL_BINDING_IDS: readonly string[];

export interface CatalogAdapterDiagnostic {
  code: string;
  resourceId: string;
  path: string;
  message: string;
}

export interface CatalogToolProjection {
  provenance: "catalog-pilot";
  resourceId: string;
  toolBindingId: string;
  registryToolId: string;
  canonicalSlug: string;
  categoryId: string;
  catalogCategoryId: string;
  kind: string;
  icon: string;
  componentKey: string;
  locales: Record<string, {
    name: string;
    summary: string;
    seoTitle: string;
    seoDescription: string;
    searchAliases: string[];
    searchKeywords: string[];
  }>;
}

export function buildCatalogToolProjection(
  artifact: unknown,
  bindings: Iterable<ToolCodeBinding>,
  options?: { pilotToolBindingIds?: Iterable<string> },
): { tools: CatalogToolProjection[]; diagnostics: CatalogAdapterDiagnostic[] };

export function compareCatalogProjectionToRegistry(
  projection: { tools: CatalogToolProjection[]; diagnostics: CatalogAdapterDiagnostic[] },
  registry?: { tools: typeof TOOLS; categories: typeof CATEGORIES },
): { diagnostics: CatalogAdapterDiagnostic[] };
