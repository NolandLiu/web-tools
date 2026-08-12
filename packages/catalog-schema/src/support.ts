import { z } from "zod";

import { LocaleCode, PublicationStatus } from "./resource.js";
import { CATALOG_SCHEMA_VERSION } from "./version.js";

export const RelationType = ["related", "alternative", "prerequisite", "successor", "replaces"] as const;
export const HealthStatus = ["unknown", "healthy", "warning", "failing"] as const;

const resourceIdSchema = z.string().regex(
  /^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$|^res_ai-skill-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "resource id must use a res_ prefix",
);

const faqIdSchema = z.string().regex(
  /^faq_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "FAQ id must use a faq_ prefix",
);

const relationIdSchema = z.string().regex(
  /^rel_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "relation id must use a rel_ prefix",
);

const healthIdSchema = z.string().regex(
  /^health_[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "health id must use a health_ prefix",
);

const httpsUrlSchema = z.string()
  .url("evidenceUrl must be a valid URL")
  .refine((value) => new URL(value).protocol === "https:", {
    message: "evidenceUrl must use HTTPS",
  });

const nonEmptyText = (fieldName: string) => z.string()
  .trim()
  .min(1, `${fieldName} is required`);

const faqLocaleSchema = z.object({
  locale: z.enum(LocaleCode),
  question: nonEmptyText("question"),
  answer: nonEmptyText("answer"),
}).strict();

export const faqSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: faqIdSchema,
  status: z.enum(PublicationStatus),
  placements: z.array(z.object({
    resourceId: resourceIdSchema,
    order: z.number().int().min(0),
  }).strict()).min(1),
  locales: z.array(faqLocaleSchema),
}).strict().superRefine((value, context) => {
  const placementIds = new Set<string>();
  for (const [index, placement] of value.placements.entries()) {
    if (placementIds.has(placement.resourceId)) {
      context.addIssue({
        code: "custom",
        path: ["placements", index, "resourceId"],
        message: `duplicate FAQ placement: ${placement.resourceId}`,
      });
    }
    placementIds.add(placement.resourceId);
  }

  const locales = new Set(value.locales.map((locale) => locale.locale));
  for (const locale of LocaleCode) {
    if (!locales.has(locale)) {
      context.addIssue({
        code: "custom",
        path: ["locales"],
        message: `missing required locale: ${locale}`,
      });
    }
  }
});

export type FAQ = z.infer<typeof faqSchema>;

export const relationSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: relationIdSchema,
  type: z.enum(RelationType),
  sourceId: resourceIdSchema,
  targetId: resourceIdSchema,
  order: z.number().int().min(0).optional(),
}).strict().superRefine((value, context) => {
  if (value.sourceId === value.targetId) {
    context.addIssue({
      code: "custom",
      path: ["targetId"],
      message: "relation cannot use self-reference",
    });
  }
});

export type ResourceRelation = z.infer<typeof relationSchema>;

const secretLikeEvidencePattern = /(?:API_KEY|TOKEN|SECRET|Authorization|Bearer|account_id|credential|password)/i;

export const healthSchema = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  id: healthIdSchema,
  resourceId: resourceIdSchema,
  checkType: z.enum([
    "external-link",
    "tool-binding",
    "locale-completeness",
    "content-review",
    "seo-completeness",
    "relation-integrity",
    "built-route",
  ]),
  status: z.enum(HealthStatus),
  checkedAt: z.string().datetime({ offset: true }),
  evidence: nonEmptyText("evidence").optional(),
  evidenceUrl: httpsUrlSchema.optional(),
}).strict().superRefine((value, context) => {
  if (value.evidence && secretLikeEvidencePattern.test(value.evidence)) {
    context.addIssue({
      code: "custom",
      path: ["evidence"],
      message: "health record contains secret-like evidence",
    });
  }
});

export type ResourceHealth = z.infer<typeof healthSchema>;
