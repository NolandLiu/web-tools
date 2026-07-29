import type { CategoryId, Lang } from "../types";

export type HomeRoute = { kind: "home"; lang: Lang };
export type ToolRoute = { kind: "tool"; lang: Lang; toolId: string };
export type CategoryRoute = { kind: "category"; lang: Lang; categoryId: CategoryId };
export type InfoRoute = { kind: "info"; lang: Lang; page: "about" | "privacy" | "terms" | "contact" };
export type NotFoundRoute = { kind: "not-found"; lang: Lang };
export type CanonicalRoute = HomeRoute | ToolRoute | CategoryRoute | InfoRoute;
export type AppRoute = CanonicalRoute | NotFoundRoute;

export function parsePath(pathname: string): AppRoute;
export function buildPath(route: AppRoute): string;
export function switchRouteLanguage<T extends AppRoute>(route: T, lang: Lang): T;
export function listCanonicalRoutes(): CanonicalRoute[];
