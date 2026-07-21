import { useEffect, useState } from "react";
import { messages } from "../i18n";
import { getCopyState } from "../lib/ui.js";
import type { Lang } from "../types";
import { Icon } from "./Icons";

type Props = {
  label: string;
  displayValue: React.ReactNode;
  copyValue: string;
  lang: Lang;
  invalidValues?: string[];
  code?: boolean;
  onClear?: () => void;
  secondaryAction?: React.ReactNode;
};

export function ResultCard({ label, displayValue, copyValue, lang, invalidValues = [], code, onClear, secondaryAction }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const disabled = getCopyState(copyValue, invalidValues) === "disabled";
  const t = messages[lang];

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section className={code ? "result-card code-result" : "result-card"} aria-label={label}>
      <div className="result-head">
        <span className="result-label">{label}</span>
        <button type="button" className="result-copy" disabled={disabled} onClick={() => void copy()}>
          <Icon name={status === "copied" ? "check" : "copy"} size={16} />
          <span>{status === "copied" ? t.copied : t.copy}</span>
        </button>
      </div>
      <div className="result-value">{displayValue}</div>
      <span className={status === "failed" ? "copy-status error" : "copy-status"} aria-live="polite">
        {status === "failed" ? t.copyFailed : status === "copied" ? t.copied : ""}
      </span>
      {(onClear || secondaryAction) && <div className="result-actions">{secondaryAction}{onClear && <button type="button" className="button-secondary" onClick={onClear}>{t.clear}</button>}</div>}
    </section>
  );
}
