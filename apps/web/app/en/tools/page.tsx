import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { CATEGORY_LABELS, TOOLS, type Category } from "@/lib/tools";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All tools — PDF, images, currency, weather",
  description:
    "Merge, split, compress, protect, unlock, convert PDF/Word/Excel, currency rates, weather… Everything is on PayFiles: free and no upload for your files.",
  alternates: { canonical: absoluteUrl("/en/tools") },
};

export default function EnglishToolsIndex() {
  const cats: Category[] = ["fichiers", "pratique"];

  return (
    <main>
      <section className="hero">
        <h1 style={{ fontSize: 28 }}>
          The complete <span style={{ color: "#6ee7b7" }}>PayFiles</span> toolbox
        </h1>
        <p>
          The full feature set of the big online suites — with one major
          difference: your files are processed by your browser, never by a
          remote server.
        </p>
      </section>

      {cats.map((cat) => (
        <section key={cat} style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px", color: "#cbd5e1" }}>
            <i className={`bi bi-${CATEGORY_LABELS[cat].icon}`} />{" "}
            {CATEGORY_LABELS[cat].labelEn}
          </h2>
          <div className="tool-grid">
            {TOOLS.filter((tool) => tool.category === cat).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale="en" />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
