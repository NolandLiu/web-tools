import { useMemo, useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { formatChequeAmount } from "../lib/cheque.js";
import type { Lang } from "../types";

const copy = {
  en: {
    input: "Amount",
    help: "Enter 0 to 999,999,999,999,999.99 with no more than two decimal places. Correctly grouped commas are optional.",
    english: "English cheque amount",
    traditional: "Traditional Chinese financial amount",
    empty: "Enter an amount.",
    negative: "Enter a non-negative amount.",
    fraction: "Use no more than two decimal places; the tool does not round extra digits.",
    format: "Use digits with optional correctly grouped commas and up to two decimal places.",
    range: "Enter an amount no greater than 999,999,999,999,999.99.",
    note: "Bank and regional writing rules vary. This currency-neutral result is a writing aid; verify the required format with the receiving bank.",
  },
  "zh-CN": {
    input: "金额",
    help: "输入 0 至 999,999,999,999,999.99，最多两位小数；可以使用正确分组的千位逗号。",
    english: "英文支票金额",
    traditional: "繁体中文金融大写金额",
    empty: "请输入金额。",
    negative: "请输入非负金额。",
    fraction: "最多输入两位小数；本工具不会对多余小数位四舍五入。",
    format: "请使用数字、可选的正确千位分组和最多两位小数。",
    range: "金额不得大于 999,999,999,999,999.99。",
    note: "不同银行和地区的书写规则可能不同。本工具输出不绑定币种，仅供书写辅助，请按实际银行要求核对。",
  },
  "zh-TW": {
    input: "金額",
    help: "輸入 0 至 999,999,999,999,999.99，最多兩位小數；可使用正確分組的千位逗號。",
    english: "英文支票金額",
    traditional: "繁體中文金融大寫金額",
    empty: "請輸入金額。",
    negative: "請輸入非負金額。",
    fraction: "最多輸入兩位小數；本工具不會對多餘小數位四捨五入。",
    format: "請使用數字、可選的正確千位分組和最多兩位小數。",
    range: "金額不得大於 999,999,999,999,999.99。",
    note: "不同銀行和地區的書寫規則可能不同。本工具輸出不綁定幣別，僅供書寫輔助，請按實際銀行要求核對。",
  },
} as const;

export function ChequeTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const t = copy[lang];
  const result = useMemo(() => formatChequeAmount(input), [input]);
  const error = result.ok ? undefined : t[result.reason];

  return (
    <div className="calculator-layout">
      <section className="input-panel">
        <h3>{t.input}</h3>
        <Field id="cheque-amount" label={t.input} help={t.help} lang={lang} error={input ? error : undefined}>
          <input
            inputMode="decimal"
            autoComplete="off"
            value={input}
            onChange={event => setInput(event.target.value)}
          />
        </Field>
        <p className="helper-note">{t.note}</p>
      </section>
      <section className="stacked-tools" aria-label={`${t.english}; ${t.traditional}`}>
        <ResultCard
          label={t.english}
          displayValue={result.ok ? result.english : error}
          copyValue={result.ok ? result.english : ""}
          lang={lang}
          onClear={() => setInput("")}
        />
        <ResultCard
          label={t.traditional}
          displayValue={result.ok ? result.traditional : error}
          copyValue={result.ok ? result.traditional : ""}
          lang={lang}
        />
      </section>
    </div>
  );
}
