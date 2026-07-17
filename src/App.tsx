import { useState } from "react";

type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  ready?: boolean;
  popular?: boolean;
};

const tools: Tool[] = [
  { id: "length", name: "长度转换", description: "米、厘米、英寸、英尺互转", category: "单位转换", icon: "↔", ready: true, popular: true },
  { id: "weight", name: "重量转换", description: "千克、克、磅、盎司互转", category: "单位转换", icon: "kg", ready: true, popular: true },
  { id: "temperature", name: "温度转换", description: "摄氏、华氏、开尔文互转", category: "单位转换", icon: "°", ready: true, popular: true },
  { id: "storage", name: "数据存储转换", description: "B、KB、MB、GB、TB 换算", category: "单位转换", icon: "01", ready: true },
  { id: "percentage", name: "百分比计算", description: "比例、增长率与折扣计算", category: "计算器", icon: "%", ready: true, popular: true },
  { id: "date", name: "日期差计算", description: "计算两个日期相隔天数", category: "计算器", icon: "日", ready: true, popular: true },
  { id: "text", name: "字数统计", description: "字符、字词、段落即时统计", category: "文本工具", icon: "字", ready: true, popular: true },
  { id: "base64", name: "Base64 编解码", description: "文本 Base64 编码与解码", category: "开发工具", icon: "64", ready: true, popular: true },
  { id: "url", name: "URL 编解码", description: "安全编码与还原 URL 参数", category: "开发工具", icon: "/", ready: true },
  { id: "password", name: "密码生成器", description: "生成安全的随机密码", category: "生成器", icon: "✦", ready: true, popular: true },
  { id: "uuid", name: "UUID 生成器", description: "一键生成 UUID v4", category: "生成器", icon: "#", ready: true },
  { id: "qr", name: "二维码生成", description: "网址、文本与 Wi-Fi 二维码", category: "二维码", icon: "▦", popular: true },
  { id: "image", name: "图片格式转换", description: "JPG、PNG、WebP 相互转换", category: "图片工具", icon: "◫" },
  { id: "json", name: "JSON 格式化", description: "格式化、压缩并校验 JSON", category: "开发工具", icon: "{}" },
  { id: "color", name: "颜色格式转换", description: "HEX、RGB、HSL 互转", category: "格式转换", icon: "●" },
];

const categories = ["全部", "单位转换", "计算器", "文本工具", "开发工具", "生成器", "二维码", "图片工具", "格式转换"];

const unitSets: Record<string, { label: string; units: Record<string, number>; defaultFrom: string; defaultTo: string }> = {
  length: { label: "长度", units: { 米: 1, 千米: 1000, 厘米: 0.01, 毫米: 0.001, 英寸: 0.0254, 英尺: 0.3048, 英里: 1609.344 }, defaultFrom: "米", defaultTo: "英尺" },
  weight: { label: "重量", units: { 千克: 1, 克: 0.001, 毫克: 0.000001, 磅: 0.45359237, 盎司: 0.028349523, 吨: 1000 }, defaultFrom: "千克", defaultTo: "磅" },
  storage: { label: "数据存储", units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 }, defaultFrom: "GB", defaultTo: "MB" },
};

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 8 }).format(value);
}

function ToolWorkspace({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(unitSets[tool.id]?.defaultFrom ?? "摄氏度");
  const [to, setTo] = useState(unitSets[tool.id]?.defaultTo ?? "华氏度");
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [dateA, setDateA] = useState("");
  const [dateB, setDateB] = useState("");
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("M7!rK9#vQ2@xP8&w");
  const [uuid, setUuid] = useState("550e8400-e29b-41d4-a716-446655440000");

  const unitSet = unitSets[tool.id];
  const unitResult = unitSet ? Number(value) * unitSet.units[from] / unitSet.units[to] : 0;
  const tempResult = (() => {
    const n = Number(value);
    const c = from === "摄氏度" ? n : from === "华氏度" ? (n - 32) * 5 / 9 : n - 273.15;
    return to === "摄氏度" ? c : to === "华氏度" ? c * 9 / 5 + 32 : c + 273.15;
  })();
  const encoded = (() => {
    try {
      if (tool.id === "base64") return mode === "encode" ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text)));
      if (tool.id === "url") return mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
    } catch { return "输入内容无法解码，请检查格式。"; }
    return "";
  })();
  const generatePassword = (size = length) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
    const bytes = new Uint32Array(size);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, n => chars[n % chars.length]).join(""));
  };
  const generateUuid = () => setUuid(crypto.randomUUID());

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <section className="workspace" aria-labelledby="workspace-title">
      <div className="workspace-head">
        <div className="tool-title-wrap"><span className="tool-icon large">{tool.icon}</span><div><span className="eyebrow">{tool.category}</span><h2 id="workspace-title">{tool.name}</h2></div></div>
        <button className="close-btn" onClick={onClose} aria-label="关闭工具">×</button>
      </div>

      {unitSet && <div className="converter-grid">
        <label>数值<input type="number" value={value} onChange={e => setValue(e.target.value)} /></label>
        <label>从<select value={from} onChange={e => setFrom(e.target.value)}>{Object.keys(unitSet.units).map(u => <option key={u}>{u}</option>)}</select></label>
        <button className="swap-btn" onClick={swap} aria-label="交换单位">⇄</button>
        <label>转换为<select value={to} onChange={e => setTo(e.target.value)}>{Object.keys(unitSet.units).map(u => <option key={u}>{u}</option>)}</select></label>
        <div className="result-box"><span>转换结果</span><strong>{formatNumber(unitResult)}</strong><small>{to}</small></div>
      </div>}

      {tool.id === "temperature" && <div className="converter-grid">
        <label>温度<input type="number" value={value} onChange={e => setValue(e.target.value)} /></label>
        <label>从<select value={from} onChange={e => setFrom(e.target.value)}>{["摄氏度", "华氏度", "开尔文"].map(u => <option key={u}>{u}</option>)}</select></label>
        <button className="swap-btn" onClick={swap}>⇄</button>
        <label>转换为<select value={to} onChange={e => setTo(e.target.value)}>{["摄氏度", "华氏度", "开尔文"].map(u => <option key={u}>{u}</option>)}</select></label>
        <div className="result-box"><span>转换结果</span><strong>{formatNumber(tempResult)}</strong><small>{to}</small></div>
      </div>}

      {tool.id === "percentage" && <div className="simple-tool"><p>计算一个数值的百分比</p><div className="inline-inputs"><input type="number" value={value} onChange={e => setValue(e.target.value)} aria-label="百分比"/><span>% ×</span><input type="number" value={text} onChange={e => setText(e.target.value)} placeholder="输入数值" aria-label="数值"/></div><div className="result-box"><span>结果</span><strong>{formatNumber(Number(value) * Number(text) / 100)}</strong></div></div>}

      {tool.id === "date" && <div className="simple-tool"><div className="date-inputs"><label>开始日期<input type="date" value={dateA} onChange={e => setDateA(e.target.value)}/></label><label>结束日期<input type="date" value={dateB} onChange={e => setDateB(e.target.value)}/></label></div><div className="result-box"><span>相隔</span><strong>{dateA && dateB ? Math.abs(Math.round((new Date(dateB).getTime() - new Date(dateA).getTime()) / 86400000)) : "—"}</strong><small>天</small></div></div>}

      {tool.id === "text" && <div className="simple-tool"><textarea value={text} onChange={e => setText(e.target.value)} placeholder="在这里粘贴或输入文本…" rows={7}/><div className="stats"><div><strong>{text.length}</strong><span>字符</span></div><div><strong>{text.trim() ? text.trim().split(/\s+/).length : 0}</strong><span>字词</span></div><div><strong>{text ? text.split(/\n+/).filter(Boolean).length : 0}</strong><span>段落</span></div></div></div>}

      {(tool.id === "base64" || tool.id === "url") && <div className="simple-tool"><div className="segmented"><button className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>编码</button><button className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>解码</button></div><div className="text-panes"><textarea value={text} onChange={e => setText(e.target.value)} placeholder="输入原始内容…" rows={6}/><textarea value={encoded} readOnly placeholder="结果会显示在这里" rows={6}/></div></div>}

      {tool.id === "password" && <div className="simple-tool"><label>密码长度：{length}<input className="range" type="range" min="8" max="32" value={length} onChange={e => { const size = Number(e.target.value); setLength(size); generatePassword(size); }}/></label><div className="code-result"><code>{password}</code><button onClick={() => navigator.clipboard?.writeText(password)}>复制</button><button onClick={() => generatePassword()}>重新生成</button></div><p className="helper">包含大小写字母、数字和特殊字符，使用浏览器安全随机数生成。</p></div>}

      {tool.id === "uuid" && <div className="simple-tool"><div className="code-result"><code>{uuid}</code><button onClick={() => navigator.clipboard?.writeText(uuid)}>复制</button><button onClick={generateUuid}>重新生成</button></div><p className="helper">符合 RFC 4122 的随机 UUID v4。</p></div>}
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const filtered = tools.filter(t => (category === "全部" || t.category === category) && `${t.name}${t.description}${t.category}`.toLowerCase().includes(query.toLowerCase()));

  const openTool = (tool: Tool) => {
    if (!tool.ready) return;
    setActiveTool(tool);
    setTimeout(() => document.getElementById("tool-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  };

  return <main>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">轻</span><span>轻工具</span></a><nav><a href="#popular">热门工具</a><a href="#all-tools">全部工具</a><a href="#privacy">隐私</a></nav></header>

    <section className="hero" id="top">
      <span className="hero-pill"><i /> 简单、快速、无需登录</span>
      <h1>需要什么工具，<br/><em>搜一下就好。</em></h1>
      <p>常用转换、计算和开发工具，一站解决日常小问题。</p>
      <div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索你需要的工具…" aria-label="搜索工具"/><kbd>⌘ K</kbd></div>
      <div className="quick-links"><span>试试：</span>{["长度转换", "百分比计算", "字数统计", "密码生成器"].map(name => <button key={name} onClick={() => setQuery(name)}>{name}</button>)}</div>
    </section>

    <section className="content" id="popular">
      {!query && category === "全部" && <><div className="section-head"><div><span className="eyebrow">常用精选</span><h2>热门工具</h2></div><span className="section-note">最常被使用的快捷工具</span></div><div className="popular-grid">{tools.filter(t => t.popular).slice(0, 8).map(tool => <ToolCard key={tool.id} tool={tool} onClick={() => openTool(tool)}/>)}</div></>}

      <div className="all-tools" id="all-tools"><div className="section-head"><div><span className="eyebrow">工具目录</span><h2>{query ? `“${query}” 的搜索结果` : "全部工具"}</h2></div><span className="count">{filtered.length} 个工具</span></div><div className="category-row" role="tablist" aria-label="工具分类">{categories.map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="tools-grid">{filtered.map(tool => <ToolCard key={tool.id} tool={tool} onClick={() => openTool(tool)}/>)}</div>{filtered.length === 0 && <div className="empty"><span>⌕</span><h3>没有找到相关工具</h3><p>换一个关键词，或浏览其他分类。</p></div>}</div>

      {activeTool && <div id="tool-workspace"><ToolWorkspace key={activeTool.id} tool={activeTool} onClose={() => setActiveTool(null)}/></div>}
    </section>

    <section className="privacy" id="privacy"><div className="privacy-icon">✓</div><div><h2>你的数据，留在你的设备里</h2><p>所有数据仅在你的浏览器中处理。我们不上传、不保存，也不追踪你的输入内容。</p></div><span>本地处理</span></section>
    <footer><a className="brand" href="#top"><span className="brand-mark">轻</span><span>轻工具</span></a><p>把复杂的事，变简单一点。</p><span>© 2026 轻工具</span></footer>
  </main>;
}

function ToolCard({ tool, onClick }: { tool: Tool; onClick: () => void }) {
  return <button className={`tool-card ${!tool.ready ? "coming" : ""}`} onClick={onClick} aria-label={tool.ready ? `打开${tool.name}` : `${tool.name}即将上线`}><span className="tool-icon">{tool.icon}</span><span className="tool-copy"><strong>{tool.name}</strong><small>{tool.description}</small></span>{tool.ready ? <span className="arrow">↗</span> : <span className="soon">即将上线</span>}</button>;
}
