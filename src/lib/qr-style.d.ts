export const QR_QUIET_ZONE: number;
export const LOGO_SIZE_RATIOS: Record<"small" | "medium" | "large", number>;
export function validateLogoMetadata(metadata: { type: string; size: number; width: number; height: number }): { ok: boolean; reason?: string };
export function effectiveErrorCorrection(selected: "L" | "M" | "Q" | "H", hasLogo: boolean): "L" | "M" | "Q" | "H";
export function contrastRatio(first: string, second: string): number;
export function qrStyleGenerationKey(settings: Record<string, unknown> & { input: string }): string;
export function createStyledQrSvg(matrix: { size: number; get(row: number, column: number): number }, options: {
  size: number;
  dark: string;
  light: string;
  moduleShape: "square" | "rounded" | "dot";
  finderFrameShape: "square" | "rounded";
  finderCenterShape: "square" | "dot";
  logo?: { dataUrl: string; width: number; height: number; size: "small" | "medium" | "large"; padding: boolean } | null;
}): string;
