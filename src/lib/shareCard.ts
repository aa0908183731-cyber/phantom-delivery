// 用前端把「戒斷成績卡」畫成 SVG → 點陣成 PNG → 分享/下載。
// 純前端、不依賴伺服器字型，中文與 emoji 都用系統字型渲染，最穩。

export interface CardStats {
  savedText: string;
  count: number;
  streak: number;
  unlocked: number;
}

const W = 1080;
const H = 1350;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSvg(s: CardStats): string {
  const font =
    "'Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC',sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${font}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff2e88"/>
      <stop offset="1" stop-color="#c0005f"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="48" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
  <text x="${W / 2}" y="180" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="46" font-weight="700">幻想外送 ・ 戒斷成績單</text>
  <text x="${W / 2}" y="400" text-anchor="middle" font-size="190">🐷</text>
  <text x="${W / 2}" y="510" text-anchor="middle" fill="#ffffff" fill-opacity="0.88" font-size="50">靠幻想，我已經省下</text>
  <text x="${W / 2}" y="650" text-anchor="middle" fill="#ffffff" font-size="130" font-weight="900">${esc(s.savedText)}</text>
  <text x="${W / 2}" y="820" text-anchor="middle" fill="#ffffff" font-size="50">幻想 ${s.count} 次　・　連續 ${s.streak} 天</text>
  <text x="${W / 2}" y="900" text-anchor="middle" fill="#ffffff" font-size="50">解鎖 ${s.unlocked} 枚成就徽章 🏅</text>
  <text x="${W / 2}" y="1180" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="42">食物不會來，但錢還在你的口袋裡。</text>
  <text x="${W / 2}" y="1252" text-anchor="middle" fill="#ffffff" fill-opacity="0.7" font-size="36">phantom-delivery.vercel.app</text>
</svg>`;
}

function svgToPng(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/png",
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("svg load failed"));
    };
    img.src = url;
  });
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export type ShareResult =
  | "shared"
  | "downloaded"
  | "copied"
  | "cancelled"
  | "none";

/** 產生成績卡並嘗試分享；不支援就下載圖檔，再不行就複製文字。 */
export async function shareStatsCard(s: CardStats): Promise<ShareResult> {
  const text = `我在幻想外送已經省下 ${s.savedText}，靠幻想戒掉亂點外送 💪`;
  const url =
    typeof location !== "undefined" ? location.origin : "";

  let blob: Blob | null = null;
  try {
    blob = await svgToPng(buildSvg(s));
  } catch {
    blob = null;
  }

  const nav = navigator as Navigator & {
    canShare?: (d?: unknown) => boolean;
  };

  // 1) 分享圖片
  if (blob && nav.canShare) {
    const file = new File([blob], "phantom-stats.png", { type: "image/png" });
    if (nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "幻想外送 戒斷成績", text });
        return "shared";
      } catch (e) {
        if ((e as Error).name === "AbortError") return "cancelled";
      }
    }
  }
  // 2) 分享文字 + 連結
  if (nav.share) {
    try {
      await nav.share({ title: "幻想外送 戒斷成績", text, url });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  // 3) 下載圖檔
  if (blob) {
    download(blob, "phantom-stats.png");
    return "downloaded";
  }
  // 4) 複製文字
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied";
  } catch {
    return "none";
  }
}
