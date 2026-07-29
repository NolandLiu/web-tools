import type { Lang } from "../types";

export type SearchResult = {
  toolId: string;
  name: string;
  category: string;
  summary: string;
  path: string;
  score: number;
};

export function searchTools(query: string, lang: Lang, limit?: number): SearchResult[];
export function moveSearchSelection(
  current: number,
  direction: "next" | "previous",
  count: number,
): number;
