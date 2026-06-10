// 列出每道菜 → 指派到的圖片，並依「圖片」分組，方便檢查圖文相符度。
import { SEED_RESTAURANTS, menuItemImage } from "../src/lib/seedData.ts";

type Row = { resto: string; name: string; category: string; img: string };
const rows: Row[] = [];
for (const r of SEED_RESTAURANTS) {
  for (const m of r.menu) {
    const img = menuItemImage(r.slug, m.name, m.category).replace("/food/", "");
    rows.push({ resto: r.name, name: m.name, category: m.category, img });
  }
}

// 依圖片分組
const byImg: Record<string, Row[]> = {};
for (const row of rows) (byImg[row.img] ??= []).push(row);

const imgs = Object.keys(byImg).sort();
console.log(`總菜色數：${rows.length}，用到圖片：${imgs.length} 張\n`);
for (const img of imgs) {
  const list = byImg[img];
  console.log(`\n■ ${img}  (${list.length})`);
  for (const row of list) {
    console.log(`    ${row.name}  〔${row.resto}／${row.category}〕`);
  }
}
