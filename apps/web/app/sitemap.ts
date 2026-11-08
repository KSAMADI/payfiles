import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { toolPath, TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL + "/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { fr: BASE_URL + "/", en: BASE_URL + "/en", "x-default": BASE_URL + "/" } },
    },
    {
      url: BASE_URL + "/en",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: BASE_URL + "/outils",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: BASE_URL + "/en/tools",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const legal = [
    { fr: "/confidentialite", en: "/en/privacy", title: "Politique de confidentialité / Privacy Policy" },
    { fr: "/conditions", en: "/en/terms", title: "Conditions d'utilisation / Terms" },
    { fr: "/a-propos", en: "/en/about", title: "À propos / About" },
    { fr: "/contact", en: "/en/contact", title: "Contact" },
  ];
  for (const l of legal) {
    entries.push({
      url: BASE_URL + l.fr,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: { languages: { fr: BASE_URL + l.fr, en: BASE_URL + l.en, "x-default": BASE_URL + l.fr } },
    });
    entries.push({ url: BASE_URL + l.en, lastModified: now, changeFrequency: "monthly", priority: 0.4 });
  }

  for (const tool of TOOLS) {
    const priority = tool.popular ? 0.9 : 0.7;
    entries.push({
      url: BASE_URL + toolPath(tool, "fr"),
      lastModified: now,
      changeFrequency: "weekly",
      priority,
      alternates: {
        languages: {
          fr: BASE_URL + toolPath(tool, "fr"),
          en: BASE_URL + toolPath(tool, "en"),
          "x-default": BASE_URL + toolPath(tool, "fr"),
        },
      },
    });
  }

  return entries;
}
