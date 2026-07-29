import type { CategoryId, Lang, Tool } from "./types";

export type LocalizedRegistryText = Record<Lang, {
  name: string;
  description: string;
}>;

export type LanguageDefinition = {
  id: Lang;
  path: string;
  htmlLang: string;
  hreflang: string;
  label: string;
};

export type CategoryDefinition = {
  id: CategoryId;
  slug: string;
  text: LocalizedRegistryText;
};

export type ToolDefinition = Tool & {
  slug: string;
  text: LocalizedRegistryText;
};

export type InfoPageDefinition = {
  id: "about" | "privacy" | "terms" | "contact";
  slug: string;
  text: LocalizedRegistryText;
};

export const SITE_ORIGIN: "https://tools.godeskhub.com";
export const DEFAULT_LANG: "en";
export const LANGUAGES: LanguageDefinition[];
export const CATEGORIES: CategoryDefinition[];
export const TOOLS: ToolDefinition[];
export const INFO_PAGES: InfoPageDefinition[];
