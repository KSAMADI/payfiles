import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de PayFiles : accès gratuit, responsabilité, propriété intellectuelle.",
  alternates: {
    canonical: absoluteUrl("/conditions"),
    languages: { fr: absoluteUrl("/conditions"), en: absoluteUrl("/en/terms"), "x-default": absoluteUrl("/conditions") },
  },
};

const DATE = "8 novembre 2026";

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Conditions d'utilisation</h1>
      <p className="muted">Dernière mise à jour : {DATE}</p>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>1. Objet</h2>
        <p>
          PayFiles est un site gratuit fournissant des outils de manipulation de fichiers (PDF, images, documents
          Office), un convertisseur de devises et un module météo, accessibles partout dans le monde au navigateur.
        </p>

        <h2 style={{ fontSize: 20 }}>2. Accès et responsabilité de l'utilisateur</h2>
        <ul>
          <li>Le service est fourni « en l'état », gratuitement, sans garantie de disponibilité continue.</li>
          <li>
            Vous vous engagez à ne pas utiliser le site pour des contenus illégaux (défense au copyright, virus,
            contenus illicites) ni à tenter de perturber le service.
          </li>
          <li>
            Vous restez responsable des fichiers que vous convertissez et de leurs droits d'usage.
          </li>
        </ul>

        <h2 style={{ fontSize: 20 }}>3. Propriété intellectuelle</h2>
        <p>
          Les documents convertis vous appartiennent et restent les vôtres : ni PayFiles, ni ses partenaires ne
          revendiquent de droits sur vos contenus. Le nom, le logo et le code du site sont la propriété de l'éditeur.
        </p>

        <h2 style={{ fontSize: 20 }}>4. Publicités</h2>
        <p>
          Le site est financé par la publicité fournie par des partenaires tiers (dont Google AdSense). Voir la{" "}
          <a href="/confidentialite">politique de confidentialité</a> pour les cookies associés.
        </p>

        <h2 style={{ fontSize: 20 }}>5. Limitation de responsabilité</h2>
        <p>
          PayFiles ne saurait être tenu responsable d'une perte de données, d'un résultat de conversion inattendu ou
          d'une indisponibilité du service. Utilisez les fichiers obtenus avec discernement et vérifiez les résultats
          importants.
        </p>

        <h2 style={{ fontSize: 20 }}>6. Droit applicable</h2>
        <p>
          Les présentes conditions sont soumises aux lois applicables au lieu d'établissement de l'éditeur ; tout
          différend sera traité à l'amiable en priorité via{" "}
          <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}
