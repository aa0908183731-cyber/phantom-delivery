import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Server 端是否已設定 Supabase。 */
export const isSupabaseConfiguredServer = Boolean(url && anonKey);

/**
 * Server Component / Server Action 用的 Supabase client。
 *
 * - 讀取（餐廳、菜單、評論）使用 anon key 即可。
 * - 寫入 fake_orders / 更新外送員座標時，若有 service role key 則優先使用，
 *   以繞過 RLS（service role key 只會留在 server，永不外洩到前端）。
 *
 * 未設定環境變數時回傳 null，呼叫端改用本地 seed 資料。
 */
export function getServerSupabase(
  options: { useServiceRole?: boolean } = {},
): SupabaseClient<Database> | null {
  if (!url || !anonKey) return null;

  const key =
    options.useServiceRole && serviceRoleKey ? serviceRoleKey : anonKey;

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
