export type ToolTreeItem = {
  id: string;
  category: string;
  order: number;
};

export function buildToolTree<T extends ToolTreeItem>(
  tools: T[],
  categoryOrder: readonly string[],
): Array<{ id: string; tools: T[] }>;

export function swapConversion(state: {
  input: string;
  output: string;
  from: string;
  to: string;
}): { input: string; from: string; to: string };

export function getCopyState(
  value: string,
  invalidValues?: string[],
): "disabled" | "ready";

export function serializeStatsResult(stats: {
  characters: number;
  words: number;
  lines: number;
}): string;
