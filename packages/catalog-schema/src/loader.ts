import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { parseDocument } from "yaml";
import type { ZodIssue, ZodType } from "zod";

import { classifyCatalogPath, validateCatalogLayoutPaths } from "./layout.js";
import { resourceLocaleSchema, resourceSchema } from "./resource.js";
import type { Resource, ResourceLocale } from "./resource.js";
import { categorySchema, collectionSchema, tagSchema } from "./taxonomy.js";
import type { Category, Collection, Tag } from "./taxonomy.js";
import { faqSchema, healthSchema, relationSchema } from "./support.js";
import type { FAQ, ResourceHealth, ResourceRelation } from "./support.js";

export type CatalogDiagnosticCode =
  | "layout-error"
  | "read-error"
  | "yaml-parse-error"
  | "schema-error";

export interface CatalogDiagnostic {
  code: CatalogDiagnosticCode;
  sourcePath: string;
  path: string;
  message: string;
}

export interface LoadedCatalogRecords {
  categories: Category[];
  collections: Collection[];
  faqs: FAQ[];
  health: ResourceHealth[];
  locales: ResourceLocale[];
  relations: ResourceRelation[];
  resources: Resource[];
  tags: Tag[];
}

export interface LoadedCatalogRecordSources {
  resources: Array<{ id: string; sourcePath: string }>;
  categories: Array<{ id: string; sourcePath: string }>;
  tags: Array<{ id: string; sourcePath: string }>;
  collections: Array<{ id: string; sourcePath: string }>;
  locales: Array<{ resourceId: string; locale: string; sourcePath: string }>;
  faqs: Array<{ id: string; sourcePath: string }>;
  relations: Array<{ id: string; sourcePath: string }>;
  health: Array<{ id: string; sourcePath: string }>;
}

export interface LoadedCatalog {
  ok: boolean;
  records: LoadedCatalogRecords;
  sources: Record<string, string>;
  recordSources: LoadedCatalogRecordSources;
  diagnostics: CatalogDiagnostic[];
}

export interface LoadCatalogOptions {
  rootDir: string;
}

const emptyRecords = (): LoadedCatalogRecords => ({
  categories: [],
  collections: [],
  faqs: [],
  health: [],
  locales: [],
  relations: [],
  resources: [],
  tags: [],
});

const emptyRecordSources = (): LoadedCatalogRecordSources => ({
  resources: [],
  categories: [],
  tags: [],
  collections: [],
  locales: [],
  faqs: [],
  relations: [],
  health: [],
});

function toCatalogPath(rootDir: string, absolutePath: string): string {
  return relative(rootDir, absolutePath).replaceAll("\\", "/");
}

async function discoverFiles(rootDir: string, currentDir = rootDir): Promise<string[]> {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await discoverFiles(rootDir, absolutePath));
      continue;
    }

    if (entry.isFile()) {
      files.push(toCatalogPath(rootDir, absolutePath));
    }
  }

  return files.sort((left, right) => left.localeCompare(right, "en"));
}

function issuePath(issue: ZodIssue): string {
  if (issue.path.length === 0) {
    return "$";
  }

  return issue.path.map(String).join(".");
}

function addSchemaDiagnostics(
  diagnostics: CatalogDiagnostic[],
  sourcePath: string,
  issues: ZodIssue[],
): void {
  for (const issue of issues) {
    diagnostics.push({
      code: "schema-error",
      sourcePath,
      path: issuePath(issue),
      message: issue.message,
    });
  }
}

function sortById<T extends { id: string }>(records: T[]): T[] {
  return [...records].sort((left, right) => left.id.localeCompare(right.id, "en"));
}

function parseRecord<T>(
  schema: ZodType<T>,
  value: unknown,
  sourcePath: string,
  diagnostics: CatalogDiagnostic[],
): T | null {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    addSchemaDiagnostics(diagnostics, sourcePath, parsed.error.issues);
    return null;
  }

  return parsed.data;
}

export async function loadCatalog(options: LoadCatalogOptions): Promise<LoadedCatalog> {
  const records = emptyRecords();
  const sources: Record<string, string> = {};
  const recordSources = emptyRecordSources();
  const diagnostics: CatalogDiagnostic[] = [];
  let paths: string[];

  try {
    paths = await discoverFiles(options.rootDir);
    validateCatalogLayoutPaths(paths);
  } catch (error) {
    diagnostics.push({
      code: "layout-error",
      sourcePath: ".",
      path: "$",
      message: error instanceof Error ? error.message : "Catalog layout error",
    });
    return {
      ok: false,
      records,
      sources,
      recordSources,
      diagnostics,
    };
  }

  for (const sourcePath of paths) {
    const classification = classifyCatalogPath(sourcePath);
    if (!classification) {
      continue;
    }

    let sourceText: string;
    try {
      sourceText = await readFile(join(options.rootDir, sourcePath), "utf8");
    } catch {
      diagnostics.push({
        code: "read-error",
        sourcePath,
        path: "$",
        message: "Could not read Catalog file",
      });
      continue;
    }

    const document = parseDocument(sourceText, {
      prettyErrors: false,
      strict: true,
    });
    if (document.errors.length > 0) {
      diagnostics.push({
        code: "yaml-parse-error",
        sourcePath,
        path: "$",
        message: document.errors[0]?.message ?? "Invalid YAML",
      });
      continue;
    }

    const value = document.toJSON();
    switch (classification.section) {
      case "resources": {
        const record = parseRecord(resourceSchema, value, sourcePath, diagnostics);
        if (record) {
          records.resources.push(record);
          sources[`resource:${record.id}`] = sourcePath;
          recordSources.resources.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "categories": {
        const record = parseRecord(categorySchema, value, sourcePath, diagnostics);
        if (record) {
          records.categories.push(record);
          sources[`category:${record.id}`] = sourcePath;
          recordSources.categories.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "tags": {
        const record = parseRecord(tagSchema, value, sourcePath, diagnostics);
        if (record) {
          records.tags.push(record);
          sources[`tag:${record.id}`] = sourcePath;
          recordSources.tags.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "collections": {
        const record = parseRecord(collectionSchema, value, sourcePath, diagnostics);
        if (record) {
          records.collections.push(record);
          sources[`collection:${record.id}`] = sourcePath;
          recordSources.collections.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "locales": {
        const record = parseRecord(resourceLocaleSchema, value, sourcePath, diagnostics);
        if (record) {
          records.locales.push(record);
          sources[`locale:${record.resourceId}:${record.locale}`] = sourcePath;
          recordSources.locales.push({ resourceId: record.resourceId, locale: record.locale, sourcePath });
        }
        break;
      }
      case "faq": {
        const record = parseRecord(faqSchema, value, sourcePath, diagnostics);
        if (record) {
          records.faqs.push(record);
          sources[`faq:${record.id}`] = sourcePath;
          recordSources.faqs.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "relations": {
        const record = parseRecord(relationSchema, value, sourcePath, diagnostics);
        if (record) {
          records.relations.push(record);
          sources[`relation:${record.id}`] = sourcePath;
          recordSources.relations.push({ id: record.id, sourcePath });
        }
        break;
      }
      case "health": {
        const record = parseRecord(healthSchema, value, sourcePath, diagnostics);
        if (record) {
          records.health.push(record);
          sources[`health:${record.id}`] = sourcePath;
          recordSources.health.push({ id: record.id, sourcePath });
        }
        break;
      }
    }
  }

  return {
    ok: diagnostics.length === 0,
    records: {
      categories: sortById(records.categories),
      collections: sortById(records.collections),
      faqs: sortById(records.faqs),
      health: sortById(records.health),
      locales: [...records.locales].sort((left, right) => {
        const idOrder = left.resourceId.localeCompare(right.resourceId, "en");
        return idOrder === 0 ? left.locale.localeCompare(right.locale, "en") : idOrder;
      }),
      relations: sortById(records.relations),
      resources: sortById(records.resources),
      tags: sortById(records.tags),
    },
    sources,
    recordSources,
    diagnostics,
  };
}
