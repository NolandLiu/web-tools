import { z } from "zod";

export { CATALOG_SCHEMA_VERSION } from "./version.js";
export {
  LocaleCode,
  PublicationStatus,
  ResourceType,
  resourceLocaleSchema,
  resourceLocaleSetSchema,
  resourceSchema,
} from "./resource.js";
export type {
  Resource,
  ResourceLocale,
} from "./resource.js";
export {
  categorySchema,
  categorySetSchema,
  collectionSchema,
  tagSchema,
} from "./taxonomy.js";
export type {
  Category,
  Collection,
  Tag,
} from "./taxonomy.js";
export {
  HealthStatus,
  RelationType,
  faqSchema,
  healthSchema,
  relationSchema,
} from "./support.js";
export type {
  FAQ,
  ResourceHealth,
  ResourceRelation,
} from "./support.js";
export {
  CatalogLayoutSection,
  classifyCatalogPath,
  validateCatalogLayoutPaths,
} from "./layout.js";
export type {
  CatalogLayoutLocale,
  CatalogLayoutSectionName,
  CatalogPathClassification,
} from "./layout.js";
export {
  loadCatalog,
} from "./loader.js";
export type {
  CatalogDiagnostic,
  CatalogDiagnosticCode,
  LoadedCatalog,
  LoadedCatalogRecords,
  LoadCatalogOptions,
} from "./loader.js";
export {
  validateCatalogGraph,
} from "./graph.js";
export type {
  CatalogGraphDiagnostic,
  CatalogGraphDiagnosticCode,
  CatalogGraphValidationOptions,
  ToolBindingResolver,
} from "./graph.js";
import { CATALOG_SCHEMA_VERSION } from "./version.js";

export const smokeSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: z.string().min(1),
});

export type SmokeRecord = z.infer<typeof smokeSchema>;
