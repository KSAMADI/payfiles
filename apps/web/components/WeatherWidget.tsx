"use client";

import { useState } from "react";
import type { Locale } from "@/lib/tools";

interface GeoResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Forecast {
  current: { temperature_2m: number; weather_code: number; wind_speed_10m: number; relative_humidity_2m: number };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

const WMO: Record<number, { icon: string; fr: string; en: string }> = {
  0: { icon: "sun", fr: "Ciel dégagé", en: "Clear sky" },
  1: { icon: "cloud-sun", fr: "Peu nuageux", en: "Mostly clear" },
  2: { icon: "cloud-sun", fr: "Partiellement nuageux", en: "Partly cloudy" },
  3: { icon: "clouds", fr: "Couvert", en: "Overcast" },
  45: { icon: "cloud-fog2", fr: "Brouillard", en: "Fog" },
  48: { icon: "cloud-fog2", fr: "Brouillard givrant", en: "Freezing fog" },
  51: { icon: "cloud-drizzle", fr: "Bruine légère", en: "Light drizzle" },
  53: { icon: "cloud-drizzle", fr: "Bruine", en: "Drizzle" },
  55: { icon: "cloud-drizzle", fr: "Bruine forte", en: "Dense drizzle" },
  61: { icon: "cloud-rain", fr: "Pluie légère", en: "Light rain" },
  63: { icon: "cloud-rain", fr: "Pluie", en: "Rain" },
  65: { icon: "cloud-rain-heavy", fr: "Pluie forte", en: "Heavy rain" },
  71: { icon: "cloud-snow", fr: "Neige légère", en: "Light snow" },
  73: { icon: "cloud-snow", fr: "Neige", en: "Snow" },
  75: { icon: "cloud-snow", fr: "Neige forte", en: "Heavy snow" },
  80: { icon: "cloud-rain", fr: "Averses", en: "Rain showers" },
  81: { icon: "cloud-rain", fr: "Averses fortes", en: "Heavy showers" },
  82: { icon: "cloud-rain-heavy", fr: "Averses violentes", en: "Violent showers" },
  95: { icon: "cloud-lightning-rain", fr: "Orage", en: "Thunderstorm" },
  96: { icon: "cloud-lightning-rain", fr: "Orage et grêle", en: "Thunderstorm + hail" },
  99: { icon: "cloud-lightning-rain", fr: "Orage violent", en: "Severe thunderstorm" },
};

function wmoIcon(code: number): string {
  return WMO[code]?.icon ?? "question-lg";
}
function wmoLabel(code: number, locale: string): string {
  const w = WMO[code];
  if (!w) return "—";
  return locale === "fr" ? w.fr : w.en;
}

const L = {
  fr: {
    search: "Ville (ex. Paris, Casablanca…)",
    results: "Résultats",
    noResult: "Ville introuvable. Essayez un autre nom.",
    wind: "Vent",
    humidity: "Humidité",
    precipProb: "Pluie",
    weekTomorrow: "Demain",
    source: "Données Open-Meteo (open-meteo.com)",
  },
  en: {
    search: "City (e.g. Paris, Marrakech…)",
    results: "Results",
    noResult: "City not found. Try another name.",
    wind: "Wind",
    humidity: "Humidity",
    precipProb: "Rain",
    weekTomorrow: "Tomorrow",
    source: "Open-Meteo data (open-meteo.com)",
  },
};

export default function WeatherWidget({ locale }: { locale: Locale }) {
  const t = L[locale];
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[] | null>(null);
  const [place, setPlace] = useState<GeoResult | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [busy, setBusy] = useState(false);

  async function searchCity() {
    if (!query.trim()) return;
    setBusy(true);
    setForecast(null);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${locale}`,
      );
      const j = await res.json();
      setResults(j.results ?? []);
    } finally {
      setBusy(false);
    }
  }

  async function pick(r: GeoResult) {
    setPlace(r);
    setResults(null);
    setBusy(true);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&forecast_days=7&timezone=auto`;
      const j = (await (await fetch(url)).json()) as Forecast;
      setForecast(j);
    } catch {
      setForecast(null);
    } finally {
      setBusy(false);
    }
  }

  const dayFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    weekday: "short", day: "numeric",
  });

  return (
    <section className="card">
      <form
        onSubmit={(e) => { e.preventDefault(); searchCity(); }}
        style={{ display: "flex", gap: 10 }}
      >
        <input
          style={{
            flex: 1, background: "#0b0f17", color: "#e6e9f0", border: "1px solid #374151",
            borderRadius: 10, padding: "10px 12px", fontSize: 14,
          }}
          placeholder={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" disabled={busy}>
          <i className="bi bi-search" aria-hidden="true" />
        </button>
      </form>

      <p className="error-text" style={{ marginTop: 8, display: results && results.length === 0 ? "block" : "none" }}>
        {t.noResult}
      </p>

      {results && results.length > 0 && (
        <ul className="weather-results">
          <li style={{ display: "none" }}>{t.results}</li>
          {results.map((r, i) => (
            <li key={i}>
              <button className="btn secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => pick(r)}>
                <span>{r.name}{r.admin1 ? `, ${r.admin1}` : ""} — {r.country}</span>
                <i className="bi bi-geo-alt" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {place && forecast && (
        <div style={{ marginTop: 18 }}>
          <div className="card" style={{ background: "#0f1522", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <i className={`bi bi-${wmoIcon(forecast.current.weather_code)}`} style={{ fontSize: 44, color: "#6ee7b7" }} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>
                {Math.round(forecast.current.temperature_2m)}°C
              </div>
              <div className="muted">{place.name} — {wmoLabel(forecast.current.weather_code, locale)}</div>
              <div className="muted">
                <i className="bi bi-wind" /> {t.wind} {Math.round(forecast.current.wind_speed_10m)} km/h
                {" · "}<i className="bi bi-droplet" /> {t.humidity} {forecast.current.relative_humidity_2m}%
              </div>
            </div>
          </div>

          <div className="grid2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", marginTop: 12 }}>
            {forecast.daily.time.slice(1).map((day, i) => (
              <div key={day} className="card" style={{ padding: 12, textAlign: "center" }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  {i === 0 ? t.weekTomorrow : dayFmt.format(new Date(day))}
                </div>
                <i className={`bi bi-${wmoIcon(forecast.daily.weather_code[i + 1])}`} style={{ fontSize: 26, color: "#8ab4f8" }} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {Math.round(forecast.daily.temperature_2m_max[i + 1])}° / {" "}
                  <span className="muted">{Math.round(forecast.daily.temperature_2m_min[i + 1])}°</span>
                </div>
                <div className="muted" style={{ fontSize: 11 }}>
                  <i className="bi bi-droplet" /> {forecast.daily.precipitation_probability_max[i + 1] ?? 0}%
                </div>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: 12 }}>{t.source}</p>
        </div>
      )}
    </section>
  );
}
