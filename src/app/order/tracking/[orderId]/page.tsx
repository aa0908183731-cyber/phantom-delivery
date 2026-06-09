"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";
import {
  DESTINATION,
  nextRiderPosition,
  riderOrigin,
  routePoints,
  type LatLng,
} from "@/lib/fakeDelivery";
import { useIsDark } from "@/lib/useIsDark";
import { supabase } from "@/lib/supabase";
import { formatNT, formatTime } from "@/lib/format";
import TopBar from "@/components/TopBar";
import StatusTimeline from "@/components/StatusTimeline";
import RiderCard from "@/components/RiderCard";
import DeliveryMessage from "@/components/DeliveryMessage";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-surface text-sm text-zinc-500">
      地圖載入中…
    </div>
  ),
});

const TEN_MINUTES = 10 * 60 * 1000;

export default function TrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const order = useOrderStore((s) => s.orders[orderId]);
  const updateRider = useOrderStore((s) => s.updateRider);

  const [rider, setRider] = useState<LatLng | null>(null);
  const riderRef = useRef<LatLng | null>(null);
  const dark = useIsDark();

  const [now, setNow] = useState(() => Date.now());
  const [showHungry, setShowHungry] = useState(false);
  const [hungryDismissed, setHungryDismissed] = useState(false);

  const elapsedMs = order ? now - new Date(order.createdAt).getTime() : 0;
  const reached10 = elapsedMs >= TEN_MINUTES;

  // 種下外送員初始位置（沿用上次離開時的位置，不重置）— 規則 7
  useEffect(() => {
    if (order && riderRef.current === null) {
      const init = { lat: order.riderLat, lng: order.riderLng };
      riderRef.current = init;
      setRider(init);
    }
  }, [order]);

  // 每秒更新計時（驅動時間軸與彩蛋）
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // 每 3 秒產生新假座標：更新本地、寫回 store、（若有）寫進 Supabase
  useEffect(() => {
    if (!order) return;
    const dest = {
      lat: order.destLat ?? DESTINATION.lat,
      lng: order.destLng ?? DESTINATION.lng,
    };
    const id = setInterval(() => {
      const cur = riderRef.current ?? {
        lat: order.riderLat,
        lng: order.riderLng,
      };
      const next = nextRiderPosition(cur, dest);
      riderRef.current = next;
      setRider(next);
      updateRider(order.id, next.lat, next.lng);

      if (supabase) {
        supabase
          .from("fake_orders")
          // @supabase/ssr 的 browser client 在此會把 payload 型別推成 never，
          // 這裡只是寫入外送員座標，用 cast 繞過即可。
          .update({
            rider_lat: next.lat,
            rider_lng: next.lng,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", order.id)
          .then(
            () => {},
            () => {},
          );
      }
    }, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  // Supabase Realtime：訂閱外送員座標變化（沒設定 Supabase 時自動跳過，用本地模擬）
  useEffect(() => {
    if (!order || !supabase) return;
    const sb = supabase;
    const channel = sb
      .channel(`order-tracking-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "fake_orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const n = payload.new as {
            rider_lat: number | null;
            rider_lng: number | null;
          };
          if (typeof n.rider_lat === "number" && typeof n.rider_lng === "number") {
            const p = { lat: n.rider_lat, lng: n.rider_lng };
            riderRef.current = p;
            setRider(p);
          }
        },
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  // 彩蛋 2：等待超過 10 分鐘
  useEffect(() => {
    if (reached10 && !hungryDismissed) setShowHungry(true);
  }, [reached10, hungryDismissed]);

  // 找不到訂單
  if (hasHydrated && !order) {
    return (
      <>
        <TopBar showBack backHref="/" title="訂單追蹤" />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="text-5xl">🤔</p>
          <p className="mt-4 text-zinc-500">
            找不到這筆訂單，可能它太虛幻了。
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
          >
            回首頁
          </Link>
        </main>
      </>
    );
  }

  if (!order || !rider) {
    return (
      <main className="grid min-h-dvh place-items-center text-zinc-500">
        載入中…
      </main>
    );
  }

  const statusLabel =
    elapsedMs >= 60_000
      ? "外送員出發中"
      : elapsedMs >= 30_000
        ? "餐廳備餐中"
        : "訂單已確認";

  const dest = {
    lat: order.destLat ?? DESTINATION.lat,
    lng: order.destLng ?? DESTINATION.lng,
  };
  const origin = riderOrigin(order.id, dest);
  const route = routePoints(origin, dest);

  return (
    <>
      <TopBar showBack backHref="/" title="訂單追蹤" />
      <DeliveryMessage />

      {/* 地圖 */}
      <div className="relative h-[42dvh] w-full">
        <TrackingMap
          rider={rider}
          destination={dest}
          origin={origin}
          route={route}
          dark={dark}
        />
        <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
          🛵 {statusLabel}・預計 {formatTime(order.etaIso)}
        </div>
      </div>

      <main className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-5">
        {/* 彩蛋 2 提示 */}
        <AnimatePresence>
          {showHungry && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-900/25 dark:text-amber-300"
            >
              <span>你還餓嗎？還是已經不餓了？</span>
              <button
                onClick={() => {
                  setShowHungry(false);
                  setHungryDismissed(true);
                }}
                className="shrink-0 text-amber-600/70 hover:text-amber-700 dark:text-amber-400/70 dark:hover:text-amber-300"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 外送員資訊 */}
        <RiderCard
          name={order.riderName}
          rating={order.riderRating}
          avatar={order.riderAvatar}
        />

        {/* 狀態時間軸 */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-5 font-bold">外送進度</h2>
          <StatusTimeline elapsedMs={elapsedMs} />
        </section>

        {/* 訂單摘要 */}
        <section className="space-y-2 rounded-2xl border border-border bg-surface p-5 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>送達地址</span>
            <span className="max-w-[60%] truncate text-right text-zinc-800">
              {order.address}
            </span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>品項數量</span>
            <span className="text-zinc-800">
              {order.items.reduce((s, i) => s + i.quantity, 0)} 件
            </span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>訂單金額</span>
            <span className="text-zinc-800">{formatNT(order.total)}</span>
          </div>
        </section>

        <p className="px-2 text-center text-sm leading-relaxed text-zinc-500">
          這份食物不會來。<br />
          但你剛剛度過了想點外送的那幾分鐘。
        </p>

        <Link
          href="/"
          className="mx-auto block w-full max-w-xs rounded-full border border-border bg-surface py-3 text-center text-sm font-medium text-zinc-800 transition hover:bg-surface-2"
        >
          結束幻想，回首頁 →
        </Link>
      </main>
    </>
  );
}
