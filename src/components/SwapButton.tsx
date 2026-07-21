import { messages } from "../i18n";
import type { Lang } from "../types";
import { Icon } from "./Icons";

export function SwapButton({ lang, onClick }: { lang: Lang; onClick: () => void }) {
  return (
    <button type="button" className="swap-button" aria-label={messages[lang].swap} title={messages[lang].swap} onClick={onClick}>
      <Icon name="swap" size={18} />
      <span>{messages[lang].swap}</span>
    </button>
  );
}
