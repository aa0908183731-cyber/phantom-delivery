"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useOrderStore } from "@/store/orderStore";
import { DESTINATION, nextRiderPosition, type LatLng } from "@/lib/fakeDelivery";
import type { RiderDot } from "./LiveRidersMap";

const LiveRidersMap = dynamic(() => import("./LiveRidersMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-surface text-sm text-zinc-500">
      地圖載入中…
    </div>
  ),
});

/** 同時模擬並顯示多筆訂單的外送員，全部繞著你家亂繞。 */
export default function AllOrdersTracker({ orderIds }: { orderIds: string[] }) {
  const orderMap = useOrderStore((s) => s.orders);
  const updateRider = useOrderStore((s) => s.updateRider);

  // 凍結這批要追蹤的訂單（避免每次 render 重新洗位置）
  const idsRef = useRef(orderIds);
  const orders = idsRef.current
    .map((id) => orderMap[id])
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  const [positions, setPositions] = useState<Record<string, LatLng>>({});
  const [trails, setTrails] = useState<Record<string, LatLng[]>>({});
  const posRef = useRef<Record<string, LatLng>>({});

  // 初始化每位外送員的位置（沿用 store 內最後座標）
  useEffect(() => {
    const init: Record<string, LatLng> = {};
    const initTrails: Record<string, LatLng[]> = {};
    for (const o of orders) {
      init[o.id] = { lat: o.riderLat, lng: o.riderLng };
      initTrails[o.id] = [{ lat: o.riderLat, lng: o.riderLng }];
    }
    posRef.current = init;
    setPositions(init);
    setTrails(initTrails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 單一計時器同時推進所有外送員
  useEffect(() => {
    const timer = setInterval(() => {
      const nextPos: Record<string, LatLng> = { ...posRef.current };
      for (const o of orders) {
        const dest = {
          lat: o.destLat ?? DESTINATION.lat,
          lng: o.destLng ?? DESTINATION.lng,
        };
        const cur = nextPos[o.id] ?? { lat: o.riderLat, lng: o.riderLng };
        const np = nextRiderPosition(cur, dest);
        nextPos[o.id] = np;
        updateRider(o.id, np.lat, np.lng);
      }
      posRef.current = nextPos;
      setPositions(nextPos);
      setTrails((prev) => {
        const out: Record<string, LatLng[]> = {};
        for (const o of orders) {
          out[o.id] = [...(prev[o.id] ?? []), nextPos[o.id]].slice(-14);
        }
        return out;
      });
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orders.length === 0) return null;

  const dest = {
    lat: orders[0].destLat ?? DESTINATION.lat,
    lng: orders[0].destLng ?? DESTINATION.lng,
  };

  const riders: RiderDot[] = orders
    .filter((o) => positions[o.id])
    .map((o) => ({
      id: o.id,
      pos: positions[o.id],
      trail: trails[o.id] ?? [],
      label: o.items[0]?.restaurantName ?? "幻想餐廳",
    }));

  return <LiveRidersMap riders={riders} destination={dest} />;
}
