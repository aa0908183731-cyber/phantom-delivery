"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAIPEI_CENTER } from "@/lib/fakeDelivery";

export interface DeliveryLocation {
  address: string;
  lat: number;
  lng: number;
  /** 是否由瀏覽器定位取得的「目前位置」 */
  isCurrent: boolean;
}

interface LocationState {
  location: DeliveryLocation;
  hasHydrated: boolean;
  setLocation: (loc: DeliveryLocation) => void;
  reset: () => void;
}

export const DEFAULT_LOCATION: DeliveryLocation = {
  address: "台北市信義區松仁路 100 號",
  lat: TAIPEI_CENTER.lat,
  lng: TAIPEI_CENTER.lng,
  isCurrent: false,
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      hasHydrated: false,
      setLocation: (loc) => set({ location: loc }),
      reset: () => set({ location: DEFAULT_LOCATION }),
    }),
    {
      name: "phantom-location",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
