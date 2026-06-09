"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";
import { useStreak } from "@/lib/useStreak";
import { formatNT } from "@/lib/format";
import TopBar from "@/components/TopBar";

interface Achievement {
  emoji: string;
  label: string;
  desc: string;
  unlocked: boolean;
}

export default function StatsPage() {
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const orders = useOrderStore((s) => s.orders);
  const streak = useStreak();

  const stats = useMemo(() => {
    const list = Object.values(orders);
    const saved = list.reduce((s, o) => s + (o.total ?? 0), 0);
    const items = list.reduce(
      (s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0),
      0,
    );
    const distinct = new Set(
      list.flatMap((o) => o.items.map((i) => i.restaurantId)),
    ).size;
    const lateNight = list.some((o) => {
      const h = new Date(o.createdAt).getHours();
      return h >= 23 || h < 5;
    });
    // 最常幻想的餐廳
    const freq: Record<string, number> = {};
    for (const o of list) {
      const n = o.items[0]?.restaurantName ?? "幻想餐廳";
      freq[n] = (freq[n] ?? 0) + 1;
    }
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return {
      count: list.length,
      saved,
      items,
      distinct,
      lateNight,
      topName: top?.[0],
      topCount: top?.[1] ?? 0,
    };
  }, [orders]);

  const achievements: Achievement[] = [
    { emoji: "🍽️", label: "初次幻想", desc: "完成第一筆幻想訂單", unlocked: stats.count >= 1 },
    { emoji: "🔁", label: "幻想常客", desc: "累積 10 筆幻想訂單", unlocked: stats.count >= 10 },
    { emoji: "🌍", label: "美食探險家", desc: "幻想過 5 間不同餐廳", unlocked: stats.distinct >= 5 },
    { emoji: "🌙", label: "深夜俠", desc: "在 23:00–05:00 幻想過", unlocked: stats.lateNight },
    { emoji: "🏆", label: "連續三日", desc: "連續 3 天打開幻想", unlocked: streak >= 3 },
    { emoji: "🔥", label: "連續七日", desc: "連續 7 天打開幻想", unlocked: streak >= 7 },
    { emoji: "💸", label: "千元戒斷", desc: "省下超過 NT$1,000", unlocked: stats.saved >= 1000 },
    { emoji: "🐷", label: "萬元存款", desc: "省下超過 NT$10,000", unlocked: stats.saved >= 10000 },
  ];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      <TopBar showBack title="戒斷成績單" />
      <main className="mx-auto max-w-2xl space-y-5 px-4 pb-28 pt-4">
        {hasHydrated && stats.count === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl">🐷</p>
            <p className="mt-4 text-zinc-500">
              還沒有戒斷成績<br />
              （去幻想一筆，存錢筒就會開始長大）
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
            >
              開始幻想
            </Link>
          </div>
        ) : (
          <>
            {/* 存錢筒 hero */}
            <motion.section
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-surface p-6 text-center"
            >
              <p className="text-5xl">🐷</p>
              <p className="mt-3 text-sm text-emerald-700/80">
                靠幻想外送，你總共省下了
              </p>
              <p className="font-display text-4xl font-black text-emerald-600">
                {formatNT(stats.saved)}
              </p>
              <p className="mt-1 text-xs text-emerald-700/60">
                （都是沒真的花掉的錢）
              </p>
            </motion.section>

            {/* 數據格 */}
            <section className="grid grid-cols-3 gap-3">
              <Stat label="幻想次數" value={`${stats.count}`} suffix="筆" />
              <Stat label="連續天數" value={`${streak}`} suffix="天" />
              <Stat label="逛過餐廳" value={`${stats.distinct}`} suffix="間" />
            </section>

            {stats.topName && (
              <section className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
                <span className="text-zinc-500">最常幻想的店 ・ </span>
                <span className="font-semibold text-zinc-900">
                  {stats.topName}
                </span>
                <span className="text-zinc-500">（{stats.topCount} 次）</span>
              </section>
            )}

            {/* 成就徽章 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-zinc-900">成就徽章</h2>
                <span className="text-sm text-zinc-500">
                  {unlockedCount} / {achievements.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {achievements.map((a) => (
                  <div
                    key={a.label}
                    className={`rounded-2xl border p-3 text-center transition ${
                      a.unlocked
                        ? "border-amber-300 bg-amber-50"
                        : "border-border bg-surface-2 opacity-60"
                    }`}
                  >
                    <p
                      className={`text-3xl ${a.unlocked ? "" : "grayscale"}`}
                    >
                      {a.unlocked ? a.emoji : "🔒"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-800">
                      {a.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-zinc-500">
                      {a.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <p className="px-2 text-center text-sm leading-relaxed text-zinc-500">
              每一筆沒送來的訂單，都是你對衝動的一次小勝利。<br />
              這些錢，真的還在你的口袋裡。
            </p>
          </>
        )}
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 text-center">
      <p className="font-display text-2xl font-bold text-uber">{value}</p>
      <p className="text-xs text-zinc-500">
        {label}
        <span className="ml-0.5 text-zinc-400">{suffix}</span>
      </p>
    </div>
  );
}
