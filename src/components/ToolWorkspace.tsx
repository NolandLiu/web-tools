import { TOOLS, categories, toolText } from "../catalog";
import { messages } from "../i18n";
import type { Lang, Tool } from "../types";
import { CalculatorTool } from "../tools/CalculatorTools";
import { QrTool } from "../tools/QrTool";
import { Base64Tool, CaseTool, ColorTool, JsonTool, TextTool, TimestampTool, UrlTool, UuidTool } from "../tools/TextTools";
import { UnitTool } from "../tools/UnitTool";
import { Icon } from "./Icons";

export function ToolWorkspace({ tool, lang, onOpenTool }: { tool: Tool; lang: Lang; onOpenTool: (tool: Tool) => void }) {
  const t = messages[lang];
  const text = toolText[tool.id][lang];
  const related = TOOLS.filter(item => item.category === tool.category && item.id !== tool.id).slice(0, 3);

  return (
    <article className="workspace" id="tool-workspace" aria-labelledby="tool-title">
      <nav className="breadcrumb" aria-label="Breadcrumb"><span>{categories[tool.category][lang]}</span><Icon name="chevron" size={14} /><strong>{text.name}</strong></nav>
      <header className="workspace-head">
        <span className="workspace-icon"><Icon name={tool.icon} size={28} /></span>
        <div><h1 id="tool-title">{text.name}</h1><p>{text.description}</p><span className="privacy-note"><Icon name="check" size={14} />{t.privacyBadge}</span></div>
      </header>
      <div className="tool-surface">
        {tool.kind === "unit" && <UnitTool tool={tool} lang={lang} />}
        {tool.kind === "json" && <JsonTool lang={lang} />}
        {tool.kind === "base64" && <Base64Tool lang={lang} />}
        {tool.kind === "url" && <UrlTool lang={lang} />}
        {tool.kind === "uuid" && <UuidTool lang={lang} />}
        {tool.kind === "timestamp" && <TimestampTool lang={lang} />}
        {tool.kind === "case" && <CaseTool lang={lang} />}
        {tool.kind === "text" && <TextTool lang={lang} />}
        {tool.kind === "color" && <ColorTool lang={lang} />}
        {tool.kind === "calculator" && <CalculatorTool tool={tool} lang={lang} />}
        {tool.kind === "qr" && <QrTool lang={lang} />}
      </div>
      <section className="usage-section"><h2>{t.usage}</h2><p>{lang === "en" ? "Enter the requested values, review the result, then use the copy button to reuse it instantly." : lang === "zh-CN" ? "填写所需内容并检查结果，然后使用复制按钮快速复用输出。" : "填寫所需內容並檢查結果，接著使用複製按鈕快速重用輸出。"}</p></section>
      {related.length > 0 && <section className="related-section"><h2>{t.related}</h2><div className="related-grid">{related.map(item => <button type="button" key={item.id} onClick={() => onOpenTool(item)}><Icon name={item.icon} size={18} /><span>{toolText[item.id][lang].name}</span><Icon name="chevron" size={14} /></button>)}</div></section>}
    </article>
  );
}
