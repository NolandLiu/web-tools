import { useEffect, useMemo, useState } from "react";
import { CATEGORY_ORDER, TOOLS, categories, toolText } from "./catalog";
import { AppShell } from "./components/AppShell";
import { Icon } from "./components/Icons";
import { ToolWorkspace } from "./components/ToolWorkspace";
import { LANGS, messages, navLabels } from "./i18n";
import { readToolStats, sortToolsByPopularity, trackToolOpen } from "./lib/core.js";
import type { Lang, Page, Tool } from "./types";

function detectLanguage(): Lang {
  const saved = localStorage.getItem("lite-tools:lang");
  if (LANGS.includes(saved as Lang)) return saved as Lang;
  const browser = navigator.language;
  if (browser.startsWith("zh-TW") || browser.startsWith("zh-HK") || browser.startsWith("zh-MO")) return "zh-TW";
  if (browser.startsWith("zh")) return "zh-CN";
  return "en";
}

function pageFromPath(): Page {
  const path = window.location.pathname;
  if (path === "/" || path === "/index.html") return "home";
  if (path === "/about") return "about";
  if (path === "/privacy") return "privacy";
  if (path === "/terms") return "terms";
  if (path === "/contact") return "contact";
  return "not-found";
}

function App() {
  const [lang, setLang] = useState<Lang>(detectLanguage);
  const [page, setPage] = useState<Page>(pageFromPath);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [stats, setStats] = useState(() => readToolStats(localStorage));
  const t = messages[lang];

  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem("lite-tools:lang", lang); }, [lang]);
  useEffect(() => { const onPop = () => { setPage(pageFromPath()); setActiveTool(null); }; window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);

  const ranked = useMemo(() => sortToolsByPopularity(TOOLS, stats), [stats]);
  const filtered = ranked.filter(tool => {
    const text = toolText[tool.id][lang];
    const haystack = `${text.name} ${text.description} ${categories[tool.category][lang]}`.toLocaleLowerCase();
    return (category === "all" || tool.category === category) && haystack.includes(query.toLocaleLowerCase());
  });

  const navigate = (next: Page) => {
    const path = next === "home" ? "/" : `/${next}`;
    window.history.pushState(null, "", path);
    setPage(next);
    setActiveTool(null);
  };

  const openTool = (tool: Tool) => {
    setPage("home");
    setActiveTool(tool);
    setStats(trackToolOpen(localStorage, tool.id));
    requestAnimationFrame(() => document.getElementById("tool-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <AppShell lang={lang} page={page} activeTool={activeTool} onLanguageChange={setLang} onNavigate={navigate} onOpenTool={openTool}>
      {page === "home" ? activeTool ? <ToolWorkspace key={activeTool.id} tool={activeTool} lang={lang} onOpenTool={openTool} /> : (
        <HomeDirectory lang={lang} query={query} setQuery={setQuery} category={category} setCategory={setCategory} tools={filtered} onOpenTool={openTool} />
      ) : <InfoPage page={page} lang={lang} navigate={navigate} />}
    </AppShell>
  );
}

function HomeDirectory({ lang, query, setQuery, category, setCategory, tools, onOpenTool }: {
  lang: Lang; query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; tools: Tool[]; onOpenTool: (tool: Tool) => void;
}) {
  const t = messages[lang];
  return <><section className="hero"><span className="hero-pill"><Icon name="check" size={14} />{t.privacyBadge}</span><h1>{t.siteName}</h1><p>{t.tagline}</p><label className="search-box"><Icon name="search" size={20} /><span className="sr-only">{t.search}</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} /></label></section><section className="directory"><div className="section-head"><div><span className="eyebrow">{t.popular}</span><h2>{t.allTools}</h2></div><span>{tools.length} {t.tools}</span></div><div className="category-row" aria-label={t.categories}><button type="button" className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>{t.allTools}</button>{CATEGORY_ORDER.map(id => <button type="button" key={id} className={category === id ? "active" : ""} onClick={() => setCategory(id)}>{categories[id][lang]}</button>)}</div><div className="tools-grid">{tools.map(tool => <ToolCard key={tool.id} tool={tool} lang={lang} onClick={() => onOpenTool(tool)} />)}</div>{tools.length === 0 && <p className="empty">{t.noResults}</p>}</section></>;
}

function ToolCard({ tool, lang, onClick }: { tool: Tool; lang: Lang; onClick: () => void }) {
  const text = toolText[tool.id][lang];
  return <button type="button" className="tool-card" onClick={onClick}><span className="tool-icon"><Icon name={tool.icon} size={22} /></span><span className="tool-copy"><strong>{text.name}</strong><small>{text.description}</small></span><span className="card-action">{messages[lang].open}<Icon name="chevron" size={14} /></span></button>;
}

function InfoPage({ page, lang, navigate }: { page: Page; lang: Lang; navigate: (page: Page) => void }) {
  const t = messages[lang];
  const title = navLabels[page][lang];
  const bodies: Record<Exclude<Page, "home">, Record<Lang, string[]>> = {
    about: { en: [t.tagline, "Original browser-side utilities for conversion, formatting, calculation, and QR Codes."], "zh-CN": [t.tagline, "提供原创的浏览器本地转换、格式处理、计算和 QR Code 工具。"], "zh-TW": [t.tagline, "提供原創的瀏覽器本機轉換、格式處理、計算與 QR Code 工具。"] },
    privacy: { en: ["Tool input is processed locally in your browser.", "Only local usage counts are stored in localStorage."], "zh-CN": ["所有工具输入均在浏览器本地处理。", "仅在 localStorage 中保存本地使用次数。"], "zh-TW": ["所有工具輸入均在瀏覽器本機處理。", "僅在 localStorage 中儲存本機使用次數。"] },
    terms: { en: ["Use these tools at your own discretion.", "Financial and health results are references only."], "zh-CN": ["请自行判断并使用这些工具。", "财务和健康类结果仅供参考。"], "zh-TW": ["請自行判斷並使用這些工具。", "財務與健康類結果僅供參考。"] },
    contact: { en: ["Use the project channels for feedback.", "Do not send secrets or private data in public reports."], "zh-CN": ["请通过项目渠道提供反馈。", "不要在公开报告中发送密钥或私密数据。"], "zh-TW": ["請透過專案管道提供回饋。", "不要在公開報告中傳送密鑰或私密資料。"] },
    "not-found": { en: ["The page was not found."], "zh-CN": ["没有找到该页面。"], "zh-TW": ["找不到該頁面。"] },
  };
  return <section className="info-page"><span className="eyebrow">{title}</span><h1>{title}</h1>{bodies[page as Exclude<Page, "home">][lang].map(line => <p key={line}>{line}</p>)}<button type="button" onClick={() => navigate("home")}>{t.home}</button></section>;
}

export default App;
