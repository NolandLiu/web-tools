export type ChequeFailure = { ok: false; reason: "empty" | "negative" | "fraction" | "format" | "range" };
export type ParsedCheque = { ok: true; normalized: string; integer: bigint; cents: number };
export function parseChequeAmount(input: string): ParsedCheque | ChequeFailure;
export function toEnglishChequeWords(integer: bigint, cents: number): string;
export function toTraditionalChequeWords(integer: bigint, cents: number): string;
export function formatChequeAmount(input: string): ChequeFailure | {
  ok: true;
  normalized: string;
  english: string;
  traditional: string;
};
