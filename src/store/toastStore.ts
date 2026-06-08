"use client";

import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  emoji?: string;
}

interface ToastState {
  toasts: Toast[];
  show: (
    message: string,
    opts?: { emoji?: string; durationMs?: number },
  ) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, emoji: opts.emoji }] }));
    const duration = opts.durationMs ?? 3500;
    if (typeof window !== "undefined") {
      window.setTimeout(() => get().dismiss(id), duration);
    }
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
