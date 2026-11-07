"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { CATEGORY_LABELS, TOOLS, getToolBySlug, toolPath, type Category, type Locale } from "@/lib/tools";

export function detectLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

export default function LocaleShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const locale = detectLocale(pathname);
  const other: Locale = locale === "fr" ? "en" : "fr";

  // Lien de changement de langue : cible exacte la page équivalente
  let langSwitchHref = locale === "fr" ? "/en" : "/";
  if (pathname.startsWith(locale === "fr" ? "/outils/" : "/en/tools/")) {
    const slug = pathname.replace(/^\/(en\/tools|outils)\//, "").split("?")[0];
    const tool = getToolBySlug(slug, locale);
    if (tool) langSwitchHref = toolPath(tool, other);
  }

  const cats: Category[] = ["fichiers", "pratique"];
  const t =
    locale === "fr"
      ? { home: "Accueil", all: "Tous les tools", switchTo: "EN", account: "Espace revenus", convert: "Convertir" }
      : { home: "Home", all: "All tools", switchTo: "FR", account: "Earnings", convert: "Convert" };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href={locale === "fr" ? "/" : "/en"} className="brand" style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 10px 14px" }}>
          <BrandMark />
          <span>Pay<span>Files</span></span>
        </Link>
        <Link
          href={locale === "fr" ? "/" : "/en"}
          className={`side-link ${pathname === (locale === "fr" ? "/" : "/en") ? "active" : ""}`}
        >
          <i className="bi bi-house-door" /> {t.home}
        </Link>
        {cats.map((cat) => (
          <div key={cat} className="side-group">
            <div className="side-cat">
              <i className={`bi bi-${CATEGORY_LABELS[cat].icon}`} />{" "}
              {locale === "fr" ? CATEGORY_LABELS[cat].label : CATEGORY_LABELS[cat].labelEn}
            </div>
            {TOOLS.filter((tool) => tool.category === cat).map((tool) => {
              const path = toolPath(tool, locale);
              return (
                <Link key={tool.slug} href={path} className={`side-link ${pathname === path ? "active" : ""}`}>
                  <i className={`bi bi-${tool.icon}`} /> {locale === "fr" ? tool.name : tool.nameEn}
                </Link>
              );
            })}
          </div>
        ))}
        <a className="side-link" href={locale === "fr" ? "/login" : "/en"}>
          <i className="bi bi-cash-coin" /> {t.account}
        </a>
        <a className="side-link" href={langSwitchHref}>
          <i className="bi bi-translate" /> {t.switchTo}
        </a>
      </aside>

      {/* nav horizontale scrollable — mobile */}
      <nav className="topbar-scroll">
        <Link href={locale === "fr" ? "/" : "/en"} className="side-link active"><BrandMark size={20} /> PayFiles</Link>
        {cats.flatMap((cat) =>
          TOOLS.filter((tool) => tool.category === cat).map((tool) => {
            const path = toolPath(tool, locale);
            return (
              <Link key={tool.slug} href={path} className="side-link">
                <i className={`bi bi-${tool.icon}`} /> {locale === "fr" ? tool.name : tool.nameEn}
              </Link>
            );
          }),
        )}
        <a className="side-link" href={langSwitchHref}>
          <i className="bi bi-translate" /> {t.switchTo}
        </a>
      </nav>

      <main className="app-main">{children}</main>
    </div>
  );
}

export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0b0f17" />
      <rect x="4" y="4" width="56" height="56" rx="11" fill="url(#brandg)" />
      <path d="M20 13h17l9 9v29H20z" fill="#ffffff" />
      <path d="M37 13l9 9h-9z" fill="#c7d2fe" />
      <rect x="25" y="30" width="15" height="3.4" rx="1.7" fill="#4f46e5" />
      <rect x="25" y="36.5" width="15" height="3.4" rx="1.7" fill="#94a3b8" />
      <rect x="25" y="43" width="10" height="3.4" rx="1.7" fill="#94a3b8" />
      <defs>
        <linearGradient id="brandg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4f46e5" />
          <stop offset="1" stop-color="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}
