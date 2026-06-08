"use server";

import { getServerSupabase } from "@/lib/supabase.server";
import {
  generateOrderId,
  initialRiderPosition,
  randomRiderName,
  randomRiderRating,
  riderAvatarUrl,
  TAIPEI_CENTER,
} from "@/lib/fakeDelivery";
import { DELIVERY_FEE, SERVICE_FEE } from "@/lib/fees";

export interface CreateOrderInput {
  items: {
    menuItemId: string;
    restaurantId: string;
    restaurantName: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
  }[];
  address: string;
  paymentMethod: string;
  subtotal: number;
  /** 外送時間描述，例如「盡快送達」或「預約 今天 18:30」 */
  deliveryWhen: string;
  /** 預約時可帶入指定送達時間（ISO）；不給則用隨機假值 */
  etaIso?: string;
  /** 送達座標（你家）；外送員會繞著它打轉。不給則用台北市中心。 */
  destLat?: number;
  destLng?: number;
}

export interface CreatedOrder {
  id: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  riderName: string;
  riderRating: number;
  riderAvatar: string;
  riderLat: number;
  riderLng: number;
  etaIso: string;
  createdAt: string;
  address: string;
  paymentMethod: string;
  deliveryWhen: string;
  destLat: number;
  destLng: number;
}

/**
 * 建立一筆假訂單。
 *
 * - status 永遠是 'confirmed'，且系統任何地方都不會把它改成 'delivered'。
 * - 有 Supabase（含 service role key）就寫進 fake_orders 表；否則純前端保存。
 * - 外送員初始座標與身分都在此產生。
 */
export async function createFakeOrder(
  input: CreateOrderInput,
): Promise<CreatedOrder> {
  const riderName = randomRiderName();
  const riderRating = randomRiderRating();
  const riderAvatar = riderAvatarUrl(riderName);

  const dest =
    typeof input.destLat === "number" && typeof input.destLng === "number"
      ? { lat: input.destLat, lng: input.destLng }
      : TAIPEI_CENTER;
  const start = initialRiderPosition(dest);

  const deliveryFee = DELIVERY_FEE;
  const serviceFee = SERVICE_FEE;
  const total = input.subtotal + deliveryFee + serviceFee;

  // 預計送達：預約有指定就用指定值，否則現在 + 25~45 分鐘的假值（永遠不會真的到）。
  const etaMinutes = 25 + Math.floor(Math.random() * 21);
  const etaIso =
    input.etaIso ?? new Date(Date.now() + etaMinutes * 60_000).toISOString();
  const createdAt = new Date().toISOString();

  let id = generateOrderId();

  const supabase = getServerSupabase({ useServiceRole: true });
  if (supabase) {
    const { data, error } = await supabase
      .from("fake_orders")
      .insert({
        items: input.items as unknown as never,
        address: input.address,
        payment_method: input.paymentMethod,
        status: "confirmed", // 永遠不會是 delivered
        rider_name: riderName,
        rider_lat: start.lat,
        rider_lng: start.lng,
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      id = data.id;
    }
    // 若寫入失敗，仍以前端產生的 id 繼續，體驗不中斷。
  }

  return {
    id,
    status: "confirmed",
    subtotal: input.subtotal,
    deliveryFee,
    serviceFee,
    total,
    riderName,
    riderRating,
    riderAvatar,
    riderLat: start.lat,
    riderLng: start.lng,
    etaIso,
    createdAt,
    address: input.address,
    paymentMethod: input.paymentMethod,
    deliveryWhen: input.deliveryWhen,
    destLat: dest.lat,
    destLng: dest.lng,
  };
}
