import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, DM_Sans } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/Toaster";
import PwaProvider from "@/components/PwaProvider";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "幻想外送 🛵 — 反正食物也不會來",
  description:
    "台灣版戒外送成癮模擬平台。完整模擬點外送的儀式感，但餐點永遠不會送到。不花錢、不攝取熱量，只享受那幾分鐘。",
  applicationName: "幻想外送",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "幻想外送",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#e3006d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${notoSansTC.variable} ${dmSans.variable} min-h-dvh bg-bg antialiased`}
      >
        {children}
        <Toaster />
        <PwaProvider />
      </body>
    </html>
  );
}
