import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  UNIT_GROUPS,
  base64Decode,
  base64Encode,
  bmi,
  changeCase,
  compoundInterest,
  convertTemperature,
  convertUnit,
  dateInterval,
  dateToTimestamp,
  discountPrice,
  formatJson,
  formatNumber,
  hexToRgb,
  percentOf,
  readToolStats,
  rgbToHex,
  rgbToHsl,
  sortToolsByPopularity,
  textStats,
  timestampToDate,
  trackToolOpen,
  urlTransform,
  validateQrInput,
} from "./lib/core.js";

type Lang = "en" | "zh-CN" | "zh-TW";
type Page = "home" | "about" | "privacy" | "terms" | "contact" | "not-found";
type ToolKind = "unit" | "json" | "base64" | "url" | "uuid" | "timestamp" | "case" | "text" | "color" | "calculator" | "qr";

type Tool = {
  id: string;
  kind: ToolKind;
  category: string;
  icon: string;
  order: number;
  defaultWeight: number;
  group?: string;
  calculator?: "percentage" | "discount" | "bmi" | "compound" | "date";
};

const LANGS: Lang[] = ["en", "zh-CN", "zh-TW"];

const messages = {
  en: {
    siteName: "Lite Tools",
    tagline: "Fast, private browser tools for everyday work.",
    search: "Search tools",
    popular: "Popular tools",
    allTools: "All tools",
    noResults: "No matching tools.",
    privacyBadge: "Inputs stay in your browser",
    open: "Open",
    copy: "Copy",
    clear: "Clear",
    swap: "Swap",
    from: "From",
    to: "To",
    value: "Value",
    result: "Result",
    invalid: "Enter a finite valid value.",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    home: "Home",
    categories: "Categories",
    tools: "Tools",
    adsOff: "AdSense is disabled. No ad script or empty ad container is rendered.",
    financeNote: "Results are for reference only and are not financial advice.",
    healthNote: "BMI is for reference only and is not a medical diagnosis.",
    qrDownload: "Download PNG",
    qrEmpty: "Enter text or a URL to generate a QR Code.",
    qrTooLong: "Input is too long for a reliable QR Code.",
  },
  "zh-CN": {
    siteName: "轻工具",
    tagline: "快速、干净、隐私优先的浏览器本地工具。",
    search: "搜索工具",
    popular: "常用工具",
    allTools: "全部工具",
    noResults: "没有找到匹配工具。",
    privacyBadge: "输入内容只留在浏览器",
    open: "打开",
    copy: "复制",
    clear: "清空",
    swap: "交换",
    from: "来源",
    to: "目标",
    value: "数值",
    result: "结果",
    invalid: "请输入有限且有效的数值。",
    about: "关于",
    privacy: "隐私政策",
    terms: "使用条款",
    contact: "联系反馈",
    home: "首页",
    categories: "分类",
    tools: "工具",
    adsOff: "AdSense 默认关闭，不渲染广告脚本或空广告容器。",
    financeNote: "计算结果仅供参考，不构成投资或理财建议。",
    healthNote: "BMI 结果仅供参考，不构成医疗诊断。",
    qrDownload: "下载 PNG",
    qrEmpty: "输入文本或 URL 后生成 QR Code。",
    qrTooLong: "输入过长，无法可靠生成 QR Code。",
  },
  "zh-TW": {
    siteName: "輕工具",
    tagline: "快速、乾淨、重視隱私的瀏覽器本機工具。",
    search: "搜尋工具",
    popular: "常用工具",
    allTools: "全部工具",
    noResults: "沒有找到相符工具。",
    privacyBadge: "輸入內容只留在瀏覽器",
    open: "開啟",
    copy: "複製",
    clear: "清除",
    swap: "交換",
    from: "來源",
    to: "目標",
    value: "數值",
    result: "結果",
    invalid: "請輸入有限且有效的數值。",
    about: "關於",
    privacy: "隱私權政策",
    terms: "使用條款",
    contact: "聯絡與回饋",
    home: "首頁",
    categories: "分類",
    tools: "工具",
    adsOff: "AdSense 預設關閉，不會渲染廣告腳本或空廣告容器。",
    financeNote: "計算結果僅供參考，不構成投資或理財建議。",
    healthNote: "BMI 結果僅供參考，不構成醫療診斷。",
    qrDownload: "下載 PNG",
    qrEmpty: "輸入文字或 URL 後產生 QR Code。",
    qrTooLong: "輸入過長，無法可靠產生 QR Code。",
  },
} satisfies Record<Lang, Record<string, string>>;

const categories = {
  units: { en: "Unit converters", "zh-CN": "单位转换", "zh-TW": "單位轉換" },
  developer: { en: "Format & developer", "zh-CN": "格式与开发", "zh-TW": "格式與開發" },
  calculators: { en: "Calculators", "zh-CN": "计算工具", "zh-TW": "計算工具" },
  qr: { en: "QR Code", "zh-CN": "QR Code", "zh-TW": "QR Code" },
};

const navLabels: Record<Page, Record<Lang, string>> = {
  home: { en: "Home", "zh-CN": "首页", "zh-TW": "首頁" },
  about: { en: "About", "zh-CN": "关于", "zh-TW": "關於" },
  privacy: { en: "Privacy", "zh-CN": "隐私政策", "zh-TW": "隱私權政策" },
  terms: { en: "Terms", "zh-CN": "使用条款", "zh-TW": "使用條款" },
  contact: { en: "Contact", "zh-CN": "联系反馈", "zh-TW": "聯絡與回饋" },
  "not-found": { en: "404", "zh-CN": "404", "zh-TW": "404" },
};

const toolText: Record<string, Record<Lang, { name: string; description: string }>> = {
  length: { en: { name: "Length converter", description: "Meters, feet, miles, and more." }, "zh-CN": { name: "长度转换", description: "米、英尺、英里等单位互转。" }, "zh-TW": { name: "長度轉換", description: "公尺、英尺、英里等單位互轉。" } },
  weight: { en: { name: "Weight converter", description: "Kilograms, pounds, ounces, and tons." }, "zh-CN": { name: "重量转换", description: "千克、磅、盎司、吨互转。" }, "zh-TW": { name: "重量轉換", description: "公斤、磅、盎司、公噸互轉。" } },
  temperature: { en: { name: "Temperature converter", description: "Celsius, Fahrenheit, and Kelvin." }, "zh-CN": { name: "温度转换", description: "摄氏、华氏、开尔文公式换算。" }, "zh-TW": { name: "溫度轉換", description: "攝氏、華氏、克氏公式換算。" } },
  area: { en: { name: "Area converter", description: "Square meters, acres, and square feet." }, "zh-CN": { name: "面积转换", description: "平方米、亩制相关面积单位换算。" }, "zh-TW": { name: "面積轉換", description: "平方公尺、英畝、平方英尺換算。" } },
  volume: { en: { name: "Volume converter", description: "Liters, milliliters, gallons, and cups." }, "zh-CN": { name: "体积转换", description: "升、毫升、美制加仑和杯互转。" }, "zh-TW": { name: "體積轉換", description: "公升、毫升、美制加侖與杯互轉。" } },
  speed: { en: { name: "Speed converter", description: "km/h, mph, knots, and m/s." }, "zh-CN": { name: "速度转换", description: "公里/小时、英里/小时、节互转。" }, "zh-TW": { name: "速度轉換", description: "公里/小時、英里/小時、節互轉。" } },
  time: { en: { name: "Time converter", description: "Milliseconds through weeks." }, "zh-CN": { name: "时间转换", description: "毫秒、秒、分钟、小时、天互转。" }, "zh-TW": { name: "時間轉換", description: "毫秒、秒、分鐘、小時、天互轉。" } },
  storage: { en: { name: "Data storage converter", description: "Bytes through petabytes." }, "zh-CN": { name: "数据存储转换", description: "B、KB、MB、GB、TB 换算。" }, "zh-TW": { name: "資料儲存轉換", description: "B、KB、MB、GB、TB 換算。" } },
  json: { en: { name: "JSON tools", description: "Format, minify, and validate JSON." }, "zh-CN": { name: "JSON 工具", description: "格式化、压缩并校验 JSON。" }, "zh-TW": { name: "JSON 工具", description: "格式化、壓縮並驗證 JSON。" } },
  base64: { en: { name: "Base64", description: "Encode and decode Unicode text." }, "zh-CN": { name: "Base64 编解码", description: "支持 Unicode 文本编码和解码。" }, "zh-TW": { name: "Base64 編解碼", description: "支援 Unicode 文字編碼和解碼。" } },
  url: { en: { name: "URL encoder", description: "Encode and decode URL text." }, "zh-CN": { name: "URL 编解码", description: "安全编码和还原 URL 文本。" }, "zh-TW": { name: "URL 編解碼", description: "安全編碼和還原 URL 文字。" } },
  uuid: { en: { name: "UUID generator", description: "Generate secure UUID v4 values." }, "zh-CN": { name: "UUID 生成器", description: "用安全随机源生成 UUID v4。" }, "zh-TW": { name: "UUID 產生器", description: "用安全隨機源產生 UUID v4。" } },
  timestamp: { en: { name: "Timestamp converter", description: "Convert seconds, milliseconds, and dates." }, "zh-CN": { name: "时间戳转换", description: "秒、毫秒和日期时间互转。" }, "zh-TW": { name: "時間戳轉換", description: "秒、毫秒和日期時間互轉。" } },
  case: { en: { name: "Text case converter", description: "Upper, lower, title, and camel case." }, "zh-CN": { name: "文本大小写转换", description: "大写、小写、标题和驼峰格式。" }, "zh-TW": { name: "文字大小寫轉換", description: "大寫、小寫、標題和駝峰格式。" } },
  text: { en: { name: "Word counter", description: "Characters, words, and lines." }, "zh-CN": { name: "字数统计", description: "字符数、字词数和行数统计。" }, "zh-TW": { name: "字數統計", description: "字元數、字詞數和行數統計。" } },
  color: { en: { name: "Color converter", description: "HEX, RGB, and HSL conversion." }, "zh-CN": { name: "颜色转换", description: "HEX、RGB、HSL 基础转换。" }, "zh-TW": { name: "顏色轉換", description: "HEX、RGB、HSL 基礎轉換。" } },
  percentage: { en: { name: "Percentage calculator", description: "Calculate a percentage of a value." }, "zh-CN": { name: "百分比计算", description: "计算某数值的百分比。" }, "zh-TW": { name: "百分比計算", description: "計算某數值的百分比。" } },
  discount: { en: { name: "Discount calculator", description: "Final price and savings." }, "zh-CN": { name: "折扣计算", description: "计算折后价和节省金额。" }, "zh-TW": { name: "折扣計算", description: "計算折後價與省下金額。" } },
  bmi: { en: { name: "BMI calculator", description: "Body mass index reference." }, "zh-CN": { name: "BMI 计算", description: "身体质量指数参考计算。" }, "zh-TW": { name: "BMI 計算", description: "身體質量指數參考計算。" } },
  compound: { en: { name: "Compound interest", description: "Reference compound growth calculation." }, "zh-CN": { name: "复利计算", description: "复利增长参考计算。" }, "zh-TW": { name: "複利計算", description: "複利成長參考計算。" } },
  datecalc: { en: { name: "Date interval", description: "Days between two dates." }, "zh-CN": { name: "日期间隔计算", description: "计算两个日期相隔天数。" }, "zh-TW": { name: "日期間隔計算", description: "計算兩個日期相隔天數。" } },
  qr: { en: { name: "QR Code generator", description: "Create and download local QR Codes." }, "zh-CN": { name: "QR Code 生成器", description: "本地生成并下载 QR Code。" }, "zh-TW": { name: "QR Code 產生器", description: "本機產生並下載 QR Code。" } },
};

const tools: Tool[] = [
  { id: "length", kind: "unit", category: "units", icon: "↔", order: 1, defaultWeight: 10, group: "length" },
  { id: "weight", kind: "unit", category: "units", icon: "kg", order: 2, defaultWeight: 9, group: "weight" },
  { id: "temperature", kind: "unit", category: "units", icon: "°", order: 3, defaultWeight: 9 },
  { id: "area", kind: "unit", category: "units", icon: "m²", order: 4, defaultWeight: 5, group: "area" },
  { id: "volume", kind: "unit", category: "units", icon: "L", order: 5, defaultWeight: 5, group: "volume" },
  { id: "speed", kind: "unit", category: "units", icon: "km", order: 6, defaultWeight: 5, group: "speed" },
  { id: "time", kind: "unit", category: "units", icon: "s", order: 7, defaultWeight: 5, group: "time" },
  { id: "storage", kind: "unit", category: "units", icon: "01", order: 8, defaultWeight: 7, group: "storage" },
  { id: "json", kind: "json", category: "developer", icon: "{}", order: 9, defaultWeight: 9 },
  { id: "base64", kind: "base64", category: "developer", icon: "64", order: 10, defaultWeight: 8 },
  { id: "url", kind: "url", category: "developer", icon: "/", order: 11, defaultWeight: 7 },
  { id: "uuid", kind: "uuid", category: "developer", icon: "#", order: 12, defaultWeight: 8 },
  { id: "timestamp", kind: "timestamp", category: "developer", icon: "ts", order: 13, defaultWeight: 7 },
  { id: "case", kind: "case", category: "developer", icon: "Aa", order: 14, defaultWeight: 6 },
  { id: "text", kind: "text", category: "developer", icon: "字", order: 15, defaultWeight: 8 },
  { id: "color", kind: "color", category: "developer", icon: "●", order: 16, defaultWeight: 6 },
  { id: "percentage", kind: "calculator", category: "calculators", icon: "%", order: 17, defaultWeight: 8, calculator: "percentage" },
  { id: "discount", kind: "calculator", category: "calculators", icon: "$", order: 18, defaultWeight: 7, calculator: "discount" },
  { id: "bmi", kind: "calculator", category: "calculators", icon: "BMI", order: 19, defaultWeight: 6, calculator: "bmi" },
  { id: "compound", kind: "calculator", category: "calculators", icon: "↗", order: 20, defaultWeight: 6, calculator: "compound" },
  { id: "datecalc", kind: "calculator", category: "calculators", icon: "日", order: 21, defaultWeight: 7, calculator: "date" },
  { id: "qr", kind: "qr", category: "qr", icon: "▦", order: 22, defaultWeight: 8 },
];

const unitLabels: Record<Lang, Record<string, string>> = {
  en: { m: "meter", km: "kilometer", cm: "centimeter", mm: "millimeter", in: "inch", ft: "foot", yd: "yard", mi: "mile", kg: "kilogram", g: "gram", mg: "milligram", lb: "pound", oz: "ounce", t: "metric ton", m2: "square meter", km2: "square kilometer", cm2: "square centimeter", mm2: "square millimeter", ha: "hectare", acre: "acre", ft2: "square foot", l: "liter", ml: "milliliter", m3: "cubic meter", gal_us: "US gallon", qt_us: "US quart", pt_us: "US pint", cup_us: "US cup", mps: "m/s", kph: "km/h", mph: "mph", knot: "knot", fps: "ft/s", ms: "millisecond", s: "second", min: "minute", h: "hour", day: "day", week: "week", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "Celsius", f: "Fahrenheit", k: "Kelvin" },
  "zh-CN": { m: "米", km: "千米", cm: "厘米", mm: "毫米", in: "英寸", ft: "英尺", yd: "码", mi: "英里", kg: "千克", g: "克", mg: "毫克", lb: "磅", oz: "盎司", t: "吨", m2: "平方米", km2: "平方千米", cm2: "平方厘米", mm2: "平方毫米", ha: "公顷", acre: "英亩", ft2: "平方英尺", l: "升", ml: "毫升", m3: "立方米", gal_us: "美制加仑", qt_us: "美制夸脱", pt_us: "美制品脱", cup_us: "美制杯", mps: "米/秒", kph: "公里/小时", mph: "英里/小时", knot: "节", fps: "英尺/秒", ms: "毫秒", s: "秒", min: "分钟", h: "小时", day: "天", week: "周", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "摄氏度", f: "华氏度", k: "开尔文" },
  "zh-TW": { m: "公尺", km: "公里", cm: "公分", mm: "毫米", in: "英寸", ft: "英尺", yd: "碼", mi: "英里", kg: "公斤", g: "公克", mg: "毫克", lb: "磅", oz: "盎司", t: "公噸", m2: "平方公尺", km2: "平方公里", cm2: "平方公分", mm2: "平方毫米", ha: "公頃", acre: "英畝", ft2: "平方英尺", l: "公升", ml: "毫升", m3: "立方公尺", gal_us: "美制加侖", qt_us: "美制夸脫", pt_us: "美制品脫", cup_us: "美制杯", mps: "公尺/秒", kph: "公里/小時", mph: "英里/小時", knot: "節", fps: "英尺/秒", ms: "毫秒", s: "秒", min: "分鐘", h: "小時", day: "天", week: "週", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "攝氏度", f: "華氏度", k: "克氏" },
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
  const [category, setCategory] = useState("all");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [stats, setStats] = useState(() => readToolStats(localStorage));
  const t = messages[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("lite-tools:lang", lang);
  }, [lang]);

  useEffect(() => {
    const onPop = () => setPage(pageFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const ranked = useMemo(() => sortToolsByPopularity(tools, stats), [stats]);
  const filtered = ranked.filter(tool => {
    const text = toolText[tool.id][lang];
    const haystack = `${text.name} ${text.description} ${categories[tool.category as keyof typeof categories][lang]}`.toLocaleLowerCase();
    return (category === "all" || tool.category === category) && haystack.includes(query.toLocaleLowerCase());
  });

  const navigate = (next: Page) => {
    const path = next === "home" ? "/" : `/${next}`;
    window.history.pushState(null, "", path);
    setPage(next);
    setActiveTool(null);
  };

  const openTool = (tool: Tool) => {
    setActiveTool(tool);
    setStats(trackToolOpen(localStorage, tool.id));
    requestAnimationFrame(() => document.getElementById("tool-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")}><span className="brand-mark">LT</span><span>{t.siteName}</span></button>
        <nav aria-label="Primary">
          {(["home", "about", "privacy", "terms", "contact"] as Page[]).map(item => (
            <button key={item} onClick={() => navigate(item)}>{navLabels[item][lang]}</button>
          ))}
        </nav>
        <label className="language">
          <span className="sr-only">Language</span>
          <select value={lang} onChange={event => setLang(event.target.value as Lang)}>
            <option value="en">English</option>
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
          </select>
        </label>
      </header>

      {page === "home" ? (
        <>
          <section className="hero">
            <span className="hero-pill">{t.privacyBadge}</span>
            <h1>{t.siteName}</h1>
            <p>{t.tagline}</p>
            <label className="search-box">
              <span>⌕</span>
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} />
            </label>
          </section>
          <section className="content">
            <div className="section-head">
              <div><span className="eyebrow">{t.popular}</span><h2>{t.allTools}</h2></div>
              <span>{filtered.length} {t.tools}</span>
            </div>
            <div className="category-row" aria-label={t.categories}>
              <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>{t.allTools}</button>
              {Object.entries(categories).map(([id, label]) => (
                <button key={id} className={category === id ? "active" : ""} onClick={() => setCategory(id)}>{label[lang]}</button>
              ))}
            </div>
            <div className="tools-grid">
              {filtered.map(tool => <ToolCard key={tool.id} tool={tool} lang={lang} onClick={() => openTool(tool)} />)}
            </div>
            {filtered.length === 0 && <p className="empty">{t.noResults}</p>}
            {activeTool && <ToolWorkspace key={activeTool.id} tool={activeTool} lang={lang} />}
          </section>
        </>
      ) : <InfoPage page={page} lang={lang} navigate={navigate} />}
      <footer>
        <span>{t.siteName}</span>
        <span>{t.adsOff}</span>
      </footer>
    </main>
  );
}

function ToolCard({ tool, lang, onClick }: { tool: Tool; lang: Lang; onClick: () => void }) {
  const text = toolText[tool.id][lang];
  return (
    <button className="tool-card" onClick={onClick}>
      <span className="tool-icon">{tool.icon}</span>
      <span className="tool-copy"><strong>{text.name}</strong><small>{text.description}</small></span>
      <span className="arrow">{messages[lang].open}</span>
    </button>
  );
}

function ToolWorkspace({ tool, lang }: { tool: Tool; lang: Lang }) {
  const t = messages[lang];
  const text = toolText[tool.id][lang];
  return (
    <section className="workspace" id="tool-workspace" aria-labelledby="tool-title">
      <div className="workspace-head"><div><span className="eyebrow">{categories[tool.category as keyof typeof categories][lang]}</span><h2 id="tool-title">{text.name}</h2><p>{text.description}</p></div><span className="tool-icon large">{tool.icon}</span></div>
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
      <p className="helper">{t.privacyBadge}</p>
    </section>
  );
}

function CopyButton({ value, lang }: { value: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" onClick={() => { void navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "✓" : messages[lang].copy}</button>;
}

function UnitTool({ tool, lang }: { tool: Tool; lang: Lang }) {
  const t = messages[lang];
  const group = tool.group ? UNIT_GROUPS[tool.group] : null;
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(group?.defaultFrom ?? "c");
  const [to, setTo] = useState(group?.defaultTo ?? "f");
  const units = group ? Object.keys(group.units) : ["c", "f", "k"];
  const result = group ? convertUnit(value, tool.group, from, to) : convertTemperature(value, from, to);
  const formatted = result === null ? t.invalid : `${formatNumber(result, lang)} ${unitLabels[lang][to]}`;
  return (
    <div className="form-grid">
      <label>{t.value}<input type="number" value={value} onChange={event => setValue(event.target.value)} /></label>
      <label>{t.from}<select value={from} onChange={event => setFrom(event.target.value)}>{units.map(unit => <option key={unit} value={unit}>{unitLabels[lang][unit]}</option>)}</select></label>
      <button className="swap-btn" onClick={() => { setFrom(to); setTo(from); }}>{t.swap}</button>
      <label>{t.to}<select value={to} onChange={event => setTo(event.target.value)}>{units.map(unit => <option key={unit} value={unit}>{unitLabels[lang][unit]}</option>)}</select></label>
      <ResultBox label={t.result} value={formatted} lang={lang} onClear={() => setValue("")} />
    </div>
  );
}

function JsonTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState('{"hello":"world"}');
  const [mode, setMode] = useState("pretty");
  const result = formatJson(input, mode);
  return <TextTransform input={input} setInput={setInput} result={result.ok ? result.value : result.error ?? ""} error={!result.ok} lang={lang} extra={<div className="segmented"><button className={mode === "pretty" ? "active" : ""} onClick={() => setMode("pretty")}>Format</button><button className={mode === "minify" ? "active" : ""} onClick={() => setMode("minify")}>Minify</button></div>} />;
}

function Base64Tool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("Hello 世界");
  const [mode, setMode] = useState("encode");
  const decoded = mode === "decode" ? base64Decode(input) : null;
  const result = mode === "encode" ? base64Encode(input) : decoded?.ok ? decoded.value : decoded?.error ?? "";
  return <TextTransform input={input} setInput={setInput} result={result} error={decoded?.ok === false} lang={lang} extra={<ModeButtons mode={mode} setMode={setMode} />} />;
}

function UrlTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("name=Lite Tools&lang=zh-CN");
  const [mode, setMode] = useState("encode");
  const result = urlTransform(input, mode);
  return <TextTransform input={input} setInput={setInput} result={result.ok ? result.value : result.error ?? ""} error={!result.ok} lang={lang} extra={<ModeButtons mode={mode} setMode={setMode} />} />;
}

function ModeButtons({ mode, setMode }: { mode: string; setMode: (mode: string) => void }) {
  return <div className="segmented"><button className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>Encode</button><button className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>Decode</button></div>;
}

function TextTransform({ input, setInput, result, error, lang, extra }: { input: string; setInput: (value: string) => void; result: string; error?: boolean; lang: Lang; extra?: React.ReactNode }) {
  return <div className="simple-tool">{extra}<div className="text-panes"><textarea value={input} onChange={event => setInput(event.target.value)} rows={8} /><textarea className={error ? "error" : ""} value={result} readOnly rows={8} /></div><div className="actions"><CopyButton value={result} lang={lang} /><button onClick={() => setInput("")}>{messages[lang].clear}</button></div></div>;
}

function UuidTool({ lang }: { lang: Lang }) {
  const [value, setValue] = useState<string>(() => crypto.randomUUID());
  return <div className="simple-tool"><ResultBox label="UUID v4" value={value} lang={lang} onClear={() => setValue("")} /><button onClick={() => setValue(crypto.randomUUID())}>Generate</button></div>;
}

function TimestampTool({ lang }: { lang: Lang }) {
  const [timestamp, setTimestamp] = useState("1704067200");
  const [date, setDate] = useState("2024-01-01T00:00");
  const iso = timestampToDate(timestamp) ?? messages[lang].invalid;
  const seconds = dateToTimestamp(date, "seconds");
  const millis = dateToTimestamp(date, "milliseconds");
  return <div className="form-grid"><label>Timestamp<input value={timestamp} onChange={event => setTimestamp(event.target.value)} /></label><ResultBox label="ISO" value={iso} lang={lang} onClear={() => setTimestamp("")} /><label>Date<input type="datetime-local" value={date} onChange={event => setDate(event.target.value)} /></label><ResultBox label="Seconds / ms" value={seconds === null || millis === null ? messages[lang].invalid : `${seconds} / ${millis}`} lang={lang} onClear={() => setDate("")} /></div>;
}

function CaseTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("Lite Tools example");
  const [mode, setMode] = useState("upper");
  return <TextTransform input={input} setInput={setInput} result={changeCase(input, mode)} lang={lang} extra={<div className="segmented">{["upper", "lower", "title", "camel"].map(item => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>} />;
}

function TextTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const stats = textStats(input);
  return <div className="simple-tool"><textarea value={input} onChange={event => setInput(event.target.value)} rows={8} /><div className="stats"><div><strong>{stats.characters}</strong><span>Characters</span></div><div><strong>{stats.words}</strong><span>Words</span></div><div><strong>{stats.lines}</strong><span>Lines</span></div></div><button onClick={() => setInput("")}>{messages[lang].clear}</button></div>;
}

function ColorTool({ lang }: { lang: Lang }) {
  const [hex, setHex] = useState("#187b69");
  const [rgb, setRgb] = useState({ r: "24", g: "123", b: "105" });
  const parsed = hexToRgb(hex);
  const hexFromRgb = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return <div className="form-grid"><label>HEX<input value={hex} onChange={event => setHex(event.target.value)} /></label><ResultBox label="RGB" value={parsed ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : messages[lang].invalid} lang={lang} onClear={() => setHex("")} /><label>R<input value={rgb.r} onChange={event => setRgb({ ...rgb, r: event.target.value })} /></label><label>G<input value={rgb.g} onChange={event => setRgb({ ...rgb, g: event.target.value })} /></label><label>B<input value={rgb.b} onChange={event => setRgb({ ...rgb, b: event.target.value })} /></label><ResultBox label="HEX / HSL" value={hexFromRgb && hsl ? `${hexFromRgb} / hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` : messages[lang].invalid} lang={lang} onClear={() => setRgb({ r: "", g: "", b: "" })} /></div>;
}

function CalculatorTool({ tool, lang }: { tool: Tool; lang: Lang }) {
  const [a, setA] = useState("10");
  const [b, setB] = useState("100");
  const [c, setC] = useState("12");
  let result = messages[lang].invalid;
  let note = "";
  if (tool.calculator === "percentage") result = String(percentOf(a, b) ?? messages[lang].invalid);
  if (tool.calculator === "discount") {
    const value = discountPrice(a, b);
    result = value ? `${formatNumber(value.finalPrice, lang)} (${formatNumber(value.saved, lang)} saved)` : messages[lang].invalid;
    note = messages[lang].financeNote;
  }
  if (tool.calculator === "bmi") {
    const value = bmi(a, b);
    result = value ? formatNumber(value, lang) : messages[lang].invalid;
    note = messages[lang].healthNote;
  }
  if (tool.calculator === "compound") {
    const value = compoundInterest(a, b, c);
    result = value ? `${formatNumber(value.amount, lang)} (${formatNumber(value.interest, lang)})` : messages[lang].invalid;
    note = messages[lang].financeNote;
  }
  if (tool.calculator === "date") result = String(dateInterval(a, b) ?? messages[lang].invalid);
  const dateMode = tool.calculator === "date";
  return <div className="form-grid"><label>{dateMode ? "Start" : "A"}<input type={dateMode ? "date" : "number"} value={a} onChange={event => setA(event.target.value)} /></label><label>{dateMode ? "End" : "B"}<input type={dateMode ? "date" : "number"} value={b} onChange={event => setB(event.target.value)} /></label>{tool.calculator === "compound" && <label>Years<input type="number" value={c} onChange={event => setC(event.target.value)} /></label>}<ResultBox label={messages[lang].result} value={result} lang={lang} onClear={() => { setA(""); setB(""); setC(""); }} />{note && <p className="helper">{note}</p>}</div>;
}

function QrTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("https://example.com");
  const [size, setSize] = useState("256");
  const [dark, setDark] = useState("#14201d");
  const [light, setLight] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");
  const validation = validateQrInput(input);
  useEffect(() => {
    if (!validation.ok) {
      return;
    }
    void QRCode.toDataURL(input, { width: Number(size), margin: 2, color: { dark, light } }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [dark, input, light, size, validation.ok]);
  const error = validation.ok ? "" : validation.error === "tooLong" ? messages[lang].qrTooLong : messages[lang].qrEmpty;
  return <div className="qr-layout"><div className="form-grid"><label>Text / URL<textarea value={input} onChange={event => setInput(event.target.value)} rows={5} /></label><label>Size<select value={size} onChange={event => setSize(event.target.value)}><option>192</option><option>256</option><option>320</option><option>512</option></select></label><label>Foreground<input type="color" value={dark} onChange={event => setDark(event.target.value)} /></label><label>Background<input type="color" value={light} onChange={event => setLight(event.target.value)} /></label><button onClick={() => setInput("")}>{messages[lang].clear}</button></div><div className="qr-preview">{validation.ok && dataUrl ? <><img src={dataUrl} alt="QR Code" /><a className="button" href={dataUrl} download="lite-tools-qr.png">{messages[lang].qrDownload}</a></> : <p>{error}</p>}</div></div>;
}

function ResultBox({ label, value, lang, onClear }: { label: string; value: string; lang: Lang; onClear: () => void }) {
  return <div className="result-box"><span>{label}</span><strong>{value}</strong><div className="actions"><CopyButton value={value} lang={lang} /><button onClick={onClear}>{messages[lang].clear}</button></div></div>;
}

function InfoPage({ page, lang, navigate }: { page: Page; lang: Lang; navigate: (page: Page) => void }) {
  const t = messages[lang];
  const title = navLabels[page][lang];
  const body = {
    about: [t.tagline, "All tools are original browser-side utilities for conversion, formatting, calculation, and QR Code generation."],
    privacy: ["Calculator, converter, text, and QR Code inputs are processed locally in the browser.", "Only local usage counts are stored in localStorage. No tool content is sent to analytics."],
    terms: ["Use these tools at your own discretion. Finance, health, and date results are references only.", "Do not use the service for unlawful content or decisions requiring professional review."],
    contact: ["For feedback, open a GitHub pull request or contact the repository maintainer through the project channels.", "Do not send secrets or private financial data in public reports."],
    "not-found": ["The page was not found. Use the button below to return home."],
    home: [],
  }[page];
  return <section className="info-page"><span className="eyebrow">{title}</span><h1>{title}</h1>{body.map(line => <p key={line}>{line}</p>)}<button onClick={() => navigate("home")}>{t.home}</button></section>;
}

export default App;
