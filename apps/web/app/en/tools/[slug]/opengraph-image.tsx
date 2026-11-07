import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";
import { getToolBySlug } from "@/lib/tools";

export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug, "en");
  return [{ id: "default", alt: tool ? `${tool.nameEn} — PayFiles` : "PayFiles", size: OG_SIZE, contentType: OG_CONTENT_TYPE }];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug, "en");
  return new ImageResponse(
    ogCard(
      tool?.nameEn ?? "PayFiles",
      (tool?.descEn ?? "").slice(0, 120),
      "100% local · free",
      "payfiles.app/en",
    ),
    size,
  );
}
