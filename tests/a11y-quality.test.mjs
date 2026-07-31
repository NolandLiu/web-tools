import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = async relative => readFile(new URL(relative, import.meta.url), "utf8");

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
  assert.match(css, /\.metric-value-primary\s*\{[^}]*font-size:\s*var\(--text-title-sm\)/);
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
