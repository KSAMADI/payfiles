import type { Metadata } from "next";
import Converter from "@/components/Converter";
import ToolCard from "@/components/ToolCard";
import { toolPath, TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PayFiles — conversion de fichiers gratuite, sans upload",
  description:
    "Tous vos outils en un seul endroit : PDF (fusion, division, compression, protection), images, Office, taux de change, météo. 100 % dans votre navigateur, gratuit.",
  alternates: {
    canonical: absoluteUrl("/"),
    languages: { fr: absoluteUrl("/"), en: absoluteUrl("/en"), "x-default": absoluteUrl("/") },
  },
  openGraph: {
    title: "PayFiles — tous vos outils, 100 % dans votre navigateur",
    description:
      "17 outils de fichiers gratuits + convertisseur de devises + météo. Aucun fichier téléversé.",
    url: absoluteUrl("/"),
    siteName: "PayFiles",
    locale: "fr_FR",
    type: "website",
  },
};

export default function HomePage() {
  const popular = TOOLS.filter((tool) => tool.popular);

  return (
    <main>
      <section className="hero">
        <h1>
          Tous vos outils <span style={{ color: "#6ee7b7" }}>gratuits</span>, sans
          upload — au même endroit
        </h1>
        <p>
          Convertissez et manipulez vos PDF et images, consultez les taux de
          change en temps réel ou la météo à 7 jours : tout fonctionne dans
          votre navigateur. Vos fichiers ne quittent jamais votre ordinateur.
        </p>
      </section>

      <Converter />

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22, margin: "0 0 14px" }}>
          <i className="bi bi-stars" /> Les plus utilisés
        </h2>
        <div className="tool-grid">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale="fr" />
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          <a className="btn secondary" href="/outils">
            Voir tous les outils <i className="bi bi-arrow-right" />
          </a>
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PayFiles",
          url: absoluteUrl("/"),
          inLanguage: "fr",
        }}
      />
    </main>
  );
}
