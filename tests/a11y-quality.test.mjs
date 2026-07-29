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
