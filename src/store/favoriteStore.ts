import { create } from 'zustand';
import { Product } from '@/types/product';

interface FavoriteStore {
  favorites: Product[];
  favoritesCount: number;
  setFavorites: (favorites: Product[]) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  setFavoritesCount: (count: number) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  favoritesCount: 0,
  setFavorites: (favorites) => set({ 
    favorites,
    favoritesCount: favorites.length
  }),
  addFavorite: (product) => set((state) => ({
    favorites: [...state.favorites, product],
    favoritesCount: state.favoritesCount + 1
  })),
  removeFavorite: (productId) => set((state) => ({
    favorites: state.favorites.filter((f) => f.id !== productId),
    favoritesCount: state.favoritesCount - 1
  })),
  setFavoritesCount: (count) => set({ favoritesCount: count })
}));