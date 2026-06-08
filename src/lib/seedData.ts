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
  "異國",
  "早午餐",
  "飲料甜點",
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

// ---- 圖片（用 loremflickr 依關鍵字抓真實美食照片，做到圖文相符）----

// 每間餐廳對應的英文美食關鍵字（loremflickr 以逗號分隔、需同時符合的 tag）
const IMG_QUERY: Record<string, string> = {
  "acai-luroufan": "rice,pork",
  "laodifang-beef-noodle": "beef,noodle",
  "sanma-stinky-hotpot": "hotpot",
  "chiabaomei-guabao": "bun,pork",
  "jiucengta-stirfry": "chinese,food",
  "dajipai-fried": "fried,chicken",
  "yeshi-fried-lab": "fried,food",
  "chishang-bento": "bento",
  "fuyuan-veg-bento": "vegetarian,food",
  "dapaozhu-thai": "thai,food",
  "curryleaf-japanese": "curry,rice",
  "oni-korean-chicken": "korean,chicken",
  "vietpho-stall": "pho",
  "houpian-toast-lab": "toast,breakfast",
  "benedict-brunch": "brunch,egg",
  "boba-institute": "bubble,tea",
  "douhua-uncle": "dessert,sweet",
  "dessert-lab": "cake,dessert",
  "salty-chicken-savior": "chicken,food",
  "midnight-instant-noodle": "ramen,noodle",
};

function qFor(slug: string): string {
  return IMG_QUERY[slug] ?? "food";
}

// 依菜單分類微調關鍵字（飲料/湯/甜點），其餘沿用餐廳料理類型
function menuKeyword(slug: string, category?: string): string {
  const c = category ?? "";
  if (/[飲茶奶汁]|咖啡/.test(c)) return "drink,beverage";
  if (/湯/.test(c)) return "soup,food";
  if (/[甜糕餅凍布]|豆花|聖代|舒芙蕾|大福|菓子|提拉|可麗/.test(c))
    return "dessert,sweet";
  return qFor(slug);
}

function lockFor(key: string): number {
  return hashString(key) % 100000;
}

export function restaurantImage(slug: string): string {
  return `https://loremflickr.com/800/600/${qFor(slug)}?lock=${lockFor(slug)}`;
}

export function menuItemImage(
  slug: string,
  index: number,
  category?: string,
): string {
  return `https://loremflickr.com/400/300/${menuKeyword(slug, category)}?lock=${lockFor(`${slug}:${index}`)}`;
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
    image_url: menuItemImage(r.slug, i, m.category),
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
