"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";
import { formatNT } from "@/lib/format";

/**
 * 幻想存錢筒：把每一筆「沒真的下單」的訂單總額加起來，當作你省下的錢。
 * compact 版用於頁面頂部 banner；完整版（/stats）另算。
 */
export function useSavings() {
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const orders = useOrderStore((s) => s.orders);
  return useMemo(() => {
    const list = Object.values(orders);
    const saved = list.reduce((sum, o) => sum + (o.total ?? 0), 0);
    return { hasHydrated, saved, count: list.length };
  }, [hasHydrated, orders]);
}

export default function SavingsBanner() {
  const { hasHydrated, saved, count } = useSavings();
  if (!hasHydrated || count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <Link
        href="/stats"
        className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition hover:bg-emerald-100/70 dark:border-emerald-900/60 dark:bg-emerald-900/25 dark:hover:bg-emerald-900/40"
      >
        <span className="text-2xl">🐷</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            你靠幻想外送省下了{" "}
            <span className="font-display text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatNT(saved)}
            </span>
          </p>
          <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
            已幻想 {count} 次，一塊錢都沒真的花掉 ・ 看戒斷成績 →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
