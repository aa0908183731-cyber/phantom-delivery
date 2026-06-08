"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Restaurant } from "@/types/database.types";
import { HOME_CATEGORIES } from "@/lib/seedData";
import { useStreak } from "@/lib/useStreak";
import BannerCarousel from "./BannerCarousel";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import RestaurantCard from "./RestaurantCard";
import CartSidebar from "./CartSidebar";

export default function HomeClient({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const streak = useStreak();

  useEffect(() => setMounted(true), []);

  // 深夜彩蛋（彩蛋 3）：23:00–05:00
  const isLateNight = useMemo(() => {
    if (!mounted) return false;
    const h = new Date().getHours();
    return h >= 23 || h < 5;
  }, [mounted]);

  // 分類篩選是真的；搜尋只是裝飾（輸入任何字都顯示全部）
  const filtered = useMemo(() => {
    if (category === "全部") return restaurants;
    return restaurants.filter((r) => r.category === category);
  }, [restaurants, category]);

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

      {search.trim() && (
        <p className="mb-3 text-sm text-zinc-500">
          顯示「{search.trim()}」的搜尋結果（其實跟沒搜尋一樣啦 😏）
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-zinc-500">
          這個分類暫時沒有店家，換一個試試？
        </p>
      )}

      <CartSidebar />
    </main>
  );
}
