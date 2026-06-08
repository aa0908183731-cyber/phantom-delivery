"use server";

import { getServerSupabase } from "@/lib/supabase.server";
import {
  getSeedRestaurants,
  getSeedRestaurantById,
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
