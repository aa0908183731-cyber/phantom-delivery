"use client";

import { useEffect, useState } from "react";

/** 深色/淺色切換，狀態存 localStorage（phantom-theme），預設跟隨系統。 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("phantom-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "切換淺色模式" : "切換深色模式"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg transition hover:bg-surface-2"
    >
      {mounted ? (dark ? "☀️" : "🌙") : "🌙"}
    </button>
  );
}
