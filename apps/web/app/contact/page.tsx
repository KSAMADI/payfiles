import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, une remarque ou un signalement sur PayFiles ? Écrivez-nous par e-mail.",
  alternates: {
    canonical: absoluteUrl("/contact"),
    languages: { fr: absoluteUrl("/contact"), en: absoluteUrl("/en/contact"), "x-default": absoluteUrl("/contact") },
  },
};

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Contact</h1>

      <section className="card" style={{ marginTop: 18 }}>
        <p>Pour toute question, suggestion ou signalement (outil en panne, fichier non converti, problème de publicité) :</p>
        <p style={{ fontSize: 18 }}>
          <i className="bi bi-envelope" />{" "}
          <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>
        </p>
        <p className="muted">
          Nous répondons généralement sous 48 h. Les demandes liées aux données personnelles (accès, suppression) sont
          traitées en priorité, où que vous viviez.
        </p>
      </section>
    </main>
  );
}
