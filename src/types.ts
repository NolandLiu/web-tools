export type Lang = "en" | "zh-CN" | "zh-TW";

export type Page = "home" | "about" | "privacy" | "terms" | "contact" | "not-found";

export type CategoryId = "units" | "developer" | "calculators" | "qr";

export type ToolKind =
  | "unit"
  | "json"
  | "base64"
  | "url"
  | "uuid"
  | "timestamp"
  | "case"
  | "text"
  | "color"
  | "calculator"
  | "qr";

export type CalculatorKind = "percentage" | "discount" | "bmi" | "compound" | "date";

export type Tool = {
  id: string;
  slug?: string;
  kind: ToolKind;
  category: CategoryId;
  icon: string;
  order: number;
  defaultWeight: number;
  group?: string;
  calculator?: CalculatorKind;
};

export type LocalizedText = Record<Lang, string>;

export type FieldCopy = Record<Lang, {
  label: string;
  placeholder: string;
  help: string;
}>;
