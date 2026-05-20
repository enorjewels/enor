'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Cart } from '@/types';

interface CartStore extends Cart {
  isOpen:      boolean;
  openCart:    () => void;
  closeCart:   () => void;
  addItem:     (item: CartItem) => void;
  removeItem:  (variantId: string) => void;
  updateQty:   (variantId: string, qty: number) => void;
  clearCart:   () => void;
}

function computeTotals(items: CartItem[]): Pick<Cart, 'totalCad' | 'itemCount'> {
  return {
    totalCad:  items.reduce((s, i) => s + i.priceCad * i.quantity, 0),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:     [],
      totalCad:  0,
      itemCount: 0,
      isOpen:    false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (incoming) => {
        const items = get().items;
        const existing = items.find(i => i.variantId === incoming.variantId);
        const next = existing
          ? items.map(i =>
              i.variantId === incoming.variantId
                ? { ...i, quantity: i.quantity + incoming.quantity }
                : i
            )
          : [...items, incoming];
        set({ items: next, ...computeTotals(next), isOpen: true });
      },

      removeItem: (variantId) => {
        const next = get().items.filter(i => i.variantId !== variantId);
        set({ items: next, ...computeTotals(next) });
      },

      updateQty: (variantId, qty) => {
        if (qty < 1) { get().removeItem(variantId); return; }
        const next = get().items.map(i =>
          i.variantId === variantId ? { ...i, quantity: qty } : i
        );
        set({ items: next, ...computeTotals(next) });
      },

      clearCart: () => set({ items: [], totalCad: 0, itemCount: 0 }),
    }),
    { name: 'enor-cart' }
  )
);
