import { useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { fieldText, messages } from "../i18n";
import { bmi, bmiCategory, compoundInterest, dateInterval, discountPrice, formatNumber, parseNumberInput, percentOf } from "../lib/core.js";
import type { Lang, Tool } from "../types";

const local = (lang: Lang, en: string, zhCN: string, zhTW: string) => lang === "en" ? en : lang === "zh-CN" ? zhCN : zhTW;

type Definition = {
  a: string; b: string; c?: string; d?: string; aType?: string; bType?: string; note?: string;
  aError?: string; bError?: string; cError?: string; dError?: string; value: string; raw: string;
};

const numberError = (input: string, predicate: (value: number) => boolean, message: string) => {
  const parsed = parseNumberInput(input);
  if (parsed.state === "empty" || parsed.state === "editing") return undefined;
  return parsed.state === "valid" && predicate(parsed.value) ? undefined : message;
};

export function CalculatorTool({ tool, lang }: { tool: Tool; lang: Lang }) {
  const [a, setA] = useState(tool.calculator === "date" ? "2024-01-01" : "10");
  const [b, setB] = useState(tool.calculator === "date" ? "2024-01-31" : "100");
  const [c, setC] = useState("12");
  const [d, setD] = useState("12");
  const t = messages[lang];
  let definition: Definition;

  switch (tool.calculator) {
    case "percentage": {
      const result = percentOf(a, b);
      definition = { a: local(lang, "Percentage", "百分比", "百分比"), b: local(lang, "Base value", "基准数值", "基準數值"), aError: numberError(a, () => true, t.invalid), bError: numberError(b, () => true, t.invalid), value: result === null ? t.invalid : formatNumber(result, lang), raw: result === null ? "" : String(result) };
      break;
    }
    case "discount": {
      const result = discountPrice(a, b);
      definition = { a: local(lang, "Original price", "原价", "原價"), b: local(lang, "Discount rate (%)", "折扣率（%）", "折扣率（%）"), aError: numberError(a, value => value >= 0, t.nonNegative), bError: numberError(b, value => value >= 0 && value <= 100, t.percentRange), value: result ? `${formatNumber(result.finalPrice, lang)} (${formatNumber(result.saved, lang)} ${local(lang, "saved", "已节省", "已省下")})` : t.invalid, raw: result ? `${result.finalPrice}` : "", note: t.financeNote };
      break;
    }
    case "bmi": {
      const result = bmi(a, b);
      const category = result === null ? null : bmiCategory(result);
      const categoryLabel = category ? {
        underweight: local(lang, "Underweight", "偏低", "過輕"),
        healthy: local(lang, "Healthy range", "健康范围", "健康範圍"),
        overweight: local(lang, "Overweight", "偏高", "過重"),
        obesity: local(lang, "Obesity range", "肥胖范围", "肥胖範圍"),
      }[category] : "";
      definition = { a: local(lang, "Weight (kg)", "体重（千克）", "體重（公斤）"), b: local(lang, "Height (cm)", "身高（厘米）", "身高（公分）"), aError: numberError(a, value => value > 0 && value <= 1000, t.bmiWeightRange), bError: numberError(b, value => value > 0 && value <= 300, t.bmiHeightRange), value: result === null ? t.invalid : `${formatNumber(result, lang)} · ${categoryLabel}`, raw: result === null ? "" : String(result), note: t.healthNote };
      break;
    }
    case "compound": {
      const result = compoundInterest(a, b, c, d);
      const frequency = parseNumberInput(d);
      const frequencyValue = frequency.state === "valid" && Number.isInteger(frequency.value) && frequency.value >= 1 && frequency.value <= 365 ? frequency.value : null;
      definition = { a: local(lang, "Principal", "本金", "本金"), b: local(lang, "Annual rate (%)", "年利率（%）", "年利率（%）"), c: local(lang, "Years", "年数", "年數"), d: local(lang, "Compounds per year", "每年复利次数", "每年複利次數"), aError: numberError(a, value => value >= 0, t.nonNegative), bError: numberError(b, value => frequencyValue === null || 1 + (value / 100) / frequencyValue > 0, t.compoundRateRange), cError: numberError(c, value => value >= 0 && value <= 1000, t.yearRange), dError: numberError(d, value => Number.isInteger(value) && value >= 1 && value <= 365, t.frequencyRange), value: result ? `${formatNumber(result.amount, lang)} (${formatNumber(result.interest, lang)} ${local(lang, "interest", "利息", "利息")})` : t.invalid, raw: result ? String(result.amount) : "", note: t.financeNote };
      break;
    }
    case "date": {
      const result = dateInterval(a, b);
      definition = { a: local(lang, "Start date", "开始日期", "開始日期"), b: local(lang, "End date", "结束日期", "結束日期"), aType: "date", bType: "date", aError: a && result === null ? t.invalidDate : undefined, bError: b && result === null ? t.invalidDate : undefined, value: result === null ? t.invalid : `${result} ${local(lang, "days", "天", "天")}`, raw: result === null ? "" : String(result) };
      break;
    }
    default:
      definition = { a: "A", b: "B", value: t.invalid, raw: "" };
  }

  const help = fieldText.number[lang];
  return <div className="calculator-layout"><section className="input-panel"><h3>{t.input}</h3><div className="calculator-fields"><Field id={`${tool.id}-a`} label={definition.a} help={help.help} lang={lang} error={definition.aError}><input type={definition.aType ?? "number"} value={a} placeholder={help.placeholder} onChange={event => setA(event.target.value)} /></Field><Field id={`${tool.id}-b`} label={definition.b} help={help.help} lang={lang} error={definition.bError}><input type={definition.bType ?? "number"} value={b} placeholder={help.placeholder} onChange={event => setB(event.target.value)} /></Field>{definition.c && <Field id={`${tool.id}-c`} label={definition.c} help={help.help} lang={lang} error={definition.cError}><input type="number" value={c} placeholder={help.placeholder} onChange={event => setC(event.target.value)} /></Field>}{definition.d && <Field id={`${tool.id}-d`} label={definition.d} help={help.help} lang={lang} error={definition.dError}><input type="number" min="1" max="365" step="1" value={d} placeholder={help.placeholder} onChange={event => setD(event.target.value)} /></Field>}</div>{definition.note && <p className="helper-note">{definition.note}</p>}</section><ResultCard label={t.output} displayValue={definition.value} copyValue={definition.raw} invalidValues={[t.invalid]} lang={lang} onClear={() => { setA(""); setB(""); setC(""); setD(""); }} /></div>;
}
