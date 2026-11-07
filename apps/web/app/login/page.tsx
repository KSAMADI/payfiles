"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [channel, setChannel] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function requestOtp() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      const data = await res.json();
      setSent(true);
      setDevCode(data.dev_code ?? null); // affiché uniquement en mode dev
    } catch {
      setError("Impossible de contacter le serveur. L'API tourne-t-elle ?");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, channel }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? "Code incorrect");
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card">
        <h2 style={{ margin: "0 0 6px" }}>Connexion par code à usage unique</h2>
        <p className="muted" style={{ margin: "0 0 20px" }}>
          Accédez à votre tableau de bord de revenus. Aucun mot de passe.
        </p>

        {!sent ? (
          <>
            <input
              placeholder="Email ou téléphone"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={inputStyle}
            />
            <button className="btn" onClick={requestOtp} disabled={busy}>
              {busy ? "Envoi…" : "Recevoir mon code"}
            </button>
          </>
        ) : (
          <>
            {devCode && (
              <p className="muted">
                Mode développement — code : <strong>{devCode}</strong>
              </p>
            )}
            <input
              placeholder="Code à 6 chiffres"
              value={code}
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              style={{ ...inputStyle, letterSpacing: 8, textAlign: "center", fontSize: 20 }}
              onKeyDown={(e) => e.key === "Enter" && code.length === 6 && verifyOtp()}
            />
            <button className="btn" onClick={verifyOtp} disabled={busy || code.length < 6}>
              {busy ? "Vérification…" : "Valider"}
            </button>
          </>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", marginBottom: 12, padding: "11px 12px",
  background: "#0b0f17", border: "1px solid #374151", borderRadius: 10,
  color: "#e6e9f0", fontSize: 14,
};
