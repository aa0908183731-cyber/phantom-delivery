"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuItem } from "@/types/database.types";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { formatNT } from "@/lib/format";

const ADD_ON_SUGGESTIONS = [
  "加購可樂 +NT$30",
  "加購玉米濃湯 +NT$40",
  "升級大份量 +NT$25",
];

export default function MenuItemCard({
  item,
  restaurantId,
  restaurantName,
}: {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [pop, setPop] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.menuItemId === item.id)?.quantity ?? 0,
  );
  const show = useToastStore((s) => s.show);

  // 一次可以幻想很多家：直接加入，不再限制只能點一家
  function handleFirstAdd() {
    addItem({
      menuItemId: item.id,
      restaurantId,
      restaurantName,
      name: item.name,
      price: item.price,
      imageUrl: item.image_url,
    });
    setPop((p) => p + 1);
    show(`已加入「${item.name}」🛒`, { emoji: "✅" });
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <motion.div
        onClick={() => setDetailOpen(true)}
        whileTap={{ scale: 0.99 }}
        className="card-glow flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-surface p-3 text-left"
      >
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name}
            width={88}
            height={88}
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-zinc-900">{item.name}</h4>
          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
            {item.description}
          </p>
          <p className="mt-1 font-display font-bold text-uber">
            {formatNT(item.price)}
          </p>
        </div>

        {/* 就地數量器：qty=0 顯示「+」，qty>0 顯示「− 數量 +」 */}
        <div onClick={stop} className="shrink-0">
          {qty === 0 ? (
            <motion.button
              key={pop}
              animate={pop ? { scale: [1.5, 1] } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 16 }}
              onClick={handleFirstAdd}
              aria-label="加入購物車"
              className="grid h-9 w-9 place-items-center rounded-full bg-uber text-xl font-bold text-black shadow-sm"
            >
              +
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => decrement(item.id)}
                aria-label="減少"
                className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-lg text-zinc-800"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => increment(item.id)}
                aria-label="增加"
                className="grid h-8 w-8 place-items-center rounded-full bg-uber text-lg font-bold text-black"
              >
                +
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 品項詳情 */}
      <AnimatePresence>
        {detailOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface"
            >
              {item.image_url && (
                <div className="relative h-52 w-full">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <button
                    onClick={() => setDetailOpen(false)}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="font-display text-lg font-bold text-uber">
                    {formatNT(item.price)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>

                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-800">
                    推薦加購 ✨
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ADD_ON_SUGGESTIONS.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-zinc-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    （加購是裝飾用的，反正都不會送到 😌）
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (qty === 0) {
                      handleFirstAdd();
                    } else {
                      increment(item.id);
                      setPop((p) => p + 1);
                    }
                    setDetailOpen(false);
                  }}
                  className="w-full rounded-full bg-uber py-3.5 font-bold text-black transition hover:brightness-105"
                >
                  {qty === 0 ? "加入購物車" : `再加一份（目前 ${qty}）`} ・{" "}
                  {formatNT(item.price)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
