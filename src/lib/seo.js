import {
  CATEGORIES,
  DEFAULT_LANG,
  INFO_PAGES,
  LANGUAGES,
  SITE_ORIGIN,
  TOOLS,
} from "../registry.js";
import { TOOL_CONTENT } from "../content/index.js";
import { buildPath, switchRouteLanguage } from "./routes.js";

const HOME_TEXT = {
  en: {
    title: "GoDeskHub — Free, fast online tools",
    description: "Free, fast, privacy-first converters, calculators, developer tools, and QR Code utilities.",
  },
  "zh-CN": {
    title: "GoDeskHub — 免费、快速的在线工具",
    description: "隐私优先的免费在线转换、计算、开发和 QR Code 工具。",
  },
  "zh-TW": {
    title: "GoDeskHub — 免費、快速的線上工具",
    description: "重視隱私的免費線上轉換、計算、開發和 QR Code 工具。",
  },
};

const NOT_FOUND_TEXT = {
  en: { title: "Page not found | GoDeskHub", description: "The requested GoDeskHub page could not be found." },
  "zh-CN": { title: "找不到页面 | GoDeskHub", description: "无法找到请求的 GoDeskHub 页面。" },
  "zh-TW": { title: "找不到頁面 | GoDeskHub", description: "無法找到要求的 GoDeskHub 頁面。" },
};

function findRouteText(route) {
  if (route.kind === "home") return HOME_TEXT[route.lang];
  if (route.kind === "not-found") return NOT_FOUND_TEXT[route.lang];

  const item = route.kind === "tool"
    ? TOOLS.find(tool => tool.id === route.toolId)
    : route.kind === "category"
      ? CATEGORIES.find(category => category.id === route.categoryId)
      : INFO_PAGES.find(page => page.id === route.page);
  const text = item?.text[route.lang] ?? NOT_FOUND_TEXT[route.lang];
  return {
    title: `${text.name} | GoDeskHub`,
    description: text.description,
  };
}

function breadcrumbEntity(route, canonical) {
  if (route.kind !== "tool" && route.kind !== "category") return null;
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: HOME_TEXT[route.lang].title,
      item: `${SITE_ORIGIN}${buildPath({ kind: "home", lang: route.lang })}`,
    },
  ];
  if (route.kind === "tool") {
    const tool = TOOLS.find(item => item.id === route.toolId);
    const category = CATEGORIES.find(item => item.id === tool?.category);
    if (category) {
      items.push({
        "@type": "ListItem",
        position: 2,
        name: category.text[route.lang].name,
        item: `${SITE_ORIGIN}${buildPath({ kind: "category", lang: route.lang, categoryId: category.id })}`,
      });
    }
    if (tool) {
      items.push({
        "@type": "ListItem",
        position: 3,
        name: tool.text[route.lang].name,
        item: canonical,
      });
    }
  } else {
    const category = CATEGORIES.find(item => item.id === route.categoryId);
    if (category) {
      items.push({
        "@type": "ListItem",
        position: 2,
        name: category.text[route.lang].name,
        item: canonical,
      });
    }
  }
  return {
    "@id": `${canonical}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function structuredDataGraph(route, text, canonical) {
  if (route.kind === "home") {
    return [{
      "@id": `${canonical}#website`,
      "@type": "WebSite",
      name: "GoDeskHub",
      description: text.description,
      url: canonical,
      inLanguage: route.lang,
    }];
  }

  if (route.kind === "tool") {
    const tool = TOOLS.find(item => item.id === route.toolId);
    const content = TOOL_CONTENT[route.toolId]?.[route.lang];
    const categoryTypes = {
      units: "UtilitiesApplication",
      developer: "DeveloperApplication",
      calculators: "UtilitiesApplication",
      qr: "MultimediaApplication",
    };
    const application = {
      "@id": `${canonical}#application`,
      "@type": "WebApplication",
      name: tool?.text[route.lang].name ?? text.title,
      description: text.description,
      url: canonical,
      inLanguage: route.lang,
      applicationCategory: categoryTypes[tool?.category] ?? "UtilitiesApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
    };
    const breadcrumb = breadcrumbEntity(route, canonical);
    const faq = {
      "@id": `${canonical}#faq`,
      "@type": "FAQPage",
      mainEntity: (content?.faqs ?? []).map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
    return [application, breadcrumb, faq].filter(Boolean);
  }

  if (route.kind === "category") {
    const category = CATEGORIES.find(item => item.id === route.categoryId);
    const tools = TOOLS.filter(tool => tool.category === route.categoryId);
    return [
      {
        "@id": `${canonical}#collection`,
        "@type": "CollectionPage",
        name: category?.text[route.lang].name ?? text.title,
        description: text.description,
        url: canonical,
        inLanguage: route.lang,
      },
      {
        "@id": `${canonical}#items`,
        "@type": "ItemList",
        numberOfItems: tools.length,
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.text[route.lang].name,
          url: `${SITE_ORIGIN}${buildPath({ kind: "tool", lang: route.lang, toolId: tool.id })}`,
        })),
      },
      breadcrumbEntity(route, canonical),
    ].filter(Boolean);
  }

  return [{
    "@id": `${canonical}#webpage`,
    "@type": "WebPage",
    name: text.title,
    description: text.description,
    url: canonical,
    inLanguage: route.lang,
  }];
}

export function getRouteMetadata(route) {
  const text = findRouteText(route);
  const path = buildPath(route);
  const canonical = `${SITE_ORIGIN}${path}`;
  const alternates = route.kind === "not-found"
    ? []
    : [
        ...LANGUAGES.map(language => ({
          hreflang: language.hreflang,
          href: `${SITE_ORIGIN}${buildPath(switchRouteLanguage(route, language.id))}`,
        })),
        {
          hreflang: "x-default",
          href: `${SITE_ORIGIN}${buildPath(switchRouteLanguage(route, DEFAULT_LANG))}`,
        },
      ];

  return {
    lang: route.lang,
    title: text.title,
    description: text.description,
    canonical,
    robots: route.kind === "not-found" ? "noindex, nofollow" : "index, follow",
    openGraph: {
      type: "website",
      title: text.title,
      description: text.description,
      url: canonical,
    },
    alternates,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": structuredDataGraph(route, text, canonical),
    },
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderMetadataTags(metadata) {
  const alternates = metadata.alternates
    .map(item => `    <link rel="alternate" hreflang="${escapeHtml(item.hreflang)}" href="${escapeHtml(item.href)}" />`)
    .join("\n");
  const jsonLd = JSON.stringify(metadata.jsonLd).replaceAll("<", "\\u003c");
  return [
    "<!-- route-metadata:start -->",
    `    <meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `    <meta name="robots" content="${escapeHtml(metadata.robots)}" />`,
    `    <link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`,
    `    <meta property="og:type" content="${escapeHtml(metadata.openGraph.type)}" />`,
    `    <meta property="og:title" content="${escapeHtml(metadata.openGraph.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(metadata.openGraph.description)}" />`,
    `    <meta property="og:url" content="${escapeHtml(metadata.openGraph.url)}" />`,
    alternates,
    `    <script type="application/ld+json">${jsonLd}</script>`,
    `    <title>${escapeHtml(metadata.title)}</title>`,
    "<!-- route-metadata:end -->",
  ].filter(Boolean).join("\n");
}

export function applyRouteMetadata(metadata, targetDocument = globalThis.document) {
  targetDocument.documentElement.lang = metadata.lang;
  targetDocument.title = metadata.title;

  const upsertMeta = (selector, attributes) => {
    let element = targetDocument.head.querySelector(selector);
    if (!element) {
      element = targetDocument.createElement("meta");
      targetDocument.head.append(element);
    }
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  };
  const upsertLink = (selector, attributes) => {
    let element = targetDocument.head.querySelector(selector);
    if (!element) {
      element = targetDocument.createElement("link");
      targetDocument.head.append(element);
    }
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  };

  upsertMeta('meta[name="description"]', { name: "description", content: metadata.description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: metadata.robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: metadata.openGraph.type });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: metadata.openGraph.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: metadata.openGraph.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: metadata.openGraph.url });
  upsertLink('link[rel="canonical"]', { rel: "canonical", href: metadata.canonical });

  targetDocument.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(element => element.remove());
  for (const alternate of metadata.alternates) {
    const link = targetDocument.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate.hreflang;
    link.href = alternate.href;
    targetDocument.head.append(link);
  }

  let script = targetDocument.head.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = targetDocument.createElement("script");
    script.type = "application/ld+json";
    targetDocument.head.append(script);
  }
  script.textContent = JSON.stringify(metadata.jsonLd);
}
