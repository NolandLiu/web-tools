import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { fieldText, messages } from "../i18n";
import { createQrGenerationKey, validateQrInput } from "../lib/core.js";
import type { Lang } from "../types";

export function QrTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("https://example.com");
  const [size, setSize] = useState("256");
  const [dark, setDark] = useState("#14201d");
  const [light, setLight] = useState("#ffffff");
  const [result, setResult] = useState({ key: "", dataUrl: "", failed: false });
  const validation = validateQrInput(input);
  const t = messages[lang];
  const generationKey = createQrGenerationKey(input, size, dark, light);

  useEffect(() => {
    if (!validation.ok) return;
    let active = true;
    void QRCode.toDataURL(input, { width: Number(size), margin: 2, color: { dark, light } })
      .then(value => { if (active) setResult({ key: generationKey, dataUrl: value, failed: false }); })
      .catch(() => { if (active) setResult({ key: generationKey, dataUrl: "", failed: true }); });
    return () => { active = false; };
  }, [dark, generationKey, input, light, size, validation.ok]);

  const error = validation.ok ? undefined : validation.error === "tooLarge" ? t.qrTooLong : t.qrEmpty;
  const currentResult = result.key === generationKey ? result : undefined;
  const visibleDataUrl = validation.ok && !currentResult?.failed ? currentResult?.dataUrl ?? "" : "";
  const previewMessage = error ?? (currentResult?.failed ? t.qrGenerationFailed : "");
  return <div className="qr-layout"><section className="input-panel"><h3>{t.input}</h3><Field id="qr-input" label={fieldText.qr[lang].label} help={fieldText.qr[lang].help} lang={lang} error={error}><textarea value={input} placeholder={fieldText.qr[lang].placeholder} onChange={event => setInput(event.target.value)} rows={5} /></Field><div className="qr-options"><Field id="qr-size" label={fieldText.size[lang].label} help={fieldText.size[lang].help} lang={lang}><select value={size} onChange={event => setSize(event.target.value)}><option>192</option><option>256</option><option>320</option><option>512</option></select></Field><Field id="qr-dark" label={fieldText.foreground[lang].label} help={fieldText.foreground[lang].help} lang={lang}><input type="color" value={dark} onChange={event => setDark(event.target.value)} /></Field><Field id="qr-light" label={fieldText.background[lang].label} help={fieldText.background[lang].help} lang={lang}><input type="color" value={light} onChange={event => setLight(event.target.value)} /></Field></div><ResultCard label={t.sourceText} displayValue={input || "—"} copyValue={validation.ok ? input : ""} lang={lang} code onClear={() => setInput("")} /></section><section className="qr-preview" aria-label={t.output} aria-live="polite">{visibleDataUrl ? <><img src={visibleDataUrl} alt={t.qrAlt} /><a className="button-primary" href={visibleDataUrl} download="lite-tools-qr.png">{t.download}</a></> : <p>{previewMessage}</p>}</section></div>;
}
