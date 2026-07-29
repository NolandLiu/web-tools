import { useCallback, useEffect, useRef, useState } from "react";
import { TOOLS } from "../catalog";
import { messages } from "../i18n";
import { moveSearchSelection, searchTools } from "../lib/search.js";
import type { Lang, Tool } from "../types";
import { Icon } from "./Icons";

const searchCopy = {
  en: { shortcut: "Search all tools", close: "Close search", suggest: "No matching tool. Suggest a new tool" },
  "zh-CN": { shortcut: "搜索全部工具", close: "关闭搜索", suggest: "没有匹配工具。建议新工具" },
  "zh-TW": { shortcut: "搜尋全部工具", close: "關閉搜尋", suggest: "沒有相符工具。建議新工具" },
} satisfies Record<Lang, Record<string, string>>;

export function SearchDialog({
  lang,
  onOpenTool,
}: {
  lang: Lang;
  onOpenTool: (tool: Tool) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const results = searchTools(query, lang, 8);

  const openDialog = useCallback(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openDialog();
      }
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [closeDialog, openDialog]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const choose = (toolId: string) => {
    const tool = TOOLS.find(item => item.id === toolId);
    if (!tool) return;
    onOpenTool(tool);
    closeDialog();
    setQuery("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(current => moveSearchSelection(
        current,
        event.key === "ArrowDown" ? "next" : "previous",
        results.length,
      ));
    } else if (event.key === "Enter" && selected >= 0 && selected < results.length) {
      event.preventDefault();
      choose(results[selected].toolId);
    } else if (event.key === "Escape") {
      closeDialog();
    }
  };

  return (
    <>
      <button className="global-search-button" type="button" onClick={openDialog}>
        <Icon name="search" size={17} />
        <span>{searchCopy[lang].shortcut}</span>
        <kbd>⌘ / Ctrl K</kbd>
      </button>
      {open && (
        <div className="search-overlay" role="presentation" onMouseDown={event => {
          if (event.target === event.currentTarget) closeDialog();
        }}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-label={searchCopy[lang].shortcut}>
            <div className="dialog-search-box">
              <Icon name="search" size={20} />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls="global-search-results"
                aria-activedescendant={selected >= 0 ? `search-result-${results[selected]?.toolId}` : undefined}
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setSelected(event.target.value ? 0 : -1);
                }}
                onKeyDown={onKeyDown}
                placeholder={messages[lang].search}
              />
              <button className="icon-button" type="button" aria-label={searchCopy[lang].close} onClick={closeDialog}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="search-results" id="global-search-results" role="listbox">
              {results.map((result, index) => (
                <a
                  id={`search-result-${result.toolId}`}
                  role="option"
                  aria-selected={selected === index}
                  className={selected === index ? "selected" : ""}
                  href={result.path}
                  key={result.toolId}
                  onMouseEnter={() => setSelected(index)}
                  onClick={event => {
                    event.preventDefault();
                    choose(result.toolId);
                  }}
                >
                  <strong>{result.name}</strong>
                  <span>{result.category}</span>
                  <small>{result.summary}</small>
                </a>
              ))}
              {query && results.length === 0 && (
                <a className="search-empty" href="mailto:support@godeskhub.com?subject=GoDeskHub%20tool%20suggestion">
                  {searchCopy[lang].suggest}
                </a>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
