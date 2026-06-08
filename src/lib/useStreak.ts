"use client";

import { useEffect, useState } from "react";

const KEY = "phantom-streak";

function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/**
 * 記錄「連續幻想外送」的天數（localStorage）。
 * 連續 3 天以上 → 首頁顯示成就 banner（彩蛋 5）。
 */
export function useStreak(): number {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const today = todayStr();
      const yesterday = todayStr(new Date(Date.now() - 86_400_000));
      const raw = localStorage.getItem(KEY);
      let data = raw
        ? (JSON.parse(raw) as { lastDate: string; streak: number })
        : null;

      if (!data) {
        data = { lastDate: today, streak: 1 };
      } else if (data.lastDate === today) {
        // 今天已記錄，維持不變
      } else if (data.lastDate === yesterday) {
        data = { lastDate: today, streak: data.streak + 1 };
      } else {
        data = { lastDate: today, streak: 1 };
      }

      localStorage.setItem(KEY, JSON.stringify(data));
      setStreak(data.streak);
    } catch {
      // localStorage 不可用時忽略
    }
  }, []);

  return streak;
}
