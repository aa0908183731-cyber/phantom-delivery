"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: Record<string, true>;
  hasHydrated: boolean;
  toggle: (id: string) => void;
  count: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: {},
      hasHydrated: false,
      toggle: (id) =>
        set((s) => {
          const next = { ...s.ids };
          if (next[id]) delete next[id];
          else next[id] = true;
          return { ids: next };
        }),
      count: () => Object.keys(get().ids).length,
    }),
    {
      name: "phantom-favorites",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
