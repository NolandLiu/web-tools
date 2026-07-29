export const SUPPORTED_LANGUAGES: string[];
export const UNIT_GROUPS: Record<string, { base: string; units: Record<string, number>; defaultFrom: string; defaultTo: string }>;
export const TEMP_UNITS: string[];
export const POPULAR_VERSION: number;
export const MAX_TEXT_BYTES: number;

export type NumberInputState =
  | { state: "empty" | "editing" | "invalid" | "out-of-range" }
  | { state: "valid"; value: number };

export function parseNumberInput(value: unknown): NumberInputState;
export function parseFiniteNumber(value: string | number): number | null;
export function convertUnit(value: string | number, groupId: string | undefined, from: string, to: string): number | null;
export function validateTemperatureInput(value: unknown, unit: string): NumberInputState;
export function convertTemperature(value: string | number, from: string, to: string): number | null;
export function normalizeNegativeZero(value: number): number;
export function formatNumber(value: number, locale?: string): string;
export function formatJson(input: string, mode?: string): { ok: true; value: string; warning?: "unsafe-integer" } | { ok: false; error: string };
export function base64Encode(input: string): string | { ok: false; error: "too-large" };
export function base64Decode(input: string): { ok: true; value: string } | { ok: false; error: string };
export function urlTransform(input: string, mode: string): { ok: true; value: string } | { ok: false; error: string; input: string };
export function timestampToDate(input: string | number, unit?: "seconds" | "milliseconds" | "auto"): string | null;
export function dateToTimestamp(input: string, unit?: "seconds" | "milliseconds", interpretation?: "local" | "utc"): number | null;
export function parseCalendarDate(input: string): { year: number; month: number; day: number; utcMs: number } | null;
export function textStats(input: string): { characters: number; words: number; lines: number };
export function changeCase(input: string, mode: string): string;
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null;
export function rgbToHex(r: string | number, g: string | number, b: string | number): string | null;
export function rgbToHsl(r: string | number, g: string | number, b: string | number): { h: number; s: number; l: number } | null;
export function isUuidV4(value: unknown): boolean;
export function generateUuidV4(cryptoProvider?: Pick<Crypto, "randomUUID" | "getRandomValues"> | Record<string, never>): string | null;
export function percentOf(percent: string | number, value: string | number): number | null;
export function discountPrice(price: string | number, discountPercent: string | number): { finalPrice: number; saved: number } | null;
export function bmi(weightKg: string | number, heightCm: string | number): number | null;
export function bmiCategory(value: string | number): "underweight" | "healthy" | "overweight" | "obesity" | null;
export function compoundInterest(principal: string | number, annualRatePercent: string | number, years: string | number, compoundsPerYear?: string | number): { amount: number; interest: number } | null;
export function dateInterval(start: string, end: string): number | null;
export const MAX_QR_UTF8_BYTES: number;
export function utf8ByteLength(value: string): number;
export function createQrGenerationKey(value: string, size: string | number, dark: string, light: string): string;
export function validateQrInput(value: string): { ok: true; bytes: number } | { ok: false; error: "empty" | "tooLarge"; bytes: number };
export function readToolStats(storage?: Storage | null, allowedToolIds?: ReadonlySet<string>): { version: number; tools: Record<string, { count: number; lastOpenedAt: number }> };
export function trackToolOpen(storage: Storage | null, toolId: string, now?: number, allowedToolIds?: ReadonlySet<string>): { version: number; tools: Record<string, { count: number; lastOpenedAt: number }> };
export function sortToolsByPopularity<T extends { id: string; defaultWeight?: number; order: number }>(tools: T[], stats: { tools: Record<string, { count: number; lastOpenedAt: number }> }, now?: number): T[];
