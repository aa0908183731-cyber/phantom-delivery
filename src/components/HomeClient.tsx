"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Restaurant } from "@/types/database.types";
import { HOME_CATEGORIES } from "@/lib/seedData";
import { useStreak } from "@/lib/useStreak";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useToastStore } from "@/store/toastStore";
import BannerCarousel from "./BannerCarousel";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import RestaurantCard from "./RestaurantCard";
import CartSidebar from "./CartSidebar";
import SavingsBanner from "./SavingsBanner";

// 心情點餐：每種心情對應一組分類，點了就從裡面隨機挑一家
const MOODS: { label: string; emoji: string; cats: string[] }[] = [
  { label: "嘴饞", emoji: "🍗", cats: ["炸物", "美式", "熱炒"] },
  { label: "宵夜", emoji: "🌙", cats: ["宵夜", "炸物", "熱炒", "燒肉"] },
  { label: "療癒甜點", emoji: "🍰", cats: ["飲料甜點", "冰品"] },
  { label: "異國風", emoji: "🌏", cats: ["異國", "日式", "港式", "印度", "墨西哥", "義式"] },
  { label: "在地台味", emoji: "🍚", cats: ["台式", "便當"] },
];

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
  const router = useRouter();
  const streak = useStreak();
  const favIds = useFavoritesStore((s) => s.ids);
  const favCount = Object.keys(favIds).length;
  const showToast = useToastStore((s) => s.show);

  useEffect(() => setMounted(true), []);

  // 幫我選：從候選餐廳隨機挑一家直接進店
  function fantasizeRandom(pool: Restaurant[], label?: string) {
    if (pool.length === 0) {
      showToast("這個範圍沒有店家可選 🥲", { emoji: "🎲" });
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    showToast(`${label ? label + "：" : "就決定是"}「${pick.name}」了！🎲`, {
      emoji: "🎯",
    });
    router.push(`/restaurant/${pick.id}`);
  }

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
      {/* 幻想存錢筒：省下的錢 */}
      <SavingsBanner />

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

      {/* 選擇障礙救星：幫我選 + 心情點餐 */}
      <div className="mb-4 rounded-2xl border border-border bg-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-800">
            選擇障礙？讓幻想幫你決定 🎯
          </p>
          <button
            onClick={() => fantasizeRandom(filtered)}
            className="shrink-0 rounded-full bg-uber px-4 py-1.5 text-sm font-bold text-black transition hover:brightness-105 active:scale-95"
          >
            🎲 幫我選
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() =>
                fantasizeRandom(
                  restaurants.filter((r) => m.cats.includes(r.category)),
                  m.label,
                )
              }
              className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-uber hover:text-uber active:scale-95"
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
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
