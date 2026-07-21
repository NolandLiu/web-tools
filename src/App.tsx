import { useEffect, useMemo, useState } from "react";
import { CATEGORY_ORDER, TOOLS, categories, toolText } from "./catalog";
import { AppShell } from "./components/AppShell";
import { Icon } from "./components/Icons";
import { ToolWorkspace } from "./components/ToolWorkspace";
import { LANGS, messages, navLabels } from "./i18n";
import { readToolStats, sortToolsByPopularity, trackToolOpen } from "./lib/core.js";
import type { Lang, Page, Tool } from "./types";

type InfoSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

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
  const pages: Record<Exclude<Page, "home">, Record<Lang, { heading: string; intro: string[]; sections: InfoSection[] }>> = {
    about: {
      en: {
        heading: "About GoDeskHub",
        intro: ["Welcome to GoDeskHub.", "GoDeskHub is a modern, web-based platform dedicated to providing free, fast, and lightweight online productivity tools. Our mission is to simplify your daily workflow, whether you are converting units, formatting code, generating QR Codes, or checking everyday calculations without software installations or expensive subscriptions."],
        sections: [{ heading: "Why Choose Us?", bullets: ["100% Free & Accessible: core tools are free to use directly from your browser.", "Privacy & Security First: many utilities process data locally, helping your content stay on your device.", "Minimalist & Fast: GoDeskHub is built for speed, efficiency, and ease of use with uncluttered interfaces."] }, { paragraphs: ["Have feedback, feature requests, or questions? Contact us at support@godeskhub.com."] }],
      },
      "zh-CN": {
        heading: "关于 GoDeskHub",
        intro: ["欢迎使用 GoDeskHub。", "GoDeskHub 是一个现代化的网页工具平台，提供免费、快速、轻量的在线效率工具。我们希望帮助用户在无需安装软件或购买订阅的情况下完成单位转换、代码格式化、QR Code 生成和日常计算。"],
        sections: [{ heading: "为什么选择我们？", bullets: ["免费且易访问：核心工具可直接在浏览器中使用。", "隐私与安全优先：许多工具在浏览器本地处理数据，帮助内容留在你的设备上。", "简洁快速：界面保持清爽，专注效率和易用性。"] }, { paragraphs: ["如有反馈、功能建议或问题，请联系 support@godeskhub.com。"] }],
      },
      "zh-TW": {
        heading: "關於 GoDeskHub",
        intro: ["歡迎使用 GoDeskHub。", "GoDeskHub 是一個現代化的網頁工具平台，提供免費、快速、輕量的線上效率工具。我們希望協助使用者在不安裝軟體或購買訂閱的情況下完成單位轉換、程式碼格式化、QR Code 產生和日常計算。"],
        sections: [{ heading: "為什麼選擇我們？", bullets: ["免費且容易使用：核心工具可直接在瀏覽器中使用。", "隱私與安全優先：許多工具在瀏覽器本機處理資料，協助內容留在你的裝置上。", "簡潔快速：介面保持清爽，專注效率和易用性。"] }, { paragraphs: ["如有回饋、功能建議或問題，請聯絡 support@godeskhub.com。"] }],
      },
    },
    privacy: {
      en: {
        heading: "Privacy Policy",
        intro: ["Last updated: July 2026", "At GoDeskHub, accessible from https://godeskhub.com, the privacy of our visitors is one of our top priorities. This Privacy Policy explains what information may be collected and how we use it."],
        sections: [
          { heading: "1. Information We Collect", bullets: ["Non-Personal Data: like most websites, hosting or analytics systems may collect log-style data such as browser type, date and time, referring pages, and general technical information. This data is not linked to personally identifiable information by GoDeskHub.", "Cookies and Web Beacons: GoDeskHub may use cookies to store visitor preferences and improve user experience based on browser settings or language choices."] },
          { heading: "2. Third-Party Advertising", paragraphs: ["GoDeskHub may use third-party advertising vendors, including Google AdSense, if advertising is enabled in the future. Google's use of advertising cookies enables it and its partners to serve ads based on visits to this site or other sites on the Internet. Users may opt out of personalized advertising through Google Ads Settings. This site currently does not add AdSense code, publisher IDs, ad containers, or ad network requests."] },
          { heading: "3. Data Processing", paragraphs: ["Most of our tools execute directly in your web browser. Text, calculator values, converter inputs, QR Code content, and similar tool data are not stored on our server and are not sent to analytics services by the application."] },
          { heading: "4. Consent", paragraphs: ["By using our website, you consent to this Privacy Policy and agree to its terms. For privacy questions, contact support@godeskhub.com."] },
        ],
      },
      "zh-CN": {
        heading: "隐私政策",
        intro: ["最后更新：2026 年 7 月", "GoDeskHub 可通过 https://godeskhub.com 访问。访问者隐私是我们的重要优先事项。本隐私政策说明可能收集的信息类型以及使用方式。"],
        sections: [
          { heading: "1. 我们收集的信息", bullets: ["非个人数据：与多数网站类似，托管或分析系统可能收集浏览器类型、日期时间、来源页面和一般技术信息等日志类数据。GoDeskHub 不会将这些数据与个人身份信息关联。", "Cookie 和 Web Beacons：GoDeskHub 可能使用 cookie 保存访问偏好，并根据浏览器设置或语言选择优化体验。"] },
          { heading: "2. 第三方广告", paragraphs: ["如果未来启用广告，GoDeskHub 可能使用包括 Google AdSense 在内的第三方广告供应商。Google 可通过广告 cookie 基于用户访问本站或其他网站的情况投放广告，用户可通过 Google Ads Settings 退出个性化广告。当前网站没有添加 AdSense 代码、publisher ID、广告容器或广告网络请求。"] },
          { heading: "3. 数据处理", paragraphs: ["大多数工具直接在你的浏览器中运行。文本、计算器数值、转换器输入、QR Code 内容及类似工具数据不会由应用保存到服务器，也不会发送到分析服务。"] },
          { heading: "4. 同意", paragraphs: ["使用本网站即表示你同意本隐私政策及其条款。如有隐私问题，请联系 support@godeskhub.com。"] },
        ],
      },
      "zh-TW": {
        heading: "隱私權政策",
        intro: ["最後更新：2026 年 7 月", "GoDeskHub 可透過 https://godeskhub.com 存取。訪客隱私是我們的重要優先事項。本隱私權政策說明可能收集的資訊類型以及使用方式。"],
        sections: [
          { heading: "1. 我們收集的資訊", bullets: ["非個人資料：與多數網站類似，託管或分析系統可能收集瀏覽器類型、日期時間、來源頁面和一般技術資訊等紀錄資料。GoDeskHub 不會將這些資料與個人身分資訊連結。", "Cookie 和 Web Beacons：GoDeskHub 可能使用 cookie 儲存造訪偏好，並依據瀏覽器設定或語言選擇改善體驗。"] },
          { heading: "2. 第三方廣告", paragraphs: ["如果未來啟用廣告，GoDeskHub 可能使用包括 Google AdSense 在內的第三方廣告供應商。Google 可透過廣告 cookie 依據使用者造訪本站或其他網站的情況投放廣告，使用者可透過 Google Ads Settings 停用個人化廣告。目前網站沒有加入 AdSense 程式碼、publisher ID、廣告容器或廣告網路請求。"] },
          { heading: "3. 資料處理", paragraphs: ["大多數工具直接在你的瀏覽器中執行。文字、計算器數值、轉換器輸入、QR Code 內容及類似工具資料不會由應用程式儲存到伺服器，也不會傳送到分析服務。"] },
          { heading: "4. 同意", paragraphs: ["使用本網站即表示你同意本隱私權政策及其條款。如有隱私問題，請聯絡 support@godeskhub.com。"] },
        ],
      },
    },
    terms: {
      en: {
        heading: "Terms of Service",
        intro: ["Last updated: July 2026"],
        sections: [
          { heading: "1. Acceptance of Terms", paragraphs: ["By accessing or using GoDeskHub (https://godeskhub.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you must not use this site."] },
          { heading: "2. Use License & Intellectual Property", paragraphs: ["Permission is granted to temporarily use the tools and services on GoDeskHub for personal, non-commercial, or commercial transit use."], bullets: ["Do not attempt to decompile or reverse engineer any software contained on GoDeskHub.", "Do not use the automated tools for malicious, illegal, abusive, or disruptive purposes."] },
          { heading: "3. Disclaimer", paragraphs: ["The materials and online tools on GoDeskHub are provided on an 'as is' and 'as available' basis. GoDeskHub makes no warranties, expressed or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.", "GoDeskHub does not warrant the accuracy, likely results, or reliability of any tool output."] },
          { heading: "4. Limitations of Liability", paragraphs: ["In no event shall GoDeskHub or its suppliers be liable for damages, including loss of data, profit, or business interruption, arising out of the use or inability to use the tools on GoDeskHub."] },
          { heading: "5. Contact Information", paragraphs: ["If you have questions about these Terms, contact support@godeskhub.com."] },
        ],
      },
      "zh-CN": {
        heading: "服务条款",
        intro: ["最后更新：2026 年 7 月"],
        sections: [
          { heading: "1. 接受条款", paragraphs: ["访问或使用 GoDeskHub（https://godeskhub.com）即表示你同意受本服务条款以及适用法律法规约束。如不同意任何条款，请不要使用本站。"] },
          { heading: "2. 使用许可与知识产权", paragraphs: ["你可以临时使用 GoDeskHub 的工具和服务，用于个人、非商业或商业辅助场景。"], bullets: ["不得尝试反编译或逆向工程 GoDeskHub 中包含的软件。", "不得将自动化工具用于恶意、非法、滥用或干扰性目的。"] },
          { heading: "3. 免责声明", paragraphs: ["GoDeskHub 的材料和在线工具按“现状”和“可用”基础提供。GoDeskHub 不作任何明示或暗示担保，包括适销性、特定用途适用性或不侵权担保。", "GoDeskHub 不保证任何工具输出的准确性、预期结果或可靠性。"] },
          { heading: "4. 责任限制", paragraphs: ["在任何情况下，GoDeskHub 或其供应商均不对因使用或无法使用 GoDeskHub 工具而产生的数据损失、利润损失或业务中断等损害承担责任。"] },
          { heading: "5. 联系信息", paragraphs: ["如对本条款有疑问，请联系 support@godeskhub.com。"] },
        ],
      },
      "zh-TW": {
        heading: "服務條款",
        intro: ["最後更新：2026 年 7 月"],
        sections: [
          { heading: "1. 接受條款", paragraphs: ["存取或使用 GoDeskHub（https://godeskhub.com）即表示你同意受本服務條款以及適用法律法規約束。如不同意任何條款，請不要使用本站。"] },
          { heading: "2. 使用授權與智慧財產權", paragraphs: ["你可以暫時使用 GoDeskHub 的工具和服務，用於個人、非商業或商業輔助情境。"], bullets: ["不得嘗試反編譯或逆向工程 GoDeskHub 中包含的軟體。", "不得將自動化工具用於惡意、非法、濫用或干擾性目的。"] },
          { heading: "3. 免責聲明", paragraphs: ["GoDeskHub 的資料和線上工具按「現狀」和「可用」基礎提供。GoDeskHub 不作任何明示或暗示擔保，包括適售性、特定用途適用性或不侵權擔保。", "GoDeskHub 不保證任何工具輸出的準確性、預期結果或可靠性。"] },
          { heading: "4. 責任限制", paragraphs: ["在任何情況下，GoDeskHub 或其供應商均不對因使用或無法使用 GoDeskHub 工具而產生的資料損失、利潤損失或業務中斷等損害承擔責任。"] },
          { heading: "5. 聯絡資訊", paragraphs: ["如對本條款有疑問，請聯絡 support@godeskhub.com。"] },
        ],
      },
    },
    contact: {
      en: { heading: "Contact Us", intro: ["We would love to hear from you. Whether you have a question about our tools, bug reports, feature suggestions, or business inquiries, please get in touch."], sections: [{ bullets: ["Email: support@godeskhub.com", "Business Hours: Monday - Friday, responding within 24-48 hours", "For security and privacy inquiries, please mark your subject line as \"Privacy Query\"."] }] },
      "zh-CN": { heading: "联系我们", intro: ["欢迎联系 GoDeskHub。无论是工具问题、bug 反馈、功能建议或商务咨询，都可以发送邮件给我们。"], sections: [{ bullets: ["邮箱：support@godeskhub.com", "工作时间：周一至周五，通常在 24-48 小时内回复", "安全和隐私咨询请在邮件标题中注明“Privacy Query”。"] }] },
      "zh-TW": { heading: "聯絡我們", intro: ["歡迎聯絡 GoDeskHub。無論是工具問題、bug 回報、功能建議或商務諮詢，都可以寄信給我們。"], sections: [{ bullets: ["Email：support@godeskhub.com", "服務時間：週一至週五，通常在 24-48 小時內回覆", "安全與隱私諮詢請在郵件標題中註明「Privacy Query」。"] }] },
    },
    "not-found": { en: { heading: "404", intro: ["The page was not found."], sections: [] }, "zh-CN": { heading: "404", intro: ["没有找到该页面。"], sections: [] }, "zh-TW": { heading: "404", intro: ["找不到該頁面。"], sections: [] } },
  };
  const content = pages[page as Exclude<Page, "home">][lang];
  return <section className="info-page"><span className="eyebrow">{title}</span><h1>{content.heading}</h1>{content.intro.map(line => <p key={line}>{line}</p>)}{content.sections.map((section, index) => <section className="policy-section" key={`${section.heading ?? "section"}-${index}`}>{section.heading && <h2>{section.heading}</h2>}{section.paragraphs?.map(line => <p key={line}>{line}</p>)}{section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}{page === "contact" && <p><a href="mailto:support@godeskhub.com">support@godeskhub.com</a></p>}<button type="button" onClick={() => navigate("home")}>{t.home}</button></section>;
}

export default App;
