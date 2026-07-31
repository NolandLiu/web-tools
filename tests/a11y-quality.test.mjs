import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = async relative => readFile(new URL(relative, import.meta.url), "utf8");
const sliceBetween = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `Missing ${endMarker}`);
  return source.slice(start, end);
};

test("shared fields associate labels, help, and errors with controls", async () => {
  const source = await readSource("../src/components/Field.tsx");
  assert.match(source, /<label htmlFor=/);
  assert.match(source, /"aria-describedby": describedBy/);
  assert.match(source, /"aria-invalid": error/);
  assert.match(source, /className="field-error"/);
});

test("shared results provide debounced polite status without pretending to be editable", async () => {
  const source = await readSource("../src/components/ResultCard.tsx");
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-atomic="true"/);
  assert.match(source, /setTimeout\(\(\) => setAnnouncedValue/);
  assert.doesNotMatch(source, /<input[^>]+readOnly/);
});

test("mode controls expose selected state and tool errors are field-associated", async () => {
  const textTools = await readSource("../src/tools/TextTools.tsx");
  const calculators = await readSource("../src/tools/CalculatorTools.tsx");
  assert.match(textTools, /aria-pressed=/);
  assert.match(calculators, /error=\{definition\.aError\}/);
  assert.match(calculators, /error=\{definition\.bError\}/);
});

test("navigation names and QR output alternatives are localized", async () => {
  const shell = await readSource("../src/components/AppShell.tsx");
  const search = await readSource("../src/components/SearchDialog.tsx");
  const qr = await readSource("../src/tools/QrTool.tsx");
  assert.match(shell, /navLabels\[item\]\[lang\]/);
  assert.match(shell, /messages\[lang\]\.language/);
  assert.match(shell, /aria-label=\{t\.footerNavigation\}/);
  assert.match(search, /className="global-search-button"[^>]+aria-label=\{searchCopy\[lang\]\.shortcut\}/);
  assert.match(qr, /alt=\{t\.qrAlt\}/);
  assert.match(qr, /aria-live="polite"/);
});

test("focus indicators and narrow-screen wrapping remain explicit", async () => {
  const css = await readSource("../src/styles.css");
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /\.tool-drawer\s*\{[^}]*visibility:\s*hidden/);
  assert.match(css, /\.tool-drawer\.open\s*\{[^}]*visibility:\s*visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("checkbox controls keep native size and align with labels", async () => {
  const css = await readSource("../src/styles.css");
  assert.match(css, /input\[type="checkbox"\],\s*input\[type="radio"\]/);
  assert.match(css, /input\[type="checkbox"\][\s\S]*width:\s*16px/);
  assert.match(css, /input\[type="checkbox"\][\s\S]*height:\s*16px/);
  assert.match(css, /input\[type="checkbox"\][\s\S]*accent-color:\s*var\(--accent\)/);
  assert.match(css, /\.password-category label\s*\{[^}]*align-items:\s*center/);
  assert.match(css, /\.checkbox-row\s*\{[^}]*align-items:\s*center/);
});

test("Phase 4 tools expose labelled dynamic controls and independent results", async () => {
  const irr = await readSource("../src/tools/IrrTool.tsx");
  const cheque = await readSource("../src/tools/ChequeTool.tsx");
  const password = await readSource("../src/tools/PasswordTool.tsx");
  const qr = await readSource("../src/tools/QrTool.tsx");
  assert.match(irr, /<Field id=\{`irr-cash-flow-/);
  assert.match(irr, /aria-label=\{`\$\{t\.remove\}/);
  assert.match(cheque, /label=\{t\.english\}/);
  assert.match(cheque, /label=\{t\.currency\}/);
  assert.match(cheque, /label=\{t\.englishCase\}/);
  assert.match(cheque, /label=\{t\.chineseScript\}/);
  assert.match(cheque, /role="note"/);
  assert.match(password, /<fieldset/);
  assert.match(password, /<legend>/);
  assert.match(qr, /type="file"/);
  assert.match(qr, /q\.removeLogo/);
  assert.match(qr, /alt=\{t\.qrAlt\}/);
});

test("IPv4 subnet module uses aligned octet inputs and localized result labels", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  assert.doesNotMatch(source, /label="IP\/CIDR"/);
  assert.doesNotMatch(source, /id="ipv4-cidr"/);
  assert.doesNotMatch(source, /id="ipv4-mask"/);
  assert.doesNotMatch(source, /\["Semantics"/);
  assert.match(source, /className="inline-ip-prefix-input"/);
  assert.match(source, /className="ipv4-octet-inputs"/);
  assert.match(source, /className="dashboard-result-card/);
  assert.match(source, /aria-label=\{subnetText\.octetLabel\(index\)\}/);
  assert.match(source, /subnetText\.labels\.binaryAddress/);
  assert.match(source, /subnetText\.semantics\.pointToPoint/);
  assert.match(source, /subnetText\.semantics\.singleHost/);
  assert.match(css, /\.inline-ip-prefix-input/);
  assert.match(css, /\.octet-field input\s*\{[^}]*width:\s*var\(--network-octet-width\)/);
  assert.match(css, /\.binary-bit-line/);
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
});

test("IPv4 subnet dashboard layout exposes reusable result cards and clear copy actions", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  assert.doesNotMatch(source, /<ResultCard label=\{messages\[lang\]\.result\} displayValue=\{display\} copyValue=\{copyValue\} lang=\{lang\} onClear=\{reset\} \/>/);
  assert.match(source, /className="tool-dashboard-input[^"]*"/);
  assert.match(source, /className="inline-ip-prefix-input"/);
  assert.match(source, /className="dashboard-result-area"/);
  assert.match(source, /className="dashboard-result-heading"/);
  assert.doesNotMatch(source, /<h4>\{subnetText\.labels\.result\}<\/h4>/);
  assert.match(source, /subnetText\.labels\.copyAll/);
  assert.match(source, /subnetText\.labels\.copyBinary/);
  assert.match(source, /status === "copied" \? t\.copied : label/);
  assert.match(source, /className="dashboard-card-grid"/);
  assert.match(source, /className="dashboard-result-card/);
  assert.match(source, /className="[^"]*dashboard-card-wide/);
  assert.match(source, /"metric-copy"/);
  assert.match(source, /subnetText\.labels\.networkCidr/);
  assert.match(source, /subnetText\.labels\.usableRange/);
  assert.match(source, /className="binary-bit-split"/);
  assert.match(source, /"binary-network-bits"/);
  assert.match(source, /"binary-host-bits"/);
  assert.match(source, /prefix === groupEnd/);
  assert.match(source, /semanticNote && <InfoNote>/);
  assert.match(css, /\.tool-dashboard-input/);
  assert.match(css, /\.inline-ip-prefix-input/);
  assert.match(css, /\.dashboard-result-area/);
  assert.match(css, /\.dashboard-card-grid/);
  assert.match(css, /\.dashboard-result-card/);
  assert.match(css, /\.metric-row/);
  assert.match(css, /\.metric-copy/);
  assert.match(css, /\.binary-bit-split/);
  assert.match(css, /\.binary-network-bits/);
  assert.match(css, /\.binary-host-bits/);
});

test("network modules use the approved dark header and compact dashboard typography", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  assert.match(source, /function ModuleCard\(\{ id, title, icon = "network"/);
  assert.match(source, /className="network-module-titlebar"/);
  assert.match(source, /className="network-module-title-icon"/);
  assert.match(source, /icon="calculator"/);
  assert.match(source, /`metric-value metric-value-\$\{tone\}`/);
  assert.match(source, /tone="mono"/);
  assert.match(source, /tone="code"/);
  assert.match(source, /tone="primary"/);
  assert.match(source, /metric-row-\$\{tone\}/);
  assert.match(source, /<CardTitle icon="document" id="ipv4-result-ip-title"/);
  assert.match(source, /<CardTitle icon="network" id="ipv4-result-subnet-title"/);
  assert.match(source, /<CardTitle icon="ruler" id="ipv4-result-range-title"/);
  assert.match(source, /<CardTitle icon="binary" id="ipv4-binary-breakdown-title"/);
  assert.match(css, /\.dashboard-result-card \.dashboard-card-title\s*\{[^}]*justify-content:\s*flex-start/);
  assert.doesNotMatch(source, /metric-row-emphasized/);
  assert.match(source, /data\.semantics === "standard"/);
  assert.match(source, /className=\{rangeMode === "standard" \? "usable-range-bar" : "usable-range-status"/);
  assert.match(source, /className="binary-octet-text/);
  assert.doesNotMatch(source, /group\.split\(""\)\.map/);
  assert.match(css, /\.network-module-titlebar/);
  assert.match(css, /background:\s*linear-gradient\(135deg,\s*#0f4f4c/);
  assert.match(css, /\.metric-row\s*\{[^}]*grid-template-columns:\s*minmax\(88px,\s*\.72fr\)\s+minmax\(0,\s*1fr\)\s+var\(--dashboard-copy-size\)/);
  assert.match(css, /\.metric-value-primary\s*\{[^}]*font-size:\s*var\(--text-ui\)/);
  assert.match(css, /\.metric-row-code\s*\{[^}]*grid-template-areas:\s*"label label label"\s*"value value copy"/);
  assert.match(css, /\.metric-row-primary\s*\{[^}]*grid-template-areas:\s*"label value copy"/);
  assert.match(css, /\.metric-value-code\s*\{[^}]*font-size:\s*var\(--text-sm\)/);
  assert.match(css, /\.metric-value-code\s*\{[^}]*white-space:\s*normal/);
  assert.match(css, /\.binary-bit-line\s*\{[^}]*font-size:\s*clamp\(var\(--text-title-sm\),\s*1\.8vw,\s*var\(--text-heading\)\)/);
  assert.match(css, /\.binary-dot\s*\{[^}]*width:\s*6px[^}]*height:\s*6px[^}]*border-radius:\s*999px/);
  assert.match(css, /\.binary-boundary-at-prefix/);
  assert.match(css, /\.binary-prefix-marker-at-dot/);
  assert.match(css, /\.binary-octet-text/);
  assert.match(css, /\.usable-range-status/);
});

test("network design system uses a fixed type scale and a full-width dashboard shell", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  const networkCss = css.slice(css.indexOf(".network-toolbox"), css.indexOf(".cash-flow-list"));

  for (const [token, value] of [
    ["--text-2xs", "11px"],
    ["--text-xs", "12px"],
    ["--text-sm", "13px"],
    ["--text-ui", "14px"],
    ["--text-body", "16px"],
    ["--text-title-sm", "18px"],
    ["--text-title", "20px"],
    ["--text-heading", "24px"],
    ["--text-display", "32px"],
  ]) {
    assert.match(css, new RegExp(`${token}:\\s*${value}`));
  }
  assert.match(css, /--font-sans:/);
  assert.match(css, /--font-mono:/);
  assert.doesNotMatch(css, /--font-sans:[^;]*Inter/);
  assert.match(css, /--weight-regular:\s*400/);
  assert.match(css, /--weight-medium:\s*500/);
  assert.match(css, /--weight-semibold:\s*600/);
  assert.match(css, /--weight-bold:\s*700/);
  assert.doesNotMatch(networkCss, /font-weight:\s*(650|720|760|780|800|820)/);

  assert.match(source, /layout = "default"/);
  assert.match(source, /`network-module network-module-\$\{layout\}`/);
  assert.match(source, /layout="dashboard"/);
  assert.match(source, /className="ipv4-prefix-group"/);
  assert.match(css, /\.network-module-dashboard \.network-module-body\s*\{[^}]*padding:\s*0/);
  assert.match(css, /\.network-module-dashboard \.tool-dashboard-input\s*\{[^}]*border:\s*1px solid var\(--line\)[^}]*border-radius:\s*0 0 var\(--radius-lg\) var\(--radius-lg\)[^}]*box-shadow:\s*var\(--shadow-elevated\)/);
  assert.match(css, /--network-octet-width:\s*clamp\(56px,\s*7vw,\s*88px\)/);
  assert.match(css, /\.ipv4-prefix-input\s*\{[^}]*width:\s*68px/);
  assert.match(css, /\.dashboard-reset-button\s*\{[^}]*min-width:\s*104px/);
});

test("special subnet notes use the shared icon-led note pattern", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  assert.match(source, /function InfoNote/);
  assert.match(source, /role="note"/);
  assert.match(source, /className="dashboard-info-note-icon"/);
  assert.match(source, /<Icon name="info" size=\{18\}/);
  assert.match(source, /semanticNote && <InfoNote>/);
  assert.match(css, /\.dashboard-info-note\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*18px\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /\.dashboard-info-note-icon/);
});

test("remaining IPv4 modules use dashboard inputs, reset actions, and row-level copy", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  const modules = [
    ["MaskConverterModule", "HostRecommendationModule"],
    ["HostRecommendationModule", "RangeCidrModule"],
    ["RangeCidrModule", "Ipv4ConverterModule"],
    ["Ipv4ConverterModule", "SameSubnetModule"],
    ["SameSubnetModule", "export function Ipv4NetworkToolbox"],
  ];

  assert.match(source, /function DashboardInputPanel/);
  assert.match(source, /function DashboardResultPanel/);
  assert.match(source, /function DashboardInputField/);

  for (const [name, next] of modules) {
    const block = sliceBetween(source, `function ${name}`, next);
    assert.match(block, /layout="dashboard"/, `${name} should use dashboard module layout`);
    assert.match(block, /<DashboardInputPanel/, `${name} should use the shared input panel`);
    assert.match(block, /<DashboardResultPanel/, `${name} should use the shared result panel`);
    assert.match(block, /<DashboardInputField/, `${name} should use labelled dashboard fields`);
    assert.match(block, /dashboard-reset-button/, `${name} should expose reset next to inputs`);
    assert.match(block, /<MetricRow/, `${name} should expose row-level copy actions`);
    assert.doesNotMatch(block, /<ResultCard/, `${name} should not use the old large result card`);
    assert.doesNotMatch(block, /rows\(\[/, `${name} should not use hard-coded result rows`);
  }

  assert.match(css, /\.dashboard-input-panel-header/);
  assert.match(css, /\.dashboard-form-grid/);
  assert.match(css, /\.dashboard-input-actions/);
  assert.match(css, /\.dashboard-result-single/);
  assert.match(css, /\.metric-list/);
});

test("remaining IPv4 dashboard modules keep copy-all inside each result card", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  const modules = [
    ["MaskConverterModule", "HostRecommendationModule"],
    ["HostRecommendationModule", "RangeCidrModule"],
    ["RangeCidrModule", "Ipv4ConverterModule"],
    ["Ipv4ConverterModule", "SameSubnetModule"],
    ["SameSubnetModule", "export function Ipv4NetworkToolbox"],
  ];

  assert.doesNotMatch(sliceBetween(source, "function DashboardResultPanel", "function copyLines"), /dashboard-result-heading/);
  assert.doesNotMatch(source, /<DashboardResultPanel lang=\{lang\} copyValue=\{copyValue\}>/);

  for (const [name, next] of modules) {
    const block = sliceBetween(source, `function ${name}`, next);
    assert.match(block, /className="dashboard-card-head"/, `${name} should place the copy action in the result card header`);
    assert.match(block, /<CopyAction value=\{copyValue\} label=\{ipv4Text\.labels\.copyAll\} lang=\{lang\}/, `${name} should expose Copy all inside its card`);
  }

  assert.match(source, /iconOnly\?: boolean/);
  assert.match(source, /label=\{subnetText\.labels\.copyBinary\} lang=\{lang\} iconOnly/);
  assert.match(css, /\.dashboard-card-head \.dashboard-copy-button\s*\{[^}]*min-height:\s*34px/);
  assert.match(css, /\.dashboard-copy-button-icon\s*\{[^}]*width:\s*34px/);
});

test("remaining IPv4 dashboard modules remove duplicated labels and use the approved stacking rules", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  const maskBlock = sliceBetween(source, "function MaskConverterModule", "function HostRecommendationModule");
  const hostBlock = sliceBetween(source, "function HostRecommendationModule", "function RangeCidrModule");
  const sameBlock = sliceBetween(source, "function SameSubnetModule", "export function Ipv4NetworkToolbox");
  const toolboxBlock = sliceBetween(source, "export function Ipv4NetworkToolbox", "function Ipv6NormalizeModule");

  assert.match(source, /function DashboardInputField\(\{ id, label, help, error, hideLabel = false, children \}/);
  assert.match(maskBlock, /<DashboardInputField id="mask-input" label=\{ipv4Text\.labels\.maskInput\}[^>]*hideLabel/);
  assert.match(hostBlock, /<DashboardInputField id="ipv4-hosts" label=\{ipv4Text\.labels\.hostInput\}[^>]*hideLabel/);
  assert.match(maskBlock, /<MetricRow label=\{ipv4Text\.labels\.recommendedPrefix\}[^>]*tone="mono"/);
  assert.match(hostBlock, /<MetricRow label=\{ipv4Text\.labels\.recommendedPrefix\}[^>]*tone="mono"/);
  assert.match(sameBlock, /tone=\{result\.data\.same \? "success" : "danger"\}/);
  assert.match(toolboxBlock, /className="network-module-grid network-module-pair"/);
  assert.match(toolboxBlock, /className="network-module-stack"/);
  assert.match(css, /\.network-module-pair\s*\{[^}]*align-items:\s*stretch/);
  assert.match(css, /\.network-module-stack\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.metric-value-success/);
  assert.match(css, /\.metric-value-danger/);
});

test("remaining IPv4 dashboard inputs use compact inline controls for address-sized values", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  const css = await readSource("../src/styles.css");
  const rangeBlock = sliceBetween(source, "function RangeCidrModule", "function Ipv4ConverterModule");
  const converterBlock = sliceBetween(source, "function Ipv4ConverterModule", "function SameSubnetModule");
  const sameBlock = sliceBetween(source, "function SameSubnetModule", "export function Ipv4NetworkToolbox");

  assert.match(source, /function DashboardInputPanel\(\{ label, help, children, showLabel = true, headerContent \}/);
  assert.match(rangeBlock, /showLabel=\{false\}/);
  assert.match(rangeBlock, /headerContent=\{<div className="segmented dashboard-mode-tabs"/);
  assert.doesNotMatch(rangeBlock, /<DashboardInputPanel label=\{local\(lang, "Range \/ CIDR mode"/);
  assert.match(rangeBlock, /className="dashboard-input-actions dashboard-input-actions-inline"/);
  assert.match(rangeBlock, /className="dashboard-form-grid dashboard-form-grid-range-cidr"/);
  assert.match(rangeBlock, /className="ipv4-cidr-input"/);

  assert.match(converterBlock, /className="dashboard-input-actions dashboard-input-actions-inline"/);
  assert.match(converterBlock, /className="dashboard-form-grid dashboard-form-grid-ipv4-converter"/);
  assert.match(converterBlock, /className="ipv4-format-select"/);
  assert.match(converterBlock, /className="ipv4-address-input"/);
  assert.doesNotMatch(converterBlock, /help=\{ipv4Text\.help\.inputFormat\}/);

  assert.match(sameBlock, /className="dashboard-input-actions dashboard-input-actions-inline"/);
  assert.match(sameBlock, /className="dashboard-form-grid dashboard-form-grid-same-subnet"/);
  assert.doesNotMatch(sameBlock, /help=\{ipv4Text\.help\.ipA\}/);
  assert.doesNotMatch(sameBlock, /help=\{ipv4Text\.help\.ipB\}/);
  assert.match(sameBlock, /<select value=\{samePrefix\} onChange=\{event => setSamePrefix\(event\.target\.value\)\}/);
  assert.match(sameBlock, /Array\.from\(\{ length: 33 \}/);
  assert.doesNotMatch(sameBlock, /inputMode="numeric" value=\{samePrefix\}/);
  assert.equal((sameBlock.match(/Network A/g) ?? []).length, 2, "Network A should appear only in copy lines and one result row");

  assert.match(css, /\.dashboard-form-grid-range-cidr\s*\{[^}]*grid-template-columns:\s*minmax\(180px,\s*300px\)/);
  assert.match(css, /\.dashboard-form-grid-ipv4-converter\s*\{[^}]*grid-template-columns:\s*minmax\(150px,\s*190px\)\s+minmax\(180px,\s*300px\)/);
  assert.match(css, /\.dashboard-form-grid-same-subnet\s*\{[^}]*grid-template-columns:\s*minmax\(150px,\s*190px\)\s+minmax\(150px,\s*190px\)\s+minmax\(88px,\s*112px\)/);
  assert.match(css, /\.dashboard-input-actions-inline\s*\{[^}]*align-items:\s*end/);
});

test("remaining IPv4 modules use localized dashboard labels instead of hard-coded English result labels", async () => {
  const source = await readSource("../src/tools/NetworkTools.tsx");
  assert.match(source, /function getIpv4ToolboxText/);
  for (const token of [
    "maskInput",
    "hostInput",
    "cidrInput",
    "startIp",
    "endIp",
    "inputFormat",
    "ipv4Value",
    "ipA",
    "ipB",
    "recommendedPrefix",
    "totalAddresses",
    "usableHosts",
    "startAddress",
    "endAddress",
    "cidrBlocks",
    "dotted",
    "decimal",
    "groupedBinary",
    "hex",
    "sameSubnet",
  ]) {
    assert.match(source, new RegExp(`ipv4Text\\.labels\\.${token}`), `Missing localized label token ${token}`);
  }
  assert.doesNotMatch(source, /label="Input format"/);
  assert.doesNotMatch(source, /label="IPv4 value"/);
  assert.doesNotMatch(source, /label="Start IP"/);
  assert.doesNotMatch(source, /label="End IP"/);
});
