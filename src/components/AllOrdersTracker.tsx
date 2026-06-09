"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useOrderStore } from "@/store/orderStore";
import {
  DESTINATION,
  nextRiderPosition,
  riderOrigin,
  routePoints,
  type LatLng,
} from "@/lib/fakeDelivery";
import { useIsDark } from "@/lib/useIsDark";
import type { RiderDot } from "./LiveRidersMap";

const LiveRidersMap = dynamic(() => import("./LiveRidersMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-surface text-sm text-zinc-500">
      地圖載入中…
    </div>
  ),
});

/** 同時模擬並顯示多筆訂單的外送員，全部沿著各自路線繞向你家。 */
export default function AllOrdersTracker({ orderIds }: { orderIds: string[] }) {
  const orderMap = useOrderStore((s) => s.orders);
  const updateRider = useOrderStore((s) => s.updateRider);
  const dark = useIsDark();

  // 凍結這批要追蹤的訂單（避免每次 render 重新洗位置）
  const idsRef = useRef(orderIds);
  const orders = idsRef.current
    .map((id) => orderMap[id])
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  const [positions, setPositions] = useState<Record<string, LatLng>>({});
  const posRef = useRef<Record<string, LatLng>>({});

  // 每筆訂單的目的地、餐廳位置與路線（固定不變）
  const geo = useMemo(() => {
    const g: Record<string, { dest: LatLng; origin: LatLng; route: LatLng[] }> =
      {};
    for (const o of orders) {
      const dest = {
        lat: o.destLat ?? DESTINATION.lat,
        lng: o.destLng ?? DESTINATION.lng,
      };
      const origin = riderOrigin(o.id, dest);
      g[o.id] = { dest, origin, route: routePoints(origin, dest) };
    }
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 初始化每位外送員位置（沿用 store 內最後座標）
  useEffect(() => {
    const init: Record<string, LatLng> = {};
    for (const o of orders) init[o.id] = { lat: o.riderLat, lng: o.riderLng };
    posRef.current = init;
    setPositions(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 單一計時器同時推進所有外送員
  useEffect(() => {
    const timer = setInterval(() => {
      const next: Record<string, LatLng> = { ...posRef.current };
      for (const o of orders) {
        const dest = geo[o.id]?.dest ?? DESTINATION;
        const cur = next[o.id] ?? { lat: o.riderLat, lng: o.riderLng };
        const np = nextRiderPosition(cur, dest);
        next[o.id] = np;
        updateRider(o.id, np.lat, np.lng);
      }
      posRef.current = next;
      setPositions(next);
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orders.length === 0) return null;

  const dest = geo[orders[0].id]?.dest ?? DESTINATION;
  const riders: RiderDot[] = orders
    .filter((o) => positions[o.id] && geo[o.id])
    .map((o) => ({
      id: o.id,
      pos: positions[o.id],
      origin: geo[o.id].origin,
      route: geo[o.id].route,
      label: o.items[0]?.restaurantName ?? "幻想餐廳",
    }));

  return <LiveRidersMap riders={riders} destination={dest} dark={dark} />;
}
