"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import {
  useLocationStore,
  DEFAULT_LOCATION,
} from "@/store/locationStore";
import { reverseGeocode } from "@/lib/geocode";
import ThemeToggle from "./ThemeToggle";

export default function TopBar({
  showBack = false,
  backHref,
  title,
  showLocation = false,
}: {
  showBack?: boolean;
  /** 指定返回目的地（例如追蹤頁固定回首頁）；未指定則用瀏覽器上一頁 */
  backHref?: string;
  title?: string;
  showLocation?: boolean;
}) {
  const router = useRouter();
  const show = useToastStore((s) => s.show);
  const location = useLocationStore((s) => s.location);
  const hasHydrated = useLocationStore((s) => s.hasHydrated);
  const setLocation = useLocationStore((s) => s.setLocation);
  const reset = useLocationStore((s) => s.reset);

  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const address = hasHydrated ? location.address : DEFAULT_LOCATION.address;
  const isCurrent = hasHydrated && location.isCurrent;

  function useCurrentLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      show("這個瀏覽器不支援定位 🥲", { emoji: "📍" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const addr = await reverseGeocode(latitude, longitude);
        setLocation({
          address: addr,
          lat: latitude,
          lng: longitude,
          isCurrent: true,
        });
        setLocating(false);
        setOpen(false);
        show(`已定位到目前位置：${addr} 📍`, { emoji: "✅" });
      },
      () => {
        setLocating(false);
        show("無法取得位置，請允許瀏覽器定位權限 🥲", { emoji: "📍" });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        {showBack ? (
          <button
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            aria-label="返回"
            className="grid h-9 w-9 place-items-center rounded-full text-zinc-600 transition hover:bg-surface-2"
          >
            ←
          </button>
        ) : (
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight"
          >
            幻想<span className="text-uber">外送</span>
          </Link>
        )}

        {showLocation && (
          <div className="relative min-w-0 flex-1">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex w-full min-w-0 items-center gap-1 text-left"
            >
              <span className="shrink-0 text-panda">📍 外送到</span>
              <span className="truncate text-sm font-medium text-zinc-800">
                {address}
              </span>
              <span className="text-zinc-500">▾</span>
            </button>

            <AnimatePresence>
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 top-9 z-50 w-72 rounded-2xl border border-border bg-surface p-2 shadow-xl"
                  >
                    <button
                      onClick={useCurrentLocation}
                      disabled={locating}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-surface-2 disabled:opacity-60"
                    >
                      <span className="text-lg">🎯</span>
                      <span className="flex-1">
                        {locating ? "定位中…" : "使用我目前的位置"}
                      </span>
                      {locating && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-uber border-t-transparent" />
                      )}
                    </button>
                    {isCurrent && (
                      <button
                        onClick={() => {
                          reset();
                          setOpen(false);
                          show("已改回預設地址", { emoji: "📍" });
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-surface-2"
                      >
                        <span className="text-lg">🏠</span>
                        <span className="flex-1">改回預設地址</span>
                      </button>
                    )}
                    <p className="px-3 pb-1 pt-2 text-xs text-zinc-400">
                      （定位只是讓地圖更像一回事，反正餐點還是不會來 😌）
                    </p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {title && (
          <h1 className="truncate text-base font-semibold text-zinc-900">
            {title}
          </h1>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {showLocation && (
            <Link
              href="/stats"
              aria-label="戒斷成績"
              className="grid h-9 w-9 place-items-center rounded-full text-lg transition hover:bg-surface-2"
            >
              📊
            </Link>
          )}
          {showLocation && (
            <Link
              href="/orders"
              aria-label="我的訂單"
              className="grid h-9 w-9 place-items-center rounded-full text-lg transition hover:bg-surface-2"
            >
              🧾
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
