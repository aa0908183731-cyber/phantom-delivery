// 產生 PWA 圖示（用 sharp 把 SVG 點陣化）。一次性腳本。
// 執行：node --experimental-strip-types scripts/genIcons.ts
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);

// 幻想外送圖示：粉色圓角底 + 白色外送紙盒 + 黃色筷子
function svg(rounded: boolean): string {
  const rx = rounded ? 112 : 0;
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff2e88"/>
      <stop offset="1" stop-color="#e3006d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${rx}" fill="url(#g)"/>
  <path d="M250 150 L300 66" stroke="#ffd24d" stroke-width="12" stroke-linecap="round"/>
  <path d="M272 152 L324 74" stroke="#ffd24d" stroke-width="12" stroke-linecap="round"/>
  <path d="M194 166 Q256 116 318 166" fill="none" stroke="#ffffff" stroke-width="13" stroke-linecap="round"/>
  <path d="M150 210 L362 210 L334 434 L178 434 Z" fill="#ffffff"/>
  <path d="M138 196 L256 156 L374 196 L362 216 L150 216 Z" fill="#ffffff"/>
  <path d="M256 158 L256 432" stroke="#e3006d" stroke-width="8" opacity="0.16"/>
</svg>`;
}

const targets: { name: string; size: number; rounded: boolean }[] = [
  { name: "icon-192.png", size: 192, rounded: true },
  { name: "icon-512.png", size: 512, rounded: true },
  { name: "icon-maskable-512.png", size: 512, rounded: false },
  { name: "apple-icon-180.png", size: 180, rounded: false },
];

for (const t of targets) {
  await sharp(Buffer.from(svg(t.rounded)))
    .resize(t.size, t.size)
    .png()
    .toFile(path.join(dir, t.name));
  console.log("wrote", t.name);
}
