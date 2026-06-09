import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "幻想外送 — 反正食物也不會來",
    short_name: "幻想外送",
    description:
      "台灣版戒外送成癮模擬器。完整模擬點外送的儀式感，但餐點永遠不會送到。",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6f7",
    theme_color: "#e3006d",
    lang: "zh-Hant",
    categories: ["food", "lifestyle", "entertainment"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
