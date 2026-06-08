"use server";

import { getServerSupabase } from "@/lib/supabase.server";
import {
  getSeedRestaurants,
  getSeedRestaurantById,
  SEED_RESTAURANTS,
} from "@/lib/seedData";
import type { Restaurant } from "@/types/database.types";

/**
 * 取得所有餐廳。
 * 有 Supabase 就讀 DB，否則回傳本地 seed 資料。
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  const supabase = getServerSupabase();
  if (!supabase) return getSeedRestaurants();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    // DB 還沒 seed 或出錯時，退回本地資料，確保畫面不空白。
    return getSeedRestaurants();
  }
  return data;
}

/** 依 id 取得單一餐廳。 */
export async function getRestaurantById(
  id: string,
): Promise<Restaurant | null> {
  const supabase = getServerSupabase();
  if (!supabase) return getSeedRestaurantById(id);

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return getSeedRestaurantById(id);
  }
  return data;
}

/**
 * 搜尋索引：每間餐廳 id → 可搜尋文字（店名 + 分類 + 招牌 + 所有菜名，小寫）。
 * 首頁拿到後即可在前端即時依「店名 / 分類 / 餐點」過濾。
 */
export async function getRestaurantSearchIndex(): Promise<
  Record<string, string>
> {
  const supabase = getServerSupabase();

  if (!supabase) {
    const idx: Record<string, string> = {};
    for (const r of SEED_RESTAURANTS) {
      idx[r.slug] = [r.name, r.category, r.tagline, ...r.menu.map((m) => m.name)]
        .join(" ")
        .toLowerCase();
    }
    return idx;
  }

  const [{ data: rests }, { data: items }] = await Promise.all([
    supabase.from("restaurants").select("id,name,category"),
    supabase.from("menu_items").select("restaurant_id,name"),
  ]);

  if (!rests || rests.length === 0) {
    // DB 還沒 seed，退回本地索引
    const idx: Record<string, string> = {};
    for (const r of SEED_RESTAURANTS) {
      idx[r.slug] = [r.name, r.category, r.tagline, ...r.menu.map((m) => m.name)]
        .join(" ")
        .toLowerCase();
    }
    return idx;
  }

  const idx: Record<string, string> = {};
  for (const r of rests) idx[r.id] = `${r.name} ${r.category}`;
  for (const it of items ?? []) {
    if (it.restaurant_id) {
      idx[it.restaurant_id] = `${idx[it.restaurant_id] ?? ""} ${it.name}`;
    }
  }
  for (const k in idx) idx[k] = idx[k].toLowerCase();
  return idx;
}
