export const QR_QUIET_ZONE = 4;
export const LOGO_SIZE_RATIOS = { small: 0.12, medium: 0.16, large: 0.2 };
const ALLOWED_LOGO_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function validateLogoMetadata({ type, size, width, height }) {
  if (!ALLOWED_LOGO_TYPES.has(type)) return { ok: false, reason: "type" };
  if (!Number.isFinite(size) || size <= 0 || size > 2_000_000) return { ok: false, reason: "file-size" };
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 2048 || height > 2048 || width * height > 4_194_304) {
    return { ok: false, reason: "dimensions" };
  }
  return { ok: true };
}

export function effectiveErrorCorrection(selected, hasLogo) {
  return hasLogo ? "H" : selected;
}

function luminance(color) {
  if (!HEX_COLOR.test(color)) return 0;
  const channels = [1, 3, 5].map(index => Number.parseInt(color.slice(index, index + 2), 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function privateHash(value) {
  let hash = 0x811c9dc5;
  for (const byte of new globalThis.TextEncoder().encode(String(value))) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

export function qrStyleGenerationKey(settings) {
  return JSON.stringify([
    privateHash(settings.input),
    settings.size,
    settings.dark,
    settings.light,
    settings.errorCorrection,
    settings.moduleShape,
    settings.finderFrameShape,
    settings.finderCenterShape,
    settings.logoRevision,
    settings.logoSize,
    settings.logoPadding,
  ]);
}

const inFinder = (row, column, count) => (
  (row < 7 && column < 7)
  || (row < 7 && column >= count - 7)
  || (row >= count - 7 && column < 7)
);

function moduleElement(shape, x, y, color) {
  if (shape === "dot") return `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.46" fill="${color}"/>`;
  const radius = shape === "rounded" ? 0.28 : 0;
  return `<rect x="${x}" y="${y}" width="1" height="1" rx="${radius}" fill="${color}"/>`;
}

function finderElement(x, y, frameShape, centerShape, dark, light) {
  const frameRadius = frameShape === "rounded" ? 1 : 0;
  const outer = `<rect x="${x}" y="${y}" width="7" height="7" rx="${frameRadius}" fill="${dark}"/>`;
  const inner = `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="${frameRadius ? 0.65 : 0}" fill="${light}"/>`;
  const center = centerShape === "dot"
    ? `<circle cx="${x + 3.5}" cy="${y + 3.5}" r="1.5" fill="${dark}"/>`
    : `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="${dark}"/>`;
  return outer + inner + center;
}

export function createStyledQrSvg(matrix, options) {
  const count = matrix.size;
  const total = count + QR_QUIET_ZONE * 2;
  const moduleShape = ["square", "rounded", "dot"].includes(options.moduleShape) ? options.moduleShape : "square";
  const frameShape = options.finderFrameShape === "rounded" ? "rounded" : "square";
  const centerShape = options.finderCenterShape === "dot" ? "dot" : "square";
  const dark = HEX_COLOR.test(options.dark) ? options.dark : "#000000";
  const light = HEX_COLOR.test(options.light) ? options.light : "#ffffff";
  const elements = [`<rect width="${total}" height="${total}" fill="${light}"/>`];

  for (let row = 0; row < count; row += 1) {
    for (let column = 0; column < count; column += 1) {
      if (!matrix.get(row, column) || inFinder(row, column, count)) continue;
      elements.push(moduleElement(moduleShape, column + QR_QUIET_ZONE, row + QR_QUIET_ZONE, dark));
    }
  }
  for (const [x, y] of [[0, 0], [count - 7, 0], [0, count - 7]]) {
    elements.push(finderElement(x + QR_QUIET_ZONE, y + QR_QUIET_ZONE, frameShape, centerShape, dark, light));
  }

  const logo = options.logo;
  if (logo && /^data:image\/(?:png|jpeg|webp);base64,/i.test(logo.dataUrl)) {
    const ratio = LOGO_SIZE_RATIOS[logo.size] ?? LOGO_SIZE_RATIOS.medium;
    const box = count * ratio;
    const x = (total - box) / 2;
    const y = (total - box) / 2;
    const padding = logo.padding ? Math.max(0.6, box * 0.08) : 0;
    if (padding) {
      elements.push(`<rect x="${x - padding}" y="${y - padding}" width="${box + padding * 2}" height="${box + padding * 2}" rx="0.6" fill="${light}"/>`);
    }
    elements.push(`<image href="${logo.dataUrl}" x="${x}" y="${y}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" viewBox="0 0 ${total} ${total}" data-quiet-zone="${QR_QUIET_ZONE}" data-module-shape="${moduleShape}" data-finder-frame="${frameShape}" data-finder-center="${centerShape}"${logo ? ` data-logo-ratio="${LOGO_SIZE_RATIOS[logo.size] ?? LOGO_SIZE_RATIOS.medium}"` : ""}>${elements.join("")}</svg>`;
}
