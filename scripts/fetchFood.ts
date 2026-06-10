// 從 Wikimedia Commons 抓真實美食照，存到 public/food/<file>.jpg。
// 用法：node --experimental-strip-types scripts/fetchFood.ts [onlyFile1 onlyFile2 ...]
// 每個項目可給多個查詢詞（fallback），抓到第一張通過過濾的就用。
import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "../public/food");

// 過濾掉明顯不是「單盤食物特寫」的字眼
const BAD = [
  "logo", "icon", "map", "diagram", "chart", "label", "poster", "sign",
  "menu", "restaurant", "shop", "store", "interior", "building", "street",
  "factory", "production", "package", "wrapper", "box", "can ", "bottle",
  "person", "people", "woman", "man", "chef", "hand", "drawing", "painting",
  "illustration", "cartoon", "stamp", "coin", "banknote", "plant", "tree",
  "raw", "uncooked", "ingredient", "market", "vendor", "festival",
];

interface Item {
  file: string;
  queries: string[];
}

const ITEMS: Item[] = [
  { file: "garlicbread", queries: ["garlic bread baguette", "garlic bread slices"] },
  { file: "sundae", queries: ["ice cream parfait glass", "matcha parfait", "ice cream sundae"] },
  { file: "mochi", queries: ["strawberry daifuku", "daifuku mochi", "ichigo daifuku"] },
  { file: "bagel", queries: ["smoked salmon bagel", "bagel cream cheese salmon", "lox bagel"] },
  { file: "tteokbokki", queries: ["Tteokbokki", "Tteok-bokki", "Garaetteok Tteokbokki"] },
  { file: "koreanpancake", queries: ["haemul pajeon", "korean seafood pancake", "pajeon"] },
  { file: "porkchop", queries: ["Schnitzel", "Pork schnitzel", "Tonkatsu"] },
  { file: "bloodcake", queries: ["Pig blood cake", "Zhuxuegao", "Taiwanese blood rice cake"] },
  { file: "croquette", queries: ["korokke croquette", "potato croquette fried"] },
  { file: "mantou", queries: ["Zha mantou", "Fried mantou", "Mantou dessert"] },
  { file: "cheeseball", queries: ["Mozzarella sticks", "fried cheese sticks", "fried mozzarella"] },
  { file: "rice", queries: ["Steamed rice in bowl", "A bowl of rice", "cooked white rice bowl"] },
  { file: "cornsoup", queries: ["Corn potage", "Corn soup", "Sweetcorn soup"] },
  { file: "chawanmushi", queries: ["chawanmushi", "japanese steamed egg custard"] },
  { file: "squidball", queries: ["Deep Fried Dace Fish Ball", "Deep fried fish ball"] },
  { file: "milktea2", queries: ["taro milk tea", "taro bubble tea purple"] },
  { file: "veg2", queries: ["stir fried green vegetables garlic", "sauteed bok choy", "stir fried leafy greens"] },
  { file: "soup2", queries: ["miso soup tofu bowl", "miso soup", "japanese soup bowl"] },
];

interface Cand {
  title: string;
  url: string;
  width: number;
  height: number;
}

async function search(query: string): Promise<Cand[]> {
  const api =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|size|mime",
      iiurlwidth: "900",
    });
  const res = await fetch(api, { headers: { "User-Agent": "phantom-delivery/1.0 (food images)" } });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    query?: { pages?: Record<string, {
      title: string;
      imageinfo?: { thumburl?: string; url?: string; mime?: string; thumbwidth?: number; thumbheight?: number }[];
    }> };
  };
  const pages = json.query?.pages ?? {};
  const out: Cand[] = [];
  for (const p of Object.values(pages)) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (ii.mime && !/jpeg|png/.test(ii.mime)) continue;
    const title = p.title.toLowerCase();
    // 用詞界比對，避免「man」誤殺「mantou」、「can」誤殺其他字。
    if (BAD.some((b) => new RegExp(`\\b${b.trim()}\\b`).test(title))) continue;
    const url = ii.thumburl ?? ii.url;
    if (!url) continue;
    out.push({ title: p.title, url, width: ii.thumbwidth ?? 0, height: ii.thumbheight ?? 0 });
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function download(url: string, file: string): Promise<boolean> {
  // thumbnail server 偶爾 429（要伺服器端算縮圖），重試幾次。
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "phantom-delivery/1.0" } });
      if (res.status === 429 || res.status >= 500) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      if (!res.ok) return false;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 4000) return false; // 太小八成是破圖
      await writeFile(path.join(OUT, `${file}.jpg`), buf);
      return true;
    } catch {
      await sleep(1000 * (attempt + 1));
    }
  }
  return false;
}

const only = process.argv.slice(2);
const items = only.length ? ITEMS.filter((i) => only.includes(i.file)) : ITEMS;

for (const item of items) {
  let done = false;
  for (const q of item.queries) {
    const cands = await search(q);
    for (const c of cands) {
      if (await download(c.url, item.file)) {
        console.log(`✓ ${item.file}.jpg  ←  「${q}」  ${c.title}`);
        done = true;
        break;
      }
    }
    if (done) break;
    await sleep(600);
  }
  if (!done) console.log(`✗ ${item.file}  抓不到（試過：${item.queries.join(" / ")}）`);
  await sleep(700); // 放慢，避免 thumbnail server 限流
}
