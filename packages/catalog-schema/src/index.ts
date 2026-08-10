import { z } from "zod";

export const CATALOG_SCHEMA_VERSION = "0.1.0" as const;

export const smokeSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: z.string().min(1),
});

export type SmokeRecord = z.infer<typeof smokeSchema>;
