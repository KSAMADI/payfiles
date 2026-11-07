import type { Metadata } from "next";
import type { Locale, ToolDef } from "@/lib/tools";
import { toolPath } from "@/lib/tools";

export const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://payfiles.app").replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

/** Metadata complète pour une page d'outil : canonical + hreflang + OpenGraph. */
export function toolMetadata(tool: ToolDef, locale: Locale): Metadata {
  const en = locale === "en";
  const title = en
    ? `${tool.nameEn} online — free, no upload | PayFiles`
    : `${tool.name} en ligne — gratuit, sans upload | PayFiles`;
  const description = en ? tool.descEn : tool.desc;
  const path = toolPath(tool, locale);
  const frPath = toolPath(tool, "fr");
  const enPath = toolPath(tool, "en");

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        fr: absoluteUrl(frPath),
        en: absoluteUrl(enPath),
        "x-default": absoluteUrl(frPath),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: "PayFiles",
      locale: en ? "en_US" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: en
      ? ["free", "browser", "no upload", "online", tool.nameEn.toLowerCase(), ...tool.slugEn.split("-")]
      : ["gratuit", "sans upload", "en ligne", tool.name.toLowerCase(), ...tool.slug.split("-")],
  };
}

export const FAQ: Record<Locale, (tool: ToolDef) => { q: string; a: string }[]> = {
  fr: (tool) => [
    {
      q: `L'outil ${tool.name} est-il vraiment gratuit ?`,
      a: "Oui, entièrement gratuit, financé par la publicité et les fonctions premium. Aucune inscription, aucune limite cachée pour les fichiers standard.",
    },
    {
      q: "Mes fichiers sont-ils envoyés sur un serveur ?",
      a: tool.server
        ? "Pour cet outil, le fichier passe brièvement par notre serveur de conversion, puis il est supprimé immédiatement : rien n'est conservé ni analysé."
        : "Non. Tout est calculé directement dans votre navigateur (WebAssembly et JavaScript). Vos fichiers ne quittent jamais votre ordinateur.",
    },
    {
      q: "Est-ce que ça fonctionne sur mobile ?",
      a: "Oui : l'interface est conçue d'abord pour le tactile, et le site peut s'installer comme une application depuis votre navigateur.",
    },
  ],
  en: (tool) => [
    {
      q: `Is ${tool.nameEn} really free?`,
      a: "Yes, completely free — funded by ads and premium features. No signup, no hidden limits for standard files.",
    },
    {
      q: "Are my files uploaded to a server?",
      a: tool.server
        ? "For this tool, the file briefly passes through our conversion server and is deleted immediately: nothing is stored or analysed."
        : "No. Everything runs inside your browser (WebAssembly and JavaScript). Your files never leave your computer.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes: the interface is touch-first, and the site can be installed as an app straight from your browser.",
    },
  ],
};

export function breadcrumbLd(tool: ToolDef, locale: Locale) {
  const en = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PayFiles", item: absoluteUrl(locale === "fr" ? "/" : "/en") },
      { "@type": "ListItem", position: 2, name: en ? "Tools" : "Outils", item: absoluteUrl(locale === "fr" ? "/outils" : "/en/tools") },
      { "@type": "ListItem", position: 3, name: en ? tool.nameEn : tool.name, item: absoluteUrl(toolPath(tool, locale)) },
    ],
  };
}

export function softwareAppLd(tool: ToolDef, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: locale === "en" ? tool.nameEn : tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: absoluteUrl(toolPath(tool, locale)),
    description: locale === "en" ? tool.descEn : tool.desc,
    offers: { "@type": "Offer", price: "0", priceCurrency: locale === "en" ? "USD" : "EUR" },
  };
}

export function faqLd(tool: ToolDef, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ[locale](tool).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
