import { CATEGORY_CONTENT, TOOL_CONTENT } from "../content/index.js";
import { CATEGORIES, INFO_PAGES, SITE_ORIGIN, TOOLS } from "../registry.js";
import { buildFeedbackMailto } from "./feedback.js";
import { buildPath } from "./routes.js";

const copy = {
  en: {
    home: "Home",
    privacy: "Inputs stay in your browser",
    interactive: "Interactive tool",
    interactiveNote: "Enable JavaScript to use the interactive controls. The guide below is available without JavaScript.",
    useCases: "When to use this tool",
    steps: "How to use",
    example: "Example",
    principles: "How it works",
    limitations: "Limits and notes",
    faq: "Frequently asked questions",
    references: "References",
    related: "Related tools",
    feedback: "Send tool feedback",
    feedbackNote: "The message includes page context only, never tool input or results.",
    categoryUse: "Common uses",
    search: "Search tools",
    allTools: "All tools",
    notFound: "Page not found",
    notFoundText: "The requested GoDeskHub page could not be found.",
  },
  "zh-CN": {
    home: "首页",
    privacy: "输入内容只留在浏览器",
    interactive: "交互式工具",
    interactiveNote: "启用 JavaScript 后可使用交互控件；下方说明无需 JavaScript 也可阅读。",
    useCases: "适用场景",
    steps: "使用步骤",
    example: "实际示例",
    principles: "工作原理与规则",
    limitations: "限制与注意事项",
    faq: "常见问题",
    references: "参考资料",
    related: "相关工具",
    feedback: "提交工具反馈",
    feedbackNote: "邮件只包含页面信息，不会包含工具输入或结果。",
    categoryUse: "适用场景",
    search: "搜索工具",
    allTools: "全部工具",
    notFound: "找不到页面",
    notFoundText: "无法找到请求的 GoDeskHub 页面。",
  },
  "zh-TW": {
    home: "首頁",
    privacy: "輸入內容只留在瀏覽器",
    interactive: "互動式工具",
    interactiveNote: "啟用 JavaScript 後可使用互動控制項；下方說明不需 JavaScript 也可閱讀。",
    useCases: "適用情境",
    steps: "使用步驟",
    example: "實際範例",
    principles: "運作原理與規則",
    limitations: "限制與注意事項",
    faq: "常見問題",
    references: "參考資料",
    related: "相關工具",
    feedback: "提交工具回饋",
    feedbackNote: "郵件只包含頁面資訊，不會包含工具輸入或結果。",
    categoryUse: "適用情境",
    search: "搜尋工具",
    allTools: "全部工具",
    notFound: "找不到頁面",
    notFoundText: "無法找到要求的 GoDeskHub 頁面。",
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function list(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function routeLink(route, label) {
  return `<a href="${escapeHtml(buildPath(route))}">${escapeHtml(label)}</a>`;
}

function renderHome(route) {
  const t = copy[route.lang];
  const cards = TOOLS.map(tool => `
    <li>${routeLink(
      { kind: "tool", lang: route.lang, toolId: tool.id },
      tool.text[route.lang].name,
    )}<p>${escapeHtml(TOOL_CONTENT[tool.id][route.lang].summary)}</p></li>`).join("");
  return `<main class="static-route-content" data-static-route="home">
    <header class="static-hero">
      <p class="privacy-note">${escapeHtml(t.privacy)}</p>
      <h1>GoDeskHub</h1>
      <p>${escapeHtml(t.allTools)}</p>
      <form class="static-search" role="search"><label>${escapeHtml(t.search)}<input type="search" name="q" autocomplete="off" /></label></form>
    </header>
    <section><h2>${escapeHtml(t.allTools)}</h2><ul class="static-tool-list">${cards}</ul></section>
  </main>`;
}

function renderTool(route) {
  const tool = TOOLS.find(item => item.id === route.toolId);
  if (!tool) return renderNotFound({ kind: "not-found", lang: route.lang });
  const category = CATEGORIES.find(item => item.id === tool.category);
  const content = TOOL_CONTENT[tool.id][route.lang];
  const t = copy[route.lang];
  const canonicalUrl = `${SITE_ORIGIN}${buildPath(route)}`;
  const feedback = buildFeedbackMailto({
    toolId: tool.id,
    slug: tool.slug,
    lang: route.lang,
    canonicalUrl,
    type: "incorrect",
  });
  const related = TOOLS.filter(item => item.category === tool.category && item.id !== tool.id).slice(0, 3);

  return `<main class="static-route-content" data-static-route="tool">
    <nav class="breadcrumb" aria-label="Breadcrumb">${routeLink({ kind: "home", lang: route.lang }, t.home)}<span>›</span>${routeLink({ kind: "category", lang: route.lang, categoryId: tool.category }, category.text[route.lang].name)}<span>›</span><strong>${escapeHtml(tool.text[route.lang].name)}</strong></nav>
    <header><h1>${escapeHtml(tool.text[route.lang].name)}</h1><p>${escapeHtml(content.summary)}</p><p class="privacy-note">${escapeHtml(t.privacy)}</p></header>
    <section class="static-tool-surface" aria-label="${escapeHtml(t.interactive)}"><h2>${escapeHtml(t.interactive)}</h2><p>${escapeHtml(t.interactiveNote)}</p></section>
    <div class="static-tool-guide">
      <p>${escapeHtml(content.introduction)}</p>
      <section><h2>${escapeHtml(t.useCases)}</h2>${list(content.useCases)}</section>
      <section><h2>${escapeHtml(t.steps)}</h2>${list(content.steps, true)}</section>
      <section><h2>${escapeHtml(t.example)}</h2><h3>${escapeHtml(content.example.title)}</h3><p>${escapeHtml(content.example.description)}</p></section>
      <section><h2>${escapeHtml(t.principles)}</h2>${list(content.principles)}</section>
      <section><h2>${escapeHtml(t.limitations)}</h2>${list(content.limitations)}</section>
      <section><h2>${escapeHtml(t.faq)}</h2>${content.faqs.map(item => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("")}</section>
      <section><h2>${escapeHtml(t.references)}</h2><ul>${content.references.map(reference => `<li><a href="${escapeHtml(reference.url)}" rel="noreferrer">${escapeHtml(reference.label)}</a></li>`).join("")}</ul></section>
      <section><h2>${escapeHtml(t.related)}</h2><ul>${related.map(item => `<li>${routeLink({ kind: "tool", lang: route.lang, toolId: item.id }, item.text[route.lang].name)}</li>`).join("")}</ul></section>
      <section><h2>${escapeHtml(t.feedback)}</h2><p>${escapeHtml(t.feedbackNote)}</p><a href="${escapeHtml(feedback)}">${escapeHtml(t.feedback)}</a></section>
    </div>
  </main>`;
}

function renderCategory(route) {
  const category = CATEGORIES.find(item => item.id === route.categoryId);
  if (!category) return renderNotFound({ kind: "not-found", lang: route.lang });
  const content = CATEGORY_CONTENT[category.id][route.lang];
  const t = copy[route.lang];
  const tools = TOOLS.filter(tool => tool.category === category.id);
  return `<main class="static-route-content" data-static-route="category">
    <nav class="breadcrumb" aria-label="Breadcrumb">${routeLink({ kind: "home", lang: route.lang }, t.home)}<span>›</span><strong>${escapeHtml(category.text[route.lang].name)}</strong></nav>
    <header><h1>${escapeHtml(category.text[route.lang].name)}</h1><p>${escapeHtml(content.introduction)}</p></header>
    <section><h2>${escapeHtml(t.categoryUse)}</h2>${list(content.useCases)}<p>${escapeHtml(content.distinction)}</p></section>
    <section><h2>${escapeHtml(t.allTools)}</h2><ul class="static-tool-list">${tools.map(tool => `<li>${routeLink({ kind: "tool", lang: route.lang, toolId: tool.id }, tool.text[route.lang].name)}<p>${escapeHtml(tool.text[route.lang].description)}</p></li>`).join("")}</ul></section>
  </main>`;
}

function renderInfo(route) {
  const page = INFO_PAGES.find(item => item.id === route.page);
  if (!page) return renderNotFound({ kind: "not-found", lang: route.lang });
  return `<main class="static-route-content" data-static-route="info">
    <nav class="breadcrumb" aria-label="Breadcrumb">${routeLink({ kind: "home", lang: route.lang }, copy[route.lang].home)}<span>›</span><strong>${escapeHtml(page.text[route.lang].name)}</strong></nav>
    <h1>${escapeHtml(page.text[route.lang].name)}</h1>
    <p>${escapeHtml(page.text[route.lang].description)}</p>
  </main>`;
}

function renderNotFound(route) {
  const t = copy[route.lang] ?? copy.en;
  return `<main class="static-route-content" data-static-route="not-found"><h1>404 — ${escapeHtml(t.notFound)}</h1><p>${escapeHtml(t.notFoundText)}</p>${routeLink({ kind: "home", lang: route.lang }, t.home)}</main>`;
}

export function renderStaticRouteContent(route) {
  if (route.kind === "home") return renderHome(route);
  if (route.kind === "tool") return renderTool(route);
  if (route.kind === "category") return renderCategory(route);
  if (route.kind === "info") return renderInfo(route);
  return renderNotFound(route);
}
