import { useState } from "react";
import { messages, navLabels } from "../i18n";
import type { Lang, Page, Tool } from "../types";
import { Icon } from "./Icons";
import { ToolSidebar } from "./ToolSidebar";

type Props = {
  lang: Lang;
  activeTool: Tool | null;
  onLanguageChange: (lang: Lang) => void;
  onNavigate: (page: Page) => void;
  onOpenTool: (tool: Tool) => void;
  children: React.ReactNode;
};

export function AppShell({ lang, activeTool, onLanguageChange, onNavigate, onOpenTool, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = messages[lang];

  const navigate = (nextPage: Page) => {
    onNavigate(nextPage);
    setDrawerOpen(false);
  };

  const openTool = (tool: Tool) => {
    onOpenTool(tool);
    setDrawerOpen(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="mobile-menu-button icon-button" type="button" aria-label={t.menu} aria-expanded={drawerOpen} aria-controls="tool-navigation" onClick={() => setDrawerOpen(true)}>
          <Icon name="menu" size={20} />
        </button>
        <button className="brand" type="button" onClick={() => navigate("home")}>
          <span className="brand-mark">GH</span><span>{t.siteName}</span>
        </button>
        <label className="language">
          <span className="sr-only">Language</span>
          <select value={lang} onChange={event => onLanguageChange(event.target.value as Lang)}>
            <option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option>
          </select>
        </label>
      </header>

      <div className="app-layout">
        <aside className={drawerOpen ? "tool-drawer open" : "tool-drawer"} id="tool-navigation">
          <div className="drawer-head"><strong>{t.navigation}</strong><button className="icon-button" type="button" aria-label={t.closeMenu} onClick={() => setDrawerOpen(false)}><Icon name="close" /></button></div>
          <ToolSidebar lang={lang} activeToolId={activeTool?.id} onOpenTool={openTool} />
        </aside>
        {drawerOpen && <button type="button" className="drawer-backdrop" aria-label={t.closeMenu} onClick={() => setDrawerOpen(false)} />}
        <div className="main-column">{children}</div>
      </div>
      <footer>
        <span>© 2026 GoDeskHub. All rights reserved.</span>
        <nav className="footer-links" aria-label="Footer">
          {(["about", "privacy", "terms", "contact"] as Page[]).map(item => (
            <button type="button" key={item} onClick={() => navigate(item)}>{navLabels[item].en}</button>
          ))}
        </nav>
      </footer>
    </main>
  );
}
