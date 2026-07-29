import { categories, TOOLS, toolText } from "../catalog";
import { TOOL_CONTENT } from "../content/index.js";
import { messages } from "../i18n";
import type { Lang, Tool } from "../types";
import { Icon } from "./Icons";

export function ToolContentSections({
  tool,
  lang,
  onOpenTool,
}: {
  tool: Tool;
  lang: Lang;
  onOpenTool: (tool: Tool) => void;
}) {
  const content = TOOL_CONTENT[tool.id][lang];
  const t = messages[lang];
  const related = TOOLS
    .filter(item => item.category === tool.category && item.id !== tool.id)
    .slice(0, 3);

  return (
    <div className="tool-content">
      <p className="tool-introduction">{content.introduction}</p>

      <div className="content-columns">
        <section className="content-section">
          <h2>{t.useCases}</h2>
          <ul>{content.useCases.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="content-section">
          <h2>{t.usage}</h2>
          <ol>{content.steps.map(step => <li key={step}>{step}</li>)}</ol>
        </section>
      </div>

      <section className="content-section example-section">
        <h2>{t.example}</h2>
        <h3>{content.example.title}</h3>
        <p>{content.example.description}</p>
      </section>

      <div className="content-columns">
        <section className="content-section">
          <h2>{t.principles}</h2>
          <ul>{content.principles.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="content-section">
          <h2>{t.limitations}</h2>
          <ul>{content.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <section className="content-section faq-section">
        <h2>{t.faq}</h2>
        <div className="faq-list">
          {content.faqs.map(item => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="content-section reference-section">
        <h2>{t.references}</h2>
        <ul>
          {content.references.map(reference => (
            <li key={reference.url}>
              <a href={reference.url} target="_blank" rel="noreferrer">{reference.label}</a>
            </li>
          ))}
        </ul>
        <p className="reviewed-date">{t.reviewed}: <time dateTime={content.reviewedAt}>{content.reviewedAt}</time></p>
      </section>

      {related.length > 0 && (
        <section className="related-section">
          <h2>{t.related}</h2>
          <p className="section-context">{categories[tool.category][lang]}</p>
          <div className="related-grid">
            {related.map(item => (
              <button type="button" key={item.id} onClick={() => onOpenTool(item)}>
                <Icon name={item.icon} size={18} />
                <span>{toolText[item.id][lang].name}</span>
                <Icon name="chevron" size={14} />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
