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

export function Ipv4SubnetTool({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<"cidr" | "hosts" | "same">("cidr");
  const [cidr, setCidr] = useState("192.168.1.10/24");
  const [ip, setIp] = useState("192.168.1.10");
  const [mask, setMask] = useState("255.255.255.0");
  const [hosts, setHosts] = useState("254");
  const [ipA, setIpA] = useState("192.168.1.10");
  const [ipB, setIpB] = useState("192.168.1.200");
  const [samePrefix, setSamePrefix] = useState("24");
  const t = {
    title: local(lang, "IPv4 subnet input", "IPv4 子网输入", "IPv4 子網輸入"),
    cidr: local(lang, "IP/CIDR", "IP/CIDR", "IP/CIDR"),
    mask: local(lang, "Subnet mask", "子网掩码", "子網遮罩"),
    hosts: local(lang, "Required hosts", "所需主机数", "所需主機數"),
    same: local(lang, "Same subnet check", "同子网检查", "同子網檢查"),
  };
  const result = useMemo(() => {
    if (mode === "hosts") return requiredHostsToPrefix(hosts);
    if (mode === "same") return sameIpv4Subnet(ipA, ipB, samePrefix);
    const combined = parseIpv4Cidr(cidr);
    if (combined.ok) return calculateIpv4Subnet({ ip: combined.data.ip, prefix: combined.data.prefix });
    const maskResult = parseSubnetMask(mask);
    if (!maskResult.ok) return maskResult;
    return calculateIpv4Subnet({ ip, prefix: maskResult.data.prefix });
  }, [cidr, hosts, ip, ipA, ipB, mask, mode, samePrefix]);
  const data = result.ok ? result.data as ValueMap : {};
  const display = result.ok
    ? mode === "hosts"
      ? rows([["CIDR prefix", `/${data.prefix}`], ["Total addresses", data.total], ["Usable hosts", data.usable]])
      : mode === "same"
        ? rows([["Same subnet", data.same ? local(lang, "Yes", "是", "是") : local(lang, "No", "否", "否")]])
        : rows([
          ["CIDR", data.cidr], ["Mask", data.mask], ["Mask binary", data.maskBinary], ["Wildcard", data.wildcard],
          ["Network", data.network], ["Broadcast", data.broadcast ?? "—"], ["First usable", data.firstUsable], ["Last usable", data.lastUsable],
          ["Total", data.total], ["Usable", data.usable], ["Semantics", data.semantics], ["Class", data.addressClass], ["Binary address", data.binaryAddress],
        ])
    : errorText(lang, result.reason);
  const copyValue = result.ok ? (typeof display === "string" ? display : "") : "";
  return <div className="calculator-layout"><section className="input-panel"><h3>{t.title}</h3><div className="segmented"><button type="button" aria-pressed={mode === "cidr"} className={mode === "cidr" ? "active" : ""} onClick={() => setMode("cidr")}>CIDR</button><button type="button" aria-pressed={mode === "hosts"} className={mode === "hosts" ? "active" : ""} onClick={() => setMode("hosts")}>{t.hosts}</button><button type="button" aria-pressed={mode === "same"} className={mode === "same" ? "active" : ""} onClick={() => setMode("same")}>{t.same}</button></div>{mode === "cidr" && <><Field id="ipv4-cidr" label={t.cidr} help="Example: 192.168.1.10/24" lang={lang} error={!result.ok ? errorText(lang, result.reason) : undefined}><input value={cidr} onChange={event => setCidr(event.target.value)} /></Field><Field id="ipv4-ip" label="IPv4" help="Alternative IP + mask input" lang={lang}><input value={ip} onChange={event => setIp(event.target.value)} /></Field><Field id="ipv4-mask" label={t.mask} help="Only contiguous masks are accepted." lang={lang}><input value={mask} onChange={event => setMask(event.target.value)} /></Field></>}{mode === "hosts" && <Field id="ipv4-hosts" label={t.hosts} help="Regular LAN host planning subtracts network and broadcast except /31 and /32 semantics." lang={lang} error={!result.ok ? errorText(lang, result.reason) : undefined}><input inputMode="numeric" value={hosts} onChange={event => setHosts(event.target.value)} /></Field>}{mode === "same" && <><Field id="ipv4-a" label="IPv4 A" help="First IPv4 address." lang={lang}><input value={ipA} onChange={event => setIpA(event.target.value)} /></Field><Field id="ipv4-b" label="IPv4 B" help="Second IPv4 address." lang={lang}><input value={ipB} onChange={event => setIpB(event.target.value)} /></Field><Field id="ipv4-prefix" label="CIDR prefix" help="0 to 32." lang={lang}><input inputMode="numeric" value={samePrefix} onChange={event => setSamePrefix(event.target.value)} /></Field></>}</section><ResultCard label={messages[lang].result} displayValue={display} copyValue={copyValue} lang={lang} /></div>;
}

export function IpRangeCidrTool({ lang }: { lang: Lang }) {
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
  const copyValue = result.ok && mode === "range" ? (data.cidrs as string[]).join("\n") : "";
  return <div className="calculator-layout"><section className="input-panel"><h3>IPv4 CIDR</h3><div className="segmented"><button type="button" aria-pressed={mode === "cidr"} className={mode === "cidr" ? "active" : ""} onClick={() => setMode("cidr")}>CIDR → range</button><button type="button" aria-pressed={mode === "range"} className={mode === "range" ? "active" : ""} onClick={() => setMode("range")}>Range → CIDR</button></div>{mode === "cidr" ? <Field id="range-cidr" label="CIDR" help="Example: 192.168.1.0/24" lang={lang} error={!result.ok ? errorText(lang, result.reason) : undefined}><input value={cidr} onChange={event => setCidr(event.target.value)} /></Field> : <><Field id="range-start" label="Start IP" help="First IPv4 address." lang={lang}><input value={start} onChange={event => setStart(event.target.value)} /></Field><Field id="range-end" label="End IP" help="Last IPv4 address." lang={lang} error={!result.ok ? errorText(lang, result.reason) : undefined}><input value={end} onChange={event => setEnd(event.target.value)} /></Field></>}</section><ResultCard label={messages[lang].result} displayValue={display} copyValue={copyValue} lang={lang} /></div>;
}

export function IpAddressConverterTool({ lang }: { lang: Lang }) {
  const [source, setSource] = useState<"dotted" | "decimal" | "binary" | "hex">("dotted");
  const [input, setInput] = useState("192.168.1.1");
  const result = convertIpv4(input, source);
  const data = result.ok ? result.data as ValueMap : {};
  const classification = data.classification as { label?: string } | undefined;
  const display = result.ok ? rows([["Dotted", data.dotted], ["Decimal", data.decimal], ["Binary", data.binary], ["Grouped binary", data.groupedBinary], ["Hex", data.hex], ["Type", classification?.label]]) : errorText(lang, result.reason);
  return <div className="calculator-layout"><section className="input-panel"><h3>IPv4</h3><Field id="ipv4-source" label="Input format" help="Choose the format used by the input." lang={lang}><select value={source} onChange={event => setSource(event.target.value as typeof source)}><option value="dotted">Dotted decimal</option><option value="decimal">Unsigned integer</option><option value="binary">32-bit binary</option><option value="hex">8-digit hex</option></select></Field><Field id="ipv4-convert-input" label="IPv4 value" help="Classification uses local IANA special-purpose rules reviewed on 2026-07-30." lang={lang} error={!result.ok ? errorText(lang, result.reason) : undefined}><input value={input} onChange={event => setInput(event.target.value)} /></Field></section><ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} /></div>;
}

export function Ipv6Tool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("2001:db8::1");
  const [prefix, setPrefix] = useState("64");
  const expanded = ipv6ToExpanded(input);
  const compressed = ipv6ToCompressed(input);
  const range = ipv6PrefixRange(input, prefix);
  const classification = classifyIpv6(input);
  const valid = expanded.ok && compressed.ok && range.ok;
  const display = valid ? rows([["Expanded", expanded.data.expanded], ["RFC 5952", compressed.data.compressed], ["Prefix start", range.data.start], ["Prefix end", range.data.end], ["Address count", range.data.total], ["Type", classification.label]]) : errorText(lang, !expanded.ok ? expanded.reason : !range.ok ? range.reason : "invalid");
  return <div className="calculator-layout"><section className="input-panel"><h3>IPv6</h3><Field id="ipv6-input" label="IPv6 address" help="Zone IDs such as %en0 are not supported." lang={lang} error={!valid ? errorText(lang) : undefined}><input value={input} onChange={event => setInput(event.target.value)} /></Field><Field id="ipv6-prefix" label="Prefix length" help="0 to 128." lang={lang}><input inputMode="numeric" value={prefix} onChange={event => setPrefix(event.target.value)} /></Field></section><ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code /></div>;
}

async function queryNetworkApi(path: string, ip: string) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ip }) });
  return response.json();
}

export function IpLookupTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ loading?: boolean; result?: unknown; error?: string }>({});
  const localCheck = normalizeIp(input);
  const submit = async () => {
    setState({ loading: true });
    if (!localCheck.ok || !localCheck.data.classification.publicQuery) {
      setState({ error: local(lang, "This address is not suitable for public IP lookup.", "该地址不适合公网 IP 查询。", "該地址不適合公網 IP 查詢。") });
      return;
    }
    try {
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.lookup, localCheck.data.ip) });
    } catch {
      setState({ error: local(lang, "The lookup request failed.", "查询请求失败。", "查詢要求失敗。") });
    }
  };
  const display = state.loading ? local(lang, "Loading…", "查询中…", "查詢中…") : state.error || (state.result ? <pre>{JSON.stringify(state.result, null, 2)}</pre> : local(lang, "Run a lookup to see estimated public network data.", "点击查询后显示公网网络估算数据。", "點擊查詢後顯示公網網絡估算資料。"));
  return <form className="calculator-layout" onSubmit={event => { event.preventDefault(); void submit(); }}><section className="input-panel"><h3>IP lookup</h3><Field id="ip-lookup-input" label="IP address" help="Only one public IPv4 or IPv6 address is accepted. The query is sent only after submit." lang={lang} error={state.error}><input value={input} onChange={event => { setInput(event.target.value); setState({}); }} /></Field><p className="helper-note">{local(lang, "IP geolocation is an estimate and may describe an ISP node or registry location, not a person or exact street address.", "IP 地理位置是数据库估算，可能代表运营商节点或注册位置，不能确定个人或精确地址。", "IP 地理位置是資料庫估算，可能代表營運商節點或註冊位置，不能確定個人或精確地址。")}</p><button type="submit" aria-busy={state.loading}>{local(lang, "Query", "查询", "查詢")}</button></section><ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code /></form>;
}

export function IpRdapTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<{ loading?: boolean; result?: unknown; error?: string }>({});
  const localCheck = normalizeIp(input);
  const submit = async () => {
    setState({ loading: true });
    if (!localCheck.ok || !localCheck.data.classification.publicQuery) {
      setState({ error: local(lang, "This address is not suitable for RDAP lookup.", "该地址不适合 RDAP 查询。", "該地址不適合 RDAP 查詢。") });
      return;
    }
    try {
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.rdap, localCheck.data.ip) });
    } catch {
      setState({ error: local(lang, "The RDAP request failed.", "RDAP 请求失败。", "RDAP 要求失敗。") });
    }
  };
  const display = state.loading ? local(lang, "Loading…", "查询中…", "查詢中…") : state.error || (state.result ? <details><summary>Raw RDAP JSON</summary><pre>{JSON.stringify(state.result, null, 2)}</pre></details> : local(lang, "Run a lookup to see public RDAP registration data.", "点击查询后显示公开 RDAP 注册资料。", "點擊查詢後顯示公開 RDAP 註冊資料。"));
  return <form className="calculator-layout" onSubmit={event => { event.preventDefault(); void submit(); }}><section className="input-panel"><h3>RDAP</h3><Field id="ip-rdap-input" label="IP address" help="Only one public IPv4 or IPv6 address is accepted. RDAP queries use the same-origin API." lang={lang} error={state.error}><input value={input} onChange={event => { setInput(event.target.value); setState({}); }} /></Field><button type="submit" aria-busy={state.loading}>{local(lang, "Query RDAP", "查询 RDAP", "查詢 RDAP")}</button></section><ResultCard label={messages[lang].result} displayValue={display} copyValue="" lang={lang} code /></form>;
}
