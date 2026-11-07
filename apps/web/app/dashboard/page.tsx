"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type RecentEvent = {
  id: string;
  source: string;
  label: string;
  amount: number;
  ts: number;
};

type Summary = {
  today: number;
  total: number;
  count: number;
  recent: RecentEvent[];
};

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAmountRef = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let es: EventSource | null = null;

    (async () => {
      const me = await fetch("/api/me");
      if (me.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!me.ok) {
        setError("API injoignable. Démarrez le serveur FastAPI (pnpm dev / npm run dev).");
        return;
      }
      setAuthed(true);

      // flux temps réel (SSE via le proxy Next -> FastAPI)
      es = new EventSource("/api/earnings/stream");
      es.onmessage = (ev) => {
        const data: Summary = JSON.parse(ev.data);
        if (data.total !== lastAmountRef.current && lastAmountRef.current !== null) {
          setFlash(true);
          setTimeout(() => setFlash(false), 700);
        }
        lastAmountRef.current = data.total;
        setSummary(data);
      };
      es.onerror = () => {
        es?.close();
        setError("Connexion temps réel perdue.");
      };
    })();

    return () => es?.close();
  }, []);

  if (!authed && !error) {
    return <p className="muted">Vérification de la session…</p>;
  }

  if (error) {
    return (
      <main>
        <div className="card">
          <h2>Tableau de bord</h2>
          <p className="error-text">{error}</p>
          <Link href="/login" className="btn secondary">
            Se reconnecter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>
          <span className="live-dot" /> Revenus en temps réel
        </h2>
        <button
          className="btn secondary"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          Déconnexion
        </button>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="kpi-label">Gains aujourd&apos;hui</div>
          <div className="kpi" style={{ color: "#6ee7b7" }}>
            {summary ? euro.format(summary.today) : "…"}
          </div>
          <div className="muted">{summary ? `${summary.count} transactions cumulées (7 j)` : ""}</div>
        </div>

        <div className="card" style={flash ? { borderColor: "#6ee7b7" } : undefined}>
          <div className="kpi-label">Total (7 derniers jours)</div>
          <div className="kpi" style={flash ? { color: "#6ee7b7" } : undefined}>
            {summary ? euro.format(summary.total) : "…"}
          </div>
          <div className="muted">Mise à jour à la seconde — flux SSE</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Dernières transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>Source</th>
              <th className="num">Montant</th>
            </tr>
          </thead>
          <tbody>
            {summary?.recent.map((e) => (
              <tr key={e.id}>
                <td>{timeFmt.format(new Date(e.ts * 1000))}</td>
                <td>{e.label}</td>
                <td className="num" style={{ color: "#6ee7b7" }}>
                  +{euro.format(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: 10 }}>
          Données de démonstration générées par la simulation Python. En
          production, brancher AdSense/Ezoic + Stripe (webhooks) à la place.
        </p>
      </div>
    </main>
  );
}
