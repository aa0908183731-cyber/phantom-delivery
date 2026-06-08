"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToastStore } from "@/store/toastStore";

export default function RiderCard({
  name,
  rating,
  avatar,
}: {
  name: string;
  rating: number;
  avatar: string;
}) {
  const show = useToastStore((s) => s.show);
  const [taps, setTaps] = useState(0);

  // 彩蛋 1：點擊頭像 5 次
  function tapAvatar() {
    const next = taps + 1;
    setTaps(next);
    if (next >= 5) {
      show("這位外送員不存在。但謝謝你的等待。", { emoji: "👻", durationMs: 5000 });
      setTaps(0);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
      <motion.button
        onClick={tapAvatar}
        whileTap={{ scale: 0.9 }}
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-panda/40"
        aria-label="外送員頭像"
      >
        <Image src={avatar} alt={name} fill sizes="56px" className="object-cover" />
      </motion.button>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900">{name}</p>
        <p className="text-sm text-zinc-500">
          <span className="text-gold">★ {rating.toFixed(1)}</span>
          <span className="mx-1.5 text-zinc-300">·</span>
          你的專屬幻想外送員
        </p>
      </div>

      <button
        onClick={() => show("撥號中⋯⋯ 請繼續等候", { emoji: "📞" })}
        className="rounded-full bg-panda px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
      >
        聯絡外送員
      </button>
    </div>
  );
}
