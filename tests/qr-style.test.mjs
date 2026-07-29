import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";
import {
  contrastRatio,
  createStyledQrSvg,
  effectiveErrorCorrection,
  qrStyleGenerationKey,
  validateLogoMetadata,
} from "../src/lib/qr-style.js";

test("logo validation accepts local raster formats within explicit limits", () => {
  for (const type of ["image/png", "image/jpeg", "image/webp"]) {
    assert.deepEqual(validateLogoMetadata({ type, size: 2_000_000, width: 2048, height: 2048 }), { ok: true });
  }
  assert.equal(validateLogoMetadata({ type: "image/svg+xml", size: 100, width: 20, height: 20 }).reason, "type");
  assert.equal(validateLogoMetadata({ type: "image/png", size: 2_000_001, width: 20, height: 20 }).reason, "file-size");
  assert.equal(validateLogoMetadata({ type: "image/png", size: 100, width: 2049, height: 20 }).reason, "dimensions");
  assert.equal(validateLogoMetadata({ type: "image/png", size: 100, width: 2048, height: 2048 }).ok, true);
  assert.equal(validateLogoMetadata({ type: "image/png", size: 100, width: 2048, height: 2049 }).reason, "dimensions");
});

test("logo forces H correction while removal restores the selected level", () => {
  assert.equal(effectiveErrorCorrection("M", false), "M");
  assert.equal(effectiveErrorCorrection("L", true), "H");
  assert.equal(effectiveErrorCorrection("Q", true), "H");
});

test("contrast guard distinguishes readable and unsafe color pairs", () => {
  assert.ok(contrastRatio("#000000", "#ffffff") > 20);
  assert.ok(contrastRatio("#777777", "#888888") < 2);
});

test("styled SVG preserves four-module quiet zone and controlled presets", () => {
  const matrix = QRCode.create("中文 😀", { errorCorrectionLevel: "H" }).modules;
  const svg = createStyledQrSvg(matrix, {
    size: 256,
    dark: "#000000",
    light: "#ffffff",
    moduleShape: "dot",
    finderFrameShape: "rounded",
    finderCenterShape: "dot",
    logo: {
      dataUrl: "data:image/png;base64,AA==",
      width: 2,
      height: 1,
      size: "large",
      padding: true,
    },
  });
  assert.match(svg, /viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /data-quiet-zone="4"/);
  assert.match(svg, /data-module-shape="dot"/);
  assert.match(svg, /data-finder-frame="rounded"/);
  assert.match(svg, /data-finder-center="dot"/);
  assert.match(svg, /preserveAspectRatio="xMidYMid meet"/);
  assert.match(svg, /data-logo-ratio="0.2"/);
  assert.doesNotMatch(svg, /<script|href="https?:\/\//);
});

test("generation keys include every output-affecting setting without logo contents", () => {
  const base = {
    input: "private",
    size: 256,
    dark: "#000000",
    light: "#ffffff",
    errorCorrection: "M",
    moduleShape: "square",
    finderFrameShape: "square",
    finderCenterShape: "square",
    logoRevision: 1,
    logoSize: "medium",
    logoPadding: true,
  };
  assert.equal(qrStyleGenerationKey(base), qrStyleGenerationKey({ ...base }));
  assert.notEqual(qrStyleGenerationKey(base), qrStyleGenerationKey({ ...base, moduleShape: "dot" }));
  assert.doesNotMatch(qrStyleGenerationKey(base), /private/);
});
