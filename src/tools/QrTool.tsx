import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { fieldText, messages } from "../i18n";
import { validateQrInput } from "../lib/core.js";
import {
  contrastRatio,
  createStyledQrSvg,
  effectiveErrorCorrection,
  qrStyleGenerationKey,
  validateLogoMetadata,
} from "../lib/qr-style.js";
import type { Lang } from "../types";

type ErrorCorrection = "L" | "M" | "Q" | "H";
type ModuleShape = "square" | "rounded" | "dot";
type FrameShape = "square" | "rounded";
type CenterShape = "square" | "dot";
type LogoSize = "small" | "medium" | "large";
type Logo = { dataUrl: string; width: number; height: number; revision: number };

const copy = {
  en: {
    correction: "Error correction", correctionHelp: "A local logo automatically uses level H.", module: "Module shape",
    frame: "Finder frame", center: "Finder center", square: "Square", rounded: "Rounded", dot: "Dot",
    logo: "Local logo", logoHelp: "PNG, JPEG, or WebP; up to 2 MB and 2048 × 2048 pixels.", removeLogo: "Remove logo",
    logoSize: "Logo size", small: "Small (12%)", medium: "Medium (16%)", large: "Large (20%)", padding: "Add solid logo backing",
    logoType: "Choose a PNG, JPEG, or WebP image.", logoFileSize: "The logo must not exceed 2 MB.",
    logoDimensions: "The logo must not exceed 2048 × 2048 pixels.", logoDecode: "The image could not be decoded.",
    contrast: "Choose foreground and background colors with stronger contrast.", preview: "Styled QR Code preview with current local settings",
  },
  "zh-CN": {
    correction: "纠错级别", correctionHelp: "添加本地 Logo 后自动使用 H 级纠错。", module: "模块形状",
    frame: "定位框形状", center: "定位点中心", square: "方形", rounded: "圆角", dot: "圆点",
    logo: "本地 Logo", logoHelp: "支持 PNG、JPEG 或 WebP；不超过 2 MB 和 2048 × 2048 像素。", removeLogo: "移除 Logo",
    logoSize: "Logo 尺寸", small: "小（12%）", medium: "中（16%）", large: "大（20%）", padding: "添加实色 Logo 留白",
    logoType: "请选择 PNG、JPEG 或 WebP 图片。", logoFileSize: "Logo 文件不得超过 2 MB。",
    logoDimensions: "Logo 尺寸不得超过 2048 × 2048 像素。", logoDecode: "无法解码该图片。",
    contrast: "请选择对比度更高的前景色和背景色。", preview: "使用当前本地设置生成的美化二维码预览",
  },
  "zh-TW": {
    correction: "錯誤修正等級", correctionHelp: "加入本機 Logo 後自動使用 H 級錯誤修正。", module: "模組形狀",
    frame: "定位框形狀", center: "定位點中心", square: "方形", rounded: "圓角", dot: "圓點",
    logo: "本機 Logo", logoHelp: "支援 PNG、JPEG 或 WebP；不超過 2 MB 及 2048 × 2048 像素。", removeLogo: "移除 Logo",
    logoSize: "Logo 尺寸", small: "小（12%）", medium: "中（16%）", large: "大（20%）", padding: "加入實色 Logo 留白",
    logoType: "請選擇 PNG、JPEG 或 WebP 圖片。", logoFileSize: "Logo 檔案不得超過 2 MB。",
    logoDimensions: "Logo 尺寸不得超過 2048 × 2048 像素。", logoDecode: "無法解碼該圖片。",
    contrast: "請選擇對比度更高的前景色及背景色。", preview: "使用目前本機設定產生的美化 QR Code 預覽",
  },
} as const;

function svgToPng(svg: string, size: number) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.drawImage(image, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("SVG rendering failed"));
    };
    image.src = objectUrl;
  });
}

export function QrTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("https://example.com");
  const [size, setSize] = useState("256");
  const [dark, setDark] = useState("#14201d");
  const [light, setLight] = useState("#ffffff");
  const [selectedCorrection, setSelectedCorrection] = useState<ErrorCorrection>("M");
  const [moduleShape, setModuleShape] = useState<ModuleShape>("square");
  const [finderFrameShape, setFinderFrameShape] = useState<FrameShape>("square");
  const [finderCenterShape, setFinderCenterShape] = useState<CenterShape>("square");
  const [logo, setLogo] = useState<Logo | null>(null);
  const [logoSize, setLogoSize] = useState<LogoSize>("medium");
  const [logoPadding, setLogoPadding] = useState(true);
  const [logoError, setLogoError] = useState("");
  const [result, setResult] = useState({ key: "", dataUrl: "", failed: false });
  const uploadRevision = useRef(0);
  const validation = validateQrInput(input);
  const t = messages[lang];
  const q = copy[lang];
  const actualCorrection = effectiveErrorCorrection(selectedCorrection, Boolean(logo));
  const readableContrast = contrastRatio(dark, light) >= 3;
  const generationKey = useMemo(() => qrStyleGenerationKey({
    input, size: Number(size), dark, light, errorCorrection: actualCorrection, moduleShape,
    finderFrameShape, finderCenterShape, logoRevision: logo?.revision ?? 0, logoSize, logoPadding,
  }), [actualCorrection, dark, finderCenterShape, finderFrameShape, input, light, logo?.revision, logoPadding, logoSize, moduleShape, size]);

  useEffect(() => {
    if (!validation.ok || !readableContrast) return;
    let active = true;
    void Promise.resolve()
      .then(() => {
        const matrix = QRCode.create(input, { errorCorrectionLevel: actualCorrection }).modules;
        return createStyledQrSvg(matrix, {
          size: Number(size), dark, light, moduleShape, finderFrameShape, finderCenterShape,
          logo: logo ? { ...logo, size: logoSize, padding: logoPadding } : null,
        });
      })
      .then(svg => svgToPng(svg, Number(size)))
      .then(dataUrl => { if (active) setResult({ key: generationKey, dataUrl, failed: false }); })
      .catch(() => { if (active) setResult({ key: generationKey, dataUrl: "", failed: true }); });
    return () => { active = false; };
  }, [actualCorrection, dark, finderCenterShape, finderFrameShape, generationKey, input, light, logo, logoPadding, logoSize, moduleShape, readableContrast, size, validation.ok]);

  const handleLogo = (file: File | undefined) => {
    const revision = uploadRevision.current + 1;
    uploadRevision.current = revision;
    setLogo(null);
    setLogoError("");
    if (!file) return;
    const preliminary = validateLogoMetadata({ type: file.type, size: file.size, width: 1, height: 1 });
    if (!preliminary.ok) {
      setLogoError(preliminary.reason === "type" ? q.logoType : q.logoFileSize);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => { if (uploadRevision.current === revision) setLogoError(q.logoDecode); };
    reader.onload = () => {
      if (uploadRevision.current !== revision || typeof reader.result !== "string") return;
      const image = new Image();
      image.onerror = () => { if (uploadRevision.current === revision) setLogoError(q.logoDecode); };
      image.onload = () => {
        if (uploadRevision.current !== revision) return;
        const checked = validateLogoMetadata({ type: file.type, size: file.size, width: image.naturalWidth, height: image.naturalHeight });
        if (!checked.ok) {
          setLogoError(q.logoDimensions);
          return;
        }
        setLogo({ dataUrl: reader.result as string, width: image.naturalWidth, height: image.naturalHeight, revision });
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    uploadRevision.current += 1;
    setLogo(null);
    setLogoError("");
  };
  const error = !validation.ok ? (validation.error === "tooLarge" ? t.qrTooLong : t.qrEmpty) : !readableContrast ? q.contrast : undefined;
  const currentResult = result.key === generationKey ? result : undefined;
  const visibleDataUrl = validation.ok && readableContrast && !currentResult?.failed ? currentResult?.dataUrl ?? "" : "";
  const previewMessage = error ?? (currentResult?.failed ? t.qrGenerationFailed : "");

  return (
    <div className="qr-layout">
      <section className="input-panel">
        <h3>{t.input}</h3>
        <Field id="qr-input" label={fieldText.qr[lang].label} help={fieldText.qr[lang].help} lang={lang} error={error}>
          <textarea value={input} placeholder={fieldText.qr[lang].placeholder} onChange={event => setInput(event.target.value)} rows={5} />
        </Field>
        <div className="qr-options">
          <Field id="qr-size" label={fieldText.size[lang].label} help={fieldText.size[lang].help} lang={lang}>
            <select value={size} onChange={event => setSize(event.target.value)}><option>192</option><option>256</option><option>320</option><option>512</option></select>
          </Field>
          <Field id="qr-correction" label={q.correction} help={q.correctionHelp} lang={lang}>
            <select value={actualCorrection} disabled={Boolean(logo)} onChange={event => setSelectedCorrection(event.target.value as ErrorCorrection)}>
              {["L", "M", "Q", "H"].map(level => <option key={level}>{level}</option>)}
            </select>
          </Field>
          <Field id="qr-dark" label={fieldText.foreground[lang].label} help={fieldText.foreground[lang].help} lang={lang}><input type="color" value={dark} onChange={event => setDark(event.target.value)} /></Field>
          <Field id="qr-light" label={fieldText.background[lang].label} help={fieldText.background[lang].help} lang={lang}><input type="color" value={light} onChange={event => setLight(event.target.value)} /></Field>
          <Field id="qr-module-shape" label={q.module} help={q.module} lang={lang}>
            <select value={moduleShape} onChange={event => setModuleShape(event.target.value as ModuleShape)}><option value="square">{q.square}</option><option value="rounded">{q.rounded}</option><option value="dot">{q.dot}</option></select>
          </Field>
          <Field id="qr-frame-shape" label={q.frame} help={q.frame} lang={lang}>
            <select value={finderFrameShape} onChange={event => setFinderFrameShape(event.target.value as FrameShape)}><option value="square">{q.square}</option><option value="rounded">{q.rounded}</option></select>
          </Field>
          <Field id="qr-center-shape" label={q.center} help={q.center} lang={lang}>
            <select value={finderCenterShape} onChange={event => setFinderCenterShape(event.target.value as CenterShape)}><option value="square">{q.square}</option><option value="dot">{q.dot}</option></select>
          </Field>
        </div>
        <Field id="qr-logo" label={q.logo} help={q.logoHelp} lang={lang} error={logoError || undefined}>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => handleLogo(event.target.files?.[0])} />
        </Field>
        {logo && <>
          <div className="qr-options">
            <Field id="qr-logo-size" label={q.logoSize} help={q.logoHelp} lang={lang}>
              <select value={logoSize} onChange={event => setLogoSize(event.target.value as LogoSize)}><option value="small">{q.small}</option><option value="medium">{q.medium}</option><option value="large">{q.large}</option></select>
            </Field>
          </div>
          <label className="checkbox-row"><input type="checkbox" checked={logoPadding} onChange={event => setLogoPadding(event.target.checked)} /> {q.padding}</label>
          <button type="button" className="button-secondary" onClick={removeLogo}>{q.removeLogo}</button>
        </>}
        <ResultCard label={t.sourceText} displayValue={input || "—"} copyValue={validation.ok ? input : ""} lang={lang} code onClear={() => setInput("")} />
      </section>
      <section className="qr-preview" aria-label={t.output} aria-live="polite">
        {visibleDataUrl ? <><img src={visibleDataUrl} alt={t.qrAlt} aria-description={q.preview} /><a className="button-primary" href={visibleDataUrl} download="lite-tools-qr.png">{t.download}</a></> : <p>{previewMessage}</p>}
      </section>
    </div>
  );
}
