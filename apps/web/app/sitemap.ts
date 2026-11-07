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
