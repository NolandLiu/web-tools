import {
  CATEGORIES,
  DEFAULT_LANG,
  INFO_PAGES,
  LANGUAGES,
  TOOLS,
} from "../registry.js";

const languageByPath = new Map(LANGUAGES.map(language => [language.path, language]));
const languageById = new Map(LANGUAGES.map(language => [language.id, language]));
const toolBySlug = new Map(TOOLS.map(tool => [tool.slug, tool]));
const toolById = new Map(TOOLS.map(tool => [tool.id, tool]));
const categoryBySlug = new Map(CATEGORIES.map(category => [category.slug, category]));
const categoryById = new Map(CATEGORIES.map(category => [category.id, category]));
const infoBySlug = new Map(INFO_PAGES.map(page => [page.slug, page]));
const infoById = new Map(INFO_PAGES.map(page => [page.id, page]));

export const LEGACY_TOOL_REDIRECTS = {
  "ipv4-subnet-calculator": { toolId: "ipv4-network", anchor: "subnet" },
  "ip-range-cidr-converter": { toolId: "ipv4-network", anchor: "range-cidr" },
  "ip-address-converter": { toolId: "ipv4-network", anchor: "ipv4-converter" },
  "ipv6-address-tool": { toolId: "ipv6-toolbox", anchor: "ipv6-normalize" },
  "ip-lookup": { toolId: "ip-info", anchor: "ip-lookup" },
  "ip-whois-rdap": { toolId: "ip-info", anchor: "ip-rdap" },
};

export function parsePath(pathname) {
  const segments = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const language = languageByPath.get(segments[0]?.toLowerCase());
  if (!language) return { kind: "not-found", lang: DEFAULT_LANG };
  const lang = language.id;
  if (segments.length === 1) return { kind: "home", lang };
  if (segments.length === 2) {
    const page = infoBySlug.get(segments[1]);
    return page
      ? { kind: "info", lang, page: page.id }
      : { kind: "not-found", lang };
  }
  if (segments.length === 3 && segments[1] === "tools") {
    const tool = toolBySlug.get(segments[2]);
    return tool
      ? { kind: "tool", lang, toolId: tool.id }
      : { kind: "not-found", lang };
  }
  if (segments.length === 3 && segments[1] === "categories") {
    const category = categoryBySlug.get(segments[2]);
    return category
      ? { kind: "category", lang, categoryId: category.id }
      : { kind: "not-found", lang };
  }
  return { kind: "not-found", lang };
}

export function buildPath(route) {
  const language = languageById.get(route.lang) ?? languageById.get(DEFAULT_LANG);
  const prefix = `/${language.path}`;
  if (route.kind === "home") return `${prefix}/`;
  if (route.kind === "tool") {
    const tool = toolById.get(route.toolId);
    if (!tool) return `${prefix}/404`;
    return `${prefix}/tools/${tool.slug}`;
  }
  if (route.kind === "category") {
    const category = categoryById.get(route.categoryId);
    if (!category) return `${prefix}/404`;
    return `${prefix}/categories/${category.slug}`;
  }
  if (route.kind === "info") {
    const page = infoById.get(route.page);
    if (!page) return `${prefix}/404`;
    return `${prefix}/${page.slug}`;
  }
  return `${prefix}/404`;
}

export function switchRouteLanguage(route, lang) {
  return { ...route, lang: languageById.has(lang) ? lang : DEFAULT_LANG };
}

export function listCanonicalRoutes() {
  return LANGUAGES.flatMap(({ id: lang }) => [
    { kind: "home", lang },
    ...TOOLS.map(tool => ({ kind: "tool", lang, toolId: tool.id })),
    ...CATEGORIES.map(category => ({ kind: "category", lang, categoryId: category.id })),
    ...INFO_PAGES.map(page => ({ kind: "info", lang, page: page.id })),
  ]);
}

export function listLegacyRedirects() {
  return LANGUAGES.flatMap(language => Object.entries(LEGACY_TOOL_REDIRECTS).map(([legacySlug, redirect]) => ({
    from: `/${language.path}/tools/${legacySlug}`,
    to: `${buildPath({ kind: "tool", lang: language.id, toolId: redirect.toolId })}#${redirect.anchor}`,
    status: 301,
  })));
}
