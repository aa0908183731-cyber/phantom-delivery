"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BANNERS = [
  {
    text: "今天不要點外送 🛵 用想的就好",
    from: "#06c167",
    to: "#04713a",
  },
  {
    text: "你的荷包謝謝你 💸 幻想一下而已",
    from: "#e3006d",
    to: "#7a0039",
  },
  {
    text: "反正食物也不會來 🍜 但過程很爽",
    from: "#ffd60a",
    to: "#9a7d00",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[index];

  return (
    <div className="relative h-32 overflow-hidden rounded-2xl sm:h-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center px-6 sm:px-8"
          style={{
            backgroundImage: `linear-gradient(120deg, ${banner.from}, ${banner.to})`,
          }}
        >
          <p className="max-w-[80%] text-xl font-bold leading-snug text-black/85 sm:text-2xl">
            {banner.text}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-6 flex gap-1.5 sm:left-8">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`第 ${i + 1} 張`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-black/80" : "w-1.5 bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
