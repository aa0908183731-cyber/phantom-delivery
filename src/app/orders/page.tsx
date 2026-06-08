"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/orderStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { shortOrderCode } from "@/lib/fakeDelivery";
import { formatNT } from "@/lib/format";
import TopBar from "@/components/TopBar";

export default function OrdersPage() {
  const router = useRouter();
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const orders = useOrderStore((s) => s.orders);
  const clear = useCartStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);
  const show = useToastStore((s) => s.show);

  const list = useMemo(
    () =>
      Object.values(orders).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  function reorder(orderId: string) {
    const o = orders[orderId];
    if (!o) return;
    clear();
    for (const it of o.items) {
      addItem(
        {
          menuItemId: it.menuItemId,
          restaurantId: it.restaurantId,
          restaurantName: it.restaurantName,
          name: it.name,
          price: it.price,
          imageUrl: it.imageUrl,
        },
        it.quantity,
      );
    }
    show("已加回購物車 🛒", { emoji: "✅" });
    router.push("/cart");
  }

  return (
    <>
      <TopBar showBack title="我的訂單" />
      <main className="mx-auto max-w-2xl space-y-3 px-4 pb-28 pt-4">
        {hasHydrated && list.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-5xl">🧾</p>
            <p className="mt-4 text-zinc-500">
              還沒有任何幻想訂單<br />
              （去點一筆永遠不會來的吧）
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-uber px-6 py-3 font-bold text-black"
            >
              開始幻想
            </Link>
          </div>
        )}

        {list.map((o) => {
          const restName = o.items[0]?.restaurantName ?? "幻想餐廳";
          const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-zinc-900">{restName}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    #{shortOrderCode(o.id)} ・{" "}
                    {new Date(o.createdAt).toLocaleString("zh-TW", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-panda/10 px-2.5 py-1 text-xs font-medium text-panda">
                  🛵 永遠運送中
                </span>
              </div>

              <p className="mt-2 line-clamp-1 text-sm text-zinc-500">
                {o.items.map((i) => `${i.name}×${i.quantity}`).join("、")}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm">
                  共 {itemCount} 件 ・{" "}
                  <span className="font-semibold text-uber">
                    {formatNT(o.total)}
                  </span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => reorder(o.id)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-surface-2"
                  >
                    再點一次
                  </button>
                  <Link
                    href={`/order/tracking/${o.id}`}
                    className="rounded-full bg-uber px-3 py-1.5 text-sm font-bold text-black"
                  >
                    看進度
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
