import { useMemo, useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { DEFAULT_SYMBOLS, generatePasswords, normalizePasswordConfig, passwordStrength } from "../lib/password.js";
import type { Lang } from "../types";

type Category = "upper" | "lower" | "digits" | "symbols";
type Config = {
  length: number;
  count: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  minimums: Record<Category, number>;
  customSymbols: string;
  excludeAmbiguous: boolean;
};

const copy = {
  en: {
    settings: "Password rules", length: "Length", count: "Number of passwords", minimum: "Minimum", generate: "Generate passwords",
    regenerate: "Regenerate", copyAll: "Copy all", generated: "Generated password", symbolsInput: "Allowed symbols",
    ambiguous: "Exclude confusing characters", ambiguousHelp: "Excludes I, l, 1, O, 0, o, and |.", upper: "Uppercase", lower: "Lowercase",
    digits: "Numbers", symbols: "Symbols", strength: "Strength", weak: "Weak", fair: "Fair", strong: "Strong", "very-strong": "Very strong",
    privacy: "Passwords are created locally with the browser cryptographic random source and are not saved or added to the URL.",
    errors: {
      length: "Choose a length from 8 to 128.", count: "Choose a batch size from 1 to 50.", category: "Enable at least one character category.",
      minimum: "Minimum counts must be non-negative whole numbers.", "disabled-minimum": "A disabled category cannot require characters.",
      "minimum-total": "The minimum character total cannot exceed the password length.", "symbol-pool": "Enter at least one allowed symbol.",
      "symbol-format": "Use visible ASCII punctuation only.", "empty-pool": "The selected exclusions leave an enabled character pool empty.",
      "random-source": "The secure random source is unavailable. No password was generated.", "unique-space": "The available result space is too small for a unique batch.",
    },
  },
  "zh-CN": {
    settings: "密码规则", length: "密码长度", count: "生成数量", minimum: "最少数量", generate: "生成密码", regenerate: "重新生成",
    copyAll: "复制全部", generated: "生成的密码", symbolsInput: "允许的符号", ambiguous: "排除易混淆字符",
    ambiguousHelp: "排除 I、l、1、O、0、o 和 |。", upper: "大写字母", lower: "小写字母", digits: "数字", symbols: "符号",
    strength: "强度", weak: "弱", fair: "一般", strong: "强", "very-strong": "很强",
    privacy: "密码仅在浏览器本地使用密码学安全随机源生成，不会保存或写入 URL。",
    errors: {
      length: "密码长度须为 8 至 128。", count: "生成数量须为 1 至 50。", category: "至少启用一类字符。",
      minimum: "最少数量必须是非负整数。", "disabled-minimum": "未启用的字符类别不能设置最少数量。",
      "minimum-total": "各类最少数量之和不能超过密码长度。", "symbol-pool": "请至少输入一个允许的符号。",
      "symbol-format": "只可使用可见的 ASCII 标点符号。", "empty-pool": "排除易混淆字符后，已启用的字符池为空。",
      "random-source": "安全随机源不可用，未生成任何密码。", "unique-space": "可用结果空间不足以生成不重复的批量密码。",
    },
  },
  "zh-TW": {
    settings: "密碼規則", length: "密碼長度", count: "產生數量", minimum: "最少數量", generate: "產生密碼", regenerate: "重新產生",
    copyAll: "複製全部", generated: "產生的密碼", symbolsInput: "允許的符號", ambiguous: "排除易混淆字元",
    ambiguousHelp: "排除 I、l、1、O、0、o 及 |。", upper: "大寫字母", lower: "小寫字母", digits: "數字", symbols: "符號",
    strength: "強度", weak: "弱", fair: "一般", strong: "強", "very-strong": "很強",
    privacy: "密碼只在瀏覽器本機使用密碼學安全隨機來源產生，不會儲存或寫入 URL。",
    errors: {
      length: "密碼長度須為 8 至 128。", count: "產生數量須為 1 至 50。", category: "至少啟用一類字元。",
      minimum: "最少數量必須是非負整數。", "disabled-minimum": "未啟用的字元類別不能設定最少數量。",
      "minimum-total": "各類最少數量之和不能超過密碼長度。", "symbol-pool": "請至少輸入一個允許的符號。",
      "symbol-format": "只可使用可見的 ASCII 標點符號。", "empty-pool": "排除易混淆字元後，已啟用的字元池為空。",
      "random-source": "安全隨機來源無法使用，未產生任何密碼。", "unique-space": "可用結果空間不足以產生不重複的批次密碼。",
    },
  },
} as const;

const initialConfig: Config = {
  length: 16, count: 1, upper: true, lower: true, digits: true, symbols: true,
  minimums: { upper: 1, lower: 1, digits: 1, symbols: 1 },
  customSymbols: DEFAULT_SYMBOLS, excludeAmbiguous: false,
};

export function PasswordTool({ lang }: { lang: Lang }) {
  const [config, setConfig] = useState(initialConfig);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState("");
  const t = copy[lang];
  const validation = useMemo(() => normalizePasswordConfig(config), [config]);
  const strength = useMemo(() => passwordStrength(config), [config]);

  const update = (next: Partial<Config>) => {
    setConfig(current => ({ ...current, ...next }));
    setPasswords([]);
    setGenerationError("");
  };
  const updateCategory = (category: Category, enabled: boolean) => {
    update({
      [category]: enabled,
      minimums: { ...config.minimums, [category]: enabled ? Math.max(1, config.minimums[category]) : 0 },
    });
  };
  const generate = () => {
    const result = generatePasswords(config);
    if (!result.ok) {
      setPasswords([]);
      setGenerationError(t.errors[result.reason as keyof typeof t.errors] ?? t.errors["random-source"]);
      return;
    }
    setGenerationError("");
    setPasswords(result.passwords ?? []);
  };
  const categories: Category[] = ["upper", "lower", "digits", "symbols"];
  const validationError = validation.ok ? "" : t.errors[validation.reason as keyof typeof t.errors];

  return (
    <div className="calculator-layout password-tool">
      <section className="input-panel">
        <h3>{t.settings}</h3>
        <div className="calculator-fields">
          <Field id="password-length" label={t.length} help="8–128" lang={lang}>
            <input type="number" min="8" max="128" value={config.length} onChange={event => update({ length: Number(event.target.value) })} />
          </Field>
          <Field id="password-count" label={t.count} help="1–50" lang={lang}>
            <input type="number" min="1" max="50" value={config.count} onChange={event => update({ count: Number(event.target.value) })} />
          </Field>
        </div>
        <fieldset className="password-categories">
          <legend>{t.settings}</legend>
          {categories.map(category => (
            <div className="password-category" key={category}>
              <label><input type="checkbox" checked={config[category]} onChange={event => updateCategory(category, event.target.checked)} /> {t[category]}</label>
              <label>{t.minimum} <input aria-label={`${t[category]} ${t.minimum}`} type="number" min="0" max="128" disabled={!config[category]} value={config.minimums[category]} onChange={event => update({ minimums: { ...config.minimums, [category]: Number(event.target.value) } })} /></label>
            </div>
          ))}
        </fieldset>
        {config.symbols && <Field id="password-symbols" label={t.symbolsInput} help={t.errors["symbol-format"]} lang={lang}>
          <input value={config.customSymbols} autoComplete="off" onChange={event => update({ customSymbols: event.target.value })} />
        </Field>}
        <label className="checkbox-row"><input type="checkbox" checked={config.excludeAmbiguous} onChange={event => update({ excludeAmbiguous: event.target.checked })} /> {t.ambiguous}</label>
        <p className="helper-note">{t.ambiguousHelp}</p>
        <p className="helper-note">{t.strength}: {t[strength.label]} · {t.privacy}</p>
        {(validationError || generationError) && <p className="field-error" role="alert">{validationError || generationError}</p>}
        <button type="button" className="button-primary" disabled={!validation.ok} onClick={generate}>{passwords.length ? t.regenerate : t.generate}</button>
      </section>
      <section className="stacked-tools" aria-label={t.generated}>
        {passwords.map((password, index) => (
          <ResultCard key={`${index}-${password}`} label={`${t.generated} ${index + 1}`} displayValue={password} copyValue={password} lang={lang} code />
        ))}
        {passwords.length > 1 && (
          <ResultCard label={t.copyAll} displayValue={`${passwords.length}`} copyValue={passwords.join("\n")} lang={lang} code />
        )}
      </section>
    </div>
  );
}
