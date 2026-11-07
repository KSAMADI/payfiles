import React from "react";

/** Carte Open Graph 1200×630 aux couleurs PayFiles (rendu par next/og). */
export function ogCard(
  title: string,
  subtitle: string,
  badge: string,
  domain: string,
): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 60,
        background: "linear-gradient(135deg, #0b0f17 0%, #101a33 100%)",
        color: "#e6e9f0",
        fontFamily: "sans-serif",
      }}
    >
      {/* en-tête : marque + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #4f46e5, #10b981)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", width: 34, height: 42, background: "#ffffff", borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
            <span style={{ color: "#e6e9f0" }}>Pay</span>
            <span style={{ color: "#6ee7b7" }}>Files</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#0b0f17",
            background: "#6ee7b7",
            borderRadius: 999,
            padding: "10px 22px",
            fontWeight: 600,
          }}
        >
          {badge}
        </div>
      </div>

      {/* titre + sous-titre */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: title.length > 40 ? 58 : 74, fontWeight: 800, lineHeight: 1.08 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8", lineHeight: 1.35, maxWidth: 1000 }}>
          {subtitle}
        </div>
      </div>

      {/* pied : domaine + finition dégradée */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", fontSize: 26, color: "#64748b" }}>{domain}</div>
        <div style={{ display: "flex", width: 240, height: 8, borderRadius: 8, background: "linear-gradient(90deg, #4f46e5, #10b981)" }} />
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
