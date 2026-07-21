import { useMemo, useState } from "react";
import { CATEGORY_ORDER, TOOLS, categories, toolText } from "../catalog";
import { messages } from "../i18n";
import { buildToolTree } from "../lib/ui.js";
import type { Lang, Tool } from "../types";
import { Icon } from "./Icons";

type Props = {
  lang: Lang;
  activeToolId?: string;
  onOpenTool: (tool: Tool) => void;
};

export function ToolSidebar({ lang, activeToolId, onOpenTool }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(CATEGORY_ORDER.map(id => [id, true])));
  const tree = useMemo(() => buildToolTree(TOOLS, CATEGORY_ORDER), []);
  const t = messages[lang];

  return (
    <nav className="sidebar-tree" aria-label={t.navigation}>
      <div className="sidebar-heading">{t.allTools}</div>
      {tree.map(group => (
        <div className="sidebar-group" key={group.id}>
          <button
            type="button"
            className="sidebar-category"
            aria-expanded={expanded[group.id]}
            onClick={() => setExpanded(current => ({ ...current, [group.id]: !current[group.id] }))}
          >
            <span>{categories[group.id as keyof typeof categories][lang]}</span>
            <Icon name="chevron" size={16} className={expanded[group.id] ? "chevron expanded" : "chevron"} />
          </button>
          {expanded[group.id] && (
            <div className="sidebar-tools">
              {group.tools.map(tool => (
                <button
                  type="button"
                  className="sidebar-tool"
                  aria-current={activeToolId === tool.id ? "page" : undefined}
                  key={tool.id}
                  onClick={() => onOpenTool(tool)}
                >
                  <span className="sidebar-tool-icon"><Icon name={tool.icon} size={18} /></span>
                  <span>{toolText[tool.id][lang].name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
