export type ToolContractInput = {
  id: string;
  type: "number" | "number-list" | "text" | "selection" | "date" | "color";
  format: string;
  range: string;
  emptyBehavior: "empty";
  editingBehavior: "editing";
  invalidBehavior: "invalid";
};

export type ToolBehaviorContract = {
  id: string;
  slug: string;
  category: string;
  operation: string;
  inputs: ToolContractInput[];
  rule: string;
  baseUnit: string | null;
  precision: {
    strategy: string;
    negativeZero: "normalize to zero";
  };
  output: { format: string };
  localization: string;
  limitations: string[];
  privacy: {
    level: "local-private";
    urlFields: string[];
    persistentFields: string[];
    clipboard: "none" | "user-only";
    download: "none" | "user-only";
    network: false;
  };
  accessibility: {
    keyboard: true;
    labeledInputs: true;
    resultStatus: true;
  };
  cases: {
    normal: Record<string, unknown>[];
    boundary: Record<string, unknown>[];
    invalid: Record<string, unknown>[];
  };
  invariants: string[];
  testFile: string;
};

export const TOOL_CONTRACTS: Record<string, ToolBehaviorContract>;

export function validateToolContracts(
  tools?: Array<{ id: string; slug?: string; category: string }>,
  contracts?: Record<string, ToolBehaviorContract>,
): {
  toolCount: number;
  normalCases: number;
  boundaryCases: number;
  invalidCases: number;
};
