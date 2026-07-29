import type { CategoryId, Lang } from "../types";

export type ContentExample = {
  title: string;
  description: string;
};

export type ContentFaq = {
  question: string;
  answer: string;
};

export type ContentReference = {
  label: string;
  url: string;
};

export type LocalizedToolContent = {
  summary: string;
  introduction: string;
  useCases: string[];
  steps: string[];
  example: ContentExample;
  principles: string[];
  limitations: string[];
  faqs: ContentFaq[];
  references: ContentReference[];
  aliases: string[];
  keywords: string[];
  reviewedAt: string;
};

export type LocalizedCategoryContent = {
  introduction: string;
  useCases: string[];
  distinction: string;
};

export const TOOL_CONTENT: Record<string, Record<Lang, LocalizedToolContent>>;
export const CATEGORY_CONTENT: Record<CategoryId, Record<Lang, LocalizedCategoryContent>>;
