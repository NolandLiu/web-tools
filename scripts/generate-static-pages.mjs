import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_ORIGIN } from "../src/registry.js";
import { buildPath, listCanonicalRoutes } from "../src/lib/routes.js";
import { getRouteMetadata, renderMetadataTags } from "../src/lib/seo.js";
import { renderStaticRouteContent } from "../src/lib/static-content.js";
import { validateContentRegistry } from "../src/lib/content.js";

const METADATA_PATTERN = /<!-- route-metadata:start -->[\s\S]*?<!-- route-metadata:end -->/;

function renderPage(template, route) {
  const metadata = getRouteMetadata(route);
  if (!METADATA_PATTERN.test(template)) {
    throw new Error("The Vite HTML template is missing route metadata markers.");
  }
  return template
    .replace(/<html\s+lang="[^"]*">/, `<html lang="${metadata.lang}">`)
    .replace(METADATA_PATTERN, renderMetadataTags(metadata))
    .replace('<div id="root"></div>', `<div id="root">${renderStaticRouteContent(route)}</div>`);
}

function routeOutputPath(distDir, route) {
  const relativePath = buildPath(route).replace(/^\/|\/$/g, "");
  return route.kind === "home"
    ? join(distDir, relativePath, "index.html")
    : join(distDir, `${relativePath}.html`);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderSitemap(routes) {
  const entries = routes.map(route => {
    const url = `${SITE_ORIGIN}${buildPath(route)}`;
    return `  <url><loc>${escapeXml(url)}</loc></url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

function renderRedirects() {
  return [
    "/ /en/ 301",
    "/index.html /en/ 301",
    "/en /en/ 301",
    "/zh-cn /zh-cn/ 301",
    "/zh-tw /zh-tw/ 301",
    "/about /en/about 301",
    "/privacy /en/privacy 301",
    "/terms /en/terms 301",
    "/contact /en/contact 301",
    "/tools/:slug /en/tools/:slug 301",
    "/categories/:slug /en/categories/:slug 301",
    "",
  ].join("\n");
}

export async function generateSite({ distDir = resolve("dist") } = {}) {
  validateContentRegistry();
  const templatePath = join(distDir, "index.html");
  const template = await readFile(templatePath, "utf8");
  const routes = listCanonicalRoutes();

  for (const route of routes) {
    const outputPath = routeOutputPath(distDir, route);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderPage(template, route));
  }

  const notFoundHtml = renderPage(template, { kind: "not-found", lang: "en" });
  await writeFile(join(distDir, "404.html"), notFoundHtml);
  await writeFile(join(distDir, "sitemap.xml"), renderSitemap(routes));
  await writeFile(join(distDir, "_redirects"), renderRedirects());

  return { routeCount: routes.length };
}

const isDirectRun = globalThis.process.argv[1]
  && resolve(globalThis.process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const result = await generateSite();
  globalThis.console.log(`Generated ${result.routeCount} canonical static pages.`);
}
