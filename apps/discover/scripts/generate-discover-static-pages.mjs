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

function localizedPath(route, locale) {
  return discoverCanonicalPath({ ...route, locale });
}

function metadata(route) {
  const t = messages[route.locale] ?? messages.en;
  if (route.kind === "resource") {
    const resource = findResourceByRoute(route);
    if (resource) return { title: resource.seoTitle, description: resource.seoDescription };
  }
  if (route.kind === "category") {
    const category = listDiscoverCategories(route.locale).find(item => item.slug === route.categorySlug);
    if (category) return { title: `${category.name} | GoDeskHub`, description: category.summary };
  }
  return { title: `${t.heroTitle} | GoDeskHub`, description: t.heroSubtitle };
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
    body = resource ? renderCard(resource, route.locale) : `<p>${escapeHtml(t.empty)}</p>`;
  } else {
    const resources = listDiscoverResources(route.locale, {
      type: route.resourceType,
      categorySlug: route.categorySlug,
      tagSlug: route.tagSlug,
    });
    body = `<section><h1>${escapeHtml(meta.title.replace(" | GoDeskHub", ""))}</h1>${resources.map(resource => renderCard(resource, route.locale)).join("") || `<p>${escapeHtml(t.empty)}</p>`}</section>`;
  }

  const hreflang = ["en", "zh-CN", "zh-TW"].map(locale => {
    const hrefLang = locale;
    const href = `${DISCOVER_ORIGIN}${localizedPath(route, locale)}`;
    return `<link rel="alternate" hreflang="${hrefLang}" href="${href}" />`;
  }).join("\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": route.kind === "home" ? "WebSite" : "WebPage",
    name: meta.title,
    description: meta.description,
    url: canonical,
    inLanguage: route.locale,
  };

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
console.log(`Generated ${count} Discover static pages.`);
