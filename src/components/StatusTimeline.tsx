"use client";

import { TIMELINE_STAGES } from "@/lib/fakeDelivery";

export default function StatusTimeline({ elapsedMs }: { elapsedMs: number }) {
  return (
    <ol className="relative ml-3 space-y-6 border-l-2 border-border pl-6">
      {TIMELINE_STAGES.map((stage) => {
        const lit =
          stage.litAfterMs !== null && elapsedMs >= stage.litAfterMs;
        const isActive =
          stage.key === "delivering" && lit; // 進行中：持續 neon pulse
        const isNeverLit = stage.litAfterMs === null;

        return (
          <li key={stage.key} className="relative">
            {/* 節點 */}
            <span
              className={`absolute -left-[2.1rem] grid h-7 w-7 place-items-center rounded-full text-sm transition ${
                lit
                  ? isActive
                    ? "animate-neon bg-panda text-white"
                    : "bg-uber text-black"
                  : "bg-surface-2 text-zinc-400"
              }`}
            >
              {stage.icon}
            </span>
            <div>
              <p
                className={`font-medium transition ${
                  lit
                    ? "text-zinc-900"
                    : isNeverLit
                      ? "text-zinc-400"
                      : "text-zinc-500"
                }`}
              >
                {stage.label}
              </p>
              <p className="text-xs text-zinc-500">
                {lit
                  ? isActive
                    ? "外送員正在路上（永遠在路上）"
                    : "已完成"
                  : isNeverLit
                    ? "⏳ 永遠的「即將」"
                    : "等待中…"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
