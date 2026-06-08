"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/store/toastStore";

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[1000] flex flex-col items-center gap-2 px-4 sm:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto max-w-sm rounded-2xl border border-border bg-surface-2/95 px-4 py-3 text-sm text-zinc-900 shadow-2xl backdrop-blur"
          >
            <span className="mr-1.5">{t.emoji ?? "🛵"}</span>
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
