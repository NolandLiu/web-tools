import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
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

function getIpv4ToolboxText(lang: Lang) {
  const subnetText = getSubnetText(lang);
  const labels = {
    ...subnetText.labels,
    maskInput: local(lang, "Subnet mask", "子网掩码", "子網遮罩"),
    hostInput: local(lang, "Required hosts", "所需主机数", "所需主機數"),
    cidrInput: local(lang, "CIDR block", "CIDR 网段", "CIDR 網段"),
    startIp: local(lang, "Start IP", "起始 IP", "起始 IP"),
    endIp: local(lang, "End IP", "结束 IP", "結束 IP"),
    inputFormat: local(lang, "Input format", "输入格式", "輸入格式"),
    ipv4Value: local(lang, "IPv4 value", "IPv4 值", "IPv4 值"),
    ipA: local(lang, "IPv4 A", "IPv4 A", "IPv4 A"),
    ipB: local(lang, "IPv4 B", "IPv4 B", "IPv4 B"),
    recommendedPrefix: local(lang, "Recommended prefix", "推荐掩码位", "建議遮罩位"),
    totalAddresses: local(lang, "Total addresses", "总地址数", "總位址數"),
    usableHosts: local(lang, "Usable hosts", "可用主机数", "可用主機數"),
    startAddress: local(lang, "Start address", "起始地址", "起始位址"),
    endAddress: local(lang, "End address", "结束地址", "結束位址"),
    cidrBlocks: local(lang, "CIDR blocks", "CIDR 网段列表", "CIDR 網段列表"),
    dotted: local(lang, "Dotted decimal", "点分十进制", "點分十進位"),
    decimal: local(lang, "Unsigned integer", "无符号整数", "無符號整數"),
    groupedBinary: local(lang, "Grouped binary", "分组二进制", "分組二進位"),
    hex: local(lang, "Hex", "十六进制", "十六進位"),
    sameSubnet: local(lang, "Same subnet", "是否同子网", "是否同子網"),
    yes: local(lang, "Yes", "是", "是"),
    no: local(lang, "No", "否", "否"),
    sourceFormatDotted: local(lang, "Dotted decimal", "点分十进制", "點分十進位"),
    sourceFormatDecimal: local(lang, "Unsigned integer", "无符号整数", "無符號整數"),
    sourceFormatBinary: local(lang, "32-bit binary", "32 位二进制", "32 位二進位"),
    sourceFormatHex: local(lang, "8-digit hex", "8 位十六进制", "8 位十六進位"),
  };
  return {
    ...subnetText,
    labels,
    help: {
      maskInput: local(lang, "Example: 255.255.255.0.", "示例：255.255.255.0。", "範例：255.255.255.0。"),
      hostInput: local(lang, "Regular LAN planning subtracts network and broadcast except /31 and /32 semantics.", "普通局域网规划会扣除网络地址和广播地址，/31 与 /32 语义除外。", "一般區域網絡規劃會扣除網絡位址和廣播位址，/31 與 /32 語義除外。"),
      cidrInput: local(lang, "Example: 192.168.1.0/24.", "示例：192.168.1.0/24。", "範例：192.168.1.0/24。"),
      startIp: local(lang, "First IPv4 address in the range.", "范围内第一个 IPv4 地址。", "範圍內第一個 IPv4 位址。"),
      endIp: local(lang, "Last IPv4 address in the range.", "范围内最后一个 IPv4 地址。", "範圍內最後一個 IPv4 位址。"),
      inputFormat: local(lang, "Choose the format used by the input.", "选择输入内容使用的格式。", "選擇輸入內容使用的格式。"),
      ipv4Value: local(lang, "Classification uses local IANA special-purpose rules reviewed on 2026-07-30.", "分类使用本地 IANA 特殊用途规则，审查日期为 2026-07-30。", "分類使用本機 IANA 特殊用途規則，審查日期為 2026-07-30。"),
      ipA: local(lang, "First IPv4 address.", "第一个 IPv4 地址。", "第一個 IPv4 位址。"),
      ipB: local(lang, "Second IPv4 address.", "第二个 IPv4 地址。", "第二個 IPv4 位址。"),
      prefix: local(lang, "CIDR prefix from 0 to 32.", "CIDR 掩码位，范围 0 到 32。", "CIDR 遮罩位，範圍 0 到 32。"),
    },
  };
}

function CopyAction({ value, label, lang, compact, iconOnly }: { value: string; label: string; lang: Lang; compact?: boolean; iconOnly?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const t = messages[lang];
  const className = compact ? "metric-copy" : `dashboard-copy-button${iconOnly ? " dashboard-copy-button-icon" : ""}`;

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
    <button type="button" className={className} aria-label={label} title={label} disabled={!value} onClick={() => void copy()}>
      <Icon name={status === "copied" ? "check" : "copy"} size={compact ? 15 : 16} />
      {!compact && !iconOnly && <span>{status === "copied" ? t.copied : label}</span>}
      <span className="sr-only" aria-live="polite">{status === "failed" ? t.copyFailed : status === "copied" ? t.copied : ""}</span>
    </button>
  );
}

function MetricRow({ label, value, copyValue, lang, tone = "default" }: { label: string; value: React.ReactNode; copyValue: string; lang: Lang; tone?: "default" | "mono" | "code" | "primary" | "success" | "danger" }) {
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

function MetricList({ children }: { children: React.ReactNode }) {
  return <div className="metric-list">{children}</div>;
}

function DashboardInputPanel({ label, help, children, showLabel = true, headerContent }: { label: string; help: string; children: React.ReactNode; showLabel?: boolean; headerContent?: React.ReactNode }) {
  const hasHeader = showLabel || headerContent;
  return (
    <section className="tool-dashboard-input" aria-label={label}>
      {hasHeader && <div className="dashboard-input-panel-header">
        {showLabel ? <span className="dashboard-input-label">{label}</span> : <span className="sr-only">{label}</span>}
        {headerContent}
      </div>}
      {children}
      <p className="helper-note">{help}</p>
    </section>
  );
}

function DashboardInputField({ id, label, help, error, hideLabel = false, children }: { id: string; label: string; help?: string; error?: string; hideLabel?: boolean; children: ReactElement<Record<string, unknown>> }) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="dashboard-input-field">
      <label htmlFor={id} className={hideLabel ? "sr-only" : undefined}>{label}</label>
      {cloneElement(children, { id, "aria-describedby": [helpId, errorId].filter(Boolean).join(" ") || undefined, "aria-invalid": error ? true : undefined })}
      {help && <span className="helper-note" id={helpId}>{help}</span>}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}

function DashboardResultPanel({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const labels = getIpv4ToolboxText(lang).labels;
  return (
    <section className="dashboard-result-area" aria-label={labels.result}>
      <div className="dashboard-result-single">
        {children}
      </div>
    </section>
  );
}

function copyLines(rowsToCopy: Array<[string, unknown]>) {
  return rowsToCopy.map(([label, value]) => `${label}: ${big(value)}`).join("\n");
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
            <CopyAction value={String(data.binaryAddress)} label={subnetText.labels.copyBinary} lang={lang} iconOnly />
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
  const ipv4Text = getIpv4ToolboxText(lang);
  const result = parseSubnetMask(mask);
  const data = result.ok ? result.data as { prefix: number; mask: bigint } : undefined;
  const subnet = data ? calculateIpv4Subnet({ ip: "0.0.0.0", prefix: data.prefix }) : undefined;
  const maskDetails = subnet?.ok ? subnet.data as ValueMap : {};
  const copyValue = result.ok ? copyLines([
    [ipv4Text.labels.recommendedPrefix, `/${data?.prefix}`],
    [ipv4Text.labels.mask, maskDetails.mask],
    [local(lang, "Wildcard", "反掩码", "反遮罩"), maskDetails.wildcard],
    [local(lang, "Mask binary", "掩码二进制", "遮罩二進位"), maskDetails.maskBinary],
  ]) : "";
  return (
    <ModuleCard id="mask-converter" icon="network" layout="dashboard" title={local(lang, "Mask / CIDR converter", "掩码 / CIDR 转换", "遮罩 / CIDR 轉換")}>
      <DashboardInputPanel label={ipv4Text.labels.maskInput} help={ipv4Text.help.maskInput}>
        <div className="dashboard-input-actions">
          <div className="dashboard-form-grid">
            <DashboardInputField id="mask-input" label={ipv4Text.labels.maskInput} error={!result.ok ? resultText(result, lang) : undefined} hideLabel>
              <input value={mask} onChange={event => setMask(event.target.value)} />
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={() => setMask("255.255.255.0")}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {result.ok
          ? <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-mask-result-title">
            <div className="dashboard-card-head">
              <CardTitle icon="network" id="ipv4-mask-result-title">{local(lang, "Converted mask", "转换结果", "轉換結果")}</CardTitle>
              <CopyAction value={copyValue} label={ipv4Text.labels.copyAll} lang={lang} />
            </div>
            <MetricList>
              <MetricRow label={ipv4Text.labels.recommendedPrefix} value={`/${data?.prefix}`} copyValue={`/${data?.prefix}`} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.mask} value={String(maskDetails.mask)} copyValue={String(maskDetails.mask)} lang={lang} tone="mono" />
              <MetricRow label={local(lang, "Wildcard", "反掩码", "反遮罩")} value={String(maskDetails.wildcard)} copyValue={String(maskDetails.wildcard)} lang={lang} tone="mono" />
              <MetricRow label={local(lang, "Mask binary", "掩码二进制", "遮罩二進位")} value={String(maskDetails.maskBinary)} copyValue={String(maskDetails.maskBinary)} lang={lang} tone="code" />
            </MetricList>
          </section>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, result.reason)}</InfoNote></section>}
      </DashboardResultPanel>
    </ModuleCard>
  );
}

function HostRecommendationModule({ lang }: { lang: Lang }) {
  const [hosts, setHosts] = useState("254");
  const ipv4Text = getIpv4ToolboxText(lang);
  const result = requiredHostsToPrefix(hosts);
  const data = result.ok ? result.data as ValueMap : {};
  const subnet = result.ok ? calculateIpv4Subnet({ ip: "0.0.0.0", prefix: Number(data.prefix) }) : undefined;
  const maskDetails = subnet?.ok ? subnet.data as ValueMap : {};
  const copyValue = result.ok ? copyLines([
    [ipv4Text.labels.recommendedPrefix, `/${data.prefix}`],
    [ipv4Text.labels.mask, maskDetails.mask],
    [ipv4Text.labels.totalAddresses, data.total],
    [ipv4Text.labels.usableHosts, data.usable],
  ]) : "";
  return (
    <ModuleCard id="host-recommendation" icon="calculator" layout="dashboard" title={local(lang, "Host recommendation", "主机容量推荐", "主機容量建議")}>
      <DashboardInputPanel label={ipv4Text.labels.hostInput} help={ipv4Text.help.hostInput}>
        <div className="dashboard-input-actions">
          <div className="dashboard-form-grid">
            <DashboardInputField id="ipv4-hosts" label={ipv4Text.labels.hostInput} error={!result.ok ? resultText(result, lang) : undefined} hideLabel>
              <input inputMode="numeric" value={hosts} onChange={event => setHosts(event.target.value)} />
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={() => setHosts("254")}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {result.ok
          ? <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-host-result-title">
            <div className="dashboard-card-head">
              <CardTitle icon="calculator" id="ipv4-host-result-title">{local(lang, "Recommended subnet", "推荐子网", "建議子網")}</CardTitle>
              <CopyAction value={copyValue} label={ipv4Text.labels.copyAll} lang={lang} />
            </div>
            <MetricList>
              <MetricRow label={ipv4Text.labels.recommendedPrefix} value={`/${data.prefix}`} copyValue={`/${data.prefix}`} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.mask} value={String(maskDetails.mask)} copyValue={String(maskDetails.mask)} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.totalAddresses} value={big(data.total)} copyValue={big(data.total)} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.usableHosts} value={big(data.usable)} copyValue={big(data.usable)} lang={lang} tone="mono" />
            </MetricList>
          </section>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, result.reason)}</InfoNote></section>}
      </DashboardResultPanel>
    </ModuleCard>
  );
}

function RangeCidrModule({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<"cidr" | "range">("cidr");
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const [start, setStart] = useState("192.168.1.1");
  const [end, setEnd] = useState("192.168.1.6");
  const ipv4Text = getIpv4ToolboxText(lang);
  const result = mode === "cidr" ? cidrToIpv4Range(cidr) : ipv4RangeToCidrs(start, end);
  const data = result.ok ? result.data as ValueMap : {};
  const cidrList = result.ok && mode === "range" ? data.cidrs as string[] : [];
  const copyValue = result.ok
    ? mode === "cidr"
      ? copyLines([
        [ipv4Text.labels.cidrInput, data.cidr],
        [ipv4Text.labels.startAddress, data.start],
        [ipv4Text.labels.endAddress, data.end],
        [ipv4Text.labels.totalAddresses, data.total],
      ])
      : copyLines([[ipv4Text.labels.cidrBlocks, cidrList.join("\n")]])
    : "";
  const reset = () => {
    setCidr("192.168.1.0/24");
    setStart("192.168.1.1");
    setEnd("192.168.1.6");
  };
  const modeLabel = local(lang, "Range / CIDR mode", "范围 / CIDR 模式", "範圍 / CIDR 模式");
  return (
    <ModuleCard id="range-cidr" icon="ruler" layout="dashboard" title={local(lang, "Range and CIDR", "范围与 CIDR", "範圍與 CIDR")}>
      <DashboardInputPanel label={modeLabel} showLabel={false} headerContent={<div className="segmented dashboard-mode-tabs"><button type="button" aria-pressed={mode === "cidr"} className={mode === "cidr" ? "active" : ""} onClick={() => setMode("cidr")}>CIDR → range</button><button type="button" aria-pressed={mode === "range"} className={mode === "range" ? "active" : ""} onClick={() => setMode("range")}>Range → CIDR</button></div>} help={mode === "cidr" ? ipv4Text.help.cidrInput : `${ipv4Text.help.startIp} ${ipv4Text.help.endIp}`}>
        <div className="dashboard-input-actions dashboard-input-actions-inline">
          <div className="dashboard-form-grid dashboard-form-grid-range-cidr">
            {mode === "cidr"
              ? <DashboardInputField id="range-cidr" label={ipv4Text.labels.cidrInput} error={!result.ok ? resultText(result, lang) : undefined}>
                <input className="ipv4-cidr-input" value={cidr} onChange={event => setCidr(event.target.value)} />
              </DashboardInputField>
              : <>
                <DashboardInputField id="range-start" label={ipv4Text.labels.startIp}>
                  <input className="ipv4-address-input" value={start} onChange={event => setStart(event.target.value)} />
                </DashboardInputField>
                <DashboardInputField id="range-end" label={ipv4Text.labels.endIp} error={!result.ok ? resultText(result, lang) : undefined}>
                  <input className="ipv4-address-input" value={end} onChange={event => setEnd(event.target.value)} />
                </DashboardInputField>
              </>}
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {result.ok
          ? <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-range-result-title">
            <div className="dashboard-card-head">
              <CardTitle icon="ruler" id="ipv4-range-result-title">{mode === "cidr" ? local(lang, "CIDR range", "CIDR 范围", "CIDR 範圍") : ipv4Text.labels.cidrBlocks}</CardTitle>
              <CopyAction value={copyValue} label={ipv4Text.labels.copyAll} lang={lang} />
            </div>
            <MetricList>
              {mode === "cidr"
                ? <>
                  <MetricRow label={ipv4Text.labels.cidrInput} value={String(data.cidr)} copyValue={String(data.cidr)} lang={lang} tone="mono" />
                  <MetricRow label={ipv4Text.labels.startAddress} value={String(data.start)} copyValue={String(data.start)} lang={lang} tone="mono" />
                  <MetricRow label={ipv4Text.labels.endAddress} value={String(data.end)} copyValue={String(data.end)} lang={lang} tone="mono" />
                  <MetricRow label={ipv4Text.labels.totalAddresses} value={big(data.total)} copyValue={big(data.total)} lang={lang} tone="mono" />
                </>
                : <MetricRow label={ipv4Text.labels.cidrBlocks} value={<span className="cidr-list cidr-list-compact">{cidrList.map(item => <code key={item}>{item}</code>)}</span>} copyValue={cidrList.join("\n")} lang={lang} tone="code" />}
            </MetricList>
          </section>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, result.reason)}</InfoNote></section>}
      </DashboardResultPanel>
    </ModuleCard>
  );
}

function Ipv4ConverterModule({ lang }: { lang: Lang }) {
  const [source, setSource] = useState<"dotted" | "decimal" | "binary" | "hex">("dotted");
  const [input, setInput] = useState("192.168.1.1");
  const ipv4Text = getIpv4ToolboxText(lang);
  const result = convertIpv4(input, source);
  const data = result.ok ? result.data as ValueMap : {};
  const classification = data.classification as { label?: string } | undefined;
  const copyValue = result.ok ? copyLines([
    [ipv4Text.labels.dotted, data.dotted],
    [ipv4Text.labels.decimal, data.decimal],
    [ipv4Text.labels.groupedBinary, data.groupedBinary],
    [ipv4Text.labels.hex, data.hex],
    [ipv4Text.labels.class, ipv4Text.classLabel(classification?.label)],
  ]) : "";
  const reset = () => {
    setSource("dotted");
    setInput("192.168.1.1");
  };
  return (
    <ModuleCard id="ipv4-converter" icon="hash" layout="dashboard" title={local(lang, "IPv4 conversion and classification", "IPv4 转换与分类", "IPv4 轉換與分類")}>
      <DashboardInputPanel label={ipv4Text.labels.ipv4Value} help={ipv4Text.help.ipv4Value}>
        <div className="dashboard-input-actions dashboard-input-actions-inline">
          <div className="dashboard-form-grid dashboard-form-grid-ipv4-converter">
            <DashboardInputField id="ipv4-source" label={ipv4Text.labels.inputFormat}>
              <select className="ipv4-format-select" value={source} onChange={event => setSource(event.target.value as typeof source)}><option value="dotted">{ipv4Text.labels.sourceFormatDotted}</option><option value="decimal">{ipv4Text.labels.sourceFormatDecimal}</option><option value="binary">{ipv4Text.labels.sourceFormatBinary}</option><option value="hex">{ipv4Text.labels.sourceFormatHex}</option></select>
            </DashboardInputField>
            <DashboardInputField id="ipv4-convert-input" label={ipv4Text.labels.ipv4Value} error={!result.ok ? resultText(result, lang) : undefined}>
              <input className="ipv4-address-input" value={input} onChange={event => setInput(event.target.value)} />
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {result.ok
          ? <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-convert-result-title">
            <div className="dashboard-card-head">
              <CardTitle icon="hash" id="ipv4-convert-result-title">{local(lang, "Converted address", "转换结果", "轉換結果")}</CardTitle>
              <CopyAction value={copyValue} label={ipv4Text.labels.copyAll} lang={lang} />
            </div>
            <MetricList>
              <MetricRow label={ipv4Text.labels.dotted} value={String(data.dotted)} copyValue={String(data.dotted)} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.decimal} value={String(data.decimal)} copyValue={String(data.decimal)} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.groupedBinary} value={String(data.groupedBinary)} copyValue={String(data.groupedBinary)} lang={lang} tone="code" />
              <MetricRow label={ipv4Text.labels.hex} value={String(data.hex)} copyValue={String(data.hex)} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.class} value={ipv4Text.classLabel(classification?.label)} copyValue={ipv4Text.classLabel(classification?.label)} lang={lang} />
            </MetricList>
          </section>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, result.reason)}</InfoNote></section>}
      </DashboardResultPanel>
    </ModuleCard>
  );
}

function SameSubnetModule({ lang }: { lang: Lang }) {
  const [ipA, setIpA] = useState("192.168.1.10");
  const [ipB, setIpB] = useState("192.168.1.200");
  const [samePrefix, setSamePrefix] = useState("24");
  const ipv4Text = getIpv4ToolboxText(lang);
  const result = sameIpv4Subnet(ipA, ipB, samePrefix);
  const aSubnet = result.ok ? calculateIpv4Subnet({ ip: ipA, prefix: samePrefix }) : undefined;
  const bSubnet = result.ok ? calculateIpv4Subnet({ ip: ipB, prefix: samePrefix }) : undefined;
  const aData = aSubnet?.ok ? aSubnet.data as ValueMap : {};
  const bData = bSubnet?.ok ? bSubnet.data as ValueMap : {};
  const sameText = result.ok && result.data.same ? ipv4Text.labels.yes : ipv4Text.labels.no;
  const copyValue = result.ok ? copyLines([
    [ipv4Text.labels.sameSubnet, sameText],
    [ipv4Text.labels.ipA, ipA],
    [ipv4Text.labels.ipB, ipB],
    [ipv4Text.labels.prefix, `/${samePrefix}`],
    [local(lang, "Network A", "网络 A", "網絡 A"), aData.network],
    [local(lang, "Network B", "网络 B", "網絡 B"), bData.network],
  ]) : "";
  const reset = () => {
    setIpA("192.168.1.10");
    setIpB("192.168.1.200");
    setSamePrefix("24");
  };
  return (
    <ModuleCard id="same-subnet" icon="network" layout="dashboard" title={local(lang, "Same subnet", "同子网判断", "同子網判斷")}>
      <DashboardInputPanel label={ipv4Text.labels.sameSubnet} help={ipv4Text.help.prefix}>
        <div className="dashboard-input-actions dashboard-input-actions-inline">
          <div className="dashboard-form-grid dashboard-form-grid-same-subnet">
            <DashboardInputField id="ipv4-a" label={ipv4Text.labels.ipA}>
              <input className="ipv4-address-input" value={ipA} onChange={event => setIpA(event.target.value)} />
            </DashboardInputField>
            <DashboardInputField id="ipv4-b" label={ipv4Text.labels.ipB}>
              <input className="ipv4-address-input" value={ipB} onChange={event => setIpB(event.target.value)} />
            </DashboardInputField>
            <DashboardInputField id="ipv4-prefix" label={ipv4Text.labels.prefix} error={!result.ok ? resultText(result, lang) : undefined}>
              <select value={samePrefix} onChange={event => setSamePrefix(event.target.value)}>
                {Array.from({ length: 33 }, (_, prefixValue) => <option key={prefixValue} value={String(prefixValue)}>/{prefixValue}</option>)}
              </select>
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {result.ok
          ? <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv4-same-result-title">
            <div className="dashboard-card-head">
              <CardTitle icon="network" id="ipv4-same-result-title">{ipv4Text.labels.sameSubnet}</CardTitle>
              <CopyAction value={copyValue} label={ipv4Text.labels.copyAll} lang={lang} />
            </div>
            <MetricList>
              <MetricRow label={ipv4Text.labels.sameSubnet} value={sameText} copyValue={sameText} lang={lang} tone={result.data.same ? "success" : "danger"} />
              <MetricRow label={ipv4Text.labels.ipA} value={ipA} copyValue={ipA} lang={lang} tone="mono" />
              <MetricRow label={ipv4Text.labels.ipB} value={ipB} copyValue={ipB} lang={lang} tone="mono" />
              <MetricRow label={local(lang, "Network A", "网络 A", "網絡 A")} value={String(aData.network)} copyValue={String(aData.network)} lang={lang} tone="mono" />
              <MetricRow label={local(lang, "Network B", "网络 B", "網絡 B")} value={String(bData.network)} copyValue={String(bData.network)} lang={lang} tone="mono" />
            </MetricList>
          </section>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, result.reason)}</InfoNote></section>}
      </DashboardResultPanel>
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
      <div className="network-module-grid network-module-pair">
        <MaskConverterModule lang={lang} />
        <HostRecommendationModule lang={lang} />
      </div>
      <div className="network-module-stack">
        <RangeCidrModule lang={lang} />
        <Ipv4ConverterModule lang={lang} />
        <SameSubnetModule lang={lang} />
      </div>
    </div>
  );
}

function getIpv6ToolboxText(lang: Lang) {
  const labels = {
    address: local(lang, "IPv6 address", "IPv6 地址", "IPv6 位址"),
    prefix: local(lang, "Prefix length", "前缀长度", "前綴長度"),
    copyAll: local(lang, "Copy all", "复制全部", "複製全部"),
    copyItem: (label: string) => local(lang, `Copy ${label}`, `复制${label}`, `複製${label}`),
    normalizedAddress: local(lang, "Normalized address", "规范化地址", "規範化位址"),
    rfc5952: local(lang, "RFC 5952", "RFC 5952", "RFC 5952"),
    expanded: local(lang, "Expanded", "展开形式", "展開形式"),
    type: local(lang, "Type", "类型", "類型"),
    hextets: local(lang, "Hextets", "十六位分组", "十六位分組"),
    prefixSummary: local(lang, "Prefix summary", "前缀摘要", "前綴摘要"),
    prefixCidr: local(lang, "Prefix / CIDR", "前缀 / CIDR", "前綴 / CIDR"),
    addressCount: local(lang, "Address count", "地址数量", "位址數量"),
    addressRange: local(lang, "Address range", "地址范围", "位址範圍"),
    startAddress: local(lang, "Start address", "起始地址", "起始位址"),
    endAddress: local(lang, "End address", "结束地址", "結束位址"),
    bitBreakdown: local(lang, "Bit breakdown", "位拆解", "位元拆解"),
    networkBits: (count: number) => local(lang, `Network bits (${count})`, `网络位（${count}）`, `網絡位（${count}）`),
    hostBits: (count: number) => local(lang, `Host bits (${count})`, `主机位（${count}）`, `主機位（${count}）`),
  };
  const classLabels: Record<string, string> = {
    Invalid: local(lang, "Invalid", "无效地址", "無效位址"),
    Unspecified: local(lang, "Unspecified", "未指定地址", "未指定位址"),
    Loopback: local(lang, "Loopback", "环回地址", "迴路位址"),
    "IPv4-mapped IPv6": local(lang, "IPv4-mapped IPv6", "IPv4 映射 IPv6", "IPv4 映射 IPv6"),
    "Unique local": local(lang, "Unique local", "唯一本地地址", "唯一本機位址"),
    "Link-local": local(lang, "Link-local", "链路本地地址", "鏈路本機位址"),
    Multicast: local(lang, "Multicast", "组播地址", "群播位址"),
    Documentation: local(lang, "Documentation", "文档示例地址", "文件範例位址"),
    "Global Unicast": local(lang, "Global Unicast", "全球单播地址", "全球單播位址"),
    "Reserved or special": local(lang, "Reserved or special", "保留或特殊地址", "保留或特殊位址"),
  };
  return {
    labels,
    help: {
      normalize: local(lang, "Zone IDs such as %en0 are not supported. No DNS or network lookup runs here.", "不支持 %en0 这类 zone ID；本模块不会执行 DNS 或网络查询。", "不支援 %en0 這類 zone ID；本模組不會執行 DNS 或網絡查詢。"),
      prefix: local(lang, "The prefix range is calculated locally with 128-bit integer arithmetic.", "前缀范围使用本地 128 位整数计算。", "前綴範圍使用本機 128 位元整數計算。"),
    },
    classLabel: (label: unknown) => classLabels[String(label)] ?? String(label ?? "—"),
  };
}

function ipv6CopyRows(rowsToCopy: Array<[string, unknown]>) {
  return copyLines(rowsToCopy);
}

function Ipv6HextetStrip({ words, prefix, lang }: { words: string[]; prefix?: number; lang: Lang }) {
  const labels = getIpv6ToolboxText(lang).labels;
  const copyValue = words.join(":");
  return (
    <div className="ipv6-hextet-strip" aria-label={`${labels.hextets}: ${copyValue}`}>
      {words.map((word, index) => {
        const start = index * 16;
        const end = start + 16;
        const tone = prefix === undefined
          ? "neutral"
          : prefix >= end
            ? "network"
            : prefix <= start
              ? "host"
              : "split";
        const boundaryHere = prefix !== undefined && prefix === end && index < words.length - 1;
        return (
          <span className="ipv6-hextet-unit" key={`${word}-${index}`}>
            <span className={`ipv6-hextet ipv6-hextet-${tone}`}>{word}</span>
            {index < words.length - 1 && <span className="ipv6-hextet-separator" aria-hidden="true">
              {boundaryHere && <span className="ipv6-prefix-boundary" aria-hidden="true" />}
              <span className="ipv6-hextet-dot" />
            </span>}
          </span>
        );
      })}
    </div>
  );
}

function Ipv6BitBreakdown({ words, prefix, lang }: { words: string[]; prefix: number; lang: Lang }) {
  const labels = getIpv6ToolboxText(lang).labels;
  return (
    <div className="ipv6-bit-breakdown">
      <Ipv6HextetStrip words={words} prefix={prefix} lang={lang} />
      <div className="binary-legend">
        <span><i className="binary-network-swatch" />{labels.networkBits(prefix)}</span>
        <span><i className="binary-host-swatch" />{labels.hostBits(128 - prefix)}</span>
      </div>
    </div>
  );
}

function Ipv6NormalizeModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("2001:db8::1");
  const expanded = ipv6ToExpanded(input);
  const compressed = ipv6ToCompressed(input);
  const classification = classifyIpv6(input);
  const ipv6Text = getIpv6ToolboxText(lang);
  const valid = expanded.ok && compressed.ok;
  const copyValue = valid ? ipv6CopyRows([
    [ipv6Text.labels.rfc5952, compressed.data.compressed],
    [ipv6Text.labels.expanded, expanded.data.expanded],
    [ipv6Text.labels.type, ipv6Text.classLabel(classification.label)],
    [ipv6Text.labels.hextets, expanded.data.words.join(" · ")],
  ]) : "";
  const reset = () => setInput("2001:db8::1");
  return (
    <ModuleCard id="ipv6-normalize" icon="binary" layout="dashboard" title={local(lang, "IPv6 formatting and detection", "IPv6 格式化与识别", "IPv6 格式化與識別")}>
      <DashboardInputPanel label={ipv6Text.labels.address} help={ipv6Text.help.normalize}>
        <div className="dashboard-input-actions dashboard-input-actions-inline">
          <div className="dashboard-form-grid dashboard-form-grid-ipv6-normalize">
            <DashboardInputField id="ipv6-input" label={ipv6Text.labels.address} error={!valid ? errorText(lang, !expanded.ok ? expanded.reason : "invalid") : undefined} hideLabel>
              <input className="ipv6-address-input" value={input} onChange={event => setInput(event.target.value)} />
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {valid
          ? <>
            <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv6-normalize-result-title">
              <div className="dashboard-card-head">
                <CardTitle icon="check" id="ipv6-normalize-result-title">{ipv6Text.labels.normalizedAddress}</CardTitle>
                <CopyAction value={copyValue} label={ipv6Text.labels.copyAll} lang={lang} />
              </div>
              <MetricList>
                <MetricRow label={ipv6Text.labels.rfc5952} value={compressed.data.compressed} copyValue={compressed.data.compressed} lang={lang} tone="mono" />
                <MetricRow label={ipv6Text.labels.expanded} value={expanded.data.expanded} copyValue={expanded.data.expanded} lang={lang} tone="code" />
                <MetricRow label={ipv6Text.labels.type} value={ipv6Text.classLabel(classification.label)} copyValue={ipv6Text.classLabel(classification.label)} lang={lang} />
              </MetricList>
            </section>
            <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv6-hextets-title">
              <div className="dashboard-card-head">
                <CardTitle icon="binary" id="ipv6-hextets-title">{ipv6Text.labels.hextets}</CardTitle>
                <CopyAction value={expanded.data.words.join(":")} label={ipv6Text.labels.copyItem(ipv6Text.labels.hextets)} lang={lang} iconOnly />
              </div>
              <Ipv6HextetStrip words={expanded.data.words} lang={lang} />
            </section>
          </>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{errorText(lang, !expanded.ok ? expanded.reason : "invalid")}</InfoNote></section>}
      </DashboardResultPanel>
    </ModuleCard>
  );
}

function Ipv6PrefixModule({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("2001:db8::1");
  const [prefix, setPrefix] = useState("64");
  const range = ipv6PrefixRange(input, prefix);
  const ipv6Text = getIpv6ToolboxText(lang);
  const parsedPrefix = range.ok ? range.data.prefix : Number(prefix);
  const startExpanded = range.ok ? ipv6ToExpanded(range.data.start) : undefined;
  const prefixCidr = range.ok ? `${range.data.start}/${range.data.prefix}` : "";
  const prefixError = range.ok ? errorText(lang, startExpanded?.ok ? undefined : "invalid") : errorText(lang, range.reason);
  const copyValue = range.ok ? ipv6CopyRows([
    [ipv6Text.labels.prefixCidr, prefixCidr],
    [ipv6Text.labels.prefix, `/${range.data.prefix}`],
    [ipv6Text.labels.addressCount, range.data.total],
    [ipv6Text.labels.startAddress, range.data.start],
    [ipv6Text.labels.endAddress, range.data.end],
  ]) : "";
  const reset = () => {
    setInput("2001:db8::1");
    setPrefix("64");
  };
  return (
    <ModuleCard id="ipv6-prefix" icon="network" layout="dashboard" title={local(lang, "IPv6 prefix range", "IPv6 前缀范围", "IPv6 前綴範圍")}>
      <DashboardInputPanel label={local(lang, "IPv6 address / Prefix", "IPv6 地址 / 前缀", "IPv6 位址 / 前綴")} help={ipv6Text.help.prefix}>
        <div className="dashboard-input-actions dashboard-input-actions-inline">
          <div className="dashboard-form-grid dashboard-form-grid-ipv6-prefix">
            <DashboardInputField id="ipv6-prefix-input" label={ipv6Text.labels.address} hideLabel>
              <input className="ipv6-address-input" value={input} onChange={event => setInput(event.target.value)} />
            </DashboardInputField>
            <DashboardInputField id="ipv6-prefix-length" label={ipv6Text.labels.prefix} error={!range.ok ? resultText(range, lang) : undefined} hideLabel>
              <select className="ipv6-prefix-input" value={prefix} onChange={event => setPrefix(event.target.value)}>
                {Array.from({ length: 129 }, (_, prefixValue) => <option key={prefixValue} value={String(prefixValue)}>/{prefixValue}</option>)}
              </select>
            </DashboardInputField>
          </div>
          <button type="button" className="button-secondary dashboard-reset-button" onClick={reset}><Icon name="swap" size={16} />{messages[lang].reset}</button>
        </div>
      </DashboardInputPanel>
      <DashboardResultPanel lang={lang}>
        {range.ok && startExpanded?.ok
          ? <>
            <div className="dashboard-card-grid dashboard-card-grid-ipv6">
              <section className="dashboard-result-card" aria-labelledby="ipv6-prefix-summary-title">
                <div className="dashboard-card-head">
                  <CardTitle icon="network" id="ipv6-prefix-summary-title">{ipv6Text.labels.prefixSummary}</CardTitle>
                  <CopyAction value={copyValue} label={ipv6Text.labels.copyAll} lang={lang} iconOnly />
                </div>
                <MetricList>
                  <MetricRow label={ipv6Text.labels.prefixCidr} value={prefixCidr} copyValue={prefixCidr} lang={lang} tone="mono" />
                  <MetricRow label={ipv6Text.labels.prefix} value={`/${range.data.prefix}`} copyValue={`/${range.data.prefix}`} lang={lang} tone="mono" />
                  <MetricRow label={ipv6Text.labels.addressCount} value={big(range.data.total)} copyValue={big(range.data.total)} lang={lang} tone="mono" />
                </MetricList>
              </section>
              <section className="dashboard-result-card" aria-labelledby="ipv6-address-range-title">
                <div className="dashboard-card-head">
                  <CardTitle icon="ruler" id="ipv6-address-range-title">{ipv6Text.labels.addressRange}</CardTitle>
                  <CopyAction value={ipv6CopyRows([[ipv6Text.labels.startAddress, range.data.start], [ipv6Text.labels.endAddress, range.data.end]])} label={ipv6Text.labels.copyAll} lang={lang} iconOnly />
                </div>
                <MetricList>
                  <MetricRow label={ipv6Text.labels.startAddress} value={range.data.start} copyValue={range.data.start} lang={lang} tone="mono" />
                  <MetricRow label={ipv6Text.labels.endAddress} value={range.data.end} copyValue={range.data.end} lang={lang} tone="mono" />
                </MetricList>
              </section>
            </div>
            <section className="dashboard-result-card dashboard-card-wide" aria-labelledby="ipv6-bit-breakdown-title">
              <div className="dashboard-card-head">
                <CardTitle icon="binary" id="ipv6-bit-breakdown-title">{ipv6Text.labels.bitBreakdown}</CardTitle>
                <CopyAction value={startExpanded.data.words.join(":")} label={ipv6Text.labels.copyItem(ipv6Text.labels.bitBreakdown)} lang={lang} iconOnly />
              </div>
              <Ipv6BitBreakdown words={startExpanded.data.words} prefix={parsedPrefix} lang={lang} />
            </section>
          </>
          : <section className="dashboard-result-card dashboard-card-wide"><InfoNote>{prefixError}</InfoNote></section>}
      </DashboardResultPanel>
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
      <div className="network-module-stack network-module-stack-ipv6">
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
