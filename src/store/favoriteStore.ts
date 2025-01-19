'use client';

import { create } from 'zustand';
import { Product } from '@/types/product';

interface FavoriteStore {
  favoritesCount: number;
  favorites: Product[];
  setFavoritesCount: (count: number) => void;
  setFavorites: (favorites: Product[]) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  refreshCount: () => Promise<void>;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favoritesCount: 0,
  favorites: [],
  setFavoritesCount: (count) => set({ favoritesCount: count }),
  setFavorites: (favorites) => set({ favorites }),
  addFavorite: (product) => set((state) => ({
    favorites: [...state.favorites, product],
    favoritesCount: state.favoritesCount + 1
  })),
  removeFavorite: (productId) => set((state) => ({
    favorites: state.favorites.filter(p => p.id !== productId),
    favoritesCount: state.favoritesCount - 1
  })),
  refreshCount: async () => {
    try {
      const response = await fetch('/api/favorites/count');
      if (response.ok) {
        const { count } = await response.json();
        set({ favoritesCount: count });
      }
    } catch (error) {
      console.error('Failed to fetch favorites count:', error);
    }
  },
}));