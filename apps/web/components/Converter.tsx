"use client";

import { useCallback, useRef, useState } from "react";
import { getEngine } from "@/lib/engine";

type Status = "idle" | "converting" | "done" | "error";

export default function Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("webp");
  const [status, setStatus] = useState<Status>("idle");
  const [engineName, setEngineName] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((f: File | null) => {
    setFile(f);
    setStatus("idle");
    setError(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  }, [resultUrl]);

  const convert = useCallback(async () => {
    if (!file) return;
    setStatus("converting");
    setError(null);
    try {
      const engine = await getEngine();
      setEngineName(engine.name);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = await engine.convert(bytes, target);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, [file, target, resultUrl]);

  return (
    <section className="card" aria-label="Convertisseur">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pickFile(e.dataTransfer.files?.[0] ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed #374151",
          borderRadius: 12,
          padding: "34px 20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          hidden
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div>
            <div style={{ fontWeight: 600 }}>{file.name}</div>
            <div className="muted">{(file.size / 1024).toFixed(0)} Ko</div>
          </div>
        ) : (
          <div className="muted">
            Déposez une image ici, ou cliquez pour choisir un fichier
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label className="muted" htmlFor="target">
          Format de sortie
        </label>
        <select
          id="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{
            background: "#0b0f17", color: "#e6e9f0", border: "1px solid #374151",
            borderRadius: 8, padding: "8px 10px",
          }}
        >
          <option value="webp">WebP</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>

        <button className="btn" onClick={convert} disabled={!file || status === "converting"}>
          {status === "converting" ? "Conversion…" : "Convertir"}
        </button>

        {resultUrl && (
          <a className="btn secondary" href={resultUrl} download={`${file!.name.split(".")[0]}.${target}`}>
            Télécharger
          </a>
        )}

        {engineName && <span className="badge">Moteur : {engineName}</span>}
      </div>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
