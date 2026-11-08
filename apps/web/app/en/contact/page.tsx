import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "A question, a suggestion or an issue with PayFiles? Email us.",
  alternates: {
    canonical: absoluteUrl("/en/contact"),
    languages: { fr: absoluteUrl("/contact"), en: absoluteUrl("/en/contact"), "x-default": absoluteUrl("/contact") },
  },
};

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Contact</h1>

      <section className="card" style={{ marginTop: 18 }}>
        <p>For any question, suggestion or report (tool down, file not converting, ad problem):</p>
        <p style={{ fontSize: 18 }}>
          <i className="bi bi-envelope" />{" "}
          <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>
        </p>
        <p className="muted">
          We usually reply within 48 hours. Personal-data requests (access, deletion) are handled as a priority,
          wherever you live.
        </p>
      </section>
    </main>
  );
}
