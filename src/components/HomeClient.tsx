"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Restaurant } from "@/types/database.types";
import { HOME_CATEGORIES } from "@/lib/seedData";
import { useStreak } from "@/lib/useStreak";
import { useFavoritesStore } from "@/store/favoritesStore";
import BannerCarousel from "./BannerCarousel";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import RestaurantCard from "./RestaurantCard";
import CartSidebar from "./CartSidebar";

export default function HomeClient({
  restaurants,
  searchIndex,
}: {
  restaurants: Restaurant[];
  searchIndex: Record<string, string>;
}) {
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("推薦");
  const [favOnly, setFavOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const streak = useStreak();
  const favIds = useFavoritesStore((s) => s.ids);
  const favCount = Object.keys(favIds).length;

  useEffect(() => setMounted(true), []);

  // 深夜彩蛋（彩蛋 3）：23:00–05:00
  const isLateNight = useMemo(() => {
    if (!mounted) return false;
    const h = new Date().getHours();
    return h >= 23 || h < 5;
  }, [mounted]);

  // 分類 + 搜尋 + 收藏 + 排序，全部都是真的
  const filtered = useMemo(() => {
    let list = restaurants;
    if (category !== "全部") {
      list = list.filter((r) => r.category === category);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        (searchIndex[r.id] ?? r.name.toLowerCase()).includes(q),
      );
    }
    if (favOnly) {
      list = list.filter((r) => favIds[r.id]);
    }

    const mins = (t: string | null) => {
      const m = (t ?? "").match(/\d+/);
      return m ? parseInt(m[0], 10) : 999;
    };
    if (sort === "評分") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === "快送") {
      list = [...list].sort(
        (a, b) => mins(a.delivery_time) - mins(b.delivery_time),
      );
    } else if (sort === "低消") {
      list = [...list].sort((a, b) => (a.min_order ?? 0) - (b.min_order ?? 0));
    }
    return list;
  }, [restaurants, category, search, searchIndex, favOnly, favIds, sort]);

  const greeting = isLateNight
    ? "宵夜只存在於你的想像中 🌙"
    : "今天想幻想點什麼？🍜";

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-4">
      {/* 連續天數成就 banner（彩蛋 5） */}
      <AnimatePresence>
        {mounted && streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
              你已經連續幻想外送 {streak} 天了 🏆 你的荷包感謝你
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="mb-4 text-2xl font-bold text-zinc-900">{greeting}</h1>

      <BannerCarousel />

      <div className="sticky top-14 z-30 -mx-4 space-y-3 bg-bg/90 px-4 py-3 backdrop-blur-md">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs
          categories={HOME_CATEGORIES}
          active={category}
          onChange={setCategory}
        />
      </div>

      <div className="mb-3 mt-3 flex items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-zinc-700 focus:border-uber focus:outline-none"
        >
          <option value="推薦">推薦排序</option>
          <option value="評分">評分高到低</option>
          <option value="快送">外送最快</option>
          <option value="低消">最低消費低</option>
        </select>
        <button
          onClick={() => setFavOnly((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            favOnly
              ? "border-panda bg-panda/10 text-panda"
              : "border-border bg-surface text-zinc-600"
          }`}
        >
          ❤️ 只看收藏
          {mounted && favCount > 0 ? `（${favCount}）` : ""}
        </button>
      </div>

      {search.trim() && (
        <p className="mb-3 text-sm text-zinc-500">
          「{search.trim()}」找到 {filtered.length} 間店
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-zinc-500">
          {favOnly
            ? "還沒收藏任何店家，點卡片右上的 🤍 收藏吧"
            : search.trim()
              ? `找不到「${search.trim()}」的店，換個關鍵字試試？`
              : "這個分類暫時沒有店家，換一個試試？"}
        </p>
      )}

      <CartSidebar />
    </main>
  );
}
