export type ChequeFailure = { ok: false; reason: "empty" | "negative" | "fraction" | "format" | "range" };
export type ParsedCheque = { ok: true; normalized: string; integer: bigint; cents: number };
export type ChequeCurrencyOption = "none" | "HKD" | "USD" | "RMB" | "SGD";
export type ChequeEnglishCase = "upper" | "title" | "sentence";
export type ChequeChineseScript = "traditional" | "simplified";
export type ChequeFormatOptions = {
  currency?: ChequeCurrencyOption;
  englishCase?: ChequeEnglishCase;
  chineseScript?: ChequeChineseScript;
};
export function parseChequeAmount(input: string): ParsedCheque | ChequeFailure;
export function toEnglishChequeWords(integer: bigint, cents: number): string;
export function toTraditionalChequeWords(integer: bigint, cents: number): string;
export function toSimplifiedChequeWords(integer: bigint, cents: number): string;
export function formatChequeDisplayInput(input: string): string;
export function formatChequeAmount(input: string): ChequeFailure | {
  ok: true;
  normalized: string;
  english: string;
  chinese: string;
  traditional: string;
};
export function formatChequeAmount(input: string, options: ChequeFormatOptions): ChequeFailure | {
  ok: true;
  normalized: string;
  english: string;
  chinese: string;
  traditional: string;
};
