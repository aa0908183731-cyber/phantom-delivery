"use client";

import { useEffect } from "react";
import { randomDeliveryMessage } from "@/lib/fakeDelivery";
import { useToastStore } from "@/store/toastStore";

/**
 * 永恆等待狀態：每隔 5 分鐘隨機跳一則外送員訊息（toast）。
 * 進頁後 12 秒先來一則暖場，之後每 5 分鐘一則。
 * 這是 headless 元件，本身不渲染任何畫面。
 */
export default function DeliveryMessage() {
  const show = useToastStore((s) => s.show);

  useEffect(() => {
    const first = setTimeout(() => {
      show(randomDeliveryMessage(), { emoji: "🛵" });
    }, 12_000);

    const interval = setInterval(
      () => show(randomDeliveryMessage(), { emoji: "🛵" }),
      5 * 60 * 1000,
    );

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [show]);

  return null;
}
