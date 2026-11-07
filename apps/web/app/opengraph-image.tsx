import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "PayFiles — tous vos outils gratuits, sans upload";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    ogCard(
      "Tous vos outils gratuits, sans upload",
      "PDF, images, Office, devises, météo — le tout dans votre navigateur.",
      "100 % local",
      "payfiles.app",
    ),
    size,
  );
}
