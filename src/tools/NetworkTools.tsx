import { useMemo, useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { messages } from "../i18n";
import {
  NETWORK_API_PATHS,
  calculateIpv4Subnet,
  cidrToIpv4Range,
  convertIpv4,
  ipv4RangeToCidrs,
  ipv6PrefixRange,
  ipv6ToCompressed,
  ipv6ToExpanded,
  parseIpv4Cidr,
  parseSubnetMask,
  requiredHostsToPrefix,
  sameIpv4Subnet,
  classifyIpv6,
  normalizeIp,
} from "../lib/network-ip.js";
import type { Lang } from "../types";

const local = (lang: Lang, en: string, zhCN: string, zhTW: string) => lang === "en" ? en : lang === "zh-CN" ? zhCN : zhTW;
const big = (value: unknown) => typeof value === "bigint" ? value.toString() : String(value ?? "—");
type ValueMap = Record<string, unknown>;

function rows(values: Array<[string, unknown]>) {
  return <dl className="result-list">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{big(value)}</dd></div>)}</dl>;
}

function errorText(lang: Lang, reason?: string) {
  const base = messages[lang].invalid;
  return reason ? `${base} (${reason})` : base;
}

function SectionNav({ lang, items }: { lang: Lang; items: Array<[string, string]> }) {
  return (
    <nav className="tool-anchor-nav" aria-label={local(lang, "Tool sections", "工具分区", "工具分區")}>
      {items.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
  );
}

function ModuleCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="network-module" id={id} aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>{title}</h3>{children}</section>;
}

function resultText(result: { ok: boolean; reason?: string }, lang: Lang) {
  return result.ok ? "" : errorText(lang, result.reason);
}

function Ipv4SubnetModule({ lang }: { lang: Lang }) {
  const [cidr, setCidr] = useState("192.168.1.10/24");
  const [ip, setIp] = useState("192.168.1.10");
  const [mask, setMask] = useState("255.255.255.0");
  const result = useMemo(() => {
    const combined = parseIpv4Cidr(cidr);
    if (combined.ok) return calculateIpv4Subnet({ ip: combined.data.ip, prefix: combined.data.prefix });
    const maskResult = parseSubnetMask(mask);
    if (!maskResult.ok) return maskResult;
    return calculateIpv4Subnet({ ip, prefix: maskResult.data.prefix });
  }, [cidr, ip, mask]);
  const data = result.ok ? result.data as ValueMap : {};
  const display = result.ok
    ? rows([
      ["CIDR", data.cidr], ["Mask", data.mask], ["Mask binary", data.maskBinary], ["Wildcard", data.wildcard],
      ["Network", data.network], ["Broadcast", data.broadcast ?? "—"], ["First usable", data.firstUsable], ["Last usable", data.lastUsable],
      ["Total", data.total], ["Usable", data.usable], ["Semantics", data.semantics], ["Class", data.addressClass], ["Binary address", data.binaryAddress],
    ])
    : errorText(lang, result.reason);
  const reset = () => {
    setCidr("192.168.1.10/24");
    setIp("192.168.1.10");
    setMask("255.255.255.0");
  };
  return (
    <ModuleCard id="subnet" title={local(lang, "IPv4 subnet calculator", "IPv4 子网计算器", "IPv4 子網計算器")}>
      <div className="calculator-layout">
        <section className="input-panel" aria-label={local(lang, "Subnet inputs", "子网输入", "子網輸入")}>
          <Field id="ipv4-cidr" label="IP/CIDR" help="Example: 192.168.1.10/24" lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input value={cidr} onChange={event => setCidr(event.target.value)} /></Field>
          <Field id="ipv4-ip" label="IPv4" help="Alternative IP + mask input." lang={lang}><input value={ip} onChange={event => setIp(event.target.value)} /></Field>
          <Field id="ipv4-mask" label={local(lang, "Subnet mask", "子网掩码", "子網遮罩")} help="Only contiguous masks are accepted." lang={lang}><input value={mask} onChange={event => setMask(event.target.value)} /></Field>
        </section>
        <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} onClear={reset} />
      </div>
    </ModuleCard>
  );
}

function MaskConverterModule({ lang }: { lang: Lang }) {
  const [mask, setMask] = useState("255.255.255.0");
  const result = parseSubnetMask(mask);
  const display = result.ok ? rows([["CIDR prefix", `/${result.data.prefix}`], ["Mask", result.data.mask]]) : errorText(lang, result.reason);
  return (
    <ModuleCard id="mask-converter" title={local(lang, "Mask / CIDR converter", "掩码 / CIDR 转换", "遮罩 / CIDR 轉換")}>
      <Field id="mask-input" label={local(lang, "Subnet mask", "子网掩码", "子網遮罩")} help="Example: 255.255.255.0" lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input value={mask} onChange={event => setMask(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue={result.ok ? `/${result.data.prefix}` : ""} lang={lang} onClear={() => setMask("255.255.255.0")} />
    </ModuleCard>
  );
}

function HostRecommendationModule({ lang }: { lang: Lang }) {
  const [hosts, setHosts] = useState("254");
  const result = requiredHostsToPrefix(hosts);
  const data = result.ok ? result.data as ValueMap : {};
  const display = result.ok ? rows([["CIDR prefix", `/${data.prefix}`], ["Total addresses", data.total], ["Usable hosts", data.usable]]) : errorText(lang, result.reason);
  return (
    <ModuleCard id="host-recommendation" title={local(lang, "Host recommendation", "主机容量推荐", "主機容量建議")}>
      <Field id="ipv4-hosts" label={local(lang, "Required hosts", "所需主机数", "所需主機數")} help="Regular LAN host planning subtracts network and broadcast except /31 and /32 semantics." lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input inputMode="numeric" value={hosts} onChange={event => setHosts(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue={result.ok ? `/${data.prefix}` : ""} lang={lang} onClear={() => setHosts("254")} />
    </ModuleCard>
  );
}

function RangeCidrModule({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<"cidr" | "range">("cidr");
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const [start, setStart] = useState("192.168.1.1");
  const [end, setEnd] = useState("192.168.1.6");
  const result = mode === "cidr" ? cidrToIpv4Range(cidr) : ipv4RangeToCidrs(start, end);
  const data = result.ok ? result.data as ValueMap : {};
  const display = result.ok
    ? mode === "cidr"
      ? rows([["Start IP", data.start], ["End IP", data.end], ["Total", data.total], ["CIDR", data.cidr]])
      : <ol className="cidr-list">{(data.cidrs as string[]).map(item => <li key={item}><code>{item}</code></li>)}</ol>
    : errorText(lang, result.reason);
  return (
    <ModuleCard id="range-cidr" title={local(lang, "Range and CIDR", "范围与 CIDR", "範圍與 CIDR")}>
      <div className="segmented"><button type="button" aria-pressed={mode === "cidr"} className={mode === "cidr" ? "active" : ""} onClick={() => setMode("cidr")}>CIDR → range</button><button type="button" aria-pressed={mode === "range"} className={mode === "range" ? "active" : ""} onClick={() => setMode("range")}>Range → CIDR</button></div>
      {mode === "cidr"
        ? <Field id="range-cidr" label="CIDR" help="Example: 192.168.1.0/24" lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input value={cidr} onChange={event => setCidr(event.target.value)} /></Field>
        : <><Field id="range-start" label="Start IP" help="First IPv4 address." lang={lang}><input value={start} onChange={event => setStart(event.target.value)} /></Field><Field id="range-end" label="End IP" help="Last IPv4 address." lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input value={end} onChange={event => setEnd(event.target.value)} /></Field></>}
      <ResultCard label={messages[lang].result} displayValue={display} copyValue={result.ok && mode === "range" ? (data.cidrs as string[]).join("\n") : ""} lang={lang} onClear={() => { setCidr("192.168.1.0/24"); setStart("192.168.1.1"); setEnd("192.168.1.6"); }} />
    </ModuleCard>
  );
}

function Ipv4ConverterModule({ lang }: { lang: Lang }) {
  const [source, setSource] = useState<"dotted" | "decimal" | "binary" | "hex">("dotted");
  const [input, setInput] = useState("192.168.1.1");
  const result = convertIpv4(input, source);
  const data = result.ok ? result.data as ValueMap : {};
  const classification = data.classification as { label?: string } | undefined;
  const display = result.ok ? rows([["Dotted", data.dotted], ["Decimal", data.decimal], ["Binary", data.binary], ["Grouped binary", data.groupedBinary], ["Hex", data.hex], ["Type", classification?.label]]) : errorText(lang, result.reason);
  return (
    <ModuleCard id="ipv4-converter" title={local(lang, "IPv4 conversion and classification", "IPv4 转换与分类", "IPv4 轉換與分類")}>
      <Field id="ipv4-source" label="Input format" help="Choose the format used by the input." lang={lang}><select value={source} onChange={event => setSource(event.target.value as typeof source)}><option value="dotted">Dotted decimal</option><option value="decimal">Unsigned integer</option><option value="binary">32-bit binary</option><option value="hex">8-digit hex</option></select></Field>
      <Field id="ipv4-convert-input" label="IPv4 value" help="Classification uses local IANA special-purpose rules reviewed on 2026-07-30." lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input value={input} onChange={event => setInput(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} onClear={() => { setSource("dotted"); setInput("192.168.1.1"); }} />
    </ModuleCard>
  );
}

function SameSubnetModule({ lang }: { lang: Lang }) {
  const [ipA, setIpA] = useState("192.168.1.10");
  const [ipB, setIpB] = useState("192.168.1.200");
  const [samePrefix, setSamePrefix] = useState("24");
  const result = sameIpv4Subnet(ipA, ipB, samePrefix);
  const display = result.ok ? rows([["Same subnet", result.data.same ? local(lang, "Yes", "是", "是") : local(lang, "No", "否", "否")]]) : errorText(lang, result.reason);
  return (
    <ModuleCard id="same-subnet" title={local(lang, "Same subnet", "同子网判断", "同子網判斷")}>
      <Field id="ipv4-a" label="IPv4 A" help="First IPv4 address." lang={lang}><input value={ipA} onChange={event => setIpA(event.target.value)} /></Field>
      <Field id="ipv4-b" label="IPv4 B" help="Second IPv4 address." lang={lang}><input value={ipB} onChange={event => setIpB(event.target.value)} /></Field>
      <Field id="ipv4-prefix" label="CIDR prefix" help="0 to 32." lang={lang} error={!result.ok ? resultText(result, lang) : undefined}><input inputMode="numeric" value={samePrefix} onChange={event => setSamePrefix(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} onClear={() => { setIpA("192.168.1.10"); setIpB("192.168.1.200"); setSamePrefix("24"); }} />
    </ModuleCard>
  );
}

export function Ipv4NetworkToolbox({ lang }: { lang: Lang }) {
  return (
    <div className="network-toolbox">
      <p className="helper-note">{local(lang, "All IPv4 calculations on this page run locally in your browser. Try 192.168.1.10/24.", "本页 IPv4 计算均在浏览器本地完成。可试用 192.168.1.10/24。", "本頁 IPv4 計算均在瀏覽器本機完成。可試用 192.168.1.10/24。")}</p>
      <SectionNav lang={lang} items={[
        ["subnet", local(lang, "Subnet", "子网", "子網")],
        ["mask-converter", local(lang, "Mask", "掩码", "遮罩")],
        ["host-recommendation", local(lang, "Hosts", "主机", "主機")],
        ["range-cidr", local(lang, "Range / CIDR", "范围 / CIDR", "範圍 / CIDR")],
        ["ipv4-converter", local(lang, "Converter", "转换", "轉換")],
        ["same-subnet", local(lang, "Same subnet", "同子网", "同子網")],
      ]} />
      <Ipv4SubnetModule lang={lang} />
      <div className="network-module-grid">
        <MaskConverterModule lang={lang} />
        <HostRecommendationModule lang={lang} />
        <RangeCidrModule lang={lang} />
        <Ipv4ConverterModule lang={lang} />
        <SameSubnetModule lang={lang} />
      </div>
    </div>
  );
}

function Ipv6NormalizeModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("2001:db8::1");
  const expanded = ipv6ToExpanded(input);
  const compressed = ipv6ToCompressed(input);
  const classification = classifyIpv6(input);
  const valid = expanded.ok && compressed.ok;
  const display = valid ? rows([["Expanded", expanded.data.expanded], ["RFC 5952", compressed.data.compressed], ["Type", classification.label]]) : errorText(lang, !expanded.ok ? expanded.reason : "invalid");
  return (
    <ModuleCard id="ipv6-normalize" title={local(lang, "IPv6 formatting and detection", "IPv6 格式化与识别", "IPv6 格式化與識別")}>
      <Field id="ipv6-input" label="IPv6 address" help="Zone IDs such as %en0 are not supported." lang={lang} error={!valid ? errorText(lang) : undefined}><input value={input} onChange={event => setInput(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code onClear={() => setInput("2001:db8::1")} />
    </ModuleCard>
  );
}

function Ipv6PrefixModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("2001:db8::1");
  const [prefix, setPrefix] = useState("64");
  const range = ipv6PrefixRange(input, prefix);
  const display = range.ok ? rows([["Prefix start", range.data.start], ["Prefix end", range.data.end], ["Address count", range.data.total]]) : errorText(lang, range.reason);
  return (
    <ModuleCard id="ipv6-prefix" title={local(lang, "IPv6 prefix range", "IPv6 前缀范围", "IPv6 前綴範圍")}>
      <Field id="ipv6-prefix-input" label="IPv6 address" help="The prefix range is calculated with 128-bit integer arithmetic." lang={lang}><input value={input} onChange={event => setInput(event.target.value)} /></Field>
      <Field id="ipv6-prefix-length" label="Prefix length" help="0 to 128." lang={lang} error={!range.ok ? resultText(range, lang) : undefined}><input inputMode="numeric" value={prefix} onChange={event => setPrefix(event.target.value)} /></Field>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code onClear={() => { setInput("2001:db8::1"); setPrefix("64"); }} />
    </ModuleCard>
  );
}

export function Ipv6Toolbox({ lang }: { lang: Lang }) {
  return (
    <div className="network-toolbox">
      <p className="helper-note">{local(lang, "IPv6 formatting and prefix calculations stay local. No DNS or lookup request runs from this page.", "IPv6 格式化和前缀计算均保留在本地；本页不会执行 DNS 或查询请求。", "IPv6 格式化和前綴計算均保留在本機；本頁不會執行 DNS 或查詢要求。")}</p>
      <SectionNav lang={lang} items={[
        ["ipv6-normalize", local(lang, "Formatting", "格式化", "格式化")],
        ["ipv6-prefix", local(lang, "Prefix", "前缀", "前綴")],
      ]} />
      <div className="network-module-grid two">
        <Ipv6NormalizeModule lang={lang} />
        <Ipv6PrefixModule lang={lang} />
      </div>
    </div>
  );
}

async function queryNetworkApi(path: string, ip: string) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ip }) });
  return response.json();
}

function IpLookupModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ loading?: boolean; result?: unknown; error?: string }>({});
  const localCheck = normalizeIp(input);
  const submit = async () => {
    setState({ loading: true });
    if (!localCheck.ok || !localCheck.data.classification.publicQuery) {
      setState({ error: local(lang, "This address is not suitable for public IP lookup.", "该地址不适合公网 IP 查询。", "該位址不適合公網 IP 查詢。") });
      return;
    }
    try {
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.lookup, localCheck.data.ip) });
    } catch {
      setState({ error: local(lang, "The lookup request failed.", "查询请求失败。", "查詢要求失敗。") });
    }
  };
  const display = state.loading ? local(lang, "Loading…", "查询中…", "查詢中…") : state.error || (state.result ? <pre>{JSON.stringify(state.result, null, 2)}</pre> : local(lang, "Run a lookup to see estimated public network data.", "点击查询后显示公网网络估算数据。", "點擊查詢後顯示公網網絡估算資料。"));
  return (
    <ModuleCard id="ip-lookup" title="IP lookup">
      <form className="network-query-form" onSubmit={event => { event.preventDefault(); void submit(); }}>
        <Field id="ip-lookup-input" label="IP address" help="Only one public IPv4 or IPv6 address is accepted. The query is sent only after submit." lang={lang} error={state.error}><input value={input} onChange={event => { setInput(event.target.value); setState({}); }} /></Field>
        <p className="helper-note">{local(lang, "IP geolocation is an estimate and may describe an ISP node or registry location, not a person or exact street address.", "IP 地理位置是数据库估算，可能代表运营商节点或注册位置，不能确定个人或精确地址。", "IP 地理位置是資料庫估算，可能代表營運商節點或註冊位置，不能確定個人或精確地址。")}</p>
        <button type="submit" aria-busy={state.loading}>{local(lang, "Query", "查询", "查詢")}</button>
      </form>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code onClear={() => { setInput(""); setState({}); }} />
    </ModuleCard>
  );
}

function IpRdapModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ loading?: boolean; result?: unknown; error?: string }>({});
  const localCheck = normalizeIp(input);
  const submit = async () => {
    setState({ loading: true });
    if (!localCheck.ok || !localCheck.data.classification.publicQuery) {
      setState({ error: local(lang, "This address is not suitable for RDAP lookup.", "该地址不适合 RDAP 查询。", "該位址不適合 RDAP 查詢。") });
      return;
    }
    try {
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.rdap, localCheck.data.ip) });
    } catch {
      setState({ error: local(lang, "The RDAP request failed.", "RDAP 请求失败。", "RDAP 要求失敗。") });
    }
  };
  const display = state.loading ? local(lang, "Loading…", "查询中…", "查詢中…") : state.error || (state.result ? <details><summary>Raw RDAP JSON</summary><pre>{JSON.stringify(state.result, null, 2)}</pre></details> : local(lang, "Run a lookup to see public RDAP registration data.", "点击查询后显示公开 RDAP 注册资料。", "點擊查詢後顯示公開 RDAP 註冊資料。"));
  return (
    <ModuleCard id="ip-rdap" title="RDAP">
      <form className="network-query-form" onSubmit={event => { event.preventDefault(); void submit(); }}>
        <Field id="ip-rdap-input" label="IP address" help="Only one public IPv4 or IPv6 address is accepted. RDAP queries use the same-origin API." lang={lang} error={state.error}><input value={input} onChange={event => { setInput(event.target.value); setState({}); }} /></Field>
        <button type="submit" aria-busy={state.loading}>{local(lang, "Query RDAP", "查询 RDAP", "查詢 RDAP")}</button>
      </form>
      <ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code onClear={() => { setInput(""); setState({}); }} />
    </ModuleCard>
  );
}

export function IpInfoTool({ lang }: { lang: Lang }) {
  return (
    <div className="network-toolbox">
      <p className="helper-note">{local(lang, "Lookup and RDAP remain separate modules. Each request is user-triggered and uses its own same-origin endpoint.", "IP 查询和 RDAP 是独立模块；每次请求均由用户触发，并使用各自的同源 endpoint。", "IP 查詢和 RDAP 是獨立模組；每次要求均由使用者觸發，並使用各自的同源 endpoint。")}</p>
      <SectionNav lang={lang} items={[
        ["ip-lookup", "IP lookup"],
        ["ip-rdap", "RDAP"],
      ]} />
      <div className="network-module-grid two">
        <IpLookupModule lang={lang} />
        <IpRdapModule lang={lang} />
      </div>
    </div>
  );
}
