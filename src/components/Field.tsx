import { cloneElement, useId, useState, type ReactElement } from "react";
import { messages } from "../i18n";
import type { Lang } from "../types";
import { Icon } from "./Icons";

type Props = {
  id: string;
  label: string;
  help: string;
  lang: Lang;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
};

export function Field({ id, label, help, lang, error, children }: Props) {
  const [open, setOpen] = useState(false);
  const instanceId = useId().replace(/:/g, "");
  const helpId = `${id}-${instanceId}-help`;
  const errorId = error ? `${id}-${instanceId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ");
  const control = cloneElement(children, {
    id: `${id}-${instanceId}`,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
  });

  return (
    <div className={error ? "field has-error" : "field"}>
      <div className="field-label-row">
        <label htmlFor={`${id}-${instanceId}`}>{label}</label>
        <button type="button" className="help-trigger" aria-label={messages[lang].showHelp} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          <Icon name="info" size={16} />
        </button>
        {open && <span className="field-tooltip" role="tooltip">{help}</span>}
      </div>
      {control}
      <span className="sr-only" id={helpId}>{help}</span>
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}
