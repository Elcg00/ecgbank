import { ImageResponse } from "next/og";
import { BrandMarkSvg } from "@/lib/brand-mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMarkSvg size={512} />, { ...size });
}
