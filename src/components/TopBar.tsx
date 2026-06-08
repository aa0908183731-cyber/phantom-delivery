"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToastStore } from "@/store/toastStore";

const FAKE_ADDRESS = "台北市信義區松仁路 100 號";

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
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            幻想<span className="text-uber">外送</span>
          </Link>
        )}

        {showLocation && (
          <button
            onClick={() =>
              show("這只是裝飾啦，反正食物也不會來 😌", { emoji: "📍" })
            }
            className="flex min-w-0 flex-1 items-center gap-1 text-left"
          >
            <span className="shrink-0 text-panda">📍 外送到</span>
            <span className="truncate text-sm font-medium text-zinc-800">
              {FAKE_ADDRESS}
            </span>
            <span className="text-zinc-500">▾</span>
          </button>
        )}

        {title && (
          <h1 className="truncate text-base font-semibold text-zinc-900">
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}
