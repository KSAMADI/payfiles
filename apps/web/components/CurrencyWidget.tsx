"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/tools";

interface RateData {
  rates: Record<string, number>;
  time_last_update_utc: string;
}

const CURRENCIES = [
  "EUR", "USD", "GBP", "CHF", "CAD", "AUD", "JPY", "CNY", "INR", "BRL",
  "MAD", "DZD", "TND", "XOF", "XAF", "NGN", "ZAR", "EGP", "TRY", "AED",
  "SAR", "QAR", "RUB", "UAH", "SEK", "NOK", "DKK", "PLN", "MXN", "ARS",
];

const L = {
  fr: {
    amount: "Montant",
    from: "De",
    to: "Vers",
    swap: "Inverser",
    rate: "Taux du jour",
    updated: "Taux mis à jour",
    loading: "Chargement des taux…",
    fail: "Taux indisponibles pour le moment. Réessayez dans un instant.",
    result: "Résultat",
  },
  en: {
    amount: "Amount",
    from: "From",
    to: "To",
    swap: "Swap",
    rate: "Today's rate",
    updated: "Rates updated",
    loading: "Loading rates…",
    fail: "Rates unavailable right now. Try again shortly.",
    result: "Result",
  },
};

const numberFmt = (locale: string, value: number, currency: string) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(value);

export default function CurrencyWidget({ locale }: { locale: Locale }) {
  const t = L[locale];
  const [data, setData] = useState<RateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");

  useEffect(() => {
    let alive = true;
    fetch(`https://open.er-api.com/v6/latest/EUR`)
      .then((r) => r.json())
      .then((j: RateData) => {
        if (!alive) return;
        if (!j.rates) throw new Error("no rates");
        setData(j);
      })
      .catch(() => alive && setError(t.fail));
    return () => { alive = false; };
  }, [t.fail]);

  const converted = useCallback(() => {
    if (!data || !from || !to || from === to) return null;
    const eur = Number(amount.replace(",", ".")) / data.rates[from];
    if (!isFinite(eur)) return null;
    return eur * data.rates[to];
  }, [data, amount, from, to]);

  const rateLine =
    data && from !== to && data.rates[from] && data.rates[to]
      ? `1 ${from} = ${(data.rates[to] / data.rates[from]).toFixed(4)} ${to}`
      : null;

  const selectStyle: React.CSSProperties = {
    background: "#0b0f17", color: "#e6e9f0", border: "1px solid #374151",
    borderRadius: 10, padding: "10px 12px", fontSize: 14, flex: 1,
  };

  return (
    <section className="card">
      {!data && !error && <p className="muted"><i className="bi bi-hourglass-split" /> {t.loading}</p>}
      {error && <p className="error-text">{error}</p>}

      {data && (
        <div style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted" style={{ fontSize: 12 }}>{t.amount}</span>
            <input
              style={{ ...selectStyle, width: "100%" }}
              value={amount}
              inputMode="decimal"
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
            />
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ flex: 1, display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 12 }}>{t.from}</span>
              <select style={selectStyle} value={from} onChange={(e) => setFrom(e.target.value)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <button
              className="btn secondary"
              onClick={() => { setFrom(to); setTo(from); }}
              title={t.swap}
              style={{ marginTop: 16, padding: "10px 12px" }}
            >
              <i className="bi bi-arrow-left-right" aria-hidden="true" />
            </button>
            <label style={{ flex: 1, display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 12 }}>{t.to}</span>
              <select style={selectStyle} value={to} onChange={(e) => setTo(e.target.value)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <div className="card" style={{ padding: "14px 16px", background: "#0f1522" }}>
            <div className="kpi" style={{ color: "#6ee7b7" }}>
              {converted() != null ? numberFmt(locale, converted()!, to) : "—"}
            </div>
            {rateLine && <div className="muted">{t.rate} : {rateLine}</div>}
          </div>

          <p className="muted" style={{ margin: 0 }}>
            <i className="bi bi-info-circle" /> {t.updated} : {data.time_last_update_utc}
            {" — "}open.er-api.com
          </p>
        </div>
      )}
    </section>
  );
}
