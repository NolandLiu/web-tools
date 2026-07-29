import { CATEGORIES, TOOLS } from "../registry.js";
import { messages } from "../i18n";
import type { CategoryId, Lang, Tool } from "../types";
import { Icon } from "./Icons";

export function CategoryPage({
  categoryId,
  lang,
  onOpenTool,
}: {
  categoryId: CategoryId;
  lang: Lang;
  onOpenTool: (tool: Tool) => void;
}) {
  const category = CATEGORIES.find(item => item.id === categoryId);
  const tools = TOOLS.filter(tool => tool.category === categoryId);

  if (!category) return null;

  return (
    <section className="directory category-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">{messages[lang].categories}</span>
          <h1>{category.text[lang].name}</h1>
          <p>{category.text[lang].description}</p>
        </div>
        <span>{tools.length} {messages[lang].tools}</span>
      </div>
      <div className="tools-grid">
        {tools.map(tool => (
          <button type="button" className="tool-card" key={tool.id} onClick={() => onOpenTool(tool)}>
            <span className="tool-icon"><Icon name={tool.icon} size={22} /></span>
            <span className="tool-copy">
              <strong>{tool.text[lang].name}</strong>
              <small>{tool.text[lang].description}</small>
            </span>
            <span className="card-action">{messages[lang].open}<Icon name="chevron" size={14} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
