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
import { CATALOG_SCHEMA_VERSION } from "./version.js";

export const smokeSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: z.string().min(1),
});

export type SmokeRecord = z.infer<typeof smokeSchema>;
