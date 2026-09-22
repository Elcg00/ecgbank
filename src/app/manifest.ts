import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ECG Bank",
    short_name: "ECG Bank",
    description: "Organização financeira para a família, sem julgamento.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f4ed",
    theme_color: "#2d5535",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
