import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { CATEGORY_LABELS, TOOLS, type Category } from "@/lib/tools";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tous les outils — PDF, images, devises, météo",
  description:
    "Fusionner, diviser, compresser, protéger, déverrouiller, convertir PDF/Word/Excel, taux de change, météo… Tout est sur PayFiles, gratuit et sans upload pour vos fichiers.",
  alternates: { canonical: absoluteUrl("/outils") },
};

export default function OutilsPage() {
  const cats: Category[] = ["fichiers", "pratique"];

  return (
    <main>
      <section className="hero">
        <h1 style={{ fontSize: 28 }}>
          Tous les outils <span style={{ color: "#6ee7b7" }}>PayFiles</span>
        </h1>
        <p>
          L&apos;équivalent complet des grandes suites en ligne — avec une différence
          majeure : vos fichiers sont traités par votre navigateur, jamais par un
          serveur distant.
        </p>
      </section>

      {cats.map((cat) => (
        <section key={cat} style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px", color: "#cbd5e1" }}>
            <i className={`bi bi-${CATEGORY_LABELS[cat].icon}`} />{" "}
            {CATEGORY_LABELS[cat].label}
          </h2>
          <div className="tool-grid">
            {TOOLS.filter((tool) => tool.category === cat).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale="fr" />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
