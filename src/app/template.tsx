"use client";

import { motion } from "framer-motion";

/**
 * 每次切換頁面時，內容向上滑入。
 * （App Router 的 template.tsx 在每次導航都會重新 mount，達到 AnimatePresence 的效果）
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
