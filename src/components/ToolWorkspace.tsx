import { categories, toolText } from "../catalog";
import { messages } from "../i18n";
import type { Lang, Tool } from "../types";
import { CalculatorTool } from "../tools/CalculatorTools";
import { ChequeTool } from "../tools/ChequeTool";
import { IrrTool } from "../tools/IrrTool";
import { PasswordTool } from "../tools/PasswordTool";
import { QrTool } from "../tools/QrTool";
import { Base64Tool, CaseTool, ColorTool, JsonTool, TextTool, TimestampTool, UrlTool, UuidTool } from "../tools/TextTools";
import { UnitTool } from "../tools/UnitTool";
import { Icon } from "./Icons";
import { ToolContentSections } from "./ToolContentSections";
import { ToolFeedback } from "./ToolFeedback";

export function ToolWorkspace({ tool, lang, onOpenTool }: { tool: Tool; lang: Lang; onOpenTool: (tool: Tool) => void }) {
  const t = messages[lang];
  const text = toolText[tool.id][lang];

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
        {tool.kind === "cheque" && <ChequeTool lang={lang} />}
        {tool.kind === "irr" && <IrrTool lang={lang} />}
        {tool.kind === "password" && <PasswordTool lang={lang} />}
        {tool.kind === "qr" && <QrTool lang={lang} />}
      </div>
      <ToolContentSections tool={tool} lang={lang} onOpenTool={onOpenTool} />
      <ToolFeedback tool={tool} lang={lang} />
    </article>
  );
}
