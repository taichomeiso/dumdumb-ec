import { create } from 'zustand';
import { Product } from '@/types/product';

interface CartStore {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter((item) => item.id !== itemId)
  })),
  clearCart: () => set({ items: [] }),
}));