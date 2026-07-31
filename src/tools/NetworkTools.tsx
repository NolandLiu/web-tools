import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Field } from "../components/Field";
import { Icon } from "../components/Icons";
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
  parseIpv4Octets,
  parseSubnetMask,
  requiredHostsToPrefix,
  shouldAutoAdvanceIpv4Octet,
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

function ModuleCard({ id, title, icon = "network", layout = "default", children }: { id: string; title: string; icon?: string; layout?: "default" | "dashboard"; children: React.ReactNode }) {
  return (
    <section className={`network-module network-module-${layout}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="network-module-titlebar">
        <span className="network-module-title-icon"><Icon name={icon} size={20} /></span>
        <h3 id={`${id}-title`}>{title}</h3>
      </div>
      <div className="network-module-body">{children}</div>
    </section>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-info-note" role="note">
      <span className="dashboard-info-note-icon"><Icon name="info" size={18} /></span>
      <span>{children}</span>
    </div>
  );
}

function CardTitle({ id, icon, children }: { id: string; icon: string; children: React.ReactNode }) {
  return (
    <h4 id={id} className="dashboard-card-title">
      <span className="dashboard-card-title-icon"><Icon name={icon} size={18} /></span>
      <span>{children}</span>
    </h4>
  );
}

function resultText(result: { ok: boolean; reason?: string }, lang: Lang) {
  return result.ok ? "" : errorText(lang, result.reason);
}

const IPV4_DEFAULT_OCTETS = ["192", "168", "1", "10"];

function getSubnetText(lang: Lang) {
  const labels = {
    ipAddress: local(lang, "IP address", "IP 地址", "IP 位址"),
    prefix: local(lang, "Prefix length", "掩码位", "遮罩位"),
    result: messages[lang].result,
    copyAll: local(lang, "Copy all", "复制全部", "複製全部"),
    copyBinary: local(lang, "Copy binary", "复制二进制", "複製二進位"),
    copyItem: (label: string) => local(lang, `Copy ${label}`, `复制${label}`, `複製${label}`),
    ipSection: local(lang, "IP", "IP", "IP"),
    subnetSection: local(lang, "Subnet", "子网", "子網"),
    usableRange: local(lang, "Usable range", "可用范围", "可用範圍"),
    binaryBreakdown: local(lang, "Binary breakdown", "二进制拆解", "二進位拆解"),
    dottedAddress: local(lang, "IP address", "IP 地址", "IP 位址"),
    class: local(lang, "Type", "类型", "類型"),
    binaryAddress: local(lang, "Binary", "二进制", "二進位"),
    networkCidr: local(lang, "Network / CIDR", "网络 / CIDR", "網絡 / CIDR"),
    total: local(lang, "Total IPs", "总 IP 数", "總 IP 數"),
    usable: local(lang, "Usable IPs", "可使用 IP 数", "可使用 IP 數"),
    mask: local(lang, "Subnet mask", "子网掩码", "子網遮罩"),
    network: local(lang, "Network", "网络地址", "網絡位址"),
    firstUsable: local(lang, "First usable IP", "第一可用 IP", "第一可用 IP"),
    lastUsable: local(lang, "Last usable IP", "最后可用 IP", "最後可用 IP"),
    broadcast: local(lang, "Broadcast", "广播地址", "廣播位址"),
    networkBits: (count: number) => local(lang, `Network bits (${count})`, `网络位（${count}）`, `網絡位（${count}）`),
    hostBits: (count: number) => local(lang, `Host bits (${count})`, `主机位（${count}）`, `主機位（${count}）`),
    pointToPointRange: local(lang, "Point-to-point subnet", "点对点子网", "點對點子網"),
    singleHostRange: local(lang, "Single-host subnet", "单主机子网", "單主機子網"),
    notApplicable: local(lang, "Not applicable", "不适用", "不適用"),
  };
  const classLabels: Record<string, string> = {
    "Unspecified": local(lang, "Unspecified", "未指定地址", "未指定位址"),
    "Limited broadcast": local(lang, "Limited broadcast", "受限广播", "受限廣播"),
    "Loopback": local(lang, "Loopback", "环回地址", "迴路位址"),
    "Private": local(lang, "Private", "私有地址", "私有位址"),
    "Link-local": local(lang, "Link-local", "链路本地地址", "鏈路本機位址"),
    "Shared address space": local(lang, "Shared address space", "共享地址空间", "共享位址空間"),
    "Documentation": local(lang, "Documentation", "文档示例地址", "文件範例位址"),
    "Benchmarking": local(lang, "Benchmarking", "基准测试地址", "基準測試位址"),
    "Multicast": local(lang, "Multicast", "组播地址", "群播位址"),
    "Reserved": local(lang, "Reserved", "保留地址", "保留位址"),
    "This network": local(lang, "This network", "本网络", "本網絡"),
    "Public": local(lang, "Public", "公网地址", "公網位址"),
  };
  return {
    labels,
    octetLabel: (index: number) => local(lang, `IP octet ${index + 1}`, `IP 第 ${index + 1} 段`, `IP 第 ${index + 1} 段`),
    help: local(lang, "Enter the IPv4 address as four decimal octets and a CIDR prefix from 0 to 32.", "请输入 4 段十进制 IPv4 地址和 0 到 32 的 CIDR 掩码位。", "請輸入 4 段十進位 IPv4 位址和 0 到 32 的 CIDR 遮罩位。"),
    classLabel: (label: unknown) => classLabels[String(label)] ?? String(label ?? "—"),
    semantics: {
      pointToPoint: local(lang, "/31 point-to-point network: both addresses are usable and a separate broadcast address is not used.", "/31 点对点网络：两个地址均可用，通常不单独使用广播地址。", "/31 點對點網絡：兩個位址均可使用，通常不單獨使用廣播位址。"),
      singleHost: local(lang, "/32 single-host network: the subnet contains exactly one IP address and a separate broadcast address is not used.", "/32 单主机网络：子网只包含当前一个 IP 地址，不单独使用广播地址。", "/32 單主機網絡：子網只包含目前一個 IP 位址，不單獨使用廣播位址。"),
    },
  };
}

function CopyAction({ value, label, lang, compact }: { value: string; label: string; lang: Lang; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const t = messages[lang];

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <button type="button" className={compact ? "metric-copy" : "dashboard-copy-button"} aria-label={label} title={label} disabled={!value} onClick={() => void copy()}>
      <Icon name={status === "copied" ? "check" : "copy"} size={compact ? 15 : 16} />
      {!compact && <span>{status === "copied" ? t.copied : label}</span>}
      <span className="sr-only" aria-live="polite">{status === "failed" ? t.copyFailed : status === "copied" ? t.copied : ""}</span>
    </button>
  );
}

function MetricRow({ label, value, copyValue, lang, tone = "default" }: { label: string; value: React.ReactNode; copyValue: string; lang: Lang; tone?: "default" | "mono" | "code" | "primary" }) {
  const rowClass = tone === "default" || tone === "mono" ? "metric-row" : `metric-row metric-row-${tone}`;
  const valueClass = tone === "default" ? "metric-value" : `metric-value metric-value-${tone}`;
  return (
    <div className={rowClass}>
      <span className="metric-label">{label}</span>
      <span className={valueClass}>{value}</span>
      <CopyAction value={copyValue} label={getSubnetText(lang).labels.copyItem(label)} lang={lang} compact />
    </div>
  );
}

function BinaryBitSplit({ binary, prefix, lang }: { binary: string; prefix: number; lang: Lang }) {
  const bits = binary.replaceAll(" ", "");
  const groups = [bits.slice(0, 8), bits.slice(8, 16), bits.slice(16, 24), bits.slice(24, 32)];
  const labels = getSubnetText(lang).labels;
  return (
    <div className="binary-bit-split" aria-label={binary}>
      <div className="binary-bit-line">
        {prefix === 0 && <><span className="binary-prefix-marker" aria-hidden="true" /><span className="binary-prefix-label">/{prefix}</span></>}
        {groups.map((group, groupIndex) => {
          const groupStart = groupIndex * 8;
          const groupEnd = groupStart + 8;
          const networkLength = Math.min(Math.max(prefix - groupStart, 0), 8);
          const networkBits = group.slice(0, networkLength);
          const hostBits = group.slice(networkLength);
          const dotAtPrefix = prefix === groupEnd && groupIndex < groups.length - 1;
          return (
            <span className="binary-octet-group" key={groupIndex}>
              <span className="binary-octet-text">
                {networkBits && <span className="binary-network-bits">{networkBits}</span>}
                {prefix > groupStart && prefix < groupEnd && <><span className="binary-prefix-marker" aria-hidden="true" /><span className="binary-prefix-label">/{prefix}</span></>}
                {hostBits && <span className="binary-host-bits">{hostBits}</span>}
                {prefix === groupEnd && !dotAtPrefix && <><span className="binary-prefix-marker" aria-hidden="true" /><span className="binary-prefix-label">/{prefix}</span></>}
              </span>
              {groupIndex < groups.length - 1 && (
                <span className={dotAtPrefix ? "binary-boundary binary-boundary-at-prefix" : "binary-boundary"} aria-hidden="true">
                  <span className="binary-dot" />
                  {dotAtPrefix && <><span className="binary-prefix-marker binary-prefix-marker-at-dot" /><span className="binary-prefix-label binary-prefix-label-at-dot">/{prefix}</span></>}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="binary-legend">
        <span><i className="binary-network-swatch" />{labels.networkBits(prefix)}</span>
        <span><i className="binary-host-swatch" />{labels.hostBits(32 - prefix)}</span>
      </div>
    </div>
  );
}

function Ipv4SubnetModule({ lang }: { lang: Lang }) {
  const [octets, setOctets] = useState(IPV4_DEFAULT_OCTETS);
  const [prefix, setPrefix] = useState("24");
  const octetRefs = useRef<Array<HTMLInputElement | null>>([]);
  const subnetText = getSubnetText(lang);
  const parsedIp = parseIpv4Octets(octets);
  const result = useMemo(() => {
    if (!parsedIp.ok) return parsedIp;
    return calculateIpv4Subnet({ ip: parsedIp.data.value, prefix });
  }, [parsedIp, prefix]);
  const data = result.ok ? result.data as ValueMap : {};
  const inputError = !parsedIp.ok ? resultText(parsedIp, lang) : undefined;
  const prefixError = parsedIp.ok && !result.ok ? resultText(result, lang) : undefined;
  const semanticNote = data.semantics === "point-to-point"
    ? subnetText.semantics.pointToPoint
    : data.semantics === "single-host"
      ? subnetText.semantics.singleHost
      : "";
  const rangeStatus = data.semantics === "point-to-point"
    ? subnetText.labels.pointToPointRange
    : data.semantics === "single-host"
      ? subnetText.labels.singleHostRange
      : "";
  const rangeMode = data.semantics === "standard" ? "standard" : String(data.semantics ?? "standard");
  const copyValue = result.ok
    ? [
      `${subnetText.labels.ipSection}`,
      `${subnetText.labels.dottedAddress}: ${data.input}`,
      `${subnetText.labels.class}: ${subnetText.classLabel(data.addressClass)}`,
      `${subnetText.labels.binaryAddress}: ${data.binaryAddress}`,
      "",
      `${subnetText.labels.subnetSection}`,
      `${subnetText.labels.networkCidr}: ${data.cidr}`,
      `${subnetText.labels.network}: ${data.network}`,
      `${subnetText.labels.total}: ${big(data.total)}`,
      `${subnetText.labels.usable}: ${big(data.usable)}`,
      `${subnetText.labels.mask}: ${data.mask}`,
      `${subnetText.labels.firstUsable}: ${data.firstUsable}`,
      `${subnetText.labels.lastUsable}: ${data.lastUsable}`,
      `${subnetText.labels.broadcast}: ${data.broadcast ?? subnetText.labels.notApplicable}`,
      semanticNote,
    ].filter(Boolean).join("\n")
    : "";
  const display = result.ok
    ? (
      <>
        <div className="dashboard-card-grid">
          <section className="dashboard-result-card" aria-labelledby="ipv4-result-ip-title">
            <CardTitle icon="document" id="ipv4-result-ip-title">{subnetText.labels.ipSection}</CardTitle>
            <MetricRow label={subnetText.labels.dottedAddress} value={String(data.input)} copyValue={String(data.input)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.class} value={subnetText.classLabel(data.addressClass)} copyValue={subnetText.classLabel(data.addressClass)} lang={lang} />
            <MetricRow label={subnetText.labels.binaryAddress} value={String(data.binaryAddress)} copyValue={String(data.binaryAddress)} lang={lang} tone="code" />
          </section>
          <section className="dashboard-result-card" aria-labelledby="ipv4-result-subnet-title">
            <CardTitle icon="network" id="ipv4-result-subnet-title">{subnetText.labels.subnetSection}</CardTitle>
            <MetricRow label={subnetText.labels.networkCidr} value={String(data.cidr)} copyValue={String(data.cidr)} lang={lang} tone="primary" />
            <MetricRow label={subnetText.labels.network} value={String(data.network)} copyValue={String(data.network)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.mask} value={String(data.mask)} copyValue={String(data.mask)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.broadcast} value={data.broadcast ? String(data.broadcast) : subnetText.labels.notApplicable} copyValue={data.broadcast ? String(data.broadcast) : subnetText.labels.notApplicable} lang={lang} tone={data.broadcast ? "mono" : "default"} />
          </section>
          <section className="dashboard-result-card" aria-labelledby="ipv4-result-range-title">
            <CardTitle icon="ruler" id="ipv4-result-range-title">{subnetText.labels.usableRange}</CardTitle>
            <div className={rangeMode === "standard" ? "usable-range-bar" : "usable-range-status"} aria-hidden={rangeMode === "standard" ? true : undefined}>
              {rangeMode !== "standard" && <span>{rangeStatus}</span>}
            </div>
            {rangeMode === "standard" && <div className="usable-range-endpoints"><span>{String(data.firstUsable)}</span><span>{String(data.lastUsable)}</span></div>}
            <MetricRow label={subnetText.labels.firstUsable} value={String(data.firstUsable)} copyValue={String(data.firstUsable)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.lastUsable} value={String(data.lastUsable)} copyValue={String(data.lastUsable)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.total} value={big(data.total)} copyValue={big(data.total)} lang={lang} tone="mono" />
            <MetricRow label={subnetText.labels.usable} value={big(data.usable)} copyValue={big(data.usable)} lang={lang} tone="mono" />
          </section>
        </div>
        <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-binary-breakdown-title">
          <div className="dashboard-card-head">
            <CardTitle icon="binary" id="ipv4-binary-breakdown-title">{subnetText.labels.binaryBreakdown}</CardTitle>
            <CopyAction value={String(data.binaryAddress)} label={subnetText.labels.copyBinary} lang={lang} />
          </div>
          <BinaryBitSplit binary={String(data.binaryAddress)} prefix={Number(data.prefix)} lang={lang} />
        </section>
        {semanticNote && <InfoNote>{semanticNote}</InfoNote>}
      </>
    )
    : errorText(lang, result.reason);
  const reset = () => {
    setOctets(IPV4_DEFAULT_OCTETS);
    setPrefix("24");
  };
  const updateOctet = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setOctets(values => values.map((value, itemIndex) => itemIndex === index ? nextValue : value));
    const inputType = "inputType" in event.nativeEvent ? String((event.nativeEvent as InputEvent).inputType) : "";
    if (shouldAutoAdvanceIpv4Octet({ value: nextValue, inputType, index })) {
      window.requestAnimationFrame(() => octetRefs.current[index + 1]?.focus());
    }
  };
  return (
    <ModuleCard id="subnet" icon="calculator" layout="dashboard" title={local(lang, "IPv4 subnet calculator", "IPv4 子网计算器", "IPv4 子網計算器")}>
      <section className="tool-dashboard-input ipv4-subnet-panel" aria-label={local(lang, "Subnet inputs and results", "子网输入和结果", "子網輸入和結果")}>
        <label className="dashboard-input-label">{subnetText.labels.ipAddress} / {subnetText.labels.prefix}</label>
        <div className="inline-ip-prefix-input">
          <span className="ipv4-octet-inputs">
            {octets.map((value, index) => (
              <span className="octet-field" key={index}>
                <input
                  ref={element => { octetRefs.current[index] = element; }}
                  value={value}
                  inputMode="numeric"
                  maxLength={3}
                  aria-label={subnetText.octetLabel(index)}
                  aria-invalid={inputError ? true : undefined}
                  aria-describedby={inputError ? "ipv4-octets-error" : undefined}
                  onChange={event => updateOctet(index, event)}
                />
                {index < octets.length - 1 && <span className="ip-separator" aria-hidden="true">.</span>}
              </span>
            ))}
          </span>
          <span className="ipv4-prefix-group">
            <span className="ip-prefix-separator" aria-hidden="true">/</span>
            <input id="ipv4-prefix-length" className="ipv4-prefix-input" inputMode="numeric" value={prefix} aria-label={subnetText.labels.prefix} aria-invalid={prefixError ? true : undefined} aria-describedby={prefixError ? "ipv4-prefix-error" : undefined} onChange={event => setPrefix(event.target.value)} />
          </span>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
        {inputError && <span className="field-error" id="ipv4-octets-error">{inputError}</span>}
        {prefixError && <span className="field-error" id="ipv4-prefix-error">{prefixError}</span>}
        <p className="helper-note">{subnetText.help}</p>
      </section>
      <section className="dashboard-result-area" aria-label={subnetText.labels.result}>
        <div className="dashboard-result-heading">
          <CopyAction value={copyValue} label={subnetText.labels.copyAll} lang={lang} />
        </div>
        <div className={result.ok ? "ipv4-subnet-results" : "dashboard-result-card dashboard-card-wide"}>
          {display}
        </div>
      </section>
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

type NetworkApiPayload = { ip: string } | { mode: "current" };

function networkErrorMessage(lang: Lang, code?: string, fallback?: string) {
  if (code === "RATE_LIMITED") return local(lang, "Upstream services are temporarily limited. Please wait and try again.", "上游服务暂时限流，请稍后重试。", "上游服務暫時限流，請稍後重試。");
  if (code === "UPSTREAM_TIMEOUT") return local(lang, "The upstream service timed out. Please try again.", "上游服务超时，请重试。", "上游服務逾時，請重試。");
  if (code === "UPSTREAM_UNAVAILABLE" || code === "ALL_PROVIDERS_FAILED") return local(lang, "The upstream service is temporarily unavailable. Please try again later.", "上游服务暂时不可用，请稍后重试。", "上游服務暫時無法使用，請稍後重試。");
  if (code === "UPSTREAM_INVALID_RESPONSE") return local(lang, "The upstream service returned a response this tool could not read.", "上游服务返回了本工具无法读取的响应。", "上游服務傳回了本工具無法讀取的回應。");
  if (code === "CONFIGURATION_ERROR") return local(lang, "The lookup service is not configured correctly.", "查询服务配置不完整。", "查詢服務設定不完整。");
  return fallback ?? local(lang, "The network request failed.", "网络请求失败。", "網絡要求失敗。");
}

async function queryNetworkApi(path: string, payload: NetworkApiPayload) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await response.json();
  if (!body?.ok) {
    const error = new Error(body?.error?.code || "UPSTREAM_UNAVAILABLE") as Error & { code?: string };
    error.code = body?.error?.code || "UPSTREAM_UNAVAILABLE";
    throw error;
  }
  return body;
}

function apiErrorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error && typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code
    : undefined;
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
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.lookup, { ip: localCheck.data.ip }) });
    } catch (error) {
      setState({ error: networkErrorMessage(lang, apiErrorCode(error), local(lang, "The lookup request failed.", "查询请求失败。", "查詢要求失敗。")) });
    }
  };
  const submitCurrent = async () => {
    setState({ loading: true });
    try {
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.lookup, { mode: "current" }) });
    } catch (error) {
      setState({ error: networkErrorMessage(lang, apiErrorCode(error), local(lang, "The current IP lookup request failed.", "当前 IP 查询请求失败。", "目前 IP 查詢要求失敗。")) });
    }
  };
  const display = state.loading ? local(lang, "Loading…", "查询中…", "查詢中…") : state.error || (state.result ? <pre>{JSON.stringify(state.result, null, 2)}</pre> : local(lang, "Run a lookup to see estimated public network data.", "点击查询后显示公网网络估算数据。", "點擊查詢後顯示公網網絡估算資料。"));
  return (
    <ModuleCard id="ip-lookup" title="IP lookup">
      <form className="network-query-form" onSubmit={event => { event.preventDefault(); void submit(); }}>
        <Field id="ip-lookup-input" label="IP address" help="Only one public IPv4 or IPv6 address is accepted. The query is sent only after submit." lang={lang} error={state.error}><input value={input} onChange={event => { setInput(event.target.value); setState({}); }} /></Field>
        <p className="helper-note">{local(lang, "IP geolocation is an estimate and may describe an ISP node or registry location, not a person or exact street address.", "IP 地理位置是数据库估算，可能代表运营商节点或注册位置，不能确定个人或精确地址。", "IP 地理位置是資料庫估算，可能代表營運商節點或註冊位置，不能確定個人或精確地址。")}</p>
        <button type="submit" aria-busy={state.loading}>{local(lang, "Query", "查询", "查詢")}</button>
        <button type="button" className="secondary-button" aria-busy={state.loading} onClick={() => { void submitCurrent(); }}>{local(lang, "Use my current IP", "使用当前 IP", "使用目前 IP")}</button>
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
      setState({ result: await queryNetworkApi(NETWORK_API_PATHS.rdap, { ip: localCheck.data.ip }) });
    } catch (error) {
      setState({ error: networkErrorMessage(lang, apiErrorCode(error), local(lang, "The RDAP request failed.", "RDAP 请求失败。", "RDAP 要求失敗。")) });
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
