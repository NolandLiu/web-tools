import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import {
  buildDiscoverHome,
  buildStaticRoutes,
  discoverCanonicalPath,
  DISCOVER_ORIGIN,
  findResourceByRoute,
  listDiscoverCategories,
  listDiscoverResources,
  messages,
} from "../src/discover-data.js";

const template = await readFile(resolve("dist-discover/index.html"), "utf8");
const supportedLocales = ["en", "zh-CN", "zh-TW"];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeScriptJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function localizedPath(route, locale) {
  return discoverCanonicalPath({ ...route, locale });
}

function metadata(route) {
  const t = messages[route.locale] ?? messages.en;
  if (route.kind === "home") return { title: `${t.heroTitle} | GoDeskHub`, description: t.heroSubtitle };
  if (route.kind === "browse") {
    const label = t.resourceTypeLabels?.[route.resourceType === "ai-skill" ? "aiSkill" : route.resourceType] ?? t.resources;
    const description = t.browseIntro?.[route.resourceType === "ai-skill" ? "aiSkill" : route.resourceType] ?? t.browseIntro.default;
    return { title: `${label} | GoDeskHub`, description };
  }
  if (route.kind === "resource") {
    const resource = findResourceByRoute(route);
    if (resource) return { title: resource.seoTitle, description: resource.seoDescription };
  }
  if (route.kind === "category") {
    const category = listDiscoverCategories(route.locale).find(item => item.slug === route.categorySlug);
    if (category) return { title: `${category.name} | GoDeskHub`, description: category.summary };
  }
  if (route.kind === "tag") {
    return { title: `${route.tagSlug} | GoDeskHub`, description: t.browseIntro.default };
  }
  if (route.kind === "info") {
    const label = t.footer?.[route.slug] ?? "GoDeskHub";
    return { title: `${label} | GoDeskHub`, description: t.heroSubtitle };
  }
  return { title: `${t.heroTitle} | GoDeskHub`, description: t.heroSubtitle };
}

function alternateLinks(route) {
  return supportedLocales.map(locale => {
    const href = `${DISCOVER_ORIGIN}${localizedPath(route, locale)}`;
    return { hreflang: locale, href };
  });
}

function renderHtmlAlternates(route) {
  const localeLinks = alternateLinks(route).map(({ hreflang, href }) => (
    `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`
  ));
  localeLinks.push(`<link rel="alternate" hreflang="x-default" href="${DISCOVER_ORIGIN}${localizedPath(route, "en")}" />`);
  return localeLinks.join("\n");
}

function routeListItems(route) {
  if (route.kind === "home") {
    return buildDiscoverHome(route.locale).featured;
  }
  if (route.kind === "browse" || route.kind === "category" || route.kind === "tag") {
    return listDiscoverResources(route.locale, {
      type: route.resourceType,
      categorySlug: route.categorySlug,
      tagSlug: route.tagSlug,
    });
  }
  return [];
}

function jsonLdForRoute(route, meta, canonical) {
  if (route.kind === "home") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GoDeskHub",
      description: meta.description,
      url: canonical,
      inLanguage: route.locale,
    };
  }

  if (route.kind === "browse" || route.kind === "category" || route.kind === "tag") {
    const resources = routeListItems(route);
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: meta.title,
      description: meta.description,
      url: canonical,
      inLanguage: route.locale,
      itemListElement: resources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.name,
        url: resource.href.startsWith("http") ? resource.href : `${DISCOVER_ORIGIN}${resource.href}`,
      })),
    };
  }

  if (route.kind === "resource") {
    const resource = findResourceByRoute(route);
    if (resource?.type === "ai-skill") {
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: resource.name,
        description: resource.seoDescription,
        url: canonical,
        inLanguage: route.locale,
        step: resource.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text: step,
        })),
      };
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: canonical,
    inLanguage: route.locale,
  };
}

function renderCard(resource, locale) {
  const t = messages[locale] ?? messages.en;
  const label = resource.type === "tool" ? t.openTool : t.details;
  return `<article class="discover-static-card">
    <p>${escapeHtml(resource.type)}</p>
    <h2>${escapeHtml(resource.name)}</h2>
    <p>${escapeHtml(resource.summary)}</p>
    <a href="${escapeHtml(resource.primaryHref)}">${escapeHtml(label)}</a>
  </article>`;
}

function renderList(title, items, ordered = false) {
  if (!items?.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `<section><h2>${escapeHtml(title)}</h2><${tag}>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}></section>`;
}

function renderResourceDetail(resource, locale) {
  const t = messages[locale] ?? messages.en;
  const base = renderCard(resource, locale);
  if (resource.type !== "ai-skill") {
    return base;
  }

  return `${base}<section class="discover-static-ai-skill">
    ${renderList(t.aiSkillDetail.useCases, resource.useCases)}
    ${renderList(t.aiSkillDetail.inputs, resource.inputRequirements)}
    ${renderList(t.aiSkillDetail.outputs, resource.outputResults)}
    ${renderList(t.aiSkillDetail.steps, resource.steps, true)}
    ${renderList(t.aiSkillDetail.privacyNotes, resource.riskNotes)}
  </section>`;
}

function renderRoute(route) {
  const t = messages[route.locale] ?? messages.en;
  const home = buildDiscoverHome(route.locale);
  const canonical = `${DISCOVER_ORIGIN}${discoverCanonicalPath(route)}`;
  const meta = metadata(route);
  let body = "";

  if (route.kind === "home") {
    body = `<section class="discover-static-hero">
      <p>godeskhub.com</p>
      <h1>${escapeHtml(t.heroTitle)}</h1>
      <p>${escapeHtml(t.heroSubtitle)}</p>
    </section>
    <section>
      <h2>${escapeHtml(t.featured)}</h2>
      ${home.featured.map(resource => renderCard(resource, route.locale)).join("")}
    </section>
    <section>
      <h2>${escapeHtml(t.browse)}</h2>
      ${home.categories.map(category => `<a href="${escapeHtml(localizedPath({ kind: "category", categorySlug: category.slug }, route.locale))}">${escapeHtml(category.name)}</a>`).join("")}
    </section>
    <section>
      <h2>${escapeHtml(t.recently)}</h2>
      ${home.recent.map(resource => `<a href="${escapeHtml(resource.href)}">${escapeHtml(resource.name)}</a>`).join("")}
    </section>`;
  } else if (route.kind === "resource") {
    const resource = findResourceByRoute(route);
    body = resource ? renderResourceDetail(resource, route.locale) : `<p>${escapeHtml(t.empty)}</p>`;
  } else {
    const resources = listDiscoverResources(route.locale, {
      type: route.resourceType,
      categorySlug: route.categorySlug,
      tagSlug: route.tagSlug,
    });
    body = `<section><h1>${escapeHtml(meta.title.replace(" | GoDeskHub", ""))}</h1>${resources.map(resource => renderCard(resource, route.locale)).join("") || `<p>${escapeHtml(t.empty)}</p>`}</section>`;
  }

  const hreflang = renderHtmlAlternates(route);
  const jsonLd = jsonLdForRoute(route, meta, canonical);

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${route.locale}">`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace("</head>", `<meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${canonical}" />
    ${hreflang}
    <script type="application/ld+json">${escapeScriptJson(jsonLd)}</script>
  </head>`)
    .replace(/<div id="discover-root">[\s\S]*?<\/div>/, `<div id="discover-root">${body}</div>`);
}

function sitemapRouteKey(route) {
  return JSON.stringify({
    kind: route.kind,
    resourceType: route.resourceType,
    slug: route.slug,
    categorySlug: route.categorySlug,
    tagSlug: route.tagSlug,
  });
}

function buildDiscoverSitemap() {
  const routeByKey = new Map();
  for (const route of buildStaticRoutes()) {
    if (route.kind !== "not-found" && route.locale === "en") {
      routeByKey.set(sitemapRouteKey(route), route);
    }
  }

  const entries = [...routeByKey.values()].map(route => {
    const loc = `${DISCOVER_ORIGIN}${discoverCanonicalPath(route)}`;
    const alternates = alternateLinks(route).map(({ hreflang, href }) => (
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}" />`
    ));
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${DISCOVER_ORIGIN}${localizedPath(route, "en")}`)}" />`);
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
${alternates.join("\n")}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
}

let count = 0;
for (const route of buildStaticRoutes()) {
  const path = discoverCanonicalPath(route);
  const outputPath = path.endsWith("/404/")
    ? join("dist-discover", route.locale.toLowerCase(), "404.html")
    : join("dist-discover", path, "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRoute(route));
  count += 1;
}

await writeFile(resolve("dist-discover/index.html"), renderRoute({ kind: "home", locale: "en" }));
await writeFile(resolve("dist-discover/sitemap.xml"), buildDiscoverSitemap());
console.log(`Generated ${count} Discover static pages.`);
