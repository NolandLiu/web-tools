import { useMemo, useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { formatChequeAmount, formatChequeDisplayInput } from "../lib/cheque.js";
import type { ChequeChineseScript, ChequeCurrencyOption, ChequeEnglishCase } from "../lib/cheque.js";
import type { Lang } from "../types";

const copy = {
  en: {
    input: "Amount",
    help: "Enter 0 to 999,999,999,999,999.99 with no more than two decimal places. Correctly grouped commas are optional.",
    english: "English cheque amount",
    traditional: "Traditional Chinese financial amount",
    currency: "Currency label",
    currencyHelp: "Choose whether to add a common currency label. The default keeps the output currency-neutral.",
    englishCase: "English letter case",
    englishCaseHelp: "Choose the case style for the English result.",
    chineseScript: "Chinese financial script",
    chineseScriptHelp: "Choose Traditional or Simplified Chinese financial numerals.",
    none: "No currency",
    hkd: "HKD",
    usd: "USD",
    rmb: "RMB",
    sgd: "SGD",
    upper: "ALL CAPS",
    title: "Title Case",
    sentence: "Sentence case",
    traditionalScript: "Traditional",
    simplifiedScript: "Simplified",
    empty: "Enter an amount.",
    negative: "Enter a non-negative amount.",
    fraction: "Use no more than two decimal places; the tool does not round extra digits.",
    format: "Use digits with optional correctly grouped commas and up to two decimal places.",
    range: "Enter an amount no greater than 999,999,999,999,999.99.",
    note: "Bank and regional writing rules vary. This result is a writing aid; verify the required format with the receiving bank.",
    security: "Tip: on a paper cheque, draw a line after the written amount to fill the remaining blank space and reduce tampering risk.",
  },
  "zh-CN": {
    input: "金额",
    help: "输入 0 至 999,999,999,999,999.99，最多两位小数；可以使用正确分组的千位逗号。",
    english: "英文支票金额",
    traditional: "繁体中文金融大写金额",
    currency: "币种标签",
    currencyHelp: "选择是否添加常见币种标签；默认保留无币种输出。",
    englishCase: "英文大小写",
    englishCaseHelp: "选择英文结果的大小写格式。",
    chineseScript: "中文金融大写",
    chineseScriptHelp: "选择繁体或简体中文金融大写。",
    none: "无币种",
    hkd: "HKD",
    usd: "USD",
    rmb: "RMB",
    sgd: "SGD",
    upper: "ALL CAPS",
    title: "Title Case",
    sentence: "Sentence case",
    traditionalScript: "繁体",
    simplifiedScript: "简体",
    empty: "请输入金额。",
    negative: "请输入非负金额。",
    fraction: "最多输入两位小数；本工具不会对多余小数位四舍五入。",
    format: "请使用数字、可选的正确千位分组和最多两位小数。",
    range: "金额不得大于 999,999,999,999,999.99。",
    note: "不同银行和地区的书写规则可能不同。本工具结果仅供书写辅助，请按实际银行要求核对。",
    security: "提示：在纸质支票大写末尾，请画一条横线填满剩余空白，以降低被他人补写金额的风险。",
  },
  "zh-TW": {
    input: "金額",
    help: "輸入 0 至 999,999,999,999,999.99，最多兩位小數；可使用正確分組的千位逗號。",
    english: "英文支票金額",
    traditional: "繁體中文金融大寫金額",
    currency: "幣別標籤",
    currencyHelp: "選擇是否加入常見幣別標籤；預設保留無幣別輸出。",
    englishCase: "英文大小寫",
    englishCaseHelp: "選擇英文結果的大小寫格式。",
    chineseScript: "中文金融大寫",
    chineseScriptHelp: "選擇繁體或簡體中文金融大寫。",
    none: "無幣別",
    hkd: "HKD",
    usd: "USD",
    rmb: "RMB",
    sgd: "SGD",
    upper: "ALL CAPS",
    title: "Title Case",
    sentence: "Sentence case",
    traditionalScript: "繁體",
    simplifiedScript: "簡體",
    empty: "請輸入金額。",
    negative: "請輸入非負金額。",
    fraction: "最多輸入兩位小數；本工具不會對多餘小數位四捨五入。",
    format: "請使用數字、可選的正確千位分組和最多兩位小數。",
    range: "金額不得大於 999,999,999,999,999.99。",
    note: "不同銀行和地區的書寫規則可能不同。本工具結果僅供書寫輔助，請按實際銀行要求核對。",
    security: "提示：在紙本支票大寫末尾，請畫一條橫線填滿剩餘空白，以降低被他人補寫金額的風險。",
  },
} as const;

export function ChequeTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const [currency, setCurrency] = useState<ChequeCurrencyOption>("none");
  const [englishCase, setEnglishCase] = useState<ChequeEnglishCase>("upper");
  const [chineseScript, setChineseScript] = useState<ChequeChineseScript>("traditional");
  const t = copy[lang];
  const result = useMemo(() => formatChequeAmount(input, { currency, englishCase, chineseScript }), [chineseScript, currency, englishCase, input]);
  const error = result.ok ? undefined : t[result.reason];
  const chineseLabel = chineseScript === "simplified" ? t.simplifiedScript : t.traditionalScript;
  const chineseResultLabel = `${chineseLabel} ${t.chineseScript}`;

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
            onBlur={() => setInput(value => formatChequeDisplayInput(value))}
          />
        </Field>
        <div className="qr-options">
          <Field id="cheque-currency" label={t.currency} help={t.currencyHelp} lang={lang}>
            <select value={currency} onChange={event => setCurrency(event.target.value as ChequeCurrencyOption)}>
              <option value="none">{t.none}</option>
              <option value="HKD">{t.hkd}</option>
              <option value="USD">{t.usd}</option>
              <option value="RMB">{t.rmb}</option>
              <option value="SGD">{t.sgd}</option>
            </select>
          </Field>
          <Field id="cheque-english-case" label={t.englishCase} help={t.englishCaseHelp} lang={lang}>
            <select value={englishCase} onChange={event => setEnglishCase(event.target.value as ChequeEnglishCase)}>
              <option value="upper">{t.upper}</option>
              <option value="title">{t.title}</option>
              <option value="sentence">{t.sentence}</option>
            </select>
          </Field>
          <Field id="cheque-chinese-script" label={t.chineseScript} help={t.chineseScriptHelp} lang={lang}>
            <select value={chineseScript} onChange={event => setChineseScript(event.target.value as ChequeChineseScript)}>
              <option value="traditional">{t.traditionalScript}</option>
              <option value="simplified">{t.simplifiedScript}</option>
            </select>
          </Field>
        </div>
        <p className="helper-note">{t.note}</p>
      </section>
      <section className="stacked-tools" aria-label={`${t.english}; ${chineseResultLabel}`}>
        <ResultCard
          label={t.english}
          displayValue={result.ok ? result.english : error}
          copyValue={result.ok ? result.english : ""}
          lang={lang}
          onClear={() => setInput("")}
        />
        <ResultCard
          label={chineseResultLabel}
          displayValue={result.ok ? result.chinese : error}
          copyValue={result.ok ? result.chinese : ""}
          lang={lang}
        />
        <p className="helper-note" role="note">{t.security}</p>
      </section>
    </div>
  );
}
