// 把 src/lib/seedData.ts 的 20 間餐廳寫進 Supabase。
//
// 執行（需先在 .env.local 填好 NEXT_PUBLIC_SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY）：
//
//   node --env-file=.env.local --experimental-strip-types scripts/seedSupabase.ts
//
// 預設會先清空 reviews / menu_items / restaurants 再重新寫入（idempotent）。

import { createClient } from "@supabase/supabase-js";
import {
  SEED_RESTAURANTS,
  generateSeedReviews,
  restaurantImage,
  menuItemImage,
} from "../src/lib/seedData.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "缺少環境變數。請確認 .env.local 內有 NEXT_PUBLIC_SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY，\n" +
      "並以  node --env-file=.env.local --experimental-strip-types scripts/seedSupabase.ts  執行。",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("🧹 清空舊資料…");
  // 依 FK 順序刪除
  await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("restaurants").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log(`🍱 寫入 ${SEED_RESTAURANTS.length} 間餐廳…`);
  for (const r of SEED_RESTAURANTS) {
    const { data: inserted, error } = await supabase
      .from("restaurants")
      .insert({
        name: r.name,
        category: r.category,
        rating: r.rating,
        review_count: r.review_count,
        min_order: r.min_order,
        delivery_time: r.delivery_time,
        image_url: restaurantImage(r.slug),
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error(`  ✗ ${r.name} 失敗:`, error?.message);
      continue;
    }
    const restaurantId = inserted.id;

    const menuRows = r.menu.map((m) => ({
      restaurant_id: restaurantId,
      name: m.name,
      description: m.description,
      price: m.price,
      image_url: menuItemImage(r.slug, m.name, m.category),
      category: m.category,
    }));
    await supabase.from("menu_items").insert(menuRows);

    const reviewRows = generateSeedReviews(r.slug).map((rev) => ({
      restaurant_id: restaurantId,
      reviewer_name: rev.reviewer_name,
      rating: rev.rating,
      content: rev.content,
    }));
    await supabase.from("reviews").insert(reviewRows);

    console.log(`  ✓ ${r.name}（${menuRows.length} 道菜 / ${reviewRows.length} 則評論）`);
  }

  console.log("✅ Seed 完成！");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
