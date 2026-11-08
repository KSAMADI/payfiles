import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for PayFiles: free access, acceptable use, liability, intellectual property.",
  alternates: {
    canonical: absoluteUrl("/en/terms"),
    languages: { fr: absoluteUrl("/conditions"), en: absoluteUrl("/en/terms"), "x-default": absoluteUrl("/conditions") },
  },
};

const DATE = "November 8, 2026";

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 style={{ fontSize: 28 }}>Terms of Service</h1>
      <p className="muted">Last updated: {DATE}</p>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 20 }}>1. Purpose</h2>
        <p>
          PayFiles is a free site providing file tools (PDF, images, Office documents), a currency converter and a
          weather widget, accessible worldwide straight from your browser.
        </p>

        <h2 style={{ fontSize: 20 }}>2. Access and acceptable use</h2>
        <ul>
          <li>The service is provided “as is”, free of charge, with no guarantee of uninterrupted availability.</li>
          <li>
            You agree not to upload or convert illegal content (copyright infringing files, malware, unlawful
            material) and not to attempt to disrupt the service.
          </li>
          <li>
            You remain responsible for the files you convert and the rights you have to use them. Your files are{" "}
            <strong>never stored</strong>: no copies, no text extraction — everything is destroyed right after the
            conversion.
          </li>
        </ul>

        <h2 style={{ fontSize: 20 }}>3. Intellectual property</h2>
        <p>
          The documents you convert are yours and remain yours: neither PayFiles nor its partners claim any rights
          over your content. The site name, logo and code belong to the publisher.
        </p>

        <h2 style={{ fontSize: 20 }}>4. Advertising</h2>
        <p>
          The site is funded by ads from third-party partners (including Google AdSense). See the{" "}
          <a href="/en/privacy">Privacy Policy</a> for the associated cookies.
        </p>

        <h2 style={{ fontSize: 20 }}>5. Limitation of liability</h2>
        <p>
          PayFiles cannot be held liable for data loss, unexpected conversion results or service downtime. Use
          converted files with care and double-check important results.
        </p>

        <h2 style={{ fontSize: 20 }}>6. Governing law</h2>
        <p>
          These terms are governed by the laws applicable at the publisher's place of business; any dispute will be
          settled amicably first, via <a href="mailto:samsoft.dz@gmail.com">samsoft.dz@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}
