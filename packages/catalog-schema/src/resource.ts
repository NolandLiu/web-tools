import { z } from "zod";

import { CATALOG_SCHEMA_VERSION } from "./version.js";

export const ResourceType = ["website", "tool", "guide"] as const;
export const PublicationStatus = ["draft", "review", "published", "deprecated", "hidden"] as const;
export const LocaleCode = ["en", "zh-CN", "zh-TW"] as const;

const catalogIdSchema = z.string().regex(
  /^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "id must use a readable resource prefix such as res_tool_ipv4-network",
);

const catalogSlugSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "canonicalSlug must use lowercase ASCII words separated by hyphens",
);

const categoryIdSchema = z.string().regex(
  /^cat_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "primaryCategoryId must use a cat_ prefix",
);

const toolBindingIdSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "toolBindingId must match a stable code-owned tool binding ID",
);

const httpsUrlSchema = z.string()
  .url("destinationUrl must be a valid URL")
  .refine((value) => new URL(value).protocol === "https:", {
    message: "destinationUrl must use HTTPS",
  });

const resourceBaseSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: catalogIdSchema,
  canonicalSlug: catalogSlugSchema,
  status: z.enum(PublicationStatus),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

const websiteResourceSchema = resourceBaseSchema.extend({
  type: z.literal("website"),
  destinationUrl: httpsUrlSchema,
}).strict();

const toolResourceSchema = resourceBaseSchema.extend({
  type: z.literal("tool"),
  toolBindingId: toolBindingIdSchema,
  primaryCategoryId: categoryIdSchema,
}).strict();

const guideResourceSchema = resourceBaseSchema.extend({
  type: z.literal("guide"),
}).strict();

export const resourceSchema = z.discriminatedUnion("type", [
  websiteResourceSchema,
  toolResourceSchema,
  guideResourceSchema,
]).superRefine((value, context) => {
  const expectedPrefix = `res_${value.type}_`;
  if (!value.id.startsWith(expectedPrefix)) {
    context.addIssue({
      code: "custom",
      path: ["id"],
      message: `id must start with ${expectedPrefix} for ${value.type} resources`,
    });
  }
});

export type Resource = z.infer<typeof resourceSchema>;

const nonEmptyText = (fieldName: string) => z.string()
  .trim()
  .min(1, `${fieldName} is required`);

export const resourceLocaleSchema = z.object({
  resourceId: catalogIdSchema,
  locale: z.enum(LocaleCode),
  name: nonEmptyText("name"),
  summary: nonEmptyText("summary"),
  seoTitle: nonEmptyText("seoTitle"),
  seoDescription: nonEmptyText("seoDescription"),
  searchAliases: z.array(nonEmptyText("searchAliases item")).default([]),
  searchKeywords: z.array(nonEmptyText("searchKeywords item")).default([]),
}).strict();

export type ResourceLocale = z.infer<typeof resourceLocaleSchema>;

export const resourceLocaleSetSchema = z.array(resourceLocaleSchema)
  .superRefine((records, context) => {
    const seen = new Set<string>();
    for (const [index, record] of records.entries()) {
      if (seen.has(record.locale)) {
        context.addIssue({
          code: "custom",
          path: [index, "locale"],
          message: `duplicate locale: ${record.locale}`,
        });
      }
      seen.add(record.locale);
    }

    for (const locale of LocaleCode) {
      if (!seen.has(locale)) {
        context.addIssue({
          code: "custom",
          path: [],
          message: `missing required locale: ${locale}`,
        });
      }
    }
  });
