import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PayFiles handles your files (no upload) and the use of Google AdSense advertising cookies.",
  alternates: {
    canonical: absoluteUrl("/en/privacy"),
    languages: { fr: absoluteUrl("/confidentialite"), en: absoluteUrl("/en/privacy"), "x-default": absoluteUrl("/confidentialite") },
  },
};

const DATE = "November 8, 2026";

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Privacy Policy</h1>
      <p className="muted">Last updated: {DATE}</p>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>1. Who runs this site?</h2>
        <p>
          PayFiles (https://payfiles-app.pages.dev) is published by <strong>Samadi Karim</strong>.
          Contact: <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>.
        </p>

        <h2 style={{ fontSize: 20 }}>2. Your files</h2>
        <p>
          <strong>PayFiles stores no files. Ever.</strong> Nearly all tools (PDF, images) run{" "}
          <strong>entirely inside your browser</strong>: your files never even leave your device. For the tools that
          need server processing (Office conversions), the file is processed ephemerally and{" "}
          <strong>destroyed immediately</strong> once the result is generated: <strong>no copies are made</strong>,{" "}
          <strong>no text is extracted</strong> from it, <strong>nothing is retained, indexed, analysed or shared</strong>{" "}
          — by us or by anyone. The file then ceases to exist on our servers.
        </p>

        <h2 style={{ fontSize: 20 }}>3. Data we collect</h2>
        <p>
          We require <strong>no account</strong> to use the tools, and no personal data is collected for that purpose.
          The optional “Earnings” feature uses a one-time login code; none of your document content ever passes through
          it.
        </p>

        <h2 style={{ fontSize: 20 }}>4. Cookies and advertising (Google AdSense)</h2>
        <p>This site is funded by advertising, served by Google through AdSense:</p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website
            or other websites.
          </li>
          <li>
            Google's use of the <em>DART</em> cookie enables it to serve ads based on your visits to this site and
            other sites on the Internet.
          </li>
          <li>
            You may opt out of personalised advertising via{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>{" "}
            or{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </li>
        </ul>

        <h2 style={{ fontSize: 20 }}>5. Third-party services</h2>
        <p>
          The currency converter queries public exchange-rate APIs and the weather widget uses public forecast
          services; only technical requests are sent, with no personal identity. The site is hosted by Cloudflare
          (Pages), which may store neutral technical logs (truncated IP address, browser) for security and
          performance.
        </p>

        <h2 style={{ fontSize: 20 }}>6. Your rights</h2>
        <p>
          This site is intended for users worldwide. Wherever you live, you may have statutory rights over your
          personal data, including under the GDPR (EU/EEA), the CCPA (California) and any other applicable local law.
          Contact <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a> for any access, rectification,
          erasure or opt-out request — we handle all of them the same way, whatever your country.
        </p>

        <h2 style={{ fontSize: 20 }}>7. Changes</h2>
        <p>This policy may change; the update date is shown at the top of the page.</p>
      </section>
    </main>
  );
}
