import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PdfToolRunner from "@/components/PdfToolRunner";
import CurrencyWidget from "@/components/CurrencyWidget";
import WeatherWidget from "@/components/WeatherWidget";
import JsonLd from "@/components/JsonLd";
import { FAQ, breadcrumbLd, faqLd, softwareAppLd, toolMetadata } from "@/lib/seo";
import { getToolBySlug, localizedTool, TOOLS, type Locale } from "@/lib/tools";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug, "fr");
  if (!tool) return {};
  return toolMetadata(tool, "fr");
}

const WIDGETS: Record<string, React.ComponentType<{ locale: Locale }>> = {
  "convertisseur-devise": CurrencyWidget,
  "meteo": WeatherWidget,
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug, "fr");
  if (!tool) notFound();

  const v = localizedTool(tool, "fr");
  const faq = FAQ["fr"](tool);
  const Widget = WIDGETS[tool.slug];

  return (
    <main>
      <nav className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
        <Link href="/">Accueil</Link> › <Link href="/outils">Outils</Link> ›{" "}
        {v.displayName}
      </nav>

      <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>
        <i className={`bi bi-${tool.icon}`} style={{ color: "#6ee7b7" }} /> {v.displayH1}
      </h1>
      <p className="muted" style={{ margin: "0 0 20px", maxWidth: 720 }}>{v.displaySeo}</p>

      {Widget ? (
        <Widget locale="fr" />
      ) : (
        <PdfToolRunner tool={tool} locale="fr" />
      )}

      <section style={{ marginTop: 26, maxWidth: 720 }}>
        <h2 style={{ fontSize: 17 }}>Questions fréquentes</h2>
        {faq.map((item) => (
          <details key={item.q} style={{ marginBottom: 6 }}>
            <summary style={{ cursor: "pointer", padding: "8px 0", fontWeight: 600, fontSize: 14 }}>
              {item.q}
            </summary>
            <p className="muted" style={{ margin: "4px 0 10px" }}>{item.a}</p>
          </details>
        ))}
      </section>

      <p className="muted" style={{ marginTop: 24 }}>
        <Link href="/outils">← Tous les outils</Link>
      </p>

      <JsonLd data={breadcrumbLd(tool, "fr")} />
      <JsonLd data={softwareAppLd(tool, "fr")} />
      <JsonLd data={faqLd(tool, "fr")} />
    </main>
  );
}
