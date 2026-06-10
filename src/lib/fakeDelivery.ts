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

// 外送員「在你附近徘徊」的範圍：永遠到不了，但看起來快到了（像 Uber Eats）
const MIN_RADIUS_M = 280;
const MAX_RADIUS_M = 1400;
const HOVER_TARGET_M = 600; // 慢慢被拉回 ~600m，看起來一直「快到了」
const RESTAURANT_RING_M = 2300; // 餐廳（路線起點）離你約 2.3km
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

/** 在環帶內隨機產生一個初始外送員座標（以 dest 為圓心）。 */
export function initialRiderPosition(dest: LatLng = DESTINATION): LatLng {
  const theta = Math.random() * Math.PI * 2;
  const r = 900 + Math.random() * 500; // 約 0.9~1.4 km（出發後就在附近徘徊）
  return polarToLatLng(r, theta, dest);
}

function seedNum(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** 依訂單 id 穩定地算出「餐廳位置」（路線起點），離你約 2.3km。 */
export function riderOrigin(seed: string, dest: LatLng = DESTINATION): LatLng {
  const theta = ((seedNum(seed) % 3600) / 3600) * Math.PI * 2;
  return polarToLatLng(RESTAURANT_RING_M, theta, dest);
}

/** 把點 p 沿著 origin→dest 的垂直方向平移 meters 公尺（讓路線有點彎、像馬路）。 */
function offsetPerp(
  p: LatLng,
  origin: LatLng,
  dest: LatLng,
  meters: number,
): LatLng {
  const mY = (dest.lat - origin.lat) * METERS_PER_DEG_LAT;
  const mX = (dest.lng - origin.lng) * metersPerDegLng(dest.lat);
  const len = Math.hypot(mX, mY) || 1;
  const px = -mY / len;
  const py = mX / len;
  return {
    lat: p.lat + (py * meters) / METERS_PER_DEG_LAT,
    lng: p.lng + (px * meters) / metersPerDegLng(dest.lat),
  };
}

function lerpLatLng(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

/** 餐廳→你家的「路線」（含兩個彎點，畫成像 Uber Eats 的導航線）。 */
export function routePoints(origin: LatLng, dest: LatLng): LatLng[] {
  return [
    origin,
    offsetPerp(lerpLatLng(origin, dest, 0.38), origin, dest, 280),
    offsetPerp(lerpLatLng(origin, dest, 0.72), origin, dest, -200),
    dest,
  ];
}

/** 路線各段的累積長度（公尺）。 */
function routeCumulative(route: LatLng[]): { cum: number[]; total: number } {
  const cum = [0];
  for (let i = 1; i < route.length; i++) {
    cum[i] = cum[i - 1] + distanceMeters(route[i - 1], route[i]);
  }
  return { cum, total: cum[cum.length - 1] || 1 };
}

/** 路線上 arc-length 比例 t∈[0,1] 對應的座標。 */
export function pointAtFraction(route: LatLng[], t: number): LatLng {
  if (route.length === 1) return route[0];
  const { cum, total } = routeCumulative(route);
  const target = clamp(t, 0, 1) * total;
  for (let i = 1; i < route.length; i++) {
    if (target <= cum[i]) {
      const segLen = cum[i] - cum[i - 1] || 1;
      return lerpLatLng(route[i - 1], route[i], (target - cum[i - 1]) / segLen);
    }
  }
  return route[route.length - 1];
}

/**
 * 把點投影到路線上，回傳最近點的 arc-length 比例 t 與垂直距離（公尺）。
 * 用來：(1) 由外送員當前座標推回「沿路線走了多遠」；(2) 判斷是否已在路上。
 */
export function projectOntoRoute(
  p: LatLng,
  route: LatLng[],
): { t: number; dist: number } {
  const { cum, total } = routeCumulative(route);
  const mPerLng = metersPerDegLng(route[0].lat);
  let best = { t: 0, dist: Infinity };
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1];
    const b = route[i];
    const bx = (b.lng - a.lng) * mPerLng;
    const by = (b.lat - a.lat) * METERS_PER_DEG_LAT;
    const px = (p.lng - a.lng) * mPerLng;
    const py = (p.lat - a.lat) * METERS_PER_DEG_LAT;
    const segLen2 = bx * bx + by * by || 1;
    const u = clamp((px * bx + py * by) / segLen2, 0, 1);
    const dist = Math.hypot(px - u * bx, py - u * by);
    if (dist < best.dist) {
      const along = cum[i - 1] + u * (cum[i] - cum[i - 1]);
      best = { t: along / total, dist };
    }
  }
  return best;
}

function polarToLatLng(r: number, theta: number, dest: LatLng): LatLng {
  const mX = r * Math.cos(theta);
  const mY = r * Math.sin(theta);
  return {
    lat: dest.lat + mY / METERS_PER_DEG_LAT,
    lng: dest.lng + mX / metersPerDegLng(dest.lat),
  };
}

// 沿路線前進的參數
const STALL_T = 0.86; // 永遠卡在路線 ~86%（離家幾百公尺），看起來「馬上到」
const STEP_T = 0.06; // 每 3 秒沿路線前進約 6%（穩定速度，像真的在騎車）

/**
 * 根據目前座標產生下一個假座標。
 *
 * 有 route 時：外送員「沿著導航線」從餐廳往你家前進，接近時就卡在 ~86%、
 * 在門口附近來回徘徊，永遠差最後一段（紅燈／找車位／走錯路）。
 * 沒有 route 時：退回舊的「環帶繞圈」模型。
 */
export function nextRiderPosition(
  prev: LatLng,
  dest: LatLng = DESTINATION,
  route?: LatLng[],
): LatLng {
  if (route && route.length >= 2) {
    const { t } = projectOntoRoute(prev, route);
    let nt: number;
    if (t < STALL_T - STEP_T) {
      // 還在路上 → 穩定前進，帶一點點變速
      nt = t + STEP_T + (Math.random() - 0.5) * 0.015;
    } else {
      // 到了門口附近 → 在 ~86% 來回徘徊，永遠到不了 100%
      nt = STALL_T + (Math.random() - 0.5) * 0.05;
    }
    nt = clamp(nt, 0, 0.93);
    const base = pointAtFraction(route, nt);
    // 一點點垂直晃動，像在巷子裡鑽，不會死板地貼在線上
    return offsetPerp(base, route[0], dest, (Math.random() - 0.5) * 30);
  }

  // ── 後備：沒有路線時，沿用「環帶繞圈」模型 ──
  const mY = (prev.lat - dest.lat) * METERS_PER_DEG_LAT;
  const mX = (prev.lng - dest.lng) * metersPerDegLng(dest.lat);

  let r = Math.hypot(mX, mY);
  let theta = Math.atan2(mY, mX);

  theta += 0.14 + (Math.random() - 0.5) * 0.3;
  r += (HOVER_TARGET_M - r) * 0.06 + (Math.random() - 0.5) * 240;
  r = clamp(r, MIN_RADIUS_M, MAX_RADIUS_M);

  return polarToLatLng(r, theta, dest);
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
