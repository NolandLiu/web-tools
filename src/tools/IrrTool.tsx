import { useMemo, useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { formatNumber } from "../lib/core.js";
import {
  addCashFlowInput,
  annualizeIrr,
  cashFlowFocusAfterRemoval,
  parseCashFlowInputs,
  removeCashFlowInput,
  roundIrrPercent,
  solveFixedPeriodIrr,
} from "../lib/irr.js";
import type { Lang } from "../types";

const PERIODS = { month: 12, quarter: 4, year: 1 } as const;

const copy = {
  en: {
    input: "Cash flows",
    period: "Period type",
    periodHelp: "Cash flows are assumed to occur at equal monthly, quarterly, or yearly intervals.",
    periods: { month: "Monthly", quarter: "Quarterly", year: "Yearly" },
    row: "Period",
    amount: "Cash flow amount",
    amountHelp: "Enter a strict decimal or scientific-notation amount. Empty values are not treated as zero.",
    add: "Add cash flow",
    remove: "Remove cash flow",
    clear: "Clear",
    example: "Restore example",
    periodic: "IRR per period",
    annualized: "Annualized IRR",
    empty: "Complete every cash-flow amount.",
    editing: "Finish entering this cash-flow amount.",
    invalid: "Enter a valid finite cash-flow amount.",
    missingNegative: "Add at least one negative cash flow.",
    missingPositive: "Add at least one positive cash flow.",
    missingBoth: "Add at least one negative and one positive cash flow.",
    noRoot: "No IRR was found within the bounded search range.",
    multiple: "This cash-flow sequence may have multiple IRRs and cannot be represented unambiguously by one rate.",
    nonConvergent: "Candidate root intervals were found, but the solver could not converge safely.",
    candidates: "Detected candidate IRRs",
    note: "IRR is a mathematical result for equally spaced cash flows. It is not a guaranteed return or investment advice.",
  },
  "zh-CN": {
    input: "现金流",
    period: "周期类型",
    periodHelp: "现金流按等间隔的月、季度或年发生。",
    periods: { month: "月", quarter: "季度", year: "年" },
    row: "第",
    amount: "期现金流金额",
    amountHelp: "输入严格十进制或科学计数法金额。空值不会按 0 处理。",
    add: "添加现金流",
    remove: "删除现金流",
    clear: "清空",
    example: "恢复示例",
    periodic: "每期 IRR",
    annualized: "年化 IRR",
    empty: "请填写全部现金流金额。",
    editing: "请完成当前现金流金额输入。",
    invalid: "请输入有效且有限的现金流金额。",
    missingNegative: "至少需要一笔负现金流。",
    missingPositive: "至少需要一笔正现金流。",
    missingBoth: "至少需要一笔负现金流和一笔正现金流。",
    noRoot: "在受控搜索范围内没有找到 IRR。",
    multiple: "该现金流可能存在多个 IRR，不能由单一收益率无歧义表示。",
    nonConvergent: "检测到候选根区间，但求解器无法安全收敛。",
    candidates: "检测到的候选 IRR",
    note: "IRR 是等间隔现金流的数学结果，不代表保证收益，也不构成投资建议。",
  },
  "zh-TW": {
    input: "現金流",
    period: "週期類型",
    periodHelp: "現金流按等間隔的月、季度或年發生。",
    periods: { month: "月", quarter: "季度", year: "年" },
    row: "第",
    amount: "期現金流金額",
    amountHelp: "輸入嚴格十進位或科學記號金額。空值不會按 0 處理。",
    add: "新增現金流",
    remove: "刪除現金流",
    clear: "清除",
    example: "還原範例",
    periodic: "每期 IRR",
    annualized: "年化 IRR",
    empty: "請填寫全部現金流金額。",
    editing: "請完成目前現金流金額輸入。",
    invalid: "請輸入有效且有限的現金流金額。",
    missingNegative: "至少需要一筆負現金流。",
    missingPositive: "至少需要一筆正現金流。",
    missingBoth: "至少需要一筆負現金流和一筆正現金流。",
    noRoot: "在受控搜尋範圍內沒有找到 IRR。",
    multiple: "此現金流可能存在多個 IRR，不能由單一收益率無歧義表示。",
    nonConvergent: "偵測到候選根區間，但求解器無法安全收斂。",
    candidates: "偵測到的候選 IRR",
    note: "IRR 是等間隔現金流的數學結果，不代表保證收益，也不構成投資建議。",
  },
} as const;

const formatRate = (rate: number, lang: Lang) => `${formatNumber(roundIrrPercent(rate), lang)}%`;

export function IrrTool({ lang }: { lang: Lang }) {
  const [cashFlows, setCashFlows] = useState(["-1000", "1100"]);
  const [period, setPeriod] = useState<keyof typeof PERIODS>("year");
  const t = copy[lang];
  const parsed = useMemo(() => parseCashFlowInputs(cashFlows), [cashFlows]);
  const result = useMemo(
    () => parsed.ok ? solveFixedPeriodIrr(parsed.values) : null,
    [parsed],
  );

  const updateCashFlow = (index: number, value: string) => {
    setCashFlows(current => current.map((item, itemIndex) => itemIndex === index ? value : item));
  };
  const focusCashFlow = (index: number) => {
    requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>(`[data-irr-index="${index}"]`)?.focus();
    });
  };
  const addCashFlow = () => {
    setCashFlows(current => {
      const next = addCashFlowInput(current);
      if (next !== current) focusCashFlow(next.length - 1);
      return next;
    });
  };
  const removeCashFlow = (index: number) => {
    setCashFlows(current => {
      const next = removeCashFlowInput(current, index);
      if (next !== current) focusCashFlow(cashFlowFocusAfterRemoval(current.length, index));
      return next;
    });
  };

  const parserMessage = !parsed.ok
    ? parsed.reason === "empty" ? t.empty : parsed.reason === "editing" ? t.editing : t.invalid
    : "";
  const diagnostic = result?.status === "invalid"
    ? result.reason === "missing-negative" ? t.missingNegative
      : result.reason === "missing-positive" ? t.missingPositive
        : t.missingBoth
    : result?.status === "no-root" ? t.noRoot
      : result?.status === "multiple" ? t.multiple
        : result?.status === "non-convergent" ? t.nonConvergent
          : "";

  const periodicRate = result?.status === "single" ? result.rate : null;
  const annualizedRate = periodicRate === null ? null : annualizeIrr(periodicRate, PERIODS[period]);

  return (
    <div className="calculator-layout irr-tool">
      <section className="input-panel">
        <h3>{t.input}</h3>
        <Field id="irr-period" label={t.period} help={t.periodHelp} lang={lang}>
          <select value={period} onChange={event => setPeriod(event.target.value as keyof typeof PERIODS)}>
            {Object.entries(t.periods).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </Field>
        <div className="cash-flow-list">
          {cashFlows.map((value, index) => {
            const error = !parsed.ok && parsed.index === index ? parserMessage : undefined;
            return (
              <div className="cash-flow-row" key={index}>
                <Field id={`irr-cash-flow-${index}`} label={`${t.row} ${index} ${t.amount}`} help={t.amountHelp} lang={lang} error={error}>
                  <input
                    data-irr-index={index}
                    inputMode="decimal"
                    value={value}
                    onChange={event => updateCashFlow(index, event.target.value)}
                  />
                </Field>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={cashFlows.length <= 2}
                  aria-label={`${t.remove} ${index}`}
                  onClick={() => removeCashFlow(index)}
                >
                  {t.remove}
                </button>
              </div>
            );
          })}
        </div>
        <div className="result-actions">
          <button type="button" className="button-secondary" disabled={cashFlows.length >= 200} onClick={addCashFlow}>{t.add}</button>
          <button type="button" className="button-secondary" onClick={() => setCashFlows(["", ""])}>{t.clear}</button>
          <button type="button" className="button-secondary" onClick={() => setCashFlows(["-1000", "1100"])}>{t.example}</button>
        </div>
        <p className="helper-note">{t.note}</p>
      </section>
      <section className="stacked-tools" aria-live="polite" aria-atomic="true">
        {periodicRate !== null && annualizedRate !== null ? (
          <>
            <ResultCard label={t.periodic} displayValue={formatRate(periodicRate, lang)} copyValue={formatRate(periodicRate, lang)} lang={lang} />
            <ResultCard label={t.annualized} displayValue={formatRate(annualizedRate, lang)} copyValue={formatRate(annualizedRate, lang)} lang={lang} />
          </>
        ) : (
          <section className="result-card" aria-label={t.periodic}>
            <div className="result-value">{parserMessage || diagnostic || "—"}</div>
            {result?.status === "multiple" && (
              <div>
                <strong>{t.candidates}</strong>
                <ul>{result.roots.map(rate => <li key={rate}>{formatRate(rate, lang)}</li>)}</ul>
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
}
