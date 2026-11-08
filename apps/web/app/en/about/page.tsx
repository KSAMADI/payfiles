import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: "PayFiles: a free, fast and private file-tool suite for everyone, available from anywhere in the world.",
  alternates: {
    canonical: absoluteUrl("/en/about"),
    languages: { fr: absoluteUrl("/a-propos"), en: absoluteUrl("/en/about"), "x-default": absoluteUrl("/a-propos") },
  },
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>About PayFiles</h1>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>Our mission</h2>
        <p>
          Give everyone — everywhere in the world — a suite of file tools that is <strong>free, fast and private</strong>:
          merge, split, compress, protect and convert your PDFs and images without ever uploading them to a server.
          As much processing as possible happens right in your browser via WebAssembly.
        </p>

        <h2 style={{ fontSize: 20 }}>How we're funded</h2>
        <p>
          The service is completely free and funded by discreet ads. None of your document content is used for
          advertising: your files stay on your device.
        </p>

        <h2 style={{ fontSize: 20 }}>What the site offers</h2>
        <ul>
          <li>17 free PDF and image tools, no signup required</li>
          <li>Office conversions (Word, Excel, PowerPoint)</li>
          <li>Real-time currency converter (150+ currencies)</li>
          <li>7-day weather forecasts</li>
          <li>Bilingual English / French interface</li>
        </ul>
      </section>
    </main>
  );
}
