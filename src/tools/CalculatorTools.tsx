import { useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { fieldText, messages } from "../i18n";
import { bmi, compoundInterest, dateInterval, discountPrice, formatNumber, percentOf } from "../lib/core.js";
import type { Lang, Tool } from "../types";

const local = (lang: Lang, en: string, zhCN: string, zhTW: string) => lang === "en" ? en : lang === "zh-CN" ? zhCN : zhTW;

type Definition = { a: string; b: string; c?: string; aType?: string; bType?: string; note?: string; value: string; raw: string };

export function CalculatorTool({ tool, lang }: { tool: Tool; lang: Lang }) {
  const [a, setA] = useState(tool.calculator === "date" ? "2024-01-01" : "10");
  const [b, setB] = useState(tool.calculator === "date" ? "2024-01-31" : "100");
  const [c, setC] = useState("12");
  const t = messages[lang];
  let definition: Definition;

  switch (tool.calculator) {
    case "percentage": {
      const result = percentOf(a, b);
      definition = { a: local(lang, "Percentage", "百分比", "百分比"), b: local(lang, "Base value", "基准数值", "基準數值"), value: result === null ? t.invalid : formatNumber(result, lang), raw: result === null ? "" : String(result) };
      break;
    }
    case "discount": {
      const result = discountPrice(a, b);
      definition = { a: local(lang, "Original price", "原价", "原價"), b: local(lang, "Discount rate (%)", "折扣率（%）", "折扣率（%）"), value: result ? `${formatNumber(result.finalPrice, lang)} (${formatNumber(result.saved, lang)} ${local(lang, "saved", "已节省", "已省下")})` : t.invalid, raw: result ? `${result.finalPrice}` : "", note: t.financeNote };
      break;
    }
    case "bmi": {
      const result = bmi(a, b);
      definition = { a: local(lang, "Weight (kg)", "体重（千克）", "體重（公斤）"), b: local(lang, "Height (cm)", "身高（厘米）", "身高（公分）"), value: result === null ? t.invalid : formatNumber(result, lang), raw: result === null ? "" : String(result), note: t.healthNote };
      break;
    }
    case "compound": {
      const result = compoundInterest(a, b, c);
      definition = { a: local(lang, "Principal", "本金", "本金"), b: local(lang, "Annual rate (%)", "年利率（%）", "年利率（%）"), c: local(lang, "Years", "年数", "年數"), value: result ? `${formatNumber(result.amount, lang)} (${formatNumber(result.interest, lang)} ${local(lang, "interest", "利息", "利息")})` : t.invalid, raw: result ? String(result.amount) : "", note: t.financeNote };
      break;
    }
    case "date": {
      const result = dateInterval(a, b);
      definition = { a: local(lang, "Start date", "开始日期", "開始日期"), b: local(lang, "End date", "结束日期", "結束日期"), aType: "date", bType: "date", value: result === null ? t.invalid : `${result} ${local(lang, "days", "天", "天")}`, raw: result === null ? "" : String(result) };
      break;
    }
    default:
      definition = { a: "A", b: "B", value: t.invalid, raw: "" };
  }

  const help = fieldText.number[lang];
  return <div className="calculator-layout"><section className="input-panel"><h3>{t.input}</h3><div className="calculator-fields"><Field id={`${tool.id}-a`} label={definition.a} help={help.help} lang={lang}><input type={definition.aType ?? "number"} value={a} placeholder={help.placeholder} onChange={event => setA(event.target.value)} /></Field><Field id={`${tool.id}-b`} label={definition.b} help={help.help} lang={lang}><input type={definition.bType ?? "number"} value={b} placeholder={help.placeholder} onChange={event => setB(event.target.value)} /></Field>{definition.c && <Field id={`${tool.id}-c`} label={definition.c} help={help.help} lang={lang}><input type="number" value={c} placeholder={help.placeholder} onChange={event => setC(event.target.value)} /></Field>}</div>{definition.note && <p className="helper-note">{definition.note}</p>}</section><ResultCard label={t.output} displayValue={definition.value} copyValue={definition.raw} invalidValues={[t.invalid]} lang={lang} onClear={() => { setA(""); setB(""); setC(""); }} /></div>;
}
