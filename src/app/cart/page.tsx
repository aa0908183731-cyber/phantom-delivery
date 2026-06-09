"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCartStore,
  groupByRestaurant,
  DELIVERY_FEE,
  SERVICE_FEE,
} from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import type { StoredOrder } from "@/store/orderStore";
import { useToastStore } from "@/store/toastStore";
import { useLocationStore } from "@/store/locationStore";
import { createFakeOrder } from "@/actions/createFakeOrder";
import { formatNT } from "@/lib/format";
import TopBar from "@/components/TopBar";

const PAYMENT_METHODS = [
  { id: "credit", label: "信用卡", emoji: "💳" },
  { id: "linepay", label: "LINE Pay", emoji: "🟢" },
  { id: "jkopay", label: "街口支付", emoji: "🔵" },
  { id: "taiwanpay", label: "台灣 Pay", emoji: "🟣" },
  { id: "cod", label: "貨到付款", emoji: "💵" },
];

// 產生預約時段（純 UI）：從下一個半點起、每 30 分鐘一個，共 10 個
function genTimeSlots(): { iso: string; label: string }[] {
  const now = new Date();
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(now.getMinutes() < 30 ? 30 : 60);
  return Array.from({ length: 10 }, (_, i) => {
    const t = new Date(start.getTime() + i * 30 * 60_000);
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    const day = t.getDate() !== now.getDate() ? "明天" : "今天";
    return { iso: t.toISOString(), label: `${day} ${hh}:${mm}` };
  });
}

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());
  const addOrders = useOrderStore((s) => s.addOrders);
  const show = useToastStore((s) => s.show);

  const groups = useMemo(() => groupByRestaurant(items), [items]);
  const location = useLocationStore((s) => s.location);
  const locHydrated = useLocationStore((s) => s.hasHydrated);

  const [address, setAddress] = useState("");

  // 預填目前選定的外送地址（TopBar 可改成「目前位置」）
  useEffect(() => {
    if (locHydrated) setAddress((a) => a || location.address);
  }, [locHydrated, location.address]);

  const [promo, setPromo] = useState("");
  const [payment, setPayment] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [warnBigSpend, setWarnBigSpend] = useState(false);

  const slots = useMemo(genTimeSlots, []);
  const [deliveryMode, setDeliveryMode] = useState<"asap" | "scheduled">(
    "asap",
  );
  const [slotIso, setSlotIso] = useState("");
  const chosenSlot = slots.find((s) => s.iso === slotIso) ?? slots[0];

  // 一次很多家：外送費 + 服務費「每家各算一次」
  const fees = (DELIVERY_FEE + SERVICE_FEE) * groups.length;
  const total = subtotal + fees;

  async function placeOrder() {
    setLoading(true);
    try {
      const scheduled = deliveryMode === "scheduled" && chosenSlot;
      const addr = address.trim() || "台北市信義區松仁路 100 號";
      const paymentLabel =
        PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? "信用卡";
      const deliveryWhen = scheduled ? `預約 ${chosenSlot.label}` : "盡快送達";

      // 每家餐廳各建立一筆訂單，可同時幻想很多家、各自有外送員與追蹤
      const created = await Promise.all(
        groups.map((g) =>
          createFakeOrder({
            items: g.items,
            address: addr,
            paymentMethod: paymentLabel,
            subtotal: g.subtotal,
            deliveryWhen,
            etaIso: scheduled ? chosenSlot.iso : undefined,
            destLat: location.lat,
            destLng: location.lng,
          }),
        ),
      );

      const stored: StoredOrder[] = created.map((order, i) => ({
        id: order.id,
        items: groups[i].items,
        address: order.address,
        paymentMethod: order.paymentMethod,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        serviceFee: order.serviceFee,
        total: order.total,
        riderName: order.riderName,
        riderRating: order.riderRating,
        riderAvatar: order.riderAvatar,
        riderLat: order.riderLat,
        riderLng: order.riderLng,
        destLat: order.destLat,
        destLng: order.destLng,
        etaIso: order.etaIso,
        deliveryWhen: order.deliveryWhen,
        createdAt: order.createdAt,
      }));

      addOrders(stored);
      clear();
      router.push("/order/confirm");
    } catch {
      show("下單失敗了，但反正也不會送到啦 🤷", { emoji: "⚠️" });
      setLoading(false);
    }
  }

  function handleCheckout() {
    if (items.length === 0) return;
    // 彩蛋 4：金額超過 NT$1,000
    if (total > 1000 && !warnBigSpend) {
      setWarnBigSpend(true);
      return;
    }
    placeOrder();
  }

  if (hasHydrated && items.length === 0) {
    return (
      <>
        <TopBar showBack title="購物車" />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-5xl">🛒</p>
          <p className="mt-4 text-zinc-500">
            購物車是空的<br />
            （但說真的，食物本來也不會來）
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
          >
            回去逛逛
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar showBack title="購物車" />
      <main className="mx-auto max-w-2xl space-y-6 px-4 pb-32 pt-4">
        {/* 品項列表（依餐廳分組，一次可以很多家） */}
        {groups.length > 1 && (
          <p className="-mb-2 text-sm font-medium text-panda">
            🛵 一次幻想 {groups.length} 家，{groups.length} 位外送員各跑各的
          </p>
        )}
        <section className="space-y-5">
          {groups.map((g) => (
            <div key={g.restaurantId} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-zinc-800">
                  <span>🏬</span>
                  {g.restaurantName}
                </h2>
                <span className="text-xs text-zinc-500">
                  小計 {formatNT(g.subtotal)}
                </span>
              </div>
              {g.items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="mt-1 font-display font-semibold text-uber">
                      {formatNT(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-xs text-zinc-500 hover:text-panda"
                    >
                      刪除
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(item.menuItemId)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-zinc-800"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.menuItemId)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-uber text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* 配送地址 */}
        <section>
          <h2 className="mb-2 font-semibold">配送地址</h2>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="輸入任何地址都會被接受…"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-uber focus:outline-none"
          />
          {address.trim() && (
            <p className="mt-1.5 text-sm text-uber">地址確認 ✅</p>
          )}
        </section>

        {/* 外送時間 */}
        <section>
          <h2 className="mb-2 font-semibold">外送時間</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDeliveryMode("asap")}
              className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left text-sm transition ${
                deliveryMode === "asap"
                  ? "border-uber bg-uber/10"
                  : "border-border bg-surface"
              }`}
            >
              <span className="font-medium">🚀 盡快送達</span>
              <span className="text-xs text-zinc-500">約 25–40 分鐘</span>
            </button>
            <button
              onClick={() => {
                setDeliveryMode("scheduled");
                if (!slotIso) setSlotIso(slots[0].iso);
              }}
              className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left text-sm transition ${
                deliveryMode === "scheduled"
                  ? "border-uber bg-uber/10"
                  : "border-border bg-surface"
              }`}
            >
              <span className="font-medium">🕒 預約時段</span>
              <span className="text-xs text-zinc-500">挑一個時間</span>
            </button>
          </div>
          {deliveryMode === "scheduled" && (
            <select
              value={chosenSlot.iso}
              onChange={(e) => setSlotIso(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-uber focus:outline-none"
            >
              {slots.map((s) => (
                <option key={s.iso} value={s.iso}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1.5 text-xs text-zinc-400">
            （送達時間只是裝飾，反正不會來 😌）
          </p>
        </section>

        {/* 付款方式 */}
        <section>
          <h2 className="mb-2 font-semibold">付款方式</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  payment === m.id
                    ? "border-uber bg-uber/10"
                    : "border-border bg-surface"
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="flex-1">{m.label}</span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${
                    payment === m.id
                      ? "border-uber bg-uber text-black"
                      : "border-zinc-300"
                  }`}
                >
                  {payment === m.id ? "✓" : ""}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 優惠碼 */}
        <section>
          <h2 className="mb-2 font-semibold">優惠碼</h2>
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="輸入優惠碼"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-uber focus:outline-none"
            />
            <button
              onClick={() =>
                promo.trim() && show("優惠碼已套用 🎉", { emoji: "🎟️" })
              }
              className="rounded-xl bg-surface-2 px-5 text-sm font-medium"
            >
              套用
            </button>
          </div>
          {promo.trim() && (
            <p className="mt-1.5 text-sm text-amber-600">
              優惠碼已套用 🎉（但金額其實沒變，嘻）
            </p>
          )}
        </section>

        {/* 金額明細 */}
        <section className="space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>小計</span>
            <span>{formatNT(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>外送費{groups.length > 1 ? ` ×${groups.length} 家` : ""}</span>
            <span>{formatNT(DELIVERY_FEE * groups.length)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>
              平台服務費{groups.length > 1 ? ` ×${groups.length} 家` : ""}
            </span>
            <span>{formatNT(SERVICE_FEE * groups.length)}</span>
          </div>
          <div className="my-1 border-t border-border" />
          <div className="flex justify-between text-base font-bold">
            <span>總計</span>
            <span className="text-uber">{formatNT(total)}</span>
          </div>
        </section>
      </main>

      {/* 固定底部結帳列 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="text-sm">
            <p className="text-zinc-500">總計</p>
            <p className="font-display text-lg font-bold text-uber">
              {formatNT(total)}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 rounded-full bg-uber py-3.5 font-bold text-black transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "下單中…" : "立即訂購"}
          </button>
        </div>
      </div>

      {/* 彩蛋 4：大金額提醒 */}
      <AnimatePresence>
        {warnBigSpend && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setWarnBigSpend(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-amber-300 bg-surface p-6 text-center"
            >
              <p className="text-4xl">👀</p>
              <p className="mt-3 text-lg font-bold text-amber-600">你確定嗎？</p>
              <p className="mt-2 text-sm text-zinc-500">
                這筆 {formatNT(total)} 存起來可以買很多東西喔。<br />
                不過嘛⋯⋯反正也只是幻想。
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setWarnBigSpend(false)}
                  className="flex-1 rounded-full bg-surface-2 py-3 text-sm font-medium"
                >
                  算了，我省錢
                </button>
                <button
                  onClick={() => {
                    setWarnBigSpend(false);
                    placeOrder();
                  }}
                  className="flex-1 rounded-full bg-uber py-3 text-sm font-bold text-black"
                >
                  繼續幻想
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
