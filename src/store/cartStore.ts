"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  increment: (menuItemId: string) => void;
  decrement: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
  totalCount: () => number;
  subtotal: () => number;
  /** 購物車裡有幾家不同餐廳（可一次幻想很多家） */
  restaurantCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItemId === item.menuItemId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.menuItemId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      increment: (menuItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItemId === menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),

      decrement: (menuItemId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.menuItemId === menuItemId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.menuItemId !== menuItemId),
        })),

      clear: () => set({ items: [] }),

      totalCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      restaurantCount: () =>
        new Set(get().items.map((i) => i.restaurantId)).size,
    }),
    {
      name: "phantom-cart",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);

export interface CartGroup {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
}

/** 依餐廳把購物車品項分組（保留首次出現的順序），給「一次很多家」的畫面與結帳用。 */
export function groupByRestaurant(items: CartItem[]): CartGroup[] {
  const order: string[] = [];
  const map: Record<string, CartGroup> = {};
  for (const it of items) {
    if (!map[it.restaurantId]) {
      map[it.restaurantId] = {
        restaurantId: it.restaurantId,
        restaurantName: it.restaurantName,
        items: [],
        subtotal: 0,
      };
      order.push(it.restaurantId);
    }
    map[it.restaurantId].items.push(it);
    map[it.restaurantId].subtotal += it.price * it.quantity;
  }
  return order.map((id) => map[id]);
}

// 外送費與服務費（從 lib/fees 再匯出，方便沿用既有 import 路徑）
export { DELIVERY_FEE, SERVICE_FEE } from "@/lib/fees";
