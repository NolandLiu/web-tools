import { useState } from "react";
import { Field } from "../components/Field";
import { ResultCard } from "../components/ResultCard";
import { SwapButton } from "../components/SwapButton";
import { fieldText, messages } from "../i18n";
import {
  base64Decode, base64Encode, changeCase, dateToTimestamp, formatJson, hexToRgb,
  generateUuidV4, rgbToHex, rgbToHsl, textStats, timestampToDate, urlTransform,
} from "../lib/core.js";
import { serializeStatsResult } from "../lib/ui.js";
import type { Lang } from "../types";

const local = (lang: Lang, en: string, zhCN: string, zhTW: string) => lang === "en" ? en : lang === "zh-CN" ? zhCN : zhTW;

function TextLayout({ lang, input, setInput, output, error, notice, inputLabel, inputHelp, placeholder, controls }: {
  lang: Lang; input: string; setInput: (value: string) => void; output: string; error?: boolean;
  notice?: string; inputLabel: string; inputHelp: string; placeholder: string; controls?: React.ReactNode;
}) {
  const t = messages[lang];
  return (
    <div className="text-tool-layout">
      <section className="input-panel"><h3>{t.input}</h3>{controls}<Field id="text-input" label={inputLabel} help={inputHelp} lang={lang} error={error ? output : undefined}><textarea value={input} placeholder={placeholder} onChange={event => setInput(event.target.value)} rows={9} /></Field>{notice && <p className="helper-note" role="status">{notice}</p>}</section>
      <ResultCard label={t.output} displayValue={output || "—"} copyValue={error ? "" : output} invalidValues={[t.invalid]} lang={lang} code onClear={() => setInput("")} />
    </div>
  );
}

function ModeButtons({ lang, mode, onChange, left, right }: { lang: Lang; mode: string; onChange: (mode: string) => void; left: [string, string]; right: [string, string] }) {
  const swap = () => onChange(mode === left[0] ? right[0] : left[0]);
  return <div className="mode-row"><div className="segmented"><button type="button" aria-pressed={mode === left[0]} className={mode === left[0] ? "active" : ""} onClick={() => onChange(left[0])}>{left[1]}</button><button type="button" aria-pressed={mode === right[0]} className={mode === right[0] ? "active" : ""} onClick={() => onChange(right[0])}>{right[1]}</button></div><SwapButton lang={lang} onClick={swap} /></div>;
}

export function JsonTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState('{"hello":"world"}');
  const [mode, setMode] = useState("pretty");
  const result = formatJson(input, mode);
  const copy = fieldText.json[lang];
  const error = result.ok ? "" : result.error === "empty" ? messages[lang].invalidJson : result.error === "too-large" ? messages[lang].inputTooLarge : messages[lang].invalidJson;
  return <TextLayout lang={lang} input={input} setInput={setInput} output={result.ok ? result.value : error} error={!result.ok} notice={result.ok && result.warning ? messages[lang].unsafeJsonInteger : undefined} inputLabel={copy.label} inputHelp={copy.help} placeholder={copy.placeholder} controls={<div className="segmented"><button type="button" aria-pressed={mode === "pretty"} className={mode === "pretty" ? "active" : ""} onClick={() => setMode("pretty")}>{local(lang, "Format", "格式化", "格式化")}</button><button type="button" aria-pressed={mode === "minify"} className={mode === "minify" ? "active" : ""} onClick={() => setMode("minify")}>{local(lang, "Minify", "压缩", "壓縮")}</button></div>} />;
}

export function Base64Tool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("Hello 世界");
  const [mode, setMode] = useState("encode");
  const encoded = mode === "encode" ? base64Encode(input) : null;
  const decoded = mode === "decode" ? base64Decode(input) : null;
  const encodeError = encoded && typeof encoded !== "string";
  const errorCode = encodeError ? encoded.error : decoded?.ok === false ? decoded.error : "";
  const output = typeof encoded === "string"
    ? encoded
    : decoded?.ok
      ? decoded.value
      : errorCode === "too-large" ? messages[lang].inputTooLarge : messages[lang].invalidBase64;
  const copy = fieldText.text[lang];
  const hasError = Boolean(encodeError || decoded?.ok === false);
  const changeMode = (next: string) => { if (output && !hasError) setInput(output); setMode(next); };
  return <TextLayout lang={lang} input={input} setInput={setInput} output={output} error={hasError} inputLabel={copy.label} inputHelp={copy.help} placeholder={copy.placeholder} controls={<ModeButtons lang={lang} mode={mode} onChange={changeMode} left={["encode", local(lang, "Encode", "编码", "編碼")]} right={["decode", local(lang, "Decode", "解码", "解碼")]} />} />;
}

export function UrlTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("name=Lite Tools&lang=zh-CN");
  const [mode, setMode] = useState("encode");
  const result = urlTransform(input, mode);
  const copy = fieldText.text[lang];
  const changeMode = (next: string) => { if (result.ok) setInput(result.value); setMode(next); };
  return <TextLayout lang={lang} input={input} setInput={setInput} output={result.ok ? result.value : messages[lang].invalidUrlEncoding} error={!result.ok} inputLabel={local(lang, "URL text", "URL 文本", "URL 文字")} inputHelp={copy.help} placeholder={local(lang, "Enter URL text", "输入 URL 文本", "輸入 URL 文字")} controls={<ModeButtons lang={lang} mode={mode} onChange={changeMode} left={["encode", local(lang, "Encode", "编码", "編碼")]} right={["decode", local(lang, "Decode", "解码", "解碼")]} />} />;
}

export function UuidTool({ lang }: { lang: Lang }) {
  const [value, setValue] = useState<string>(() => generateUuidV4() ?? "");
  return <div className="single-result-tool"><ResultCard label="UUID v4" displayValue={value || messages[lang].uuidUnavailable} copyValue={value} lang={lang} onClear={() => setValue("")} secondaryAction={<button type="button" onClick={() => setValue(generateUuidV4() ?? "")}>{messages[lang].generate}</button>} /></div>;
}

export function TimestampTool({ lang }: { lang: Lang }) {
  const [timestamp, setTimestamp] = useState("1704067200");
  const [timestampUnit, setTimestampUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [date, setDate] = useState("2024-01-01T00:00");
  const iso = timestampToDate(timestamp, timestampUnit);
  const seconds = dateToTimestamp(date, "seconds", "local");
  const millis = dateToTimestamp(date, "milliseconds", "local");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
  const moveValues = () => {
    if (iso) {
      const instant = new Date(iso);
      const localValue = new Date(instant.getTime() - instant.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setDate(localValue);
    }
    if (seconds !== null) {
      setTimestamp(String(seconds));
      setTimestampUnit("seconds");
    }
  };
  return <div className="stacked-tools"><div className="converter-layout"><section className="input-panel"><h3>{messages[lang].input}</h3><Field id="timestamp" label={fieldText.timestamp[lang].label} help={fieldText.timestamp[lang].help} lang={lang} error={timestamp && iso === null ? messages[lang].invalid : undefined}><input inputMode="numeric" value={timestamp} placeholder={fieldText.timestamp[lang].placeholder} onChange={event => setTimestamp(event.target.value)} /></Field><Field id="timestamp-unit" label={fieldText.timestampUnit[lang].label} help={fieldText.timestampUnit[lang].help} lang={lang}><select value={timestampUnit} onChange={event => setTimestampUnit(event.target.value as "seconds" | "milliseconds")}><option value="seconds">{local(lang, "Seconds", "秒", "秒")}</option><option value="milliseconds">{local(lang, "Milliseconds", "毫秒", "毫秒")}</option></select></Field></section><ResultCard label="ISO 8601 UTC" displayValue={iso ?? messages[lang].invalid} copyValue={iso ?? ""} lang={lang} onClear={() => setTimestamp("")} /></div><SwapButton lang={lang} onClick={moveValues} /><div className="converter-layout"><section className="input-panel"><Field id="date-time" label={`${fieldText.dateTime[lang].label} (${timeZone})`} help={fieldText.dateTime[lang].help} lang={lang} error={date && seconds === null ? messages[lang].invalid : undefined}><input type="datetime-local" value={date} onChange={event => setDate(event.target.value)} /></Field></section><ResultCard label={local(lang, "Unix seconds / milliseconds", "Unix 秒／毫秒", "Unix 秒／毫秒")} displayValue={seconds === null || millis === null ? messages[lang].invalid : `${seconds} / ${millis}`} copyValue={seconds === null || millis === null ? "" : `${seconds}\n${millis}`} lang={lang} onClear={() => setDate("")} /></div></div>;
}

export function CaseTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("Lite Tools example");
  const [mode, setMode] = useState("upper");
  const output = changeCase(input, mode);
  const copy = fieldText.text[lang];
  return <TextLayout lang={lang} input={input} setInput={setInput} output={output} inputLabel={copy.label} inputHelp={copy.help} placeholder={copy.placeholder} controls={<div className="segmented">{["upper", "lower", "title", "camel"].map(item => <button type="button" key={item} aria-pressed={mode === item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>} />;
}

export function TextTool({ lang }: { lang: Lang }) {
  const [input, setInput] = useState("");
  const stats = textStats(input);
  const copy = fieldText.text[lang];
  const display = <div className="stats-grid"><div><strong>{stats.characters}</strong><span>{local(lang, "Characters", "字符", "字元")}</span></div><div><strong>{stats.words}</strong><span>{local(lang, "Words", "字词", "字詞")}</span></div><div><strong>{stats.lines}</strong><span>{local(lang, "Lines", "行数", "行數")}</span></div></div>;
  return <div className="text-tool-layout"><section className="input-panel"><h3>{messages[lang].input}</h3><Field id="word-count" label={copy.label} help={copy.help} lang={lang}><textarea value={input} placeholder={copy.placeholder} onChange={event => setInput(event.target.value)} rows={9} /></Field></section><ResultCard label={messages[lang].output} displayValue={display} copyValue={input ? serializeStatsResult(stats) : ""} lang={lang} onClear={() => setInput("")} /></div>;
}

export function ColorTool({ lang }: { lang: Lang }) {
  const [hex, setHex] = useState("#187b69");
  const [rgb, setRgb] = useState({ r: "24", g: "123", b: "105" });
  const parsed = hexToRgb(hex);
  const hexFromRgb = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgbValue = parsed ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : "";
  const combined = hexFromRgb && hsl ? `${hexFromRgb} / hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` : "";
  const copy = fieldText.color[lang];
  return <div className="stacked-tools"><div className="converter-layout"><section className="input-panel"><h3>HEX</h3><Field id="hex" label="HEX" help={copy.help} lang={lang}><input value={hex} placeholder={copy.placeholder} onChange={event => setHex(event.target.value)} /></Field></section><ResultCard label="RGB" displayValue={rgbValue || messages[lang].invalid} copyValue={rgbValue} lang={lang} onClear={() => setHex("")} /></div><div className="converter-layout"><section className="input-panel"><h3>RGB</h3><div className="rgb-fields">{(["r", "g", "b"] as const).map(channel => <Field key={channel} id={`rgb-${channel}`} label={channel.toUpperCase()} help={copy.help} lang={lang}><input type="number" min="0" max="255" value={rgb[channel]} onChange={event => setRgb({ ...rgb, [channel]: event.target.value })} /></Field>)}</div></section><ResultCard label="HEX / HSL" displayValue={combined || messages[lang].invalid} copyValue={combined} lang={lang} onClear={() => setRgb({ r: "", g: "", b: "" })} /></div></div>;
}
