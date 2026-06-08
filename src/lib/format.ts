export function formatNT(n: number): string {
  return `NT$${Math.round(n).toLocaleString("zh-TW")}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
