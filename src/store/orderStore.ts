"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cartStore";

export interface StoredOrder {
  id: string;
  items: CartItem[];
  address: string;
  paymentMethod: string;
  /** 永遠是 confirmed / preparing / delivering，絕不會是 delivered */
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
  /** 送達座標（你家），外送員繞著它打轉 */
  destLat: number;
  destLng: number;
  /** 預計送達（純裝飾，永遠不會真的送達） */
  etaIso: string;
  /** 外送時間描述：盡快送達 / 預約 今天 18:30 */
  deliveryWhen: string;
  createdAt: string;
}

interface OrderState {
  orders: Record<string, StoredOrder>;
  /** 最近一筆訂單 id（給確認頁用） */
  lastOrderId: string | null;
  hasHydrated: boolean;
  addOrder: (order: StoredOrder) => void;
  getOrder: (id: string) => StoredOrder | undefined;
  updateRider: (id: string, lat: number, lng: number) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: {},
      lastOrderId: null,
      hasHydrated: false,

      addOrder: (order) =>
        set((state) => ({
          orders: { ...state.orders, [order.id]: order },
          lastOrderId: order.id,
        })),

      getOrder: (id) => get().orders[id],

      updateRider: (id, lat, lng) =>
        set((state) => {
          const order = state.orders[id];
          if (!order) return state;
          return {
            orders: {
              ...state.orders,
              [id]: { ...order, riderLat: lat, riderLng: lng },
            },
          };
        }),
    }),
    {
      name: "phantom-orders",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
