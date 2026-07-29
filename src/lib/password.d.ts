export const AMBIGUOUS_CHARACTERS: string;
export const DEFAULT_SYMBOLS: string;
export type PasswordCategory = "upper" | "lower" | "digits" | "symbols";
export type PasswordConfigInput = {
  length?: number;
  count?: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  minimums?: Partial<Record<PasswordCategory, number>>;
  customSymbols?: string;
  customPools?: Partial<Record<PasswordCategory, string>>;
  excludeAmbiguous?: boolean;
};
export type RandomSource = { fill(bytes: Uint8Array): Uint8Array };
export function normalizePasswordConfig(input?: PasswordConfigInput): { ok: boolean; reason?: string; config?: unknown };
export function secureRandomIndex(size: number, source?: RandomSource): number;
export function generatePasswords(input?: PasswordConfigInput, source?: RandomSource, options?: { maxDuplicateRetries?: number }): {
  ok: boolean;
  reason?: string;
  passwords?: string[];
  config?: unknown;
};
export function passwordStrength(input?: PasswordConfigInput): { label: "weak" | "fair" | "strong" | "very-strong"; bits: number };
