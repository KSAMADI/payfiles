import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment PayFiles traite vos fichiers (aucun téléversement) et l'utilisation des cookies publicitaires Google AdSense.",
  alternates: {
    canonical: absoluteUrl("/confidentialite"),
    languages: { fr: absoluteUrl("/confidentialite"), en: absoluteUrl("/en/privacy"), "x-default": absoluteUrl("/confidentialite") },
  },
};

const DATE = "8 novembre 2026";

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Politique de confidentialité</h1>
      <p className="muted">Dernière mise à jour : {DATE}</p>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>1. Qui est responsable du site ?</h2>
        <p>
          Le site PayFiles (https://payfiles-app.pages.dev) est édité par <strong>Samadi Karim</strong>.
          Contact : <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>.
        </p>

        <h2 style={{ fontSize: 20 }}>2. Vos fichiers</h2>
        <p>
          La quasi-totalité des outils de conversion (PDF, images, Office) fonctionne <strong>entièrement dans votre
          navigateur</strong> : vos fichiers ne sont jamais téléversés sur nos serveurs, ni conservés, ni analysés.
          Pour les quelques outils qui nécessitent un traitement serveur (conversions Office), le fichier est transmis
          de façon éphémère au service de conversion et <strong>supprimé immédiatement</strong> après le résultat : rien
          n'est stocké, copié ou partagé.
        </p>

        <h2 style={{ fontSize: 20 }}>3. Données que nous collectons</h2>
        <p>
          Nous ne demandons <strong>aucune inscription</strong> pour utiliser les outils. Aucune donnée personnelle
          n'est collectée à cette occasion. La fonction « Espace revenus » (optionnelle) utilise un code de connexion
          ponctuel ; aucun contenu de vos documents n'y transite.
        </p>

        <h2 style={{ fontSize: 20 }}>4. Cookies et publicité (Google AdSense)</h2>
        <p>
          Ce site est financé par la publicité. Les annonces sont fournies par Google via AdSense :
        </p>
        <ul>
          <li>
            Les fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction des
            visites précédentes de l'utilisateur sur ce site ou sur d'autres sites.
          </li>
          <li>
            L'utilisation du cookie principal, <em>DART</em>, permet à Google de diffuser des annonces en fonction des
            visites effectuées sur ce site et sur d'autres sites Internet.
          </li>
          <li>
            Vous pouvez désactiver la publicité personnalisée dans les{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              paramètres des annonces Google
            </a>{" "}
            ou via{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </li>
        </ul>

        <h2 style={{ fontSize: 20 }}>5. Serveurs tiers</h2>
        <p>
          Le convertisseur de devises interroge des API publiques de taux de change et le module météo des services de
          prévisions ; seules des requêtes techniques sont envoyées, sans identité personnelle. Le site est hébergé par
          Cloudflare (Pages), qui peut enregistrer des journaux techniques neutres (adresse IP abrégée, navigateur) pour
          la sécurité et la performance.
        </p>

        <h2 style={{ fontSize: 20 }}>6. Vos droits</h2>
        <p>
          Ce site est destiné aux utilisateurs du monde entier. Selon votre lieu de résidence, vous bénéficiez de droits
          sur vos données personnelles, notamment : le RGPD (Union européenne et EEE), le CCPA (Californie), et toute
          autre législation locale applicable. Vous pouvez nous contacter à{" "}
          <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a> pour toute demande d'information,
          rectification, effacement ou opposition — nous traitons ces demandes de la même manière, quel que soit le
          pays.
        </p>

        <h2 style={{ fontSize: 20 }}>7. Modifications</h2>
        <p>Cette politique peut évoluer ; la date de mise à jour est affichée en haut de la page.</p>
      </section>
    </main>
  );
}
