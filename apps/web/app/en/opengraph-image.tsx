import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "PayFiles — all your free tools, no upload";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    ogCard(
      "All your free tools, zero uploads",
      "PDF, images, Office, currency rates, weather — right in your browser.",
      "100% local",
      "payfiles.app/en",
    ),
    size,
  );
}
