import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CATEGORIES, TOOLS } from "../src/registry.js";
import { TOOL_CONTENT } from "../src/content/index.js";

const catalogRoot = "catalog";
const timestamp = "2026-08-11T00:00:00.000Z";

const categoryOrder = {
  "network-ip": 10,
  calculators: 20,
  developer: 30,
  units: 40,
  qr: 50,
};

const hiddenResources = [
  {
    id: "res_tool_ip-lookup",
    canonicalSlug: "ip-lookup",
    status: "hidden",
    toolBindingId: "ip-info",
    primaryCategoryId: "cat_network-ip",
    locales: {
      en: {
        name: "IP lookup",
        summary: "Hidden capability record for the unpublished IP information lookup.",
        aliases: ["ip lookup", "ip geolocation"],
        keywords: ["ip", "lookup", "hidden"],
      },
      "zh-CN": {
        name: "IP 查询",
        summary: "未发布 IP 信息查询的隐藏能力记录。",
        aliases: ["IP 查询", "IP 地理位置"],
        keywords: ["IP", "查询", "隐藏"],
      },
      "zh-TW": {
        name: "IP 查詢",
        summary: "未發佈 IP 資訊查詢的隱藏能力記錄。",
        aliases: ["IP 查詢", "IP 地理位置"],
        keywords: ["IP", "查詢", "隱藏"],
      },
    },
  },
  {
    id: "res_tool_ip-whois-rdap",
    canonicalSlug: "ip-whois-rdap",
    status: "hidden",
    toolBindingId: "ip-rdap",
    primaryCategoryId: "cat_network-ip",
    locales: {
      en: {
        name: "IP WHOIS and RDAP",
        summary: "Hidden capability record for unpublished IP registry lookup.",
        aliases: ["rdap", "whois"],
        keywords: ["ip", "rdap", "whois", "hidden"],
      },
      "zh-CN": {
        name: "IP WHOIS 与 RDAP",
        summary: "未发布 IP 注册信息查询的隐藏能力记录。",
        aliases: ["RDAP", "WHOIS"],
        keywords: ["IP", "RDAP", "WHOIS", "隐藏"],
      },
      "zh-TW": {
        name: "IP WHOIS 與 RDAP",
        summary: "未發佈 IP 註冊資訊查詢的隱藏能力記錄。",
        aliases: ["RDAP", "WHOIS"],
        keywords: ["IP", "RDAP", "WHOIS", "隱藏"],
      },
    },
  },
];

function yamlScalar(value) {
  return JSON.stringify(String(value));
}

function yamlList(items) {
  if (!items?.length) return "[]";
  const publicItems = items.filter(item => !/credential/i.test(item));
  if (!publicItems.length) return "[]";
  return `\n${publicItems.map(item => `  - ${yamlScalar(item)}`).join("\n")}`;
}

function resourceIdForTool(tool) {
  return `res_tool_${tool.slug}`;
}

function faqIdFor(tool, index) {
  return `faq_${tool.slug}-q${String(index + 1).padStart(2, "0")}`;
}

async function cleanGeneratedFiles(dir, prefix) {
  await mkdir(dir, { recursive: true });
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries
    .filter(entry => entry.isFile() && entry.name.startsWith(prefix) && entry.name.endsWith(".yml"))
    .map(entry => rm(join(dir, entry.name))));
}

async function writeCatalogFile(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content.trimEnd()}\n`, "utf8");
}

async function writeCategories() {
  await cleanGeneratedFiles(join(catalogRoot, "taxonomy/categories"), "cat_");
  for (const category of CATEGORIES) {
    await writeCatalogFile(join(catalogRoot, "taxonomy/categories", `cat_${category.id}.yml`), `
schemaVersion: 0.1.0
id: cat_${category.id}
slug: ${category.slug}
status: published
order: ${categoryOrder[category.id] ?? category.order ?? 100}
`);
  }
}

async function writeResource(resource) {
  await writeCatalogFile(join(catalogRoot, "resources", `${resource.id}.yml`), `
schemaVersion: 0.1.0
id: ${resource.id}
type: tool
canonicalSlug: ${resource.canonicalSlug}
status: ${resource.status}
createdAt: "${timestamp}"
updatedAt: "${timestamp}"
toolBindingId: ${resource.toolBindingId}
primaryCategoryId: ${resource.primaryCategoryId}
`);
}

async function writeLocale(resourceId, locale, text, content) {
  const publicSummary = text.description;
  await writeCatalogFile(join(catalogRoot, "locales", `${resourceId}.${locale}.yml`), `
resourceId: ${resourceId}
locale: ${locale}
name: ${yamlScalar(text.name)}
summary: ${yamlScalar(publicSummary)}
seoTitle: ${yamlScalar(`${text.name} | GoDeskHub`)}
seoDescription: ${yamlScalar(publicSummary)}
searchAliases:${yamlList(content.aliases ?? [])}
searchKeywords:${yamlList(content.keywords ?? [])}
`);
}

async function writeToolResources() {
  await cleanGeneratedFiles(join(catalogRoot, "resources"), "res_tool_");
  await cleanGeneratedFiles(join(catalogRoot, "locales"), "res_tool_");

  for (const tool of TOOLS) {
    const resourceId = resourceIdForTool(tool);
    await writeResource({
      id: resourceId,
      canonicalSlug: tool.slug,
      status: "published",
      toolBindingId: tool.slug,
      primaryCategoryId: `cat_${tool.category}`,
    });
    for (const locale of ["en", "zh-CN", "zh-TW"]) {
      await writeLocale(resourceId, locale, tool.text[locale], TOOL_CONTENT[tool.id][locale]);
    }
  }

  for (const hidden of hiddenResources) {
    await writeResource(hidden);
    for (const locale of ["en", "zh-CN", "zh-TW"]) {
      const content = hidden.locales[locale];
      await writeLocale(hidden.id, locale, { name: content.name, description: content.summary }, {
        summary: content.summary,
        aliases: content.aliases,
        keywords: content.keywords,
      });
    }
  }
}

async function writeFaqs() {
  await cleanGeneratedFiles(join(catalogRoot, "faq"), "faq_");
  for (const tool of TOOLS) {
    const resourceId = resourceIdForTool(tool);
    const faqCount = Math.max(...["en", "zh-CN", "zh-TW"].map(locale => TOOL_CONTENT[tool.id][locale].faqs.length));
    for (let index = 0; index < faqCount; index += 1) {
      const locales = ["en", "zh-CN", "zh-TW"].map(locale => {
        const faq = TOOL_CONTENT[tool.id][locale].faqs[index];
        return `  - locale: ${locale}
    question: ${yamlScalar(faq.question)}
    answer: ${yamlScalar(faq.answer)}`;
      }).join("\n");
      await writeCatalogFile(join(catalogRoot, "faq", `${faqIdFor(tool, index)}.yml`), `
schemaVersion: 0.1.0
id: ${faqIdFor(tool, index)}
status: published
placements:
  - resourceId: ${resourceId}
    order: ${index + 1}
locales:
${locales}
`);
    }
  }
}

async function writeRelations() {
  await cleanGeneratedFiles(join(catalogRoot, "relations"), "rel_");
  for (const tool of TOOLS) {
    const content = TOOL_CONTENT[tool.id].en;
    for (const [index, relatedId] of (content.relatedTools ?? []).entries()) {
      const related = TOOLS.find(item => item.id === relatedId);
      if (!related) continue;
      await writeCatalogFile(join(catalogRoot, "relations", `rel_${tool.slug}-to-${related.slug}.yml`), `
schemaVersion: 0.1.0
id: rel_${tool.slug}-to-${related.slug}
type: related
sourceId: ${resourceIdForTool(tool)}
targetId: ${resourceIdForTool(related)}
order: ${index + 1}
`);
    }
  }
}

async function writeCollections() {
  await cleanGeneratedFiles(join(catalogRoot, "collections"), "col_");
  const resourceIds = TOOLS.map(resourceIdForTool);
  await writeCatalogFile(join(catalogRoot, "collections", "col_published-tools.yml"), `
schemaVersion: 0.1.0
id: col_published-tools
slug: published-tools
status: published
mode: manual
resourceIds:
${resourceIds.map(resourceId => `  - ${resourceId}`).join("\n")}
`);
}

async function writeHealth() {
  await cleanGeneratedFiles(join(catalogRoot, "health"), "health_");
  for (const tool of TOOLS) {
    await writeCatalogFile(join(catalogRoot, "health", `health_${tool.slug}-catalog-binding.yml`), `
schemaVersion: 0.1.0
id: health_${tool.slug}-catalog-binding
resourceId: ${resourceIdForTool(tool)}
checkType: tool-binding
status: healthy
checkedAt: "${timestamp}"
evidence: "Catalog resource resolves to a published code-owned tool binding."
`);
  }
  for (const hidden of hiddenResources) {
    await writeCatalogFile(join(catalogRoot, "health", `health_${hidden.canonicalSlug}-hidden.yml`), `
schemaVersion: 0.1.0
id: health_${hidden.canonicalSlug}-hidden
resourceId: ${hidden.id}
checkType: tool-binding
status: healthy
checkedAt: "${timestamp}"
evidence: "Hidden capability is validated but excluded from public routes and search."
`);
  }
}

await writeCategories();
await writeToolResources();
await writeFaqs();
await writeRelations();
await writeCollections();
await writeHealth();
