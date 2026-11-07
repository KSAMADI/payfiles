import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { BrandMark } from "@/components/LocaleShell";

export const metadata: Metadata = {
  title: "PayFiles — free file conversion, no upload",
  description:
    "All your tools in one place: PDF (merge, split, compress, protect), images, Office, currency converter, weather. 100% in your browser, free.",
  alternates: {
    canonical: absoluteUrl("/en"),
    languages: { en: absoluteUrl("/en"), fr: absoluteUrl("/"), "x-default": absoluteUrl("/") },
  },
  openGraph: {
    title: "PayFiles — all your tools, 100% in your browser",
    description: "17 free file tools + currency converter + weather. Nothing is uploaded.",
    url: absoluteUrl("/en"),
    siteName: "PayFiles",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishHome() {
  const popular = TOOLS.filter((tool) => tool.popular);

  return (
    <main>
      <section className="hero">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <BrandMark size={30} /> <b style={{ color: "#6ee7b7" }}>PayFiles in English</b>
        </span>
        <h1>
          All your <span style={{ color: "#6ee7b7" }}>free</span> tools, zero uploads
          — in one place
        </h1>
        <p>
          Convert and edit your PDFs and images, check live exchange rates or the
          7-day forecast. Everything runs right in your browser — your files
          never leave your computer.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 22, margin: "0 0 14px" }}>
          <i className="bi bi-stars" /> Most used
        </h2>
        <div className="tool-grid">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale="en" />
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          <a className="btn secondary" href="/en/tools">
            Browse all tools <i className="bi bi-arrow-right" />
          </a>
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PayFiles",
          url: absoluteUrl("/en"),
          inLanguage: "en",
        }}
      />
    </main>
  );
}
