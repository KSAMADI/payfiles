"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pf-cookie-ok";

export default function CookieBar({ locale }: { locale: "fr" | "en" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // on lit le storage après l'hydratation pour éviter un décalage serveur/client
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };

  const t =
    locale === "fr"
      ? {
          msg: "Ce site utilise des cookies pour financer le service via les annonces Google AdSense. Vos fichiers ne quittent jamais votre appareil.",
          more: "En savoir plus",
        }
      : {
          msg: "This site uses cookies so that Google AdSense ads can fund the service. Your files never leave your device.",
          more: "Learn more",
        };
  const href = locale === "fr" ? "/confidentialite" : "/en/privacy";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "#0b0f17",
        borderTop: "1px solid #374151",
        padding: "10px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        fontSize: 13,
      }}
    >
      <span>{t.msg}</span>
      <Link href={href} style={{ whiteSpace: "nowrap" }}>
        <i className="bi bi-shield-check" /> {t.more} →
      </Link>
      <button className="btn" onClick={dismiss} style={{ padding: "6px 14px", fontSize: 13 }}>
        OK
      </button>
    </div>
  );
}
