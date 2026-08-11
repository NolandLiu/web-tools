import catalogArtifact from "../../catalog/artifacts/catalog.normalized.v1.mjs";
import { SITE_ORIGIN } from "../registry.js";
import { buildPath, listCanonicalRoutes } from "./routes.js";

export function resolvePublicationIndexingPolicy({ status, routeKind, replacementUrl = null }) {
  if (routeKind === "not-found") {
    return {
      robots: "noindex, nofollow",
      publishRoute: false,
      includeInSitemap: false,
      httpStatus: 404,
    };
  }

  if (status === "published") {
    return {
      robots: "index, follow",
      publishRoute: true,
      includeInSitemap: true,
      httpStatus: 200,
    };
  }

  if (status === "deprecated" && replacementUrl) {
    return {
      robots: "noindex, nofollow",
      publishRoute: false,
      includeInSitemap: false,
      httpStatus: 301,
      replacementUrl,
    };
  }

  return {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
    httpStatus: status === "deprecated" ? 410 : 404,
  };
}

export function buildCatalogSitemapUrls(activeCatalogArtifact = catalogArtifact, { frontend = "tools" } = {}) {
  if (frontend !== "tools") {
    throw new Error(`unsupported sitemap frontend: ${frontend}`);
  }
  void activeCatalogArtifact;

  return listCanonicalRoutes()
    .map(route => `${SITE_ORIGIN}${buildPath(route)}`)
    .filter((url, index, urls) => urls.indexOf(url) === index);
}
