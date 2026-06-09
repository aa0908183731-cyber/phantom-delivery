"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCartStore,
  groupByRestaurant,
  DELIVERY_FEE,
  SERVICE_FEE,
} from "@/store/cartStore";
import { formatNT } from "@/lib/format";

export default function CartSidebar() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const count = useCartStore((s) => s.totalCount());

  const showBar = hasHydrated && count > 0;
  const groups = groupByRestaurant(items);
  const fees = (DELIVERY_FEE + SERVICE_FEE) * groups.length;

  return (
    <>
      {/* 底部「查看購物車」列（foodpanda 風格，有東西才浮出） */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
          >
            <button
              onClick={() => setOpen(true)}
              aria-label="查看購物車"
              className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl bg-panda px-4 py-3.5 text-white shadow-[0_12px_34px_-8px_rgba(227,0,109,0.55)] transition hover:brightness-105 active:scale-[0.99]"
            >
              <motion.span
                key={count}
                initial={{ scale: 0.6 }}
                animate={{ scale: [1.35, 1] }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="grid h-7 min-w-7 place-items-center rounded-full bg-white/25 px-1.5 text-sm font-bold"
              >
                {count}
              </motion.span>
              <span className="flex-1 text-left font-bold">查看購物車</span>
              <span className="font-display font-bold">{formatNT(subtotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 購物車面板 */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-sm flex-col border-l border-border bg-surface"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold">你的購物車</h2>
                  {groups.length > 0 && (
                    <p className="text-xs text-zinc-500">
                      {groups.length === 1
                        ? groups[0].restaurantName
                        : `${groups.length} 家餐廳一起幻想 🛵`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 hover:bg-surface-2"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                {items.length === 0 && (
                  <p className="mt-16 text-center text-sm text-zinc-500">
                    購物車是空的<br />
                    （但反正也不會送來啦）
                  </p>
                )}
                {groups.map((g) => (
                  <div key={g.restaurantId} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏬</span>
                      <p className="truncate text-sm font-bold text-zinc-800">
                        {g.restaurantName}
                      </p>
                    </div>
                    {g.items.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex gap-3 rounded-xl bg-surface-2 p-3"
                      >
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-uber">
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
                              className="grid h-7 w-7 place-items-center rounded-full bg-bg text-zinc-800"
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
              </div>

              {items.length > 0 && (
                <div className="space-y-3 border-t border-border px-5 py-4">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>小計</span>
                    <span>{formatNT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>
                      外送費 + 服務費
                      {groups.length > 1 ? ` ×${groups.length} 家` : ""}
                    </span>
                    <span>{formatNT(fees)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-uber py-3 text-center font-bold text-black transition hover:brightness-105"
                  >
                    前往結帳 ・ {formatNT(subtotal + fees)}
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
