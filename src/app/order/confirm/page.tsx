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
  const lastOrderId = useOrderStore((s) => s.lastOrderId);
  const order = useOrderStore((s) =>
    lastOrderId ? s.orders[lastOrderId] : undefined,
  );

  const [countdown, setCountdown] = useState(3);

  // 沒有訂單時導回首頁
  useEffect(() => {
    if (hasHydrated && !order) {
      router.replace("/");
    }
  }, [hasHydrated, order, router]);

  // 3 秒倒數後跳轉追蹤頁
  useEffect(() => {
    if (!order) return;
    if (countdown <= 0) {
      router.replace(`/order/tracking/${order.id}`);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, order, router]);

  if (!order) {
    return (
      <main className="grid min-h-dvh place-items-center text-zinc-500">
        載入中…
      </main>
    );
  }

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
            訂單成立！
          </h1>
          <p className="mt-2 text-zinc-500">
            （但你心裡也知道，它不會來）
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-3 rounded-2xl border border-border bg-surface p-5 text-left text-sm"
        >
          <Row label="訂單編號">
            <span className="font-display font-bold tracking-wider text-uber">
              #{shortOrderCode(order.id)}
            </span>
          </Row>
          <Row label="預計送達">
            <span>
              {order.deliveryWhen && order.deliveryWhen !== "盡快送達"
                ? order.deliveryWhen
                : `${formatTime(order.etaIso)}（左右）`}
            </span>
          </Row>
          <Row label="外送地址">
            <span className="max-w-[60%] truncate text-right">
              {order.address}
            </span>
          </Row>
          <Row label="總金額">
            <span className="font-semibold">{formatNT(order.total)}</span>
          </Row>
        </motion.div>

        <p className="mt-6 text-sm text-zinc-500">
          {countdown} 秒後自動前往追蹤頁…
        </p>
        <Link
          href={`/order/tracking/${order.id}`}
          className="mt-3 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
        >
          立即查看外送進度 →
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
