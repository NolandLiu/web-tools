# Tool Workspace UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Lite Tools into a responsive sidebar-based workspace with consistent multilingual typography, clearly named inputs and outputs, accessible contextual help, efficient swap actions, and copy support for every textual result.

**Architecture:** Keep `App` responsible for page-level routing, language, search, and active-tool state, while extracting catalog/i18n data, the application shell, sidebar, reusable form primitives, and tool families into focused modules. Pure UI policies live in `src/lib/ui.js` so they can be tested with the existing Node test runner; browser verification covers rendered interactions and responsive behavior.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Node 22 built-in test runner, CSS, inline SVG icons, Cloudflare Pages.

## Global Constraints

- Support exactly `en`, `zh-CN`, and `zh-TW` without missing user-visible strings.
- Do not add external font, icon, analytics, advertising, database, or backend requests.
- Preserve browser-local processing and existing conversion/calculation functions in `src/lib/core.js`.
- Desktop sidebar width is 260px; mobile navigation becomes a drawer below 768px.
- Text outputs use one shared copy interaction with a two-second localized success state.
- Every field has a persistent visible label and an `aria-describedby` help relationship.
- Invalid or empty output disables copy.
- Do not create or merge a GitHub PR without separate user approval.

## File Structure

- Create `src/types.ts`: shared `Lang`, `Page`, `Tool`, category, and field metadata types.
- Create `src/catalog.ts`: tool registry, category registry, tool copy, and unit labels.
- Create `src/i18n.ts`: global messages, tool-field labels, hints, actions, and translation helpers.
- Create `src/lib/ui.js` and `src/lib/ui.d.ts`: pure tree, swap, output, and copy-state policies.
- Create `src/components/Icons.tsx`: consistent inline SVG icon set.
- Create `src/components/AppShell.tsx`: top bar, desktop shell, mobile drawer state, footer.
- Create `src/components/ToolSidebar.tsx`: two-level category tree and active tool navigation.
- Create `src/components/Field.tsx`: visible label, tooltip, hidden description, and error slot.
- Create `src/components/ResultCard.tsx`: output naming, copy, clear/download actions, and live feedback.
- Create `src/components/ToolWorkspace.tsx`: tool header, breadcrumb, related tools, and tool-family dispatch.
- Create `src/tools/UnitTool.tsx`: unit and temperature converters.
- Create `src/tools/TextTools.tsx`: JSON, Base64, URL, UUID, timestamp, case, text statistics, and color tools.
- Create `src/tools/CalculatorTools.tsx`: percentage, discount, BMI, compound interest, and date interval.
- Create `src/tools/QrTool.tsx`: QR inputs, output text copy, preview, and PNG download.
- Modify `src/App.tsx`: compose extracted modules and preserve page/search/stat state.
- Replace `src/styles.css`: design tokens, app shell, tree, workspace, field, result, drawer, and responsive rules.
- Modify `tests/core.test.mjs`: retain formula tests and add UI policy tests through imports.
- Create `tests/ui.test.mjs`: translation completeness, tree, swap, output-copy, and source-contract tests.
- Modify `tests/smoke.test.mjs`: assert the production shell and accessibility contracts.

---

### Task 1: Pure UI Policies and Shared Types

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/ui.js`
- Create: `src/lib/ui.d.ts`
- Create: `tests/ui.test.mjs`

**Interfaces:**
- Produces: `buildToolTree(tools, categoryOrder)`, `swapConversion({ input, output, from, to })`, `getCopyState(value, invalidValues)`, and `serializeStatsResult(stats)`.
- Produces: `Lang`, `Page`, `ToolKind`, `Tool`, and `CategoryId` types.

- [ ] **Step 1: Write failing UI-policy tests**

```js
test("tool tree preserves category and tool order", () => {
  const tree = buildToolTree([
    { id: "json", category: "developer", order: 2 },
    { id: "length", category: "units", order: 1 },
  ], ["units", "developer"]);
  assert.deepEqual(tree.map(group => [group.id, group.tools.map(tool => tool.id)]), [
    ["units", ["length"]],
    ["developer", ["json"]],
  ]);
});

test("swap uses the current output as the next input when valid", () => {
  assert.deepEqual(swapConversion({ input: "1", output: "3.28", from: "m", to: "ft" }), {
    input: "3.28", from: "ft", to: "m",
  });
});

test("invalid and empty outputs are not copyable", () => {
  assert.equal(getCopyState("", ["Invalid"]), "disabled");
  assert.equal(getCopyState("Invalid", ["Invalid"]), "disabled");
  assert.equal(getCopyState("42", ["Invalid"]), "ready");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/ui.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/ui.js`.

- [ ] **Step 3: Implement minimal policies and declarations**

```js
export function buildToolTree(tools, categoryOrder) {
  return categoryOrder.map(id => ({
    id,
    tools: tools.filter(tool => tool.category === id).toSorted((a, b) => a.order - b.order),
  }));
}

export function swapConversion({ input, output, from, to }) {
  return { input: output.trim() ? output : input, from: to, to: from };
}

export function getCopyState(value, invalidValues = []) {
  return !value.trim() || invalidValues.includes(value) ? "disabled" : "ready";
}

export function serializeStatsResult({ characters, words, lines }) {
  return `Characters: ${characters}\nWords: ${words}\nLines: ${lines}`;
}
```

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `node --test tests/ui.test.mjs`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Commit the policy layer**

```bash
git add src/types.ts src/lib/ui.js src/lib/ui.d.ts tests/ui.test.mjs
git commit -m "test: define tool workspace ui policies"
```

### Task 2: Catalog and Complete Multilingual Copy

**Files:**
- Create: `src/catalog.ts`
- Create: `src/i18n.ts`
- Modify: `tests/ui.test.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Lang`, `Tool`, and `CategoryId` from `src/types.ts`.
- Produces: `TOOLS`, `CATEGORY_ORDER`, `categories`, `toolText`, `unitLabels`, `messages`, `fieldText`, and `translateField(toolId, fieldId, lang)`.

- [ ] **Step 1: Add failing translation-completeness tests**

```js
test("every supported language has all global and tool field keys", async () => {
  const source = await readFile(new URL("../src/i18n.ts", import.meta.url), "utf8");
  for (const lang of ["en", "zh-CN", "zh-TW"]) assert.match(source, new RegExp(`['\"]?${lang.replace("-", "-")}['\"]?`));
  for (const key of ["input", "output", "swap", "copy", "copied", "copyFailed", "showHelp", "navigation"]) assert.match(source, new RegExp(`${key}:`));
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/ui.test.mjs`

Expected: FAIL because `src/i18n.ts` does not exist.

- [ ] **Step 3: Extract catalog data and add all three translations**

Implement field metadata for every tool. A field entry has this exact shape:

```ts
type FieldCopy = Record<Lang, {
  label: string;
  placeholder: string;
  help: string;
}>;
```

Examples:

```ts
inputLength: {
  en: { label: "Input length", placeholder: "e.g. 100", help: "Enter the numeric length to convert." },
  "zh-CN": { label: "输入长度", placeholder: "例如：100", help: "输入需要换算的长度数值。" },
  "zh-TW": { label: "輸入長度", placeholder: "例如：100", help: "輸入需要換算的長度數值。" },
}
```

Replace the duplicate constants in `App.tsx` with imports from `catalog.ts` and `i18n.ts` without changing behavior.

- [ ] **Step 4: Run tests and TypeScript build**

Run: `node --test tests/ui.test.mjs && npm run build`

Expected: all focused tests pass; Vite build exits 0.

- [ ] **Step 5: Commit translations and catalog extraction**

```bash
git add src/catalog.ts src/i18n.ts src/App.tsx tests/ui.test.mjs
git commit -m "refactor: centralize tool catalog and translations"
```

### Task 3: App Shell, Tree Sidebar, and Mobile Drawer

**Files:**
- Create: `src/components/Icons.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/ToolSidebar.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `tests/smoke.test.mjs`

**Interfaces:**
- Consumes: `TOOLS`, `CATEGORY_ORDER`, localized catalog text, `activeToolId`, and `onOpenTool(tool)`.
- Produces: `AppShellProps` and `ToolSidebarProps`; sidebar tool buttons expose `aria-current="page"` for the active tool.

- [ ] **Step 1: Add failing shell contract tests**

```js
test("source contains sidebar and mobile drawer accessibility contracts", async () => {
  const shell = await readFile(new URL("../src/components/AppShell.tsx", import.meta.url), "utf8");
  const sidebar = await readFile(new URL("../src/components/ToolSidebar.tsx", import.meta.url), "utf8");
  assert.match(shell, /aria-expanded/);
  assert.match(shell, /aria-controls="tool-navigation"/);
  assert.match(sidebar, /aria-current/);
  assert.match(sidebar, /<nav/);
});
```

- [ ] **Step 2: Run the smoke test and confirm RED**

Run: `node --test tests/smoke.test.mjs`

Expected: FAIL because shell/sidebar component files do not exist.

- [ ] **Step 3: Implement the shell and navigation tree**

Use a native button for the mobile menu and native buttons for expandable category headings. Category buttons have `aria-expanded`; the drawer has `id="tool-navigation"`; selecting a tool calls `onOpenTool` and closes the drawer. Use the inline `Icon` component instead of text glyphs.

- [ ] **Step 4: Add the shell layout CSS**

Implement `--sidebar-width: 260px`, a two-column `.app-layout`, sticky `.tool-sidebar`, `.sidebar-tree`, `.sidebar-tool[aria-current="page"]`, `.mobile-menu-button`, `.drawer-backdrop`, and the `<768px` drawer transform. Keep the top bar visible and ensure the drawer has a 44px close target.

- [ ] **Step 5: Run focused tests and build**

Run: `node --test tests/smoke.test.mjs && npm run build`

Expected: smoke tests pass and build exits 0.

- [ ] **Step 6: Commit the application shell**

```bash
git add src/components/Icons.tsx src/components/AppShell.tsx src/components/ToolSidebar.tsx src/App.tsx src/styles.css tests/smoke.test.mjs
git commit -m "feat: add responsive tool navigation shell"
```

### Task 4: Accessible Field, Tooltip, Copy, and Result Primitives

**Files:**
- Create: `src/components/Field.tsx`
- Create: `src/components/ResultCard.tsx`
- Modify: `src/styles.css`
- Modify: `tests/ui.test.mjs`

**Interfaces:**
- Produces: `Field({ id, label, help, error, children })` and `ResultCard({ label, displayValue, copyValue, invalid, onClear, secondaryAction })`.
- `Field` applies `${id}-help` through `aria-describedby` to its single form control.
- `ResultCard` disables copy when `getCopyState(copyValue, invalidValues) === "disabled"`.

- [ ] **Step 1: Add failing primitive contract tests**

```js
test("field and result primitives expose help and copy status", async () => {
  const field = await readFile(new URL("../src/components/Field.tsx", import.meta.url), "utf8");
  const result = await readFile(new URL("../src/components/ResultCard.tsx", import.meta.url), "utf8");
  assert.match(field, /aria-describedby/);
  assert.match(field, /role="tooltip"/);
  assert.match(result, /aria-live="polite"/);
  assert.match(result, /navigator\.clipboard/);
  assert.match(result, /disabled=/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/ui.test.mjs`

Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Implement `Field` and `ResultCard`**

`Field` clones the provided input/select/textarea to add `id` and `aria-describedby`, renders a focusable info button with `aria-label`, and provides a tooltip plus screen-reader text. `ResultCard` writes only `copyValue`, catches clipboard errors, shows localized `copied` or `copyFailed`, and restores the ready state after 2000ms.

- [ ] **Step 4: Style form and result primitives**

Add 44px inputs/buttons, `.field-label-row`, `.help-trigger`, `.field-tooltip`, `.result-card`, `.result-copy`, `.copy-status`, focus-visible styles, long-result wrapping, and code-result horizontal scrolling.

- [ ] **Step 5: Run focused tests and build**

Run: `node --test tests/ui.test.mjs && npm run build`

Expected: tests pass and build exits 0.

- [ ] **Step 6: Commit the reusable primitives**

```bash
git add src/components/Field.tsx src/components/ResultCard.tsx src/styles.css tests/ui.test.mjs
git commit -m "feat: add accessible field and result components"
```

### Task 5: Unit and Text Tool Workspace Migration

**Files:**
- Create: `src/components/ToolWorkspace.tsx`
- Create: `src/tools/UnitTool.tsx`
- Create: `src/tools/TextTools.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `Field`, `ResultCard`, `swapConversion`, catalog metadata, i18n copy, and existing core functions.
- Produces: named input/output sections for unit, JSON, Base64, URL, UUID, timestamp, case, text statistics, and color tools.

- [ ] **Step 1: Add failing coverage for text outputs and swap-capable tools**

```js
test("all textual tool families use the shared result component", async () => {
  const source = await readFile(new URL("../src/tools/TextTools.tsx", import.meta.url), "utf8");
  for (const tool of ["JsonTool", "Base64Tool", "UrlTool", "UuidTool", "TimestampTool", "CaseTool", "TextTool", "ColorTool"]) {
    assert.match(source, new RegExp(`function ${tool}`));
  }
  assert.ok((source.match(/<ResultCard/g) ?? []).length >= 8);
  assert.match(source, /SwapButton/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/ui.test.mjs`

Expected: FAIL because tool-family files do not exist.

- [ ] **Step 3: Implement the workspace header and unit tools**

Create breadcrumb, 28px tool icon, title, description, and privacy badge. In `UnitTool`, render `input value`, `from unit`, `swap`, `to unit`, and `converted result` as distinct named regions. Swap the unit selectors and use the valid raw numeric output as the next input.

- [ ] **Step 4: Implement text/developer tools with named panes**

Each tool provides localized input and output labels, field help, placeholders, and copy values. Base64, URL, and timestamp expose a swap/direction action where meaningful. Word counter copies `serializeStatsResult(stats)`. UUID exposes generate and copy. QR is deferred to Task 7.

- [ ] **Step 5: Run focused tests and build**

Run: `node --test tests/ui.test.mjs && npm run build`

Expected: tests pass and build exits 0.

- [ ] **Step 6: Commit unit and text tools**

```bash
git add src/components/ToolWorkspace.tsx src/tools/UnitTool.tsx src/tools/TextTools.tsx src/App.tsx src/styles.css tests/ui.test.mjs
git commit -m "feat: redesign unit and developer tool workspaces"
```

### Task 6: Calculator Workspace Migration

**Files:**
- Create: `src/tools/CalculatorTools.tsx`
- Modify: `src/components/ToolWorkspace.tsx`
- Modify: `src/styles.css`
- Modify: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: calculator functions from `src/lib/core.js`, localized field metadata, `Field`, and `ResultCard`.
- Produces: calculator-specific inputs and a copyable named result for each calculator.

- [ ] **Step 1: Add failing calculator-contract test**

```js
test("every calculator renders a shared copyable result", async () => {
  const source = await readFile(new URL("../src/tools/CalculatorTools.tsx", import.meta.url), "utf8");
  for (const id of ["percentage", "discount", "bmi", "compound", "date"]) assert.match(source, new RegExp(`case ["']${id}["']`));
  assert.match(source, /<ResultCard/);
  assert.match(source, /financeNote/);
  assert.match(source, /healthNote/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/ui.test.mjs`

Expected: FAIL because `CalculatorTools.tsx` does not exist.

- [ ] **Step 3: Implement explicit calculator fields**

Replace generic `A/B/C` labels with tool-specific localized labels: percentage/value, original price/discount rate, weight/height, principal/rate/years, start/end date. Each calculator supplies a raw copy string and a localized display value. Preserve financial and health notices.

- [ ] **Step 4: Run focused tests and build**

Run: `node --test tests/ui.test.mjs && npm run build`

Expected: tests pass and build exits 0.

- [ ] **Step 5: Commit calculator migration**

```bash
git add src/tools/CalculatorTools.tsx src/components/ToolWorkspace.tsx src/styles.css tests/ui.test.mjs
git commit -m "feat: clarify calculator inputs and outputs"
```

### Task 7: QR Workspace, Related Tools, and Complete Visual System

**Files:**
- Create: `src/tools/QrTool.tsx`
- Modify: `src/components/ToolWorkspace.tsx`
- Modify: `src/components/Icons.tsx`
- Replace: `src/styles.css`
- Modify: `tests/smoke.test.mjs`
- Modify: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `Field`, `ResultCard`, QR validation, catalog tools, and icon names.
- Produces: QR source text copy, PNG download, related-tool links, unified design tokens, and responsive workspace rules.

- [ ] **Step 1: Add failing QR and design-system tests**

```js
test("QR exposes source copy and PNG download", async () => {
  const source = await readFile(new URL("../src/tools/QrTool.tsx", import.meta.url), "utf8");
  assert.match(source, /<ResultCard/);
  assert.match(source, /download="lite-tools-qr\.png"/);
});

test("responsive CSS defines desktop sidebar and mobile drawer", async () => {
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(css, /--sidebar-width:\s*260px/);
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /\.tool-drawer/);
  assert.match(css, /prefers-reduced-motion/);
});
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `node --test tests/ui.test.mjs tests/smoke.test.mjs`

Expected: FAIL because the QR module and final CSS contracts are missing.

- [ ] **Step 3: Implement QR input/output and related tools**

Name text/URL, size, foreground, and background inputs; provide help for each. Use `ResultCard` to copy original source text and preserve PNG download. Add up to three related tools from the same category below each workspace.

- [ ] **Step 4: Complete typography, icon, card, button, and responsive CSS**

Apply the approved system font stack, title sizes, 15px body copy, 14px buttons, 16/18/22/28px SVG icons, 44px controls, consistent 8/12/16/24/32px spacing, focus-visible rings, and the 375/768/1024/1440 responsive layout. Do not load remote assets.

- [ ] **Step 5: Run tests and build**

Run: `node --test tests/ui.test.mjs tests/smoke.test.mjs && npm run build`

Expected: tests pass and build exits 0.

- [ ] **Step 6: Commit QR and visual completion**

```bash
git add src/tools/QrTool.tsx src/components/ToolWorkspace.tsx src/components/Icons.tsx src/styles.css tests/ui.test.mjs tests/smoke.test.mjs
git commit -m "feat: complete responsive tool workspace design"
```

### Task 8: Full Verification, Browser QA, Documentation, and Branch Handoff

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Modify: `docs/product-requirements.md`
- Modify: `docs/superpowers/plans/2026-07-21-tool-workspace-ui-redesign.md`

**Interfaces:**
- Consumes: the complete implementation.
- Produces: verified documentation and a pushed feature branch; does not create a PR.

- [ ] **Step 1: Run all automated checks**

Run: `npm ci && npm run lint && npm run test && npm run build && npm run verify && npm audit`

Expected: every command exits 0; tests report 0 failures; audit reports no high or critical vulnerability.

- [ ] **Step 2: Inspect production output**

Run: `rg -n '/src/main\.tsx|localhost:' dist/index.html && exit 1 || true; rg -n '/assets/' dist/index.html`

Expected: no source/development references; at least one `/assets/` reference.

- [ ] **Step 3: Run browser QA at four widths**

Start `npm run dev -- --host 127.0.0.1`. Verify 375px, 768px, 1024px, and 1440px for:

- Sidebar/drawer open, close, category expansion, and active state.
- English, Simplified Chinese, and Traditional Chinese labels without overflow.
- Length conversion swap and copy.
- JSON input/output naming and copy.
- Calculator-specific labels and copy.
- QR input copy and PNG download presence.
- Console has no errors and no user input is sent over the network.

- [ ] **Step 4: Update project documentation**

Document the app shell, shared components, field-help behavior, copy rules, responsive breakpoints, local privacy behavior, and exact verification commands. Do not include private task text or business planning.

- [ ] **Step 5: Re-run final verification after docs**

Run: `npm run verify && git diff --check && git status --short`

Expected: verification exits 0; no whitespace errors; only intended tracked files are modified.

- [ ] **Step 6: Commit the verified documentation**

```bash
git add README.md docs/architecture.md docs/product-requirements.md docs/superpowers/plans/2026-07-21-tool-workspace-ui-redesign.md
git commit -m "docs: document redesigned tool workspace"
```

- [ ] **Step 7: Push branch and prepare the approval package**

Run: `git push -u origin feat/ui-workspace-redesign`

Report branch, commits, changed files, check results, browser QA, screenshots, deployment risk, and a concise Draft PR title/body. Stop and ask: `是否批准创建以上 GitHub Pull Request？`
