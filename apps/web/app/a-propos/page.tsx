import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "À propos",
  description: "PayFiles : une suite d'outils de fichiers gratuite, rapide et privée, accessible depuis n'importe où dans le monde.",
  alternates: {
    canonical: absoluteUrl("/a-propos"),
    languages: { fr: absoluteUrl("/a-propos"), en: absoluteUrl("/en/about"), "x-default": absoluteUrl("/a-propos") },
  },
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>À propos de PayFiles</h1>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>Notre mission</h2>
        <p>
          Offrir à tout le monde — partout dans le monde — une suite d'outils de fichiers <strong>gratuite, rapide et
          privée</strong> : fusionner, diviser, compresser, protéger et convertir vos PDF et images sans jamais les
          téléverser sur un serveur. Le plus de traitement possible se fait directement dans votre navigateur via
          WebAssembly.
        </p>

        <h2 style={{ fontSize: 20 }}>Comment nous nous financons</h2>
        <p>
          Le service est entièrement gratuit et financé par des annonces discrètes. Aucune donnée de vos documents
          n'est utilisée pour la publicité : vos fichiers restent sur votre appareil.
        </p>

        <h2 style={{ fontSize: 20 }}>Ce que ce site propose</h2>
        <ul>
          <li>17 outils PDF et images, 100 % gratuits, sans inscription</li>
          <li>Conversions Office (Word, Excel, PowerPoint)</li>
          <li>Convertisseur de devises en temps réel (150+ monnaies)</li>
          <li>Météo sur 7 jours</li>
          <li>Interface bilingue français / anglais</li>
        </ul>
      </section>
    </main>
  );
}
