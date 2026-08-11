import { DEFAULT_LOCALE, SUPPORTED_LOCALES, localeToRouteSegment } from "./locale.js";
import { buildPath, switchRouteLanguage } from "./routes.js";
import { getRouteMetadata } from "./seo.js";

export const TOOLS_FRONTEND_POLICY = Object.freeze({
  frontend: "tools",
  origin: "https://tools.godeskhub.com",
  canonicalResourceTypes: Object.freeze(["tool"]),
  websiteUrlMode: "internal",
});

function originFromPolicy(frontendPolicy) {
  const origin = frontendPolicy?.origin;
  if (origin !== "https://tools.godeskhub.com") {
    throw new Error(`unsupported frontend origin: ${String(origin)}`);
  }
  return origin;
}

export function resolveCanonicalUrl(route, frontendPolicy = TOOLS_FRONTEND_POLICY) {
  return `${originFromPolicy(frontendPolicy)}${buildPath(route)}`;
}

export function resolveHreflangSet(route, frontendPolicy = TOOLS_FRONTEND_POLICY) {
  const origin = originFromPolicy(frontendPolicy);
  if (route.kind === "not-found") return [];
  return [
    ...SUPPORTED_LOCALES.map(locale => ({
      hreflang: locale,
      href: `${origin}${buildPath(switchRouteLanguage(route, locale))}`,
    })),
    {
      hreflang: "x-default",
      href: `${origin}${buildPath(switchRouteLanguage(route, DEFAULT_LOCALE))}`,
    },
  ];
}

export function resolveRobotsPolicy({ status, routeKind }) {
  if (routeKind === "not-found") {
    return {
      robots: "noindex, nofollow",
      publishRoute: false,
      includeInSitemap: false,
    };
  }
  if (status === "published") {
    return {
      robots: "index, follow",
      publishRoute: true,
      includeInSitemap: true,
    };
  }
  return {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
  };
}

export function resolveCatalogPageMetadata(route, { frontendPolicy = TOOLS_FRONTEND_POLICY } = {}) {
  const metadata = getRouteMetadata(route);
  const canonical = resolveCanonicalUrl(route, frontendPolicy);
  const alternates = resolveHreflangSet(route, frontendPolicy);
  return {
    ...metadata,
    canonical,
    openGraph: {
      ...metadata.openGraph,
      url: canonical,
    },
    alternates,
  };
}

export function routeSegmentForLocale(locale) {
  return localeToRouteSegment(locale);
}
