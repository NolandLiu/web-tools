export const CatalogLayoutSection = [
  "resources",
  "categories",
  "tags",
  "collections",
  "locales",
  "faq",
  "relations",
  "health",
] as const;

export type CatalogLayoutSectionName = typeof CatalogLayoutSection[number];

export type CatalogLayoutLocale = "en" | "zh-CN" | "zh-TW";

export interface CatalogPathClassification {
  section: CatalogLayoutSectionName;
  authorityId: string;
  locale: CatalogLayoutLocale | null;
}

interface CatalogPathPattern {
  section: CatalogLayoutSectionName;
  pattern: RegExp;
}

const catalogPathPatterns: CatalogPathPattern[] = [
  {
    section: "resources",
    pattern: /^resources\/(res_(?:website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "categories",
    pattern: /^taxonomy\/categories\/(cat_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "tags",
    pattern: /^taxonomy\/tags\/(tag_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "collections",
    pattern: /^collections\/(col_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "faq",
    pattern: /^faq\/(faq_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "relations",
    pattern: /^relations\/(rel_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "health",
    pattern: /^health\/(health_[a-z0-9]+(?:-[a-z0-9]+)*)\.ya?ml$/,
  },
  {
    section: "locales",
    pattern: /^locales\/((?:res_(?:website|tool|guide)|cat|tag|col|faq)_[a-z0-9]+(?:-[a-z0-9]+)*)\.(en|zh-CN|zh-TW)\.ya?ml$/,
  },
];

function normalizeCatalogPath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^catalog\//, "");
}

function isIgnorableCatalogPath(path: string): boolean {
  if (path === "README.md" || path.endsWith("/README.md")) {
    return true;
  }

  return path.split("/").some((part) => part.startsWith("."));
}

export function classifyCatalogPath(path: string): CatalogPathClassification | null {
  const normalizedPath = normalizeCatalogPath(path);

  if (isIgnorableCatalogPath(normalizedPath)) {
    return null;
  }

  for (const { section, pattern } of catalogPathPatterns) {
    const match = normalizedPath.match(pattern);
    if (!match) {
      continue;
    }
    const authorityId = match[1];
    if (!authorityId) {
      throw new Error(`unknown Catalog path: ${path}`);
    }

    return {
      section,
      authorityId,
      locale: section === "locales" ? match[2] as CatalogLayoutLocale : null,
    };
  }

  if (normalizedPath.endsWith(".yml") || normalizedPath.endsWith(".yaml")) {
    throw new Error(`unknown Catalog path: ${path}`);
  }

  return null;
}

export function validateCatalogLayoutPaths(paths: string[]): CatalogPathClassification[] {
  const classifications: CatalogPathClassification[] = [];
  const seenAuthorityFiles = new Map<string, string>();

  for (const path of paths) {
    const classification = classifyCatalogPath(path);
    if (!classification) {
      continue;
    }

    const key = classification.locale
      ? `${classification.section}:${classification.authorityId}:${classification.locale}`
      : `${classification.section}:${classification.authorityId}`;

    const existingPath = seenAuthorityFiles.get(key);
    if (existingPath) {
      throw new Error(`duplicate authority file: ${classification.authorityId} in ${existingPath} and ${path}`);
    }

    seenAuthorityFiles.set(key, path);
    classifications.push(classification);
  }

  return classifications;
}
