"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaProvider() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [show, setShow] = useState(false);

  // 註冊 Service Worker（僅正式環境，避免 dev 快取困擾）
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    )
      return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  // 安裝提示
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => setShow(false);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setShow(false);
    try {
      sessionStorage.setItem("pwa-dismissed", "1");
    } catch {}
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-5 z-[45] mx-auto flex w-[92%] max-w-sm items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl"
        >
          <span className="text-2xl">🛵</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900">
              把幻想外送加到主畫面
            </p>
            <p className="text-xs text-zinc-500">像真的 App 一樣，離線也能幻想</p>
          </div>
          <button
            onClick={install}
            className="shrink-0 rounded-full bg-uber px-3.5 py-1.5 text-sm font-bold text-black"
          >
            安裝
          </button>
          <button
            onClick={dismiss}
            aria-label="關閉"
            className="shrink-0 text-zinc-400 hover:text-zinc-600"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
