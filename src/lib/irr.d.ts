export type IrrResult =
  | { status: "single"; rate: number }
  | { status: "multiple"; roots: number[]; intervals: Array<[number, number]> }
  | { status: "no-root" }
  | { status: "non-convergent"; intervals: Array<[number, number]> }
  | { status: "invalid"; reason: string };

export function npvAtRate(cashFlows: number[], rate: number): number;
export function annualizeIrr(periodicRate: number, periodsPerYear: number): number;
export function roundIrrPercent(rate: number, digits?: number): number;
export function parseCashFlowInputs(inputs: string[]):
  | { ok: true; values: number[] }
  | { ok: false; reason: string; index: number };
export function addCashFlowInput(inputs: string[]): string[];
export function removeCashFlowInput(inputs: string[], index: number): string[];
export function cashFlowFocusAfterRemoval(length: number, index: number): number;
export function solveFixedPeriodIrr(
  cashFlows: number[],
  options?: {
    maxIterations?: number;
    tolerance?: number;
    scanSteps?: number;
    minimumRate?: number;
    maximumRate?: number;
  },
): IrrResult;
