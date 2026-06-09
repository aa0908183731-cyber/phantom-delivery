"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";
import { shortOrderCode } from "@/lib/fakeDelivery";
import { formatNT, formatTime } from "@/lib/format";
import Confetti from "@/components/Confetti";

export default function OrderConfirmPage() {
  const router = useRouter();
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const lastOrderIds = useOrderStore((s) => s.lastOrderIds);
  const orderMap = useOrderStore((s) => s.orders);

  const orders = lastOrderIds.map((id) => orderMap[id]).filter(Boolean);
  const multi = orders.length > 1;
  const primary = orders[0];
  // 多家 → 去「全部一起追蹤」的訂單頁；單家 → 去該筆追蹤頁
  const nextHref = multi ? "/orders" : primary ? `/order/tracking/${primary.id}` : "/";

  const [countdown, setCountdown] = useState(3);

  // 沒有訂單時導回首頁
  useEffect(() => {
    if (hasHydrated && orders.length === 0) {
      router.replace("/");
    }
  }, [hasHydrated, orders.length, router]);

  // 3 秒倒數後跳轉
  useEffect(() => {
    if (orders.length === 0) return;
    if (countdown <= 0) {
      router.replace(nextHref);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, orders.length, nextHref, router]);

  if (!primary) {
    return (
      <main className="grid min-h-dvh place-items-center text-zinc-500">
        載入中…
      </main>
    );
  }

  const grandTotal = orders.reduce((s, o) => s + o.total, 0);
  const totalItems = orders.reduce(
    (s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0),
    0,
  );

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <Confetti />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <p className="text-7xl">🎉</p>
          <h1 className="mt-4 text-4xl font-black text-gradient">
            {multi ? `${orders.length} 家訂單成立！` : "訂單成立！"}
          </h1>
          <p className="mt-2 text-zinc-500">
            {multi
              ? `${orders.length} 位外送員同時出發（但一個都不會到）`
              : "（但你心裡也知道，它不會來）"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-3 rounded-2xl border border-border bg-surface p-5 text-left text-sm"
        >
          {multi ? (
            <>
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="min-w-0 flex-1 truncate text-zinc-700">
                    🏬 {o.items[0]?.restaurantName ?? "幻想餐廳"}
                  </span>
                  <span className="font-display font-semibold text-uber">
                    {formatNT(o.total)}
                  </span>
                </div>
              ))}
              <div className="my-1 border-t border-border" />
              <Row label={`共 ${totalItems} 件`}>
                <span className="font-semibold">{formatNT(grandTotal)}</span>
              </Row>
            </>
          ) : (
            <>
              <Row label="訂單編號">
                <span className="font-display font-bold tracking-wider text-uber">
                  #{shortOrderCode(primary.id)}
                </span>
              </Row>
              <Row label="預計送達">
                <span>
                  {primary.deliveryWhen && primary.deliveryWhen !== "盡快送達"
                    ? primary.deliveryWhen
                    : `${formatTime(primary.etaIso)}（左右）`}
                </span>
              </Row>
              <Row label="外送地址">
                <span className="max-w-[60%] truncate text-right">
                  {primary.address}
                </span>
              </Row>
              <Row label="總金額">
                <span className="font-semibold">{formatNT(primary.total)}</span>
              </Row>
            </>
          )}
        </motion.div>

        <p className="mt-6 text-sm text-zinc-500">
          {countdown} 秒後自動前往
          {multi ? "「全部一起追蹤」…" : "追蹤頁…"}
        </p>
        <Link
          href={nextHref}
          className="mt-3 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
        >
          {multi ? "一起看 N 位外送員亂繞 →" : "立即查看外送進度 →"}
        </Link>
      </div>
    </main>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-800">{children}</span>
    </div>
  );
}
