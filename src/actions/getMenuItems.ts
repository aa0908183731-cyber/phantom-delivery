"use server";

import { getServerSupabase } from "@/lib/supabase.server";
import { getSeedMenuItems, generateSeedReviews } from "@/lib/seedData";
import type { MenuItem, Review } from "@/types/database.types";

/** 取得某餐廳的菜單品項。 */
export async function getMenuItems(
  restaurantId: string,
): Promise<MenuItem[]> {
  const supabase = getServerSupabase();
  if (!supabase) return getSeedMenuItems(restaurantId);

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error || !data || data.length === 0) {
    return getSeedMenuItems(restaurantId);
  }
  return data;
}

/** 取得某餐廳的假評論。 */
export async function getReviews(restaurantId: string): Promise<Review[]> {
  const supabase = getServerSupabase();
  if (!supabase) return generateSeedReviews(restaurantId);

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .limit(5);

  if (error || !data || data.length === 0) {
    return generateSeedReviews(restaurantId);
  }
  return data;
}
