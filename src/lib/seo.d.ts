import type { AppRoute } from "./routes.js";

export type RouteMetadata = {
  lang: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description: string;
    url: string;
  };
  alternates: Array<{ hreflang: string; href: string }>;
  jsonLd: Record<string, string | boolean>;
};

export function getRouteMetadata(route: AppRoute): RouteMetadata;
export function renderMetadataTags(metadata: RouteMetadata): string;
export function applyRouteMetadata(metadata: RouteMetadata, targetDocument?: Document): void;
