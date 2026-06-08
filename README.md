# 幻想外送 🛵
> 反正食物也不會來 — 台灣版戒外送成癮模擬平台

完整模擬台灣外送 App（Uber Eats / foodpanda）的點餐儀式，但**餐點永遠不會送到**。
讓你透過完成整套「點餐 → 結帳 → 追蹤」的流程獲得多巴胺滿足，同時不花錢、不攝取熱量。

---

## 專案簡介

- 瀏覽 26 間台灣在地餐廳（台式 / 便當 / 熱炒 / 炸物 / 日式 / 異國 / 美式 / 義式 / 早午餐 / 飲料甜點 / 宵夜）、搜尋餐點、收藏、加入購物車、選付款方式、下單。
- 下單後進入**永恆等待**的追蹤頁：外送員在地圖上 1~3 公里環帶內永遠繞圈，永遠不抵達。
- 全程繁體中文、明亮白底亮色系（保留 Uber 綠 / panda 粉 / 暖黃點綴），藏了 5 個彩蛋。
- **離線可玩**：未接 Supabase 時自動使用內建假資料與本地外送員模擬；接上 Supabase 後升級為 DB 讀取 + Realtime 即時座標。

---

## Tech Stack

| 類別 | 技術 | 版本 |
| --- | --- | --- |
| 框架 | Next.js（App Router） | 15.5.x |
| UI | React | 19.x |
| 樣式 | Tailwind CSS | v4.x |
| 語言 | TypeScript（strict） | 5.6.x |
| 狀態管理 | Zustand（含 persist） | 5.x |
| 動畫 | Framer Motion | 11.x |
| 地圖 | react-leaflet / leaflet | 5.x / 1.9.x |
| 後端 | Supabase（PostgreSQL + Realtime，選用） | @supabase/ssr 0.5.x、@supabase/supabase-js 2.x |
| 字體 | Noto Sans TC + DM Sans（next/font） | — |
| 部署 | Vercel | — |

---

## 專案結構

```
.
├── README.md                         # ← Single Source of Truth
├── .env.local.example                # 環境變數範本
├── next.config.mjs                   # 圖片 remotePatterns（pravatar 頭像）
├── public/food/                      # 24 張本地美食照（每種菜色一張，永不破圖）
├── postcss.config.mjs                # Tailwind v4 PostCSS plugin
├── eslint.config.mjs
├── tsconfig.json
├── supabase/
│   └── schema.sql                    # 建表 + RLS + Realtime（整段可貼進 SQL Editor）
├── scripts/
│   └── seedSupabase.ts               # 把 seed 資料寫進 Supabase 的腳本
└── src/
    ├── app/
    │   ├── layout.tsx                # 字體、Toaster、metadata
    │   ├── template.tsx              # 頁面切換向上滑入動畫
    │   ├── globals.css               # Tailwind v4 @theme 設計 token + 自訂動畫
    │   ├── not-found.tsx
    │   ├── page.tsx                  # 首頁（Server Component fetch 餐廳）
    │   ├── restaurant/[id]/page.tsx  # 餐廳頁
    │   ├── cart/page.tsx             # 購物車 / 結帳
    │   └── order/
    │       ├── confirm/page.tsx      # 訂單確認（confetti + 倒數）
    │       └── tracking/[orderId]/page.tsx  # 追蹤頁（地圖 + Realtime）
    ├── components/
    │   ├── TopBar.tsx                # 頂部列（含假定位 / 返回）
    │   ├── BannerCarousel.tsx        # 首頁輪播 Banner
    │   ├── CategoryTabs.tsx          # 分類 / 菜單分類 tab
    │   ├── SearchBar.tsx             # 裝飾用搜尋欄
    │   ├── RestaurantCard.tsx        # 餐廳卡片（staggered 淡入）
    │   ├── MenuItemCard.tsx          # 菜單品項（就地 +/− 數量器 + 詳情 + 跨餐廳確認）
    │   ├── CartSidebar.tsx           # 底部「查看購物車」列 + 側欄
    │   ├── HomeClient.tsx            # 首頁互動（篩選 / 彩蛋）
    │   ├── RestaurantMenu.tsx        # 餐廳頁菜單互動
    │   ├── StarRating.tsx
    │   ├── Confetti.tsx              # 輕量慶祝彩帶
    │   ├── TrackingMap.tsx           # Leaflet 地圖（dynamic, ssr:false）
    │   ├── StatusTimeline.tsx        # 4 階段狀態時間軸（neon pulse）
    │   ├── RiderCard.tsx             # 外送員資訊卡（含頭像彩蛋）
    │   ├── DeliveryMessage.tsx       # 每 5 分鐘外送員 toast
    │   └── Toaster.tsx               # 全域 toast 容器
    ├── store/
    │   ├── cartStore.ts              # Zustand 購物車（persist）
    │   ├── orderStore.ts             # Zustand 訂單 + 外送員座標（persist）
    │   └── toastStore.ts             # Zustand toast
    ├── lib/
    │   ├── supabase.ts               # 前端 Supabase client（未設定則為 null）
    │   ├── supabase.server.ts        # Server 端 client（service role 只在此）
    │   ├── seedData.ts               # 20 間餐廳假資料 + 評論產生器
    │   ├── fakeDelivery.ts           # 假路線演算法（台北市為中心）
    │   ├── fees.ts                   # 外送費 / 服務費常數
    │   ├── format.ts                 # NT$ / 時間格式化
    │   └── useStreak.ts              # 連續天數記錄（彩蛋 5）
    ├── actions/
    │   ├── getRestaurants.ts         # Server Action
    │   ├── getMenuItems.ts           # 菜單 + 評論
    │   └── createFakeOrder.ts        # 建立假訂單
    └── types/
        └── database.types.ts         # Supabase 型別
```

---

## 環境變數

複製 `.env.local.example` 為 `.env.local`。**全部留空也能跑**（會用內建假資料）。

| 變數 | 說明 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL，例如 `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key（可公開，給瀏覽器用） |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key（**機密**，只在 Server Action 使用，禁止暴露前端） |

---

## Supabase 設定

> 完全選用。不設定也能玩完整流程；設定後餐廳/菜單改由 DB 讀取，外送員座標走 Realtime。

### 1. Schema SQL

到 Supabase → SQL Editor，整段貼上 [`supabase/schema.sql`](supabase/schema.sql) 並執行。重點：

```sql
-- 假訂單表（永遠不會送達）
create table if not exists fake_orders (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  items jsonb,
  address text,
  payment_method text,
  -- 狀態只允許：confirmed → preparing → delivering
  -- 在資料庫層級就禁止 'delivered'（重要規則 2 的硬保證）
  status text default 'confirmed'
    check (status in ('confirmed', 'preparing', 'delivering')),
  rider_name text,
  rider_lat numeric,
  rider_lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

`schema.sql` 同時會：建立 `restaurants` / `menu_items` / `reviews` / `fake_orders` 四張表、
開啟 RLS（公開讀取；`fake_orders` 可 insert/select/update 但不可 delete）、加上 `updated_at` trigger，
並 `alter publication supabase_realtime add table fake_orders;` 開啟 Realtime。

### 2. Seed 資料

20 間餐廳的真實內容定義在 [`src/lib/seedData.ts`](src/lib/seedData.ts)（同時是離線 fallback 的資料來源）。
用以下指令把它寫進 Supabase（需 Node 22+，會自動讀 `.env.local`）：

```bash
node --env-file=.env.local --experimental-strip-types scripts/seedSupabase.ts
```

腳本會先清空舊資料再寫入 20 間餐廳、每間 9~11 道菜與 5 則評論（idempotent，可重跑）。

---

## 本地開發

```bash
# 1. 安裝依賴
npm install

# 2.（選用）設定 Supabase
cp .env.local.example .env.local   # 填入 Supabase 資訊；留空則用內建假資料

# 3. 啟動開發伺服器
npm run dev
# → http://localhost:3000

# 其他
npm run build   # production build
npm start       # 啟動 production server
npm run lint
```

---

## Vercel 部署

1. 將 repo 推到 GitHub，於 Vercel **Import** 該 repo（框架自動偵測為 Next.js）。
2. 在 Vercel → Settings → Environment Variables 設定三個變數
   （`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`）。
   - 不設定也能部署成功，會以內建假資料運行。
3. 若使用 Supabase：先在 SQL Editor 跑 `supabase/schema.sql`，再跑一次 seed 腳本。
4. Deploy。

---

## 功能清單

- [x] 26 間餐廳、24 種菜色本地美食照、每道菜圖文相符
- [x] 真・搜尋（店名 / 分類 / 餐點名稱）、排序（推薦 / 評分 / 外送快 / 低消）、❤️ 收藏
- [x] 選取目前位置（瀏覽器定位 + 反查地址，地圖中心跟著走）
- [x] 美化配送地圖（CARTO 圖磚 + 自訂標記 + 脈動的家 + 外送員平滑滑動）
- [x] 我的訂單頁（歷史訂單 + 再點一次 + 看進度）
- [x] 首頁：3 張輪播 Banner、可滑動分類 tab、餐廳卡片（staggered 淡入）
- [x] 首頁：底部「查看購物車」列（foodpanda 風，有品項才浮出）、頂部定位列
- [x] 餐廳頁：Hero banner、店家資訊、菜單分類 tab（點了自動捲到該區 + 捲動高亮）、品項詳情 modal + 推薦加購
- [x] 餐廳頁：5 則台灣口吻假評論
- [x] 加入購物車彈跳動畫 + toast；菜單品項就地 +/− 數量器
- [x] 單一餐廳購物車：從別家加餐點時跳出「清空購物車？」確認（參考 foodpanda）
- [x] 購物車：加減數量 / 刪除、地址欄（任何輸入皆「地址確認 ✅」）
- [x] 購物車：外送時間（盡快 / 預約時段，純 UI）、5 種付款方式（純 UI）、優惠碼（任何輸入皆「已套用 🎉」但金額不變）
- [x] 購物車：小計 + 外送費 NT$35 + 服務費 NT$10 明細
- [x] 訂單確認頁：全螢幕 confetti、訂單編號前 8 碼、預計送達時間/地址、3 秒倒數跳轉
- [x] 追蹤頁：Leaflet 地圖（台北市中心 25.0330, 121.5654）、外送員 + 家 標記、殘影軌跡
- [x] 追蹤頁：外送員每 3 秒新座標（1~3km 環帶隨機漫步，永不靠近終點）
- [x] 追蹤頁：4 階段狀態時間軸（第 3 階段 neon pulse、第 4 階段永不點亮）
- [x] 追蹤頁：外送員資訊卡、聯絡外送員 toast、底部固定文案
- [x] 永恆等待：每 5 分鐘隨機外送員 toast
- [x] Supabase Realtime 訂閱外送員座標（含未設定時的本地 fallback）
- [x] 5 個彩蛋（見下）
- [x] RWD（手機優先）+ 頁面切換動畫
- [x] README 維護為 Single Source of Truth

---

## 彩蛋

<details>
<summary>點開看 5 個彩蛋的觸發條件（劇透）</summary>

1. **外送員頭像點 5 下** → 顯示「這位外送員不存在。但謝謝你的等待。」
2. **追蹤頁等待超過 10 分鐘** → 出現提示「你還餓嗎？還是已經不餓了？」
3. **深夜進入（23:00–05:00）** → 首頁歡迎語變成「宵夜只存在於你的想像中 🌙」
4. **購物車總金額超過 NT$1,000** → 結帳前跳出「你確定嗎？這筆錢存起來可以買很多東西喔 👀」（仍可繼續）
5. **連續使用超過 3 天**（localStorage 記錄） → 首頁頂部出現「你已經連續幻想外送 N 天了 🏆」

</details>

---

## 設計決策

- **Supabase 為選用、內建假資料為 fallback**：規格以 Supabase 為核心，但為了讓專案 clone 下來即可運行、
  且不會因缺少金鑰而崩潰，所有 Server Action 在偵測不到 Supabase 環境變數時，會回傳 `src/lib/seedData.ts`
  的本地資料。這是嚴格的超集合：設定金鑰後即升級為 DB 讀取 + Realtime，無需改任何程式碼。
- **外送員座標用極座標保證「永不抵達」**：以終點為圓心，半徑永遠夾在 1000~3000 公尺、角度持續同向漂移，
  數學上就不可能靠近終點，比「隨機漫步再判斷距離」更穩定。詳見 `src/lib/fakeDelivery.ts`。
- **`status` 永不為 `delivered` 的雙重保險**：程式端從不寫入 `delivered`；資料庫端再用 `CHECK` constraint
  限制 `status in ('confirmed','preparing','delivering')`，從 DB 層級徹底封死（重要規則 2）。
- **訂單與外送員位置存在前端**（orderStore + persist）：確認頁、追蹤頁即使未接 DB 也能運作；
  離開追蹤頁再回來會沿用上次的外送員位置（不重置，符合重要規則 7）。
- **`service role key` 隔離**：只在 `src/lib/supabase.server.ts`（`import "server-only"`）與 Server Action 中讀取，
  前端 client（`src/lib/supabase.ts`）只用 anon key。
- **Tailwind v4 `@theme` 設計 token**：白底亮色系主題（Uber 綠 / panda 粉 / 暖黃點綴）以 CSS 變數定義，
  自動產生對應 utility class。
- **美食圖片改用本地真實照片（`public/food/`）**：曾用 loremflickr 關鍵字抓圖，但會破圖、又不夠精準。
  改為下載一組 24 張策展過的真實美食照（台灣在地菜用 Wikimedia Commons：滷肉飯/珍奶/火鍋/豆花/台式雞排；
  其餘用 TheMealDB），放進 `public/food/`，由 `dishToFoodType()` 以菜名+分類關鍵字逐道對應正確類型。
  好處：永不破圖、載入快、圖文相符。`image_url` 存的是 `/food/xxx.jpg` 本地路徑。
- **搜尋是真的**：首頁拿到一份「餐廳 id → 店名+分類+所有菜名」索引（`getRestaurantSearchIndex`），前端即時過濾。
- **可選目前位置**：TopBar 用瀏覽器 Geolocation 取座標、Nominatim 反查地址，存進 `locationStore`；
  下單時把座標帶進訂單，追蹤頁地圖中心與外送員繞圈的圓心都跟著你的位置走。
- **頁面轉場用 `template.tsx`**：App Router 每次導航會重新 mount template，藉此達到「向上滑入」效果。

---

## 重要規則（絕對不能違反）

1. ✅ 絕對不串接任何真實付款 API（付款方式純 UI）
2. ✅ `fake_orders.status` 永遠不更新為 `delivered`（程式 + DB CHECK 雙重保證）
3. ✅ 外送員座標由前端假演算法產生後寫入 Supabase
4. ✅ `SUPABASE_SERVICE_ROLE_KEY` 只在 Server Action 使用，未出現在任何前端檔案
5. ✅ 地址欄位接受任何文字，顯示「地址確認 ✅」
6. ✅ 優惠碼欄位接受任何文字，顯示「優惠碼已套用 🎉」但金額不變
7. ✅ 離開追蹤頁再回來：外送員沿用原位附近，不重置
