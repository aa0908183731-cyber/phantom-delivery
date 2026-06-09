// 本地假資料（Single Source of Truth for 離線/未接 Supabase 模式）。
//
// 這 20 間餐廳同時用於：
//   1. 未設定 Supabase 時，App 直接讀這份資料運行。
//   2. scripts/seedSupabase.mjs 會把這份資料寫進 Supabase（含產生 seed SQL）。
//
// 每間餐廳的 id 在離線模式即為 slug；接上 Supabase 後則使用真實 uuid。

import type { MenuItem, Restaurant, Review } from "@/types/database.types";

export interface SeedMenuItem {
  name: string;
  description: string;
  price: number;
  category: string; // 菜單分類 tab，例如「主餐」「小菜」「飲料」
}

export interface SeedRestaurant {
  slug: string;
  name: string;
  /** 對應首頁分類 tab：台式 / 便當 / 熱炒 / 炸物 / 異國 / 早午餐 / 飲料甜點 / 宵夜 */
  category: string;
  /** 給人看的料理類型副標 */
  tagline: string;
  rating: number;
  review_count: number;
  min_order: number;
  delivery_time: string;
  menu: SeedMenuItem[];
}

export const HOME_CATEGORIES = [
  "全部",
  "台式",
  "便當",
  "熱炒",
  "炸物",
  "日式",
  "異國",
  "美式",
  "義式",
  "港式",
  "印度",
  "墨西哥",
  "燒肉",
  "早午餐",
  "飲料甜點",
  "冰品",
  "宵夜",
] as const;

export const SEED_RESTAURANTS: SeedRestaurant[] = [
  {
    slug: "acai-luroufan",
    name: "阿財滷肉飯",
    category: "台式",
    tagline: "台式便當・古早味滷肉飯",
    rating: 4.7,
    review_count: 3820,
    min_order: 120,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "招牌滷肉飯", description: "肥瘦三比七，淋上祖傳滷汁，配半熟滷蛋", price: 45, category: "飯類" },
      { name: "控肉飯", description: "三層肉滷到入口即化，肥而不膩", price: 75, category: "飯類" },
      { name: "爌肉便當", description: "大塊爌肉＋三樣配菜＋滷蛋", price: 110, category: "便當" },
      { name: "雞腿便當", description: "去骨雞腿排，外酥內嫩", price: 120, category: "便當" },
      { name: "滷蛋", description: "滷到入味的糖心蛋", price: 15, category: "小菜" },
      { name: "滷豆腐", description: "吸滿滷汁的傳統板豆腐", price: 20, category: "小菜" },
      { name: "燙青菜", description: "當季時蔬淋肉燥", price: 35, category: "小菜" },
      { name: "貢丸湯", description: "手打貢丸，湯頭清甜", price: 30, category: "湯品" },
      { name: "味噌湯", description: "豆腐海帶味噌湯", price: 25, category: "湯品" },
      { name: "冬瓜茶", description: "古法熬煮無添加", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "laodifang-beef-noodle",
    name: "老地方牛肉麵",
    category: "台式",
    tagline: "湯麵類・紅燒牛肉麵",
    rating: 4.6,
    review_count: 2680,
    min_order: 150,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "紅燒牛肉麵", description: "燉三小時的牛腱牛筋，湯頭濃郁", price: 180, category: "麵類" },
      { name: "清燉牛肉麵", description: "原汁原味，喝得到牛骨甜", price: 180, category: "麵類" },
      { name: "半筋半肉麵", description: "筋肉各半，膠質滿滿", price: 200, category: "麵類" },
      { name: "牛肉乾拌麵", description: "麻醬香蔥，拌開超香", price: 150, category: "麵類" },
      { name: "陽春麵", description: "簡單卻療癒的古早味", price: 60, category: "麵類" },
      { name: "滷牛腱", description: "薄切牛腱，淋蒜蓉醬油", price: 120, category: "小菜" },
      { name: "嘴邊肉", description: "彈牙有嚼勁", price: 80, category: "小菜" },
      { name: "燙地瓜葉", description: "蒜香清燙", price: 40, category: "小菜" },
      { name: "酸菜（免費續）", description: "解膩必備", price: 0, category: "小菜" },
      { name: "酸梅湯", description: "酸甜開胃", price: 30, category: "飲料" },
    ],
  },
  {
    slug: "sanma-stinky-hotpot",
    name: "三媽臭臭鍋",
    category: "台式",
    tagline: "臭豆腐鍋物・個人小火鍋",
    rating: 4.4,
    review_count: 1920,
    min_order: 160,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "臭豆腐臭臭鍋", description: "招牌臭豆腐＋豬血糕＋蔬菜盤", price: 150, category: "鍋物" },
      { name: "麻辣臭臭鍋", description: "麻辣湯底加臭豆腐，雙重夠味", price: 170, category: "鍋物" },
      { name: "海鮮鍋", description: "蝦、蛤蜊、魚片滿滿一鍋", price: 190, category: "鍋物" },
      { name: "牛肉鍋", description: "霜降牛肉片，涮一下最嫩", price: 180, category: "鍋物" },
      { name: "起司牛奶鍋", description: "濃郁奶香，小孩最愛", price: 180, category: "鍋物" },
      { name: "加點豬血糕", description: "Q彈沾醬一流", price: 30, category: "加料" },
      { name: "加點王子麵", description: "煮到剛好的童年回憶", price: 20, category: "加料" },
      { name: "加點鴨血", description: "嫩到入口即化", price: 30, category: "加料" },
      { name: "白飯", description: "免費續，鍋物好朋友", price: 10, category: "加料" },
      { name: "綠茶", description: "無糖解辣", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "chiabaomei-guabao",
    name: "呷飽沒割包店",
    category: "台式",
    tagline: "台式小吃・割包肉圓碗粿",
    rating: 4.5,
    review_count: 1450,
    min_order: 100,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "傳統割包", description: "爌肉、酸菜、花生粉、香菜，台式漢堡", price: 55, category: "割包" },
      { name: "雞排割包", description: "把整塊雞排塞進割包裡", price: 70, category: "割包" },
      { name: "肉圓（兩顆）", description: "外皮Q彈，內餡有筍丁香菇", price: 60, category: "小吃" },
      { name: "碗粿", description: "古早味鹹碗粿淋醬", price: 45, category: "小吃" },
      { name: "米糕", description: "油蔥米糕配甜辣醬", price: 40, category: "小吃" },
      { name: "四神湯", description: "薏仁、豬肚，溫補暖胃", price: 60, category: "湯品" },
      { name: "綜合湯", description: "貢丸＋魚丸＋油豆腐", price: 50, category: "湯品" },
      { name: "燙花枝", description: "新鮮花枝沾五味醬", price: 90, category: "小菜" },
      { name: "豆漿", description: "現磨無糖豆漿", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "jiucengta-stirfry",
    name: "九層塔快炒",
    category: "熱炒",
    tagline: "台式熱炒・百元快炒一條街",
    rating: 4.5,
    review_count: 2210,
    min_order: 200,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "三杯雞", description: "九層塔爆香，醬香下飯神器", price: 180, category: "熱炒" },
      { name: "蒼蠅頭", description: "韭菜花、豆豉、絞肉，超下酒", price: 160, category: "熱炒" },
      { name: "炒米粉", description: "古早味油蔥炒米粉", price: 90, category: "主食" },
      { name: "蚵仔煎", description: "粉漿蛋香，淋特調醬", price: 80, category: "小吃" },
      { name: "鹽酥溪蝦", description: "酥脆連殼一起吃", price: 150, category: "熱炒" },
      { name: "塔香茄子", description: "九層塔爆炒茄子", price: 130, category: "熱炒" },
      { name: "炒水蓮", description: "清脆爽口", price: 120, category: "熱炒" },
      { name: "宮保皮蛋", description: "皮蛋裹粉炸再炒", price: 140, category: "熱炒" },
      { name: "蛤蜊絲瓜", description: "鮮甜多汁", price: 150, category: "熱炒" },
      { name: "白飯", description: "一碗", price: 10, category: "主食" },
      { name: "台灣啤酒", description: "（未成年請勿飲酒）", price: 60, category: "飲料" },
    ],
  },
  {
    slug: "dajipai-fried",
    name: "大雞排來了",
    category: "炸物",
    tagline: "炸物・霸氣大雞排",
    rating: 4.8,
    review_count: 5120,
    min_order: 100,
    delivery_time: "15-25 分鐘",
    menu: [
      { name: "霸氣大雞排", description: "比臉大，現點現炸，免費灑辣椒", price: 80, category: "炸物" },
      { name: "鹽酥雞", description: "酥脆多汁，九層塔爆香", price: 70, category: "炸物" },
      { name: "甜不辣", description: "炸過更香，沾甜辣醬", price: 50, category: "炸物" },
      { name: "地瓜球", description: "外酥內Q，越嚼越香", price: 45, category: "炸物" },
      { name: "薯條", description: "粗薯條灑梅子粉", price: 50, category: "炸物" },
      { name: "雞米花", description: "一口一個停不下來", price: 60, category: "炸物" },
      { name: "炸花枝丸", description: "彈牙花枝丸", price: 55, category: "炸物" },
      { name: "炸杏鮑菇", description: "椒鹽杏鮑菇", price: 55, category: "炸物" },
      { name: "炸豆干", description: "外酥內嫩", price: 40, category: "炸物" },
      { name: "可樂", description: "冰涼解膩", price: 30, category: "飲料" },
    ],
  },
  {
    slug: "yeshi-fried-lab",
    name: "夜市炸物研究所",
    category: "炸物",
    tagline: "夜市炸物・獵奇部位專賣",
    rating: 4.6,
    review_count: 2870,
    min_order: 120,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "炸雞屁股", description: "夜市隱藏版，油脂噴汁", price: 60, category: "炸物" },
      { name: "炸大腸頭", description: "外酥內Q，沾蒜泥醬油", price: 90, category: "炸物" },
      { name: "炸豆干", description: "滷過再炸，超入味", price: 40, category: "炸物" },
      { name: "炸杏鮑菇", description: "椒鹽口味", price: 55, category: "炸物" },
      { name: "鹽酥雞", description: "經典不敗", price: 70, category: "炸物" },
      { name: "四季豆", description: "酥炸四季豆", price: 50, category: "炸物" },
      { name: "炸銀絲卷", description: "淋煉乳，鹹甜衝突美學", price: 50, category: "炸物" },
      { name: "炸魷魚", description: "椒鹽厚切魷魚", price: 90, category: "炸物" },
      { name: "百頁豆腐", description: "吸醬一流", price: 45, category: "炸物" },
      { name: "麥茶", description: "古早味麥茶", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "chishang-bento",
    name: "池上便當復刻版",
    category: "便當",
    tagline: "鐵路便當・木盒復刻",
    rating: 4.7,
    review_count: 3340,
    min_order: 110,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "招牌排骨便當", description: "炸排骨＋滷蛋＋三樣配菜，池上米", price: 110, category: "便當" },
      { name: "雞腿便當", description: "鐵路風味去骨雞腿", price: 120, category: "便當" },
      { name: "控肉便當", description: "滷到透的爌肉", price: 115, category: "便當" },
      { name: "鯖魚便當", description: "煎得焦香的鹽烤鯖魚", price: 130, category: "便當" },
      { name: "綜合便當", description: "排骨＋雞腿小份雙拼", price: 140, category: "便當" },
      { name: "素食便當", description: "素排＋三色蔬菜", price: 100, category: "便當" },
      { name: "加購滷蛋", description: "糖心滷蛋一顆", price: 15, category: "加購" },
      { name: "加購高麗菜", description: "清炒高麗菜", price: 25, category: "加購" },
      { name: "味噌湯", description: "附贈款也可單點", price: 20, category: "湯品" },
    ],
  },
  {
    slug: "fuyuan-veg-bento",
    name: "素食福緣便當",
    category: "便當",
    tagline: "素食便當・蔬食無負擔",
    rating: 4.5,
    review_count: 980,
    min_order: 100,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "素排骨便當", description: "酥炸素排＋四樣時蔬", price: 100, category: "便當" },
      { name: "三杯猴頭菇便當", description: "九層塔三杯猴頭菇", price: 115, category: "便當" },
      { name: "咖哩蔬食便當", description: "馬鈴薯紅蘿蔔咖哩燴飯", price: 110, category: "便當" },
      { name: "糖醋豆腐便當", description: "酸甜開胃", price: 105, category: "便當" },
      { name: "什錦炒麵", description: "滿滿蔬菜的炒麵", price: 90, category: "主食" },
      { name: "燙青菜", description: "當季蔬菜淋香油", price: 40, category: "小菜" },
      { name: "滷豆包", description: "滷得入味的豆包", price: 35, category: "小菜" },
      { name: "紫菜湯", description: "清爽紫菜蛋花湯（純素可備註）", price: 25, category: "湯品" },
      { name: "無糖豆漿", description: "現磨豆漿", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "dapaozhu-thai",
    name: "打拋豬研究室",
    category: "異國",
    tagline: "泰式料理・酸辣開胃",
    rating: 4.6,
    review_count: 2540,
    min_order: 180,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "招牌打拋豬飯", description: "九層塔、辣椒、魚露快炒，配半熟蛋", price: 130, category: "主食" },
      { name: "泰式綠咖哩雞", description: "椰香綠咖哩，微辣回甘", price: 160, category: "咖哩" },
      { name: "月亮蝦餅", description: "外酥內Q，附梅醬", price: 180, category: "小點" },
      { name: "涼拌青木瓜", description: "酸辣夠味的 Som Tum", price: 120, category: "沙拉" },
      { name: "泰式酸辣湯", description: "冬陰功，蝦味十足", price: 150, category: "湯品" },
      { name: "椒麻雞", description: "炸雞淋椒麻醬汁", price: 150, category: "主食" },
      { name: "打拋雞飯", description: "不吃豬的好選擇", price: 130, category: "主食" },
      { name: "泰式炒河粉", description: "Pad Thai 附花生碎", price: 140, category: "主食" },
      { name: "泰式奶茶", description: "橘紅色的濃郁香甜", price: 55, category: "飲料" },
      { name: "椰子汁", description: "冰鎮椰子水", price: 60, category: "飲料" },
    ],
  },
  {
    slug: "curryleaf-japanese",
    name: "咖哩葉日式咖哩",
    category: "異國",
    tagline: "日式咖哩・熬煮三小時",
    rating: 4.7,
    review_count: 1760,
    min_order: 150,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "炸豬排咖哩飯", description: "厚切里肌炸排，淋上濃醇咖哩", price: 160, category: "咖哩飯" },
      { name: "起司咖哩飯", description: "牽絲起司＋咖哩，邪惡組合", price: 150, category: "咖哩飯" },
      { name: "炸雞咖哩飯", description: "日式唐揚炸雞", price: 150, category: "咖哩飯" },
      { name: "野菜咖哩飯", description: "滿滿烤蔬菜，純素友善", price: 140, category: "咖哩飯" },
      { name: "咖哩烏龍", description: "Q彈烏龍泡進咖哩湯", price: 140, category: "烏龍" },
      { name: "牛肉咖哩飯", description: "燉到軟嫩的牛肋條", price: 180, category: "咖哩飯" },
      { name: "可樂餅（兩個）", description: "馬鈴薯可樂餅", price: 60, category: "炸物" },
      { name: "溫泉蛋加購", description: "半熟溫泉蛋", price: 20, category: "加購" },
      { name: "和風沙拉", description: "生菜淋胡麻醬", price: 70, category: "沙拉" },
      { name: "麥茶", description: "冰麥茶", price: 30, category: "飲料" },
    ],
  },
  {
    slug: "oni-korean-chicken",
    name: "韓式歐逆炸雞",
    category: "異國",
    tagline: "韓式料理・首爾直送的辣",
    rating: 4.8,
    review_count: 4280,
    min_order: 200,
    delivery_time: "30-45 分鐘",
    menu: [
      { name: "醬燒炸雞（半隻）", description: "韓式甜辣醬裹炸雞，灑白芝麻", price: 240, category: "炸雞" },
      { name: "原味炸雞（半隻）", description: "酥脆無調味，沾醬更香", price: 220, category: "炸雞" },
      { name: "起司炸雞", description: "炸雞淋上濃郁起司醬", price: 260, category: "炸雞" },
      { name: "蜂蜜奶油炸雞", description: "鹹甜奶油香", price: 250, category: "炸雞" },
      { name: "部隊鍋（兩人份）", description: "泡麵、起司、香腸、午餐肉滿滿", price: 320, category: "鍋物" },
      { name: "辣炒年糕", description: "Q彈年糕裹辣醬", price: 130, category: "小點" },
      { name: "起司球（六顆）", description: "爆漿馬自拉起司球", price: 120, category: "小點" },
      { name: "韓式煎餅", description: "海鮮蔥煎餅", price: 150, category: "小點" },
      { name: "醃蘿蔔", description: "解膩必備", price: 30, category: "小菜" },
      { name: "韓國米酒", description: "（未成年請勿飲酒）", price: 90, category: "飲料" },
    ],
  },
  {
    slug: "vietpho-stall",
    name: "越式河粉小棧",
    category: "異國",
    tagline: "越南料理・清爽系外送",
    rating: 4.5,
    review_count: 1320,
    min_order: 150,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "牛肉河粉", description: "清燉牛骨湯，附生豆芽九層塔", price: 150, category: "河粉" },
      { name: "雞肉河粉", description: "清爽雞湯底", price: 140, category: "河粉" },
      { name: "生牛肉河粉", description: "現燙生牛肉片", price: 170, category: "河粉" },
      { name: "越式春捲（四捲）", description: "米紙包蝦與蔬菜，沾魚露", price: 120, category: "小點" },
      { name: "炸春捲（四捲）", description: "酥脆豬肉春捲", price: 110, category: "小點" },
      { name: "越式法國麵包", description: "酥脆麵包夾烤肉與醃蘿蔔", price: 100, category: "主食" },
      { name: "檸檬香茅雞飯", description: "香茅烤雞腿飯", price: 140, category: "主食" },
      { name: "涼拌青木瓜", description: "酸甜開胃", price: 110, category: "沙拉" },
      { name: "越南滴漏咖啡", description: "煉乳冰咖啡", price: 70, category: "飲料" },
      { name: "甘蔗汁", description: "現榨清涼", price: 50, category: "飲料" },
    ],
  },
  {
    slug: "houpian-toast-lab",
    name: "厚片吐司實驗室",
    category: "早午餐",
    tagline: "早午餐・台式古早味",
    rating: 4.4,
    review_count: 1680,
    min_order: 100,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "花生厚片", description: "現烤厚片塗滿顆粒花生醬", price: 45, category: "吐司" },
      { name: "起司蛋厚片", description: "起司＋荷包蛋雙重滿足", price: 55, category: "吐司" },
      { name: "肉鬆厚片", description: "美乃滋配肉鬆", price: 50, category: "吐司" },
      { name: "蛋餅（原味）", description: "現煎粉漿蛋餅", price: 35, category: "蛋餅" },
      { name: "起司蛋餅", description: "牽絲起司蛋餅", price: 45, category: "蛋餅" },
      { name: "玉米蛋餅", description: "玉米粒蛋餅", price: 45, category: "蛋餅" },
      { name: "飯糰", description: "油條、菜脯、肉鬆的傳統飯糰", price: 50, category: "飯糰" },
      { name: "蘿蔔糕（兩塊）", description: "煎到金黃酥脆", price: 40, category: "鐵板" },
      { name: "冰豆漿", description: "古早味豆漿", price: 25, category: "飲料" },
      { name: "大冰奶", description: "袋裝大冰奶，回憶殺", price: 35, category: "飲料" },
    ],
  },
  {
    slug: "benedict-brunch",
    name: "班尼迪克蛋研究所",
    category: "早午餐",
    tagline: "西式早午餐・優雅開場",
    rating: 4.6,
    review_count: 2090,
    min_order: 180,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "經典班尼迪克蛋", description: "英式馬芬、火腿、水波蛋淋荷蘭醬", price: 220, category: "蛋料理" },
      { name: "煙燻鮭魚班尼迪克蛋", description: "升級煙燻鮭魚版", price: 260, category: "蛋料理" },
      { name: "酪梨班尼迪克蛋", description: "酪梨控必點", price: 240, category: "蛋料理" },
      { name: "美式鬆餅", description: "三層鬆餅淋楓糖配奶油", price: 180, category: "鬆餅" },
      { name: "藍莓鬆餅", description: "新鮮藍莓鬆餅", price: 200, category: "鬆餅" },
      { name: "煙燻鮭魚貝果", description: "貝果夾鮭魚與酸豆奶油", price: 190, category: "貝果" },
      { name: "總匯歐姆蛋", description: "起司火腿蘑菇歐姆蛋", price: 200, category: "蛋料理" },
      { name: "美式咖啡", description: "現萃黑咖啡", price: 80, category: "飲料" },
      { name: "鮮榨柳橙汁", description: "現榨無加糖", price: 90, category: "飲料" },
      { name: "拿鐵", description: "拉花拿鐵", price: 100, category: "飲料" },
    ],
  },
  {
    slug: "boba-institute",
    name: "波霸研究院",
    category: "飲料甜點",
    tagline: "手搖飲・珍珠控的天堂",
    rating: 4.7,
    review_count: 5980,
    min_order: 100,
    delivery_time: "15-25 分鐘",
    menu: [
      { name: "招牌珍珠奶茶", description: "黑糖珍珠＋濃醇紅茶鮮奶", price: 60, category: "奶茶" },
      { name: "多多綠", description: "養樂多綠茶，酸甜清爽", price: 55, category: "茶飲" },
      { name: "椰果奶茶", description: "Q彈椰果加奶茶", price: 55, category: "奶茶" },
      { name: "黑糖珍珠鮮奶", description: "黑糖掛壁＋鮮奶", price: 70, category: "鮮奶" },
      { name: "四季春青茶", description: "回甘無負擔", price: 35, category: "茶飲" },
      { name: "百香雙響炮", description: "百香果＋椰果＋珍珠", price: 65, category: "茶飲" },
      { name: "冬瓜檸檬", description: "古早味冬瓜配檸檬", price: 50, category: "茶飲" },
      { name: "芋頭鮮奶", description: "真芋頭顆粒鮮奶", price: 75, category: "鮮奶" },
      { name: "烏龍奶茶", description: "炭焙烏龍奶香", price: 55, category: "奶茶" },
      { name: "檸檬蘆薈", description: "蘆薈果肉檸檬飲", price: 60, category: "茶飲" },
    ],
  },
  {
    slug: "douhua-uncle",
    name: "豆花阿伯",
    category: "飲料甜點",
    tagline: "台式甜點・古早味豆花",
    rating: 4.6,
    review_count: 2240,
    min_order: 100,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "綜合豆花", description: "豆花＋花生＋粉圓＋紅豆", price: 55, category: "豆花" },
      { name: "花生豆花", description: "軟綿花生熬到入口即化", price: 50, category: "豆花" },
      { name: "粉圓豆花", description: "手煮粉圓配嫩豆花", price: 50, category: "豆花" },
      { name: "薑汁豆花", description: "暖胃薑汁，冬天限定感", price: 55, category: "豆花" },
      { name: "湯圓（紅豆湯）", description: "小湯圓配綿密紅豆", price: 60, category: "甜湯" },
      { name: "燒仙草", description: "熱燒仙草加料", price: 60, category: "甜湯" },
      { name: "芋圓地瓜圓", description: "手工Q彈芋圓", price: 65, category: "甜湯" },
      { name: "綠豆湯", description: "古法熬煮綿密綠豆", price: 50, category: "甜湯" },
      { name: "杏仁豆花", description: "杏仁香氣濃郁", price: 55, category: "豆花" },
    ],
  },
  {
    slug: "dessert-lab",
    name: "甜點實驗室",
    category: "飲料甜點",
    tagline: "日系甜點・少女心爆擊",
    rating: 4.8,
    review_count: 3120,
    min_order: 150,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "原味舒芙蕾鬆餅", description: "現烤厚鬆餅，入口即化", price: 180, category: "舒芙蕾" },
      { name: "抹茶聖代", description: "宇治抹茶冰淇淋＋紅豆白玉", price: 160, category: "聖代" },
      { name: "草莓大福（兩顆）", description: "Q麻糬包整顆草莓", price: 90, category: "和菓子" },
      { name: "巧克力熔岩蛋糕", description: "切開爆漿巧克力", price: 130, category: "蛋糕" },
      { name: "提拉米蘇", description: "經典咖啡酒香", price: 120, category: "蛋糕" },
      { name: "焦糖布丁", description: "古早味手工布丁", price: 70, category: "布丁" },
      { name: "抹茶舒芙蕾", description: "抹茶口味厚鬆餅", price: 200, category: "舒芙蕾" },
      { name: "莓果聖代", description: "綜合莓果冰淇淋聖代", price: 170, category: "聖代" },
      { name: "玫瑰荔枝茶", description: "甜點好搭檔", price: 90, category: "飲料" },
    ],
  },
  {
    slug: "salty-chicken-savior",
    name: "消夜救星鹹水雞",
    category: "宵夜",
    tagline: "鹹水雞・深夜的低調美味",
    rating: 4.6,
    review_count: 2760,
    min_order: 120,
    delivery_time: "20-35 分鐘",
    menu: [
      { name: "鹹水雞腿", description: "去骨雞腿，淋蔥油椒鹽", price: 90, category: "雞肉" },
      { name: "鹹水雞翅（三隻）", description: "嫩雞翅冰鎮入味", price: 80, category: "雞肉" },
      { name: "鹹水雞胸", description: "低脂高蛋白，健身族最愛", price: 70, category: "雞肉" },
      { name: "雞胗", description: "脆口雞胗", price: 50, category: "雞肉" },
      { name: "高麗菜", description: "爽脆高麗菜", price: 30, category: "蔬菜" },
      { name: "玉米筍", description: "清甜玉米筍", price: 35, category: "蔬菜" },
      { name: "四季豆", description: "燙青脆四季豆", price: 35, category: "蔬菜" },
      { name: "杏鮑菇", description: "厚切杏鮑菇", price: 40, category: "蔬菜" },
      { name: "花椰菜", description: "白綠花椰各半", price: 35, category: "蔬菜" },
      { name: "綜合拼盤", description: "雞腿＋四樣蔬菜，蔥油爆香", price: 160, category: "拼盤" },
    ],
  },
  {
    slug: "midnight-instant-noodle",
    name: "深夜食堂泡麵升級",
    category: "宵夜",
    tagline: "泡麵加料・罪惡感加倍奉還",
    rating: 4.5,
    review_count: 1890,
    min_order: 100,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "起司辛拉麵", description: "辛拉麵加滿起司，牽絲到天邊", price: 110, category: "泡麵" },
      { name: "海陸雙拼泡麵", description: "泡麵加蝦、蛤蜊、肉片", price: 140, category: "泡麵" },
      { name: "肉蛋泡麵", description: "加肉片＋半熟蛋的基本款", price: 100, category: "泡麵" },
      { name: "麻辣鴨血泡麵", description: "麻辣湯底加鴨血豆腐", price: 130, category: "泡麵" },
      { name: "起司年糕泡麵", description: "韓式年糕＋起司", price: 130, category: "泡麵" },
      { name: "加點半熟蛋", description: "一顆會爆漿的蛋", price: 20, category: "加料" },
      { name: "加點起司片", description: "邪惡牽絲", price: 25, category: "加料" },
      { name: "加點午餐肉", description: "煎香午餐肉", price: 40, category: "加料" },
      { name: "加點王子麵", description: "再加一塊乾吃也行", price: 20, category: "加料" },
      { name: "可樂", description: "冰可樂解膩", price: 30, category: "飲料" },
    ],
  },
  {
    slug: "bake-american-burger",
    name: "霸克美式漢堡",
    category: "美式",
    tagline: "美式漢堡・現煎厚牛肉排",
    rating: 4.6,
    review_count: 2380,
    min_order: 180,
    delivery_time: "25-35 分鐘",
    menu: [
      { name: "經典牛肉堡", description: "4 盎司現煎牛肉排、生菜番茄", price: 130, category: "漢堡" },
      { name: "雙層起司牛肉堡", description: "雙層牛肉＋融化起司，超滿足", price: 180, category: "漢堡" },
      { name: "蘑菇培根牛肉堡", description: "炒蘑菇＋脆培根，濃郁多汁", price: 175, category: "漢堡" },
      { name: "香脆雞腿堡", description: "現炸多汁雞腿排", price: 140, category: "漢堡" },
      { name: "黃金薯條", description: "現炸粗切薯條", price: 70, category: "配餐" },
      { name: "酥炸洋蔥圈", description: "一份 6 個，酥脆涮嘴", price: 75, category: "配餐" },
      { name: "雞塊（6 塊）", description: "外酥內嫩", price: 80, category: "配餐" },
      { name: "香草奶昔", description: "濃郁香草，邪惡甜", price: 90, category: "飲料" },
      { name: "可樂", description: "冰涼暢快", price: 35, category: "飲料" },
    ],
  },
  {
    slug: "napoli-pizza",
    name: "拿坡里手工披薩",
    category: "義式",
    tagline: "手工窯烤披薩・薄脆餅皮",
    rating: 4.7,
    review_count: 1920,
    min_order: 250,
    delivery_time: "30-45 分鐘",
    menu: [
      { name: "瑪格麗特披薩", description: "番茄、莫札瑞拉、羅勒，經典不敗", price: 220, category: "披薩" },
      { name: "夏威夷披薩", description: "火腿＋鳳梨，甜鹹之爭", price: 260, category: "披薩" },
      { name: "培根蘑菇披薩", description: "脆培根與蘑菇的香氣", price: 280, category: "披薩" },
      { name: "海鮮總匯披薩", description: "蝦仁、花枝、淡菜滿滿", price: 320, category: "披薩" },
      { name: "四種起司披薩", description: "起司控的終極夢想", price: 290, category: "披薩" },
      { name: "香蒜麵包", description: "烤得金黃的蒜香麵包", price: 80, category: "前菜" },
      { name: "水牛城炸雞翅", description: "微辣多汁，附藍紋起司醬", price: 160, category: "前菜" },
      { name: "凱薩沙拉", description: "生菜淋凱薩醬與帕瑪森", price: 120, category: "沙拉" },
      { name: "義式氣泡飲", description: "清爽解膩", price: 60, category: "飲料" },
    ],
  },
  {
    slug: "kisen-donburi",
    name: "極鮮丼飯屋",
    category: "日式",
    tagline: "日式丼飯・每日現切生魚片",
    rating: 4.8,
    review_count: 3260,
    min_order: 200,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "鮭魚親子丼", description: "厚切鮭魚＋鮭魚卵雙重享受", price: 220, category: "丼飯" },
      { name: "鮪魚丼", description: "肥美赤身鋪滿飯上", price: 240, category: "丼飯" },
      { name: "海膽干貝丼", description: "海膽與干貝的奢華組合", price: 380, category: "丼飯" },
      { name: "綜合生魚片丼", description: "五種當日鮮魚生魚片", price: 280, category: "丼飯" },
      { name: "炙燒鮭魚丼", description: "炙燒到微焦，油脂噴香", price: 250, category: "丼飯" },
      { name: "鰻魚丼", description: "蒲燒鰻魚淋特製醬汁", price: 320, category: "丼飯" },
      { name: "茶碗蒸", description: "滑嫩日式蒸蛋", price: 60, category: "小品" },
      { name: "味噌湯", description: "豆腐海帶味噌湯", price: 30, category: "湯品" },
      { name: "綠茶", description: "無糖冷泡綠茶", price: 30, category: "飲料" },
    ],
  },
  {
    slug: "yeshi-steak",
    name: "夜市平價牛排",
    category: "美式",
    tagline: "夜市牛排・鐵板滋滋作響",
    rating: 4.5,
    review_count: 2750,
    min_order: 160,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "沙朗牛排", description: "鐵板現煎，附麵與蛋", price: 180, category: "牛排" },
      { name: "菲力牛排", description: "軟嫩菲力，肉控最愛", price: 220, category: "牛排" },
      { name: "德式豬排", description: "厚切炸豬排淋黑胡椒醬", price: 150, category: "排餐" },
      { name: "香煎雞腿排", description: "外皮酥香的去骨雞腿", price: 150, category: "排餐" },
      { name: "鐵板麵（加點）", description: "鐵板上的靈魂配角", price: 40, category: "加點" },
      { name: "玉米濃湯（免費續）", description: "餐前暖胃必備", price: 0, category: "湯品" },
      { name: "蘑菇黑胡椒醬加購", description: "醬汁淋好淋滿", price: 20, category: "加購" },
      { name: "半熟蛋加購", description: "戳破拌牛排超香", price: 15, category: "加購" },
      { name: "古早味紅茶", description: "無限暢飲的回憶", price: 25, category: "飲料" },
    ],
  },
  {
    slug: "alley-pasta",
    name: "巷弄義式麵屋",
    category: "義式",
    tagline: "義大利麵・道地南義風味",
    rating: 4.6,
    review_count: 1640,
    min_order: 200,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "奶油培根義大利麵", description: "濃郁卡邦尼白醬", price: 180, category: "義大利麵" },
      { name: "青醬雞肉義大利麵", description: "羅勒青醬香氣十足", price: 190, category: "義大利麵" },
      { name: "茄汁海鮮義大利麵", description: "蝦仁花枝淡菜的酸甜", price: 210, category: "義大利麵" },
      { name: "松露野菇義大利麵", description: "松露香氣的奢華", price: 220, category: "義大利麵" },
      { name: "焗烤千層麵", description: "層層肉醬與起司", price: 200, category: "焗烤" },
      { name: "烤蒜香麵包", description: "金黃酥脆", price: 70, category: "前菜" },
      { name: "凱薩沙拉", description: "清爽開胃", price: 120, category: "沙拉" },
      { name: "提拉米蘇", description: "咖啡酒香的經典甜點", price: 110, category: "甜點" },
      { name: "氣泡水", description: "義式餐桌標配", price: 50, category: "飲料" },
    ],
  },
  {
    slug: "charcoal-skewer",
    name: "炭火串燒攤",
    category: "宵夜",
    tagline: "深夜串燒・炭火直烤",
    rating: 4.7,
    review_count: 3120,
    min_order: 150,
    delivery_time: "25-40 分鐘",
    menu: [
      { name: "鹽烤雞肉串", description: "炭火逼出油脂，鹹香", price: 45, category: "串燒" },
      { name: "牛五花串", description: "油花豐富，一口爆汁", price: 60, category: "串燒" },
      { name: "豬五花串", description: "炭烤到微焦的五花", price: 50, category: "串燒" },
      { name: "炭烤雞翅", description: "皮脆肉嫩", price: 55, category: "串燒" },
      { name: "烤香腸", description: "台式香腸炭烤更香", price: 40, category: "串燒" },
      { name: "烤米血", description: "Q彈米血刷醬", price: 35, category: "串燒" },
      { name: "杏鮑菇串", description: "多汁杏鮑菇", price: 40, category: "串燒" },
      { name: "蔥鹽豬五花", description: "蔥花鹽香解膩", price: 60, category: "串燒" },
      { name: "烤高麗菜", description: "炭烤出甜味的高麗菜", price: 45, category: "蔬菜" },
      { name: "台灣啤酒", description: "（未成年請勿飲酒）", price: 60, category: "飲料" },
    ],
  },
  {
    slug: "tim-dimsum",
    name: "添好運港式點心",
    category: "港式",
    tagline: "港式飲茶・一盅兩件",
    rating: 4.7,
    review_count: 4120,
    min_order: 200,
    delivery_time: "30-45 分鐘",
    menu: [
      { name: "晶瑩鮮蝦餃（四顆）", description: "薄皮裹整隻鮮蝦，港點之王", price: 90, category: "點心" },
      { name: "干貝燒賣皇（四顆）", description: "豬肉蝦仁加干貝，鮮味爆棚", price: 85, category: "點心" },
      { name: "豉汁蒸鳳爪", description: "軟糯入味的經典飲茶", price: 70, category: "點心" },
      { name: "鮮蝦腸粉", description: "滑嫩腸粉淋上甜豉油", price: 80, category: "點心" },
      { name: "流沙包（三入）", description: "爆漿鹹蛋黃奶黃餡", price: 75, category: "點心" },
      { name: "蜜汁叉燒飯", description: "炭燒蜜汁叉燒鋪滿白飯", price: 130, category: "燒臘飯" },
      { name: "港式燒臘雙拼飯", description: "油雞＋燒肉雙拼，附例湯", price: 150, category: "燒臘飯" },
      { name: "香煎蘿蔔糕（三塊）", description: "臘味蘿蔔糕煎到金黃", price: 70, category: "點心" },
      { name: "楊枝甘露", description: "芒果西米露淋上柚子", price: 80, category: "甜點" },
      { name: "港式絲襪奶茶", description: "濃滑奶茶，回味無窮", price: 60, category: "飲料" },
    ],
  },
  {
    slug: "bombay-curry",
    name: "孟買印度咖哩屋",
    category: "印度",
    tagline: "正統北印度・坦都窯烤",
    rating: 4.6,
    review_count: 2240,
    min_order: 250,
    delivery_time: "30-45 分鐘",
    menu: [
      { name: "奶油雞咖哩", description: "番茄奶油醬燉雞，濃郁微甜", price: 220, category: "印度咖哩" },
      { name: "瑪薩拉羊肉咖哩", description: "香料燉到軟爛的羊肉", price: 260, category: "印度咖哩" },
      { name: "菠菜起司咖哩", description: "菠菜泥燴印度起司，純素友善", price: 200, category: "印度咖哩" },
      { name: "坦都里烤雞（半隻）", description: "優格香料醃漬，窯烤上色", price: 240, category: "窯烤" },
      { name: "蒜香印度烤餅", description: "現烤 Naan，蒜香四溢", price: 60, category: "烤餅" },
      { name: "原味印度烤餅", description: "蓬鬆有嚼勁的現烤餅", price: 50, category: "烤餅" },
      { name: "咖哩餃（兩個）", description: "酥皮包馬鈴薯咖哩餡 Samosa", price: 80, category: "印度咖哩" },
      { name: "芒果優格拉西", description: "冰涼濃稠的芒果優格飲", price: 90, category: "飲料" },
      { name: "印度香料奶茶", description: "瑪薩拉香料煮的甜奶茶", price: 70, category: "飲料" },
    ],
  },
  {
    slug: "amigo-mexican",
    name: "阿米哥墨西哥餐廳",
    category: "墨西哥",
    tagline: "墨西哥街頭・塔可捲餅",
    rating: 4.5,
    review_count: 1680,
    min_order: 220,
    delivery_time: "30-45 分鐘",
    menu: [
      { name: "招牌牛肉塔可（三入）", description: "玉米餅夾炭烤牛肉莎莎醬", price: 180, category: "塔可" },
      { name: "雞肉塔可（三入）", description: "墨西哥香料雞肉塔可", price: 170, category: "塔可" },
      { name: "招牌牛肉捲餅", description: "大份量飽足的 Burrito", price: 190, category: "捲餅" },
      { name: "雞肉酪梨捲餅", description: "酪梨醬與雞肉的清爽組合", price: 180, category: "捲餅" },
      { name: "起司玉米片", description: "脆玉米片淋滿起司醬 Nachos", price: 120, category: "玉米片" },
      { name: "莎莎醬玉米片", description: "番茄莎莎醬配脆玉米片", price: 110, category: "玉米片" },
      { name: "雞肉法士達", description: "鐵板炒雞肉甜椒，自己包", price: 200, category: "塔可" },
      { name: "墨西哥香料炒飯", description: "番茄香料炒出的西班牙飯", price: 130, category: "主食" },
      { name: "莫吉托（無酒精）", description: "薄荷萊姆氣泡飲", price: 90, category: "飲料" },
    ],
  },
  {
    slug: "yakiniku-dojo",
    name: "燒肉道場",
    category: "燒肉",
    tagline: "日式燒肉・炭火直烤",
    rating: 4.8,
    review_count: 3560,
    min_order: 300,
    delivery_time: "35-50 分鐘",
    menu: [
      { name: "特選牛五花", description: "油花分布均勻，一烤就香", price: 220, category: "燒肉" },
      { name: "厚切牛舌", description: "彈牙多汁，擠檸檬最對味", price: 260, category: "燒肉" },
      { name: "霜降松阪豬", description: "粉嫩松阪豬，脆口不柴", price: 180, category: "燒肉" },
      { name: "韓式醬豬五花", description: "甜辣醬醃漬的厚切豬五花", price: 170, category: "燒肉" },
      { name: "安格斯牛小排", description: "帶骨牛小排，油脂噴香", price: 280, category: "燒肉" },
      { name: "鹽蔥雞腿肉", description: "蔥鹽風味去骨雞腿", price: 160, category: "燒肉" },
      { name: "韓式石鍋拌飯", description: "石鍋鍋巴香，拌開更好吃", price: 150, category: "飯食" },
      { name: "韓式泡菜", description: "微酸微辣，解膩必備", price: 50, category: "小菜" },
      { name: "炭烤時蔬拼盤", description: "杏鮑菇、玉米、甜椒一次烤", price: 90, category: "蔬菜" },
      { name: "韓國生啤酒", description: "（未成年請勿飲酒）", price: 90, category: "飲料" },
    ],
  },
  {
    slug: "snowice-house",
    name: "雪花冰の家",
    category: "冰品",
    tagline: "綿綿雪花冰・夏日限定",
    rating: 4.7,
    review_count: 3980,
    min_order: 120,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "新鮮芒果雪花冰", description: "整顆愛文芒果＋煉乳雪花冰", price: 150, category: "雪花冰" },
      { name: "草莓煉乳雪花冰", description: "酸甜草莓鋪滿綿綿冰", price: 140, category: "雪花冰" },
      { name: "抹茶紅豆綿綿冰", description: "宇治抹茶淋上綿綿冰", price: 130, category: "雪花冰" },
      { name: "招牌八寶冰", description: "紅豆、芋圓、粉圓、仙草八種料", price: 90, category: "剉冰" },
      { name: "黑糖粉粿牛奶冰", description: "黑糖粉粿配綿密牛奶冰", price: 110, category: "雪花冰" },
      { name: "芋圓地瓜圓剉冰", description: "手工芋圓地瓜圓加剉冰", price: 85, category: "剉冰" },
      { name: "古早味紅豆牛奶冰", description: "綿密紅豆配煉乳牛奶冰", price: 95, category: "剉冰" },
      { name: "綜合水果雪花冰", description: "當季水果繽紛一大碗", price: 140, category: "雪花冰" },
      { name: "仙草凍剉冰", description: "Q彈仙草凍配剉冰", price: 80, category: "剉冰" },
      { name: "冬瓜檸檬", description: "古早味冬瓜配檸檬", price: 50, category: "飲料" },
    ],
  },
  {
    slug: "donut-planet",
    name: "甜甜圈星球",
    category: "飲料甜點",
    tagline: "現炸甜甜圈・療癒系下午茶",
    rating: 4.6,
    review_count: 2870,
    min_order: 120,
    delivery_time: "20-30 分鐘",
    menu: [
      { name: "原味糖霜甜甜圈", description: "經典蓬鬆，裹滿糖霜", price: 45, category: "甜甜圈" },
      { name: "巧克力淋醬甜甜圈", description: "濃郁巧克力淋醬", price: 55, category: "甜甜圈" },
      { name: "草莓糖霜甜甜圈", description: "粉嫩草莓糖霜＋彩糖", price: 55, category: "甜甜圈" },
      { name: "肉桂糖甜甜圈", description: "現炸裹肉桂糖粉", price: 50, category: "甜甜圈" },
      { name: "蜂蜜波堤（六入）", description: "Q彈相連的蜂蜜波堤", price: 90, category: "甜甜圈" },
      { name: "花生醬法蘭奇", description: "酥脆法蘭奇淋花生醬", price: 60, category: "甜甜圈" },
      { name: "美式咖啡", description: "現萃黑咖啡，配甜甜圈剛好", price: 70, category: "飲料" },
      { name: "拿鐵", description: "拉花拿鐵", price: 90, category: "飲料" },
      { name: "草莓奶昔", description: "濃郁草莓奶昔", price: 90, category: "飲料" },
    ],
  },
];

// ---- 假評論產生（台灣在地口吻、繁體中文） ----

const REVIEWER_NAMES = [
  "美食獵人小P",
  "吃貨阿明",
  "信義區吳小姐",
  "減肥中的Kevin",
  "深夜覓食者",
  "台北胃無底洞",
  "外送成癮者",
  "週末廚房逃兵",
  "巷口陳太太",
  "幻想美食家",
  "省錢小資女",
  "夜貓子工程師",
];

const REVIEW_TEMPLATES = [
  "超好吃！外送還很快，下次還會再點 👍",
  "CP值超高，份量很大，推推！",
  "等了一下下但很值得，味道很道地。",
  "包裝很用心，到的時候還是熱的，給讚。",
  "口味偏重但很對我的胃，會回購。",
  "朋友推薦來的，果然沒讓我失望。",
  "份量普通但味道不錯，整體可以。",
  "醬料給超多的，超佛心，謝謝老闆 🙏",
  "深夜點這個真的會有罪惡感⋯但好吃。",
  "在地人認證，這家真的是隱藏版。",
  "第一次點就愛上，已加入我的口袋名單。",
  "送來的時候湯有點灑出來，但味道滿分。",
  "辣度剛剛好，吃完整個很滿足。",
  "比想像中好吃，價格也很佛，推！",
  "招牌必點，其他的就普普，但招牌真的強。",
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// 將 hashString 結果做 avalanche 混合後取最低位元，作為「兩張圖輪替」的依據。
// 直接拿 hashString 取奇偶會因中文字碼規律而整排偏向同一張，混合後才夠均勻。
function variantBit(str: string): number {
  let h = hashString(str);
  h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0) >>> 0;
  h ^= h >>> 16;
  return h & 1;
}

/** 依餐廳 id 穩定地產生 5 則假評論。 */
export function generateSeedReviews(restaurantId: string): Review[] {
  const base = hashString(restaurantId);
  const reviews: Review[] = [];
  for (let i = 0; i < 5; i++) {
    const tIdx = (base + i * 7) % REVIEW_TEMPLATES.length;
    const nIdx = (base + i * 5) % REVIEWER_NAMES.length;
    const rating = 4 + ((base + i) % 2); // 4 或 5 顆星
    reviews.push({
      id: `${restaurantId}-r${i}`,
      restaurant_id: restaurantId,
      reviewer_name: REVIEWER_NAMES[nIdx],
      rating,
      content: REVIEW_TEMPLATES[tIdx],
      created_at: new Date(Date.now() - i * 86_400_000).toISOString(),
    });
  }
  return reviews;
}

// ---- 圖片（本地真實美食照，放在 /public/food；做到圖文相符、永不破圖）----
//
// 39 種菜色類型，各對應一張下載好的真實美食照（Wikimedia 台灣在地照 + TheMealDB）。
// 細分到「小菜 / 蛋 / 豆腐 / 湯 / 各式飲料 / 甜湯…」，讓同一間店點進去後每道菜的圖片有差異。

export type FoodType =
  | "luroufan"
  | "bento"
  | "beef-noodle"
  | "ramen"
  | "friedchicken"
  | "chicken-cutlet"
  | "karaage"
  | "friedrice"
  | "katsu-curry"
  | "thai-curry"
  | "bao"
  | "hotpot"
  | "stirfry"
  | "veg"
  | "bubble-tea"
  | "douhua"
  | "cake"
  | "pancake"
  | "burger"
  | "pizza"
  | "sushi"
  | "steak"
  | "pasta"
  | "skewer"
  // 細分小菜 / 配料 / 飲料 / 甜點，避免同店菜色圖片重複
  | "egg"
  | "tofu"
  | "soup"
  | "fries"
  | "salad"
  | "springroll"
  | "sweetsoup"
  | "waffle"
  | "toast"
  | "milktea"
  | "tea"
  | "coffee"
  | "soda"
  | "beer"
  | "soymilk"
  | "coldchicken"
  // 圖文修正用的精準類型
  | "mushroom"
  | "meatball"
  | "shrimpcake"
  | "banhmi"
  | "luwei"
  // 新增料理類別
  | "dimsum"
  | "charsiu"
  | "naan"
  | "indian-curry"
  | "tandoori"
  | "taco"
  | "burrito"
  | "nachos"
  | "yakiniku"
  | "shavedice"
  | "donut"
  | "bibimbap"
  | "kimchi";

// 這些「單一主題店容易整排重複」的類型各備有第二張照片（檔名加 2），
// 依菜名雜湊輪流使用，讓火鍋店 / 串燒店 / 丼飯店…點進去不會整排同一張圖。
const VARIANT_TYPES = new Set<FoodType>([
  "hotpot", "stirfry", "thai-curry", "ramen", "skewer", "katsu-curry",
  "pizza", "sushi", "pasta", "cake", "friedchicken", "beef-noodle",
  "bento", "douhua", "karaage", "pancake", "tea",
  "dimsum", "yakiniku", "shavedice", "donut", "indian-curry",
]);

function foodImg(type: FoodType): string {
  return `/food/${type}.jpg`;
}

// 每間餐廳的招牌圖（hero / 卡片），同時當作菜色比對不到時的 fallback
const RESTAURANT_FOOD: Record<string, FoodType> = {
  "acai-luroufan": "luroufan",
  "laodifang-beef-noodle": "beef-noodle",
  "sanma-stinky-hotpot": "hotpot",
  "chiabaomei-guabao": "bao",
  "jiucengta-stirfry": "stirfry",
  "dajipai-fried": "chicken-cutlet",
  "yeshi-fried-lab": "karaage",
  "chishang-bento": "bento",
  "fuyuan-veg-bento": "veg",
  "dapaozhu-thai": "thai-curry",
  "curryleaf-japanese": "katsu-curry",
  "oni-korean-chicken": "friedchicken",
  "vietpho-stall": "beef-noodle",
  "houpian-toast-lab": "pancake",
  "benedict-brunch": "pancake",
  "boba-institute": "bubble-tea",
  "douhua-uncle": "douhua",
  "dessert-lab": "cake",
  "salty-chicken-savior": "veg",
  "midnight-instant-noodle": "ramen",
  "bake-american-burger": "burger",
  "napoli-pizza": "pizza",
  "kisen-donburi": "sushi",
  "yeshi-steak": "steak",
  "alley-pasta": "pasta",
  "charcoal-skewer": "skewer",
  "tim-dimsum": "dimsum",
  "bombay-curry": "indian-curry",
  "amigo-mexican": "taco",
  "yakiniku-dojo": "yakiniku",
  "snowice-house": "shavedice",
  "donut-planet": "donut",
};

// 依菜名 + 分類關鍵字判斷菜色類型（順序：特定 → 一般），比對不到就用餐廳招牌圖。
//
// 重點：細分到小菜 / 蛋 / 豆腐 / 各式湯 / 各式飲料 / 甜湯，讓「同一間店點進去後」
// 每道菜盡量對到不同照片（例如滷肉飯店的 滷蛋→蛋、滷豆腐→豆腐、貢丸湯→湯、冬瓜茶→茶）。
// 只比對「菜名 + 菜單分類」，不含描述，避免描述裡的字誤判。
function dishToFoodType(
  name: string,
  category: string,
  fallback: FoodType,
): FoodType {
  const s = `${name} ${category}`;
  const has = (...ks: string[]) => ks.some((k) => s.includes(k));

  // 0) 特定例外（避免被一般關鍵字誤判，例如 可樂餅 不是可樂）
  if (has("可樂餅", "薯餅")) return "karaage";

  // 1) 飲料：細分成 啤酒 / 咖啡 / 豆漿 / 汽水 / 珍奶 / 奶茶 / 茶飲
  if (has("啤酒", "米酒", "調酒", "沙瓦")) return "beer";
  if (has("咖啡", "拿鐵")) return "coffee";
  if (has("豆漿")) return "soymilk";
  if (has("可樂", "汽水", "沙士", "雪碧", "氣泡", "莫吉托")) return "soda";
  if (has("珍珠", "珍奶", "波霸")) return "bubble-tea";
  if (has("奶茶", "鮮奶", "奶昔", "冰奶", "拉西", "優格")) return "milktea";
  if (
    has(
      "綠茶", "紅茶", "青茶", "四季春", "冬瓜", "麥茶", "酸梅", "多多", "養樂多",
      "百香", "蘆薈", "甘蔗", "柳橙", "椰子", "玫瑰", "荔枝茶", "茶飲", "滴漏",
    )
  )
    return "tea";
  // 飲料分類但沒對到具體品項 → 給杯茶飲（保底，免得落到食物圖）
  if (category.includes("飲料")) return "tea";

  // 2) 甜點（剉冰 / 甜甜圈 先於豆花蛋糕，免得草莓雪花冰被當蛋糕、巧克力甜甜圈被當蛋糕）
  if (has("雪花冰", "綿綿冰", "剉冰", "挫冰", "刨冰", "牛奶冰", "八寶冰", "芒果冰"))
    return "shavedice";
  if (has("甜甜圈", "波堤", "法蘭奇", "多拿滋")) return "donut";
  if (has("豆花", "杏仁豆")) return "douhua";
  if (
    has("湯圓", "紅豆", "燒仙草", "仙草", "綠豆", "芋圓", "地瓜圓", "甜湯", "楊枝甘露")
  )
    return "sweetsoup";
  if (has("舒芙蕾", "鬆餅")) return "waffle";
  if (
    has("蛋糕", "提拉米蘇", "熔岩", "聖代", "大福", "布丁", "可麗",
      "巧克力", "草莓", "莓果", "焦糖", "甜點")
  )
    return "cake";

  // 2.5) 新增料理：港式 / 韓式 / 印度 / 墨西哥 / 越式（先於通用飯麵咖哩，免得被誤判）
  if (has("石鍋拌", "拌飯")) return "bibimbap"; // 先於 鍋物
  if (category.includes("燒肉") || has("燒肉", "烤肉")) return "yakiniku"; // 先於 串/五花
  if (has("泡菜")) return "kimchi";
  if (has("蝦餃", "燒賣", "腸粉", "鳳爪")) return "dimsum";
  if (has("叉燒", "燒臘", "油雞飯", "燒鴨", "脆皮燒")) return "charsiu";
  if (has("烤餅", "naan", "饢")) return "naan"; // 先於 indian-curry（印度烤餅含「印度」）
  if (has("坦都", "tandoori")) return "tandoori";
  if (has("瑪薩拉", "奶油雞", "咖哩餃", "咖哩角") || category.includes("印度"))
    return "indian-curry"; // 先於 katsu 咖哩
  if (has("塔可", "taco", "法士達")) return "taco";
  if (has("捲餅", "burrito")) return "burrito";
  if (has("玉米片", "nachos")) return "nachos";
  if (has("月亮蝦餅", "蝦餅")) return "shrimpcake"; // 先於 泰式
  if (has("法國麵包", "越式法國")) return "banhmi"; // 先於 河粉/便當

  // 3) 炒飯 / 炒麵 / 炒河粉（先於 泰式 / 河粉，否則 泰式炒河粉 會變綠咖哩或湯麵）
  if (has("炒飯", "炒米粉", "炒麵", "炒河粉", "什錦炒")) return "friedrice";

  // 4) 西式 / 日式（先於麵飯類，避免「鐵板麵 / 丼飯」被誤判）
  if (has("披薩")) return "pizza";
  if (has("漢堡", "牛肉堡", "起司堡", "雞堡", "培根堡", "雞腿堡")) return "burger";
  if (has("丼", "生魚片", "壽司", "炙燒鮭", "海膽", "鰻魚", "親子")) return "sushi";
  if (has("牛排", "沙朗", "菲力")) return "steak";
  if (has("義大利麵", "千層麵", "鐵板麵", "卡邦尼", "青醬", "焗烤", "松露"))
    return "pasta";
  if (has("串", "串燒", "香腸", "米血", "烤雞翅", "五花")) return "skewer";

  // 5) 咖哩 / 泰式（先於 飯/便當/炸雞/麵；月亮蝦餅已在前面歸 shrimpcake）
  if (has("打拋", "綠咖哩", "椒麻", "酸辣", "青木瓜", "泰式", "冬陰"))
    return "thai-curry";
  if (has("咖哩")) return "katsu-curry";

  // 6) 鍋物（先於 豆腐 / 炸物，臭臭鍋才不會變成豆腐）
  if (has("鍋", "臭豆腐", "豬血糕", "鴨血", "部隊")) return "hotpot";

  // 7) 蛋 / 豆腐（小菜、加購；用具體字避免誤抓 蛋餅 / 班尼迪克蛋）
  if (has("滷蛋", "溫泉蛋", "半熟蛋", "糖心", "溏心", "茶碗蒸", "茶葉蛋", "水波蛋"))
    return "egg";
  if (has("豆腐", "豆包", "百頁", "豆干")) return "tofu";
  // 滷味小菜（滷牛腱 / 嘴邊肉）；菇類（杏鮑菇 等，修正圖文不符）
  if (has("滷牛腱", "嘴邊肉", "滷味", "滷大腸")) return "luwei";
  if (has("杏鮑菇", "金針菇", "鴻喜菇", "香菇", "秀珍菇")) return "mushroom";

  // 8) 鹹湯（甜湯 / 酒釀湯 / 酸辣湯 / 酸梅湯 已在前面攔截，剩下的 湯 都是鹹湯）
  if (has("湯")) return "soup";

  // 9) 炸物配料：薯條 / 春捲 / 沙拉（先於泛用炸物與蔬菜）
  if (has("薯條", "洋蔥圈", "薯餅")) return "fries";
  if (has("沙拉", "凱薩", "和風", "生菜")) return "salad";
  if (has("春捲")) return "springroll";

  // 10) 麵 / 湯麵
  if (has("牛肉麵", "牛腩", "半筋", "河粉")) return "beef-noodle";
  if (has("泡麵", "拉麵", "辛拉", "烏龍", "麵線", "陽春", "乾拌麵", "王子麵"))
    return "ramen";

  // 11) 飯 / 便當（便當先於熱炒，三杯猴頭菇便當才不會變熱炒）
  if (has("滷肉飯", "魯肉", "控肉", "爌肉", "米糕", "肉燥", "油飯")) return "luroufan";
  if (has("排骨", "豬排", "便當", "鯖魚", "素排", "香茅雞飯", "雞飯")) return "bento";

  // 11.5) 肉圓 / 碗粿（修正：原本落到割包圖）
  if (has("肉圓", "碗粿")) return "meatball";

  // 12) 割包（先於 雞排，雞排割包才會是割包）
  if (has("割包", "刈包", "包子", "虎咬豬")) return "bao";

  // 13) 熱炒（先於 炸雞，鹽酥溪蝦才不會變炸雞）
  if (
    has("三杯", "蒼蠅頭", "宮保", "塔香", "蚵仔煎", "蛤蜊", "快炒", "水蓮",
      "溪蝦", "茄子", "煎餅", "年糕")
  )
    return "stirfry";

  // 14) 雞排 / 炸雞 / 炸物
  if (has("雞排")) return "chicken-cutlet";
  if (has("鹽酥", "鹹酥", "唐揚", "雞米花", "雞塊", "炸雞")) return "friedchicken";
  if (
    has("甜不辣", "地瓜球", "花枝丸", "銀絲卷", "魷魚", "雞屁股", "大腸", "炸")
  )
    return "karaage";

  // 15) 早午餐：吐司 / 厚片 / 貝果 → 烤吐司；蛋餅 / 飯糰 / 班尼迪克 → 煎食
  if (has("吐司", "厚片", "貝果")) return "toast";
  if (has("蛋餅", "飯糰", "蘿蔔糕", "班尼迪克", "歐姆", "蔥抓")) return "pancake";

  // 16) 鹹水雞 / 白斬雞（雞肉部位）→ 白切雞盤；純蔬菜才走 veg
  // 用「綜合拼盤」而非裸「拼盤」，免得燒肉店的「時蔬拼盤」被誤判
  if (has("鹹水", "白斬", "白切", "雞胗", "綜合拼盤")) return "coldchicken";

  // 17) 蔬菜 / 小菜（含 category 為「蔬菜」者）
  if (
    category.includes("蔬菜") ||
    has("青菜", "高麗菜", "玉米筍", "花椰", "時蔬", "燙", "地瓜葉",
      "醃蘿蔔", "酸菜")
  )
    return "veg";

  return fallback;
}

export function restaurantImage(slug: string): string {
  return foodImg(RESTAURANT_FOOD[slug] ?? "luroufan");
}

export function menuItemImage(
  slug: string,
  name: string,
  category: string,
): string {
  const type = dishToFoodType(
    name,
    category ?? "",
    RESTAURANT_FOOD[slug] ?? "luroufan",
  );
  // 重複度高的主題類型備有第二張圖：依菜名雜湊輪流，讓同店同類菜色有差異。
  const variant = VARIANT_TYPES.has(type) && variantBit(name) === 1 ? "2" : "";
  return `/food/${type}${variant}.jpg`;
}

// ---- 把 seed 轉成 DB Row 形狀（離線 fallback 用） ----

export function seedRestaurantToRow(r: SeedRestaurant): Restaurant {
  return {
    id: r.slug,
    name: r.name,
    category: r.category,
    rating: r.rating,
    review_count: r.review_count,
    min_order: r.min_order,
    delivery_time: r.delivery_time,
    image_url: restaurantImage(r.slug),
    created_at: new Date().toISOString(),
  };
}

export function seedMenuToRows(r: SeedRestaurant): MenuItem[] {
  return r.menu.map((m, i) => ({
    id: `${r.slug}-m${i}`,
    restaurant_id: r.slug,
    name: m.name,
    description: m.description,
    price: m.price,
    image_url: menuItemImage(r.slug, m.name, m.category),
    category: m.category,
  }));
}

export function getSeedRestaurants(): Restaurant[] {
  return SEED_RESTAURANTS.map(seedRestaurantToRow);
}

export function getSeedRestaurantById(id: string): Restaurant | null {
  const found = SEED_RESTAURANTS.find((r) => r.slug === id);
  return found ? seedRestaurantToRow(found) : null;
}

export function getSeedMenuItems(restaurantId: string): MenuItem[] {
  const found = SEED_RESTAURANTS.find((r) => r.slug === restaurantId);
  return found ? seedMenuToRows(found) : [];
}
