"use client";

import { useCallback, useRef, useState } from "react";
import { runTool, type ToolResult } from "@/lib/pdfTools";
import type { OptionDef, ToolDef } from "@/lib/tools";
import type { Locale } from "@/lib/tools";
import { UI } from "@/lib/ui";

/** Outils serveur : upload -> conversion à la volée -> fichier supprimé. */
async function convertOnServer(file: File): Promise<ToolResult> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/office/convert", { method: "POST", body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Erreur serveur (${res.status})`);
  }
  const blob = await res.blob();
  return {
    filename: file.name.replace(/\.[^.]+$/, "") + ".pdf",
    blob,
    note: "Fichier source supprimé immédiatement après conversion (traitement à la volée).",
  };
}

export default function PdfToolRunner({ tool, locale }: { tool: ToolDef; locale: Locale }) {
  const t = UI[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      tool.options.map((o) => {
        const raw = o.default;
        return [o.id, raw != null ? String(raw) : ""] as [string, string];
      }),
    ),
  );
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMulti = tool.input !== "single";
  const accept = tool.accept ?? (tool.input === "multiple-images" ? "image/png,image/jpeg" : "application/pdf,.pdf");

  const setOption = (id: string, value: string) =>
    setOptions((prev) => ({ ...prev, [id]: value }));

  const pick = useCallback((list: FileList | null) => {
    setFiles(list ? Array.from(list) : []);
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  const execute = useCallback(async () => {
    setStatus("running");
    setError(null);
    setResult(null);
    try {
      if (files.length === 0) throw new Error(t.pickFirst);
      const res = tool.server ? await convertOnServer(files[0]) : await runTool(tool, files, options);
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, [tool, files, options, t.pickFirst]);

  const dropText =
    tool.input === "multiple-images" ? t.dropImages : isMulti ? t.dropMulti : t.dropSingle;

  return (
    <section className="card" aria-label={tool.name}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={isMulti}
          hidden
          onChange={(e) => pick(e.target.files)}
        />
        {files.length === 0 ? (
          <div className="muted">{dropText}</div>
        ) : (
          <div>
            <div style={{ fontWeight: 600 }}>
              {files.length === 1 ? files[0].name : `${files.length} ${t.files}`}
            </div>
            <div className="muted">
              {files.length === 1
                ? `${(files[0].size / 1024).toFixed(0)} KO`
                : files.map((f) => f.name).join(", ")}
            </div>
          </div>
        )}
      </div>

      {tool.options.length > 0 && (
        <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
          {tool.options.map((o) => (
            <OptionInput
              key={o.id}
              def={o}
              locale={locale}
              value={options[o.id] ?? ""}
              onChange={setOption}
            />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={execute} disabled={files.length === 0 || status === "running"}>
          {status === "running" ? t.running : t.launch}
        </button>

        {result && (
          <a className="btn secondary" href={URL.createObjectURL(result.blob)} download={result.filename}>
            <i className="bi bi-download" aria-hidden="true" /> {t.download} · {result.filename}
          </a>
        )}
        <span className="badge">{tool.server ? t.badgeServer : t.badgeLocal}</span>
      </div>

      {result?.note && <p className="muted" style={{ marginTop: 10 }}>{result.note}</p>}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}

function OptionInput({
  def,
  locale,
  value,
  onChange,
}: {
  def: OptionDef;
  locale: Locale;
  value: string;
  onChange: (id: string, value: string) => void;
}) {
  const en = locale === "en";
  const style: React.CSSProperties = {
    background: "#0b0f17",
    color: "#e6e9f0",
    border: "1px solid #374151",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
  };

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="muted" style={{ fontSize: 12 }}>{en ? def.labelEn ?? def.label : def.label}</span>

      {(def.kind === "text" || def.kind === "pages" || def.kind === "password") && (
        <input
          style={style}
          type={def.kind === "password" ? "password" : "text"}
          value={value}
          placeholder={def.placeholder}
          onChange={(e) => onChange(def.id, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      )}

      {def.kind === "select" && def.choices && (
        <select style={style} value={value || def.default || ""} onChange={(e) => onChange(def.id, e.target.value)}>
          {def.choices.map((c) => (
            <option key={c.value} value={c.value}>
              {en ? c.labelEn ?? c.label : c.label}
            </option>
          ))}
        </select>
      )}

      {def.kind === "range" && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="range"
            min={def.min ?? 0}
            max={def.max ?? 100}
            step={def.step ?? 1}
            value={value || def.default || ""}
            onChange={(e) => onChange(def.id, e.target.value)}
            style={{ flex: 1 }}
          />
          <span className="muted" style={{ minWidth: 48 }}>
            {value || def.default}{def.suffix ?? ""}
          </span>
        </div>
      )}
    </label>
  );
}
