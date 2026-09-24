import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ECG Bank",
    short_name: "ECG Bank",
    description: "Organização financeira para a família, sem julgamento.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f4",
    theme_color: "#173d2a",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
