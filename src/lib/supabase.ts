"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 是否已設定 Supabase 公開金鑰。
 * 沒設定時 App 會自動退回本地假資料模式（含外送員模擬）。
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * 前端 Supabase client（瀏覽器用）。
 * 若未設定環境變數則為 null，呼叫端需自行處理 fallback。
 */
export const supabase = isSupabaseConfigured
  ? createBrowserClient<Database>(url!, anonKey!)
  : null;
