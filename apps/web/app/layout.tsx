import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { BASE_URL } from "@/lib/seo";
import LocaleShell from "@/components/LocaleShell";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PayFiles — conversion de fichiers gratuite, sans upload",
    template: "%s | PayFiles",
  },
  description:
    "Fusionner, diviser, compresser, protéger et convertir vos PDF et images — 100 % dans votre navigateur, plus devises et météo. Gratuit, sans inscription.",
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0b0f17",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Script
          id="adsense-loader"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8020438433528946"
          crossOrigin="anonymous"
        />
        <LocaleShell>{children}</LocaleShell>
      </body>
    </html>
  );
}
