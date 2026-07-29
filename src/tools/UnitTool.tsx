import { useState } from "react";
import { unitLabels } from "../catalog";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { SwapButton } from "../components/SwapButton";
import { fieldText, messages } from "../i18n";
import { UNIT_GROUPS, convertTemperature, convertUnit, formatNumber, validateTemperatureInput } from "../lib/core.js";
import { swapConversion } from "../lib/ui.js";
import type { Lang, Tool } from "../types";

export function UnitTool({ tool, lang }: { tool: Tool; lang: Lang }) {
  const t = messages[lang];
  const group = tool.group ? UNIT_GROUPS[tool.group] : null;
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(group?.defaultFrom ?? "c");
  const [to, setTo] = useState(group?.defaultTo ?? "f");
  const units = group ? Object.keys(group.units) : ["c", "f", "k"];
  const result = group ? convertUnit(value, tool.group, from, to) : convertTemperature(value, from, to);
  const temperatureState = group ? null : validateTemperatureInput(value, from);
  const error = value && result === null
    ? temperatureState?.state === "out-of-range" ? t.belowAbsoluteZero : t.invalid
    : undefined;
  const rawResult = result === null ? "" : String(result);
  const displayResult = result === null ? t.invalid : `${formatNumber(result, lang)} ${unitLabels[lang][to]}`;
  const valueCopy = fieldText.number[lang];
  const fromCopy = fieldText.fromUnit[lang];
  const toCopy = fieldText.toUnit[lang];

  const swap = () => {
    const next = swapConversion({ input: value, output: rawResult, from, to });
    setValue(next.input);
    setFrom(next.from);
    setTo(next.to);
  };

  return (
    <div className="converter-layout">
      <section className="input-panel" aria-labelledby={`${tool.id}-input-title`}>
        <h3 id={`${tool.id}-input-title`}>{t.input}</h3>
        <Field id={`${tool.id}-value`} label={valueCopy.label} help={valueCopy.help} lang={lang} error={error}>
          <input type="number" value={value} placeholder={valueCopy.placeholder} onChange={event => setValue(event.target.value)} />
        </Field>
        <div className="unit-pair">
          <Field id={`${tool.id}-from`} label={fromCopy.label} help={fromCopy.help} lang={lang}>
            <select value={from} onChange={event => setFrom(event.target.value)}>{units.map(unit => <option key={unit} value={unit}>{unitLabels[lang][unit]}</option>)}</select>
          </Field>
          <SwapButton lang={lang} onClick={swap} />
          <Field id={`${tool.id}-to`} label={toCopy.label} help={toCopy.help} lang={lang}>
            <select value={to} onChange={event => setTo(event.target.value)}>{units.map(unit => <option key={unit} value={unit}>{unitLabels[lang][unit]}</option>)}</select>
          </Field>
        </div>
      </section>
      <ResultCard label={t.output} displayValue={displayResult} copyValue={rawResult ? `${rawResult} ${unitLabels[lang][to]}` : ""} invalidValues={[t.invalid]} lang={lang} onClear={() => setValue("")} />
    </div>
  );
}
