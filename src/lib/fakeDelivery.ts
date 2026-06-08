// 假外送邏輯：外送員永遠在 1~3 公里的環帶內繞圈，永遠不靠近終點（你家）。
//
// 作法：把外送員位置換算成「以終點為圓心」的極座標 (r, θ)。
//   - r 永遠夾在 1000m ~ 3000m，所以永遠不會抵達。
//   - θ 每 tick 主要朝同方向漂移 → 看起來像繞圈，再加一點隨機抖動。

export interface LatLng {
  lat: number;
  lng: number;
}

/** 台北市中心，同時當作「你家」的終點。 */
export const TAIPEI_CENTER: LatLng = { lat: 25.033, lng: 121.5654 };

/** 你家（目的地）。外送員永遠到不了這裡。 */
export const DESTINATION: LatLng = TAIPEI_CENTER;

const MIN_RADIUS_M = 1000; // 1 公里
const MAX_RADIUS_M = 3000; // 3 公里
const METERS_PER_DEG_LAT = 111_320;

function metersPerDegLng(lat: number): number {
  return METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** 兩點間的近似距離（公尺）。 */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const dY = (a.lat - b.lat) * METERS_PER_DEG_LAT;
  const dX = (a.lng - b.lng) * metersPerDegLng(DESTINATION.lat);
  return Math.hypot(dX, dY);
}

/** 在環帶內隨機產生一個初始外送員座標。 */
export function initialRiderPosition(): LatLng {
  const theta = Math.random() * Math.PI * 2;
  const r = 1800 + Math.random() * 600; // 約 1.8~2.4 km
  return polarToLatLng(r, theta);
}

function polarToLatLng(r: number, theta: number): LatLng {
  const mX = r * Math.cos(theta);
  const mY = r * Math.sin(theta);
  return {
    lat: DESTINATION.lat + mY / METERS_PER_DEG_LAT,
    lng: DESTINATION.lng + mX / metersPerDegLng(DESTINATION.lat),
  };
}

/**
 * 根據目前座標產生下一個假座標。
 * 永遠維持在 1~3km 環帶，永遠不靠近終點。
 */
export function nextRiderPosition(prev: LatLng): LatLng {
  const mY = (prev.lat - DESTINATION.lat) * METERS_PER_DEG_LAT;
  const mX = (prev.lng - DESTINATION.lng) * metersPerDegLng(DESTINATION.lat);

  let r = Math.hypot(mX, mY);
  let theta = Math.atan2(mY, mX);

  // 主要朝逆時針漂移（繞圈），加上隨機抖動。
  theta += 0.16 + (Math.random() - 0.5) * 0.28;
  // 半徑小幅隨機，但永遠夾在環帶內。
  r += (Math.random() - 0.5) * 260;
  r = clamp(r, MIN_RADIUS_M, MAX_RADIUS_M);

  return polarToLatLng(r, theta);
}

// ---- 外送員身分 ----

const RIDER_NAMES = [
  "陳建宏",
  "林志明",
  "黃淑芬",
  "張家豪",
  "李宗翰",
  "王怡君",
  "吳承恩",
  "劉俊傑",
  "蔡英傑",
  "鄭雅婷",
  "謝沛縈",
  "周杰文",
];

export function randomRiderName(): string {
  return RIDER_NAMES[Math.floor(Math.random() * RIDER_NAMES.length)];
}

/** 外送員假評分 4.6~4.9。 */
export function randomRiderRating(): number {
  return Math.round((4.6 + Math.random() * 0.3) * 10) / 10;
}

export function riderAvatarUrl(name: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;
}

// ---- 永恆等待的外送員訊息 ----

export const DELIVERY_MESSAGES = [
  "快到了！再等我一下 🙏",
  "前面有點塞車，請稍候",
  "我在附近了，馬上到！",
  "不好意思，剛剛走錯路了 😅",
  "你家附近停車有點難找⋯⋯",
  "紅燈有夠多，馬上就好 🚦",
  "湯有點灑出來，我慢慢騎 🥲",
  "導航把我帶到河堤了，重新規劃中",
];

export function randomDeliveryMessage(): string {
  return DELIVERY_MESSAGES[
    Math.floor(Math.random() * DELIVERY_MESSAGES.length)
  ];
}

// ---- 狀態時間軸 ----

export interface TimelineStage {
  key: string;
  label: string;
  icon: string;
  /** 進入追蹤頁後幾毫秒點亮；null 代表永遠不會點亮。 */
  litAfterMs: number | null;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  { key: "confirmed", label: "訂單確認", icon: "✅", litAfterMs: 0 },
  { key: "preparing", label: "餐廳備餐中", icon: "👨‍🍳", litAfterMs: 30_000 },
  {
    key: "delivering",
    label: "外送員出發中",
    icon: "🛵",
    litAfterMs: 60_000,
  },
  { key: "arriving", label: "即將送達", icon: "⏳", litAfterMs: null },
];

/** 產生一個假訂單編號（fallback 用，沒有 Supabase 時）。 */
export function generateOrderId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // 極簡 fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 取訂單編號前 8 碼大寫。 */
export function shortOrderCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}
