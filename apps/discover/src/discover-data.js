import catalogArtifact from "../../../catalog/artifacts/catalog.normalized.v1.mjs";

export const DISCOVER_ORIGIN = "https://godeskhub.com";
export const TOOLS_ORIGIN = "https://tools.godeskhub.com";

export const locales = [
  { locale: "en", segment: "en", label: "English", htmlLang: "en" },
  { locale: "zh-CN", segment: "zh-cn", label: "简体中文", htmlLang: "zh-CN" },
  { locale: "zh-TW", segment: "zh-tw", label: "繁體中文", htmlLang: "zh-TW" },
];

export const defaultLocale = "en";

export const routeModelFields = ["locale", "resourceType", "slug", "categorySlug", "tagSlug"];

const categoryLabels = {
  en: {
    "calculators": ["Calculators", "Finance, dates, percentages, and everyday planning."],
    "developer-tools": ["Developer", "Format, encode, inspect, and debug local data."],
    "network-ip": ["Network", "IPv4, IPv6, subnet, mask, and range utilities."],
    "qr-code": ["QR code", "Create and tune QR codes in the browser."],
    "unit-converters": ["Converters", "Convert common units without sending input away."],
  },
  "zh-CN": {
    "calculators": ["计算器", "金融、日期、百分比和日常规划。"],
    "developer-tools": ["开发工具", "本地格式化、编码、检查和调试数据。"],
    "network-ip": ["网络", "IPv4、IPv6、子网、掩码和范围工具。"],
    "qr-code": ["二维码", "在浏览器中生成和调整二维码。"],
    "unit-converters": ["单位转换", "常用单位换算，不上传输入内容。"],
  },
  "zh-TW": {
    "calculators": ["計算器", "金融、日期、百分比和日常規劃。"],
    "developer-tools": ["開發工具", "本機格式化、編碼、檢查和除錯資料。"],
    "network-ip": ["網絡", "IPv4、IPv6、子網、遮罩和範圍工具。"],
    "qr-code": ["QR Code", "在瀏覽器中產生和調整 QR Code。"],
    "unit-converters": ["單位轉換", "常用單位換算，不上傳輸入內容。"],
  },
};

const tagLabels = {
  en: {
    finance: "Finance",
    network: "Network",
    private: "Private",
  },
  "zh-CN": {
    finance: "金融",
    network: "网络",
    private: "隐私",
  },
  "zh-TW": {
    finance: "金融",
    network: "網絡",
    private: "隱私",
  },
};

export const messages = {
  en: {
    htmlLang: "en",
    nav: { tools: "Tools", websites: "Websites", guides: "Guides", collections: "Collections" },
    footer: { about: "About", contact: "Contact", privacy: "Privacy", terms: "Terms" },
    heroTitle: "Find the right tool without giving up your data",
    heroSubtitle: "Discover privacy-first tools, useful websites, and practical guides. Everything in one place.",
    searchPlaceholder: "Search tools, websites, guides...",
    searchButton: "Search",
    featured: "Featured picks",
    featuredText: "Handpicked resources to help you work smarter.",
    browse: "Browse by category",
    recently: "Recently added",
    openTool: "Open tool",
    details: "Details",
    external: "External website",
    empty: "No published resources in this section yet.",
    source: "Shared Catalog artifact",
    resources: "Published resources",
    browseIntro: {
      tool: "Privacy-first tools that run in your browser whenever possible.",
      website: "Reliable web references and practical resources worth bookmarking.",
      guide: "Short guides that explain common workflows without filler.",
      collection: "Curated sets of resources grouped around a practical goal.",
      default: "Browse published resources from the shared Catalog.",
    },
    resourceCounts: { tool: "tools", website: "websites", guide: "guides", collection: "collections", default: "resources" },
  },
  "zh-CN": {
    htmlLang: "zh-CN",
    nav: { tools: "工具", websites: "网站", guides: "指南", collections: "集合" },
    footer: { about: "关于", contact: "联系", privacy: "隐私", terms: "条款" },
    heroTitle: "快速找到合适工具，同时保留数据隐私",
    heroSubtitle: "发现注重隐私的工具、实用网站和操作指南。集中查找，不上传你的内容。",
    searchPlaceholder: "搜索工具、网站、指南……",
    searchButton: "搜索",
    featured: "精选资源",
    featuredText: "帮助你更高效完成工作的资源。",
    browse: "按分类浏览",
    recently: "最近添加",
    openTool: "打开工具",
    details: "详情",
    external: "外部网站",
    empty: "此部分暂时没有已发布资源。",
    source: "Shared Catalog artifact",
    resources: "已发布资源",
    browseIntro: {
      tool: "优先收录尽量在浏览器本地运行的隐私友好工具。",
      website: "值得收藏的可靠网页资料与实用资源。",
      guide: "用简洁语言解释常见工作流，不堆砌空话。",
      collection: "围绕具体目标整理的一组相关资源。",
      default: "浏览 Shared Catalog 中已发布的公开资源。",
    },
    resourceCounts: { tool: "个工具", website: "个网站", guide: "篇指南", collection: "个集合", default: "个资源" },
  },
  "zh-TW": {
    htmlLang: "zh-TW",
    nav: { tools: "工具", websites: "網站", guides: "指南", collections: "集合" },
    footer: { about: "關於", contact: "聯絡", privacy: "隱私", terms: "條款" },
    heroTitle: "快速找到合適工具，同時保留資料隱私",
    heroSubtitle: "發現重視隱私的工具、實用網站和操作指南。集中查找，不上傳你的內容。",
    searchPlaceholder: "搜尋工具、網站、指南……",
    searchButton: "搜尋",
    featured: "精選資源",
    featuredText: "協助你更高效完成工作的資源。",
    browse: "按分類瀏覽",
    recently: "最近加入",
    openTool: "開啟工具",
    details: "詳情",
    external: "外部網站",
    empty: "此部分暫時沒有已發布資源。",
    source: "Shared Catalog artifact",
    resources: "已發布資源",
    browseIntro: {
      tool: "優先收錄盡量在瀏覽器本機執行的隱私友善工具。",
      website: "值得收藏的可靠網頁資料與實用資源。",
      guide: "用簡潔語言解釋常見工作流程，不堆砌空話。",
      collection: "圍繞具體目標整理的一組相關資源。",
      default: "瀏覽 Shared Catalog 中已發布的公開資源。",
    },
    resourceCounts: { tool: "個工具", website: "個網站", guide: "篇指南", collection: "個集合", default: "個資源" },
  },
};

function localeFromSegment(segment) {
  return locales.find(item => item.segment === segment)?.locale ?? defaultLocale;
}

export function localeSegment(locale) {
  return locales.find(item => item.locale === locale)?.segment ?? "en";
}

function localeRecord(resourceId, locale) {
  return catalogArtifact.records.locales.find(item => item.resourceId === resourceId && item.locale === locale);
}

function publicResources() {
  return catalogArtifact.records.resources
    .filter(resource => resource.status === "published")
    .sort((a, b) => a.canonicalSlug.localeCompare(b.canonicalSlug));
}

export function listDiscoverCategories(locale = defaultLocale) {
  return catalogArtifact.records.categories
    .filter(category => category.status === "published")
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
    .map(category => {
      const label = categoryLabels[locale]?.[category.slug] ?? categoryLabels.en[category.slug] ?? [category.slug, ""];
      const count = publicResources().filter(resource => resource.primaryCategoryId === category.id).length;
      return { ...category, name: label[0], summary: label[1], count };
    });
}

export function listDiscoverTags(locale = defaultLocale) {
  return catalogArtifact.records.tags
    .filter(tag => tag.status === "published")
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(tag => ({ ...tag, name: tagLabels[locale]?.[tag.slug] ?? tag.slug }));
}

export function resourcePath(resource, locale = defaultLocale) {
  const segment = localeSegment(locale);
  return `/${segment}/resources/${resource.type}/${resource.canonicalSlug}/`;
}

export function resourcePrimaryAction(resource, locale = defaultLocale) {
  if (resource.type === "tool") {
    return `${TOOLS_ORIGIN}/${localeSegment(locale)}/tools/${resource.canonicalSlug}`;
  }
  return resource.websiteUrl ?? resourcePath(resource, locale);
}

export function projectResource(resource, locale = defaultLocale) {
  const text = localeRecord(resource.id, locale) ?? localeRecord(resource.id, defaultLocale);
  const category = catalogArtifact.records.categories.find(item => item.id === resource.primaryCategoryId);
  const categoryText = category
    ? (categoryLabels[locale]?.[category.slug] ?? categoryLabels.en[category.slug])
    : undefined;

  return {
    ...resource,
    locale,
    name: text?.name ?? resource.canonicalSlug,
    summary: text?.summary ?? "",
    seoTitle: text?.seoTitle ?? `${resource.canonicalSlug} | GoDeskHub`,
    seoDescription: text?.seoDescription ?? text?.summary ?? "",
    searchAliases: text?.searchAliases ?? [],
    searchKeywords: text?.searchKeywords ?? [],
    categorySlug: category?.slug,
    categoryName: categoryText?.[0] ?? category?.slug ?? "",
    href: resourcePath(resource, locale),
    primaryHref: resourcePrimaryAction(resource, locale),
  };
}

export function listDiscoverResources(locale = defaultLocale, options = {}) {
  const { type, categorySlug, tagSlug, query } = options;
  let resources = publicResources();

  if (type && type !== "all") {
    resources = resources.filter(resource => resource.type === type);
  }

  if (categorySlug) {
    const category = catalogArtifact.records.categories.find(item => item.slug === categorySlug);
    resources = resources.filter(resource => resource.primaryCategoryId === category?.id);
  }

  if (tagSlug) {
    resources = resources.filter(resource => resource.tagIds?.includes(tagSlug) || resource.tagIds?.includes(`tag_${tagSlug}`));
  }

  const projected = resources.map(resource => projectResource(resource, locale));

  if (!query) {
    return projected;
  }

  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) {
    return projected;
  }

  return projected.filter(resource => [
    resource.name,
    resource.summary,
    resource.categoryName,
    ...resource.searchAliases,
    ...resource.searchKeywords,
  ].some(value => value.toLocaleLowerCase().includes(normalized)));
}

export function buildDiscoverHome(locale = defaultLocale) {
  const tools = listDiscoverResources(locale, { type: "tool" });
  const featuredIds = new Set([
    "res_tool_json-tools",
    "res_tool_ipv4-network-toolbox",
    "res_tool_password-generator",
  ]);
  const featured = tools.filter(resource => featuredIds.has(resource.id));
  return {
    locale,
    featured: featured.length ? featured : tools.slice(0, 3),
    categories: listDiscoverCategories(locale),
    recent: [...tools].reverse().slice(0, 6),
    totalResources: listDiscoverResources(locale).length,
  };
}

export function getRelatedResources(resource, locale = defaultLocale) {
  return listDiscoverResources(locale, { categorySlug: resource.categorySlug })
    .filter(item => item.id !== resource.id)
    .slice(0, 3);
}

export function parseDiscoverPath(pathname = "/") {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const parts = clean.split("/").filter(Boolean);
  const locale = localeFromSegment(parts[0]);
  const segment = localeSegment(locale);
  const rest = parts[0] === segment ? parts.slice(1) : parts;

  const route = {
    locale,
    resourceType: undefined,
    slug: undefined,
    categorySlug: undefined,
    tagSlug: undefined,
    kind: "home",
  };

  if (rest.length === 0) return route;
  if (["tools", "websites", "guides", "collections"].includes(rest[0]) && rest.length === 1) {
    return { ...route, kind: "browse", resourceType: rest[0] === "tools" ? "tool" : rest[0].slice(0, -1) };
  }
  if (rest[0] === "categories" && rest[1]) return { ...route, kind: "category", categorySlug: rest[1] };
  if (rest[0] === "tags" && rest[1]) return { ...route, kind: "tag", tagSlug: rest[1] };
  if (rest[0] === "resources" && rest[1] && rest[2]) {
    return { ...route, kind: "resource", resourceType: rest[1], slug: rest[2] };
  }
  if (["about", "contact", "privacy", "terms"].includes(rest[0])) return { ...route, kind: "info", slug: rest[0] };
  return { ...route, kind: "not-found" };
}

export function findResourceByRoute(route) {
  if (!route.slug) return undefined;
  return listDiscoverResources(route.locale, { type: route.resourceType })
    .find(resource => resource.canonicalSlug === route.slug);
}

export function discoverCanonicalPath(route) {
  const segment = localeSegment(route.locale);
  if (route.kind === "home") return `/${segment}/`;
  if (route.kind === "browse") {
    const plural = route.resourceType === "tool" ? "tools" : `${route.resourceType}s`;
    return `/${segment}/${plural}/`;
  }
  if (route.kind === "category") return `/${segment}/categories/${route.categorySlug}/`;
  if (route.kind === "tag") return `/${segment}/tags/${route.tagSlug}/`;
  if (route.kind === "resource") return `/${segment}/resources/${route.resourceType}/${route.slug}/`;
  if (route.kind === "info") return `/${segment}/${route.slug}/`;
  return `/${segment}/404/`;
}

export function switchDiscoverLocalePath(pathname = "/", targetLocale = defaultLocale) {
  const route = parseDiscoverPath(pathname);
  return discoverCanonicalPath({ ...route, locale: targetLocale });
}

export function buildStaticRoutes() {
  const routes = [];
  for (const { locale } of locales) {
    routes.push({ kind: "home", locale });
    for (const resourceType of ["tool", "website", "guide", "collection"]) routes.push({ kind: "browse", locale, resourceType });
    for (const category of listDiscoverCategories(locale)) routes.push({ kind: "category", locale, categorySlug: category.slug });
    for (const tag of listDiscoverTags(locale)) routes.push({ kind: "tag", locale, tagSlug: tag.slug });
    for (const resource of listDiscoverResources(locale)) routes.push({ kind: "resource", locale, resourceType: resource.type, slug: resource.canonicalSlug });
    for (const slug of ["about", "contact", "privacy", "terms"]) routes.push({ kind: "info", locale, slug });
    routes.push({ kind: "not-found", locale });
  }
  return routes;
}
