import { z } from "zod";

import { PublicationStatus } from "./resource.js";
import { CATALOG_SCHEMA_VERSION } from "./version.js";

const slugSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "slug must use lowercase ASCII words separated by hyphens",
);

const categoryIdSchema = z.string().regex(
  /^cat_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "category id must use a cat_ prefix",
);

const tagIdSchema = z.string().regex(
  /^tag_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "tag id must use a tag_ prefix",
);

const collectionIdSchema = z.string().regex(
  /^col_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "collection id must use a col_ prefix",
);

const resourceIdSchema = z.string().regex(
  /^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$|^res_ai-skill-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "resource id must use a res_ prefix",
);

const baseTaxonomyRecord = {
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  slug: slugSchema,
  status: z.enum(PublicationStatus),
};

export const categorySchema = z.object({
  ...baseTaxonomyRecord,
  id: categoryIdSchema,
  parentId: categoryIdSchema.optional(),
  order: z.number().int().min(0),
}).strict();

export type Category = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  ...baseTaxonomyRecord,
  id: tagIdSchema,
}).strict();

export type Tag = z.infer<typeof tagSchema>;

const collectionRuleSchema = z.object({
  field: z.enum(["tagId", "categoryId", "resourceType"]),
  operator: z.literal("equals"),
  value: z.string().min(1),
}).strict();

const manualCollectionSchema = z.object({
  ...baseTaxonomyRecord,
  id: collectionIdSchema,
  mode: z.literal("manual"),
  resourceIds: z.array(resourceIdSchema).min(1),
}).strict();

const automaticCollectionSchema = z.object({
  ...baseTaxonomyRecord,
  id: collectionIdSchema,
  mode: z.literal("automatic"),
  rules: z.array(collectionRuleSchema).min(1),
}).strict();

const hybridCollectionSchema = z.object({
  ...baseTaxonomyRecord,
  id: collectionIdSchema,
  mode: z.literal("hybrid"),
  resourceIds: z.array(resourceIdSchema).min(1),
  rules: z.array(collectionRuleSchema).min(1),
}).strict();

export const collectionSchema = z.discriminatedUnion("mode", [
  manualCollectionSchema,
  automaticCollectionSchema,
  hybridCollectionSchema,
]).superRefine((value, context) => {
  if ("resourceIds" in value) {
    const seen = new Set<string>();
    for (const [index, resourceId] of value.resourceIds.entries()) {
      if (seen.has(resourceId)) {
        context.addIssue({
          code: "custom",
          path: ["resourceIds", index],
          message: `duplicate resourceIds entry: ${resourceId}`,
        });
      }
      seen.add(resourceId);
    }
  }
});

export type Collection = z.infer<typeof collectionSchema>;

const MAX_CATEGORY_DEPTH = 3;

export const categorySetSchema = z.array(categorySchema)
  .superRefine((categories, context) => {
    const byId = new Map<string, Category>();
    for (const [index, category] of categories.entries()) {
      if (byId.has(category.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `duplicate category id: ${category.id}`,
        });
      }
      byId.set(category.id, category);
    }

    for (const [index, category] of categories.entries()) {
      if (category.parentId && !byId.has(category.parentId)) {
        context.addIssue({
          code: "custom",
          path: [index, "parentId"],
          message: `unknown parentId: ${category.parentId}`,
        });
      }
    }

    for (const [index, category] of categories.entries()) {
      const path = new Set<string>();
      let current: Category | undefined = category;
      let depth = 0;

      while (current) {
        depth += 1;
        if (path.has(current.id)) {
          context.addIssue({
            code: "custom",
            path: [index, "parentId"],
            message: `category hierarchy cycle detected at ${current.id}`,
          });
          break;
        }
        path.add(current.id);

        if (depth > MAX_CATEGORY_DEPTH) {
          context.addIssue({
            code: "custom",
            path: [index, "parentId"],
            message: `maximum category depth is ${MAX_CATEGORY_DEPTH}`,
          });
          break;
        }

        current = current.parentId ? byId.get(current.parentId) : undefined;
      }
    }
  });
