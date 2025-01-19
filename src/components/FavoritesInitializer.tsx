'use client';

import { useEffect } from 'react';
import { useFavoriteStore } from '@/store/favoriteStore';

export function FavoritesInitializer() {
  const { setFavoritesCount } = useFavoriteStore();

  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        const response = await fetch('/api/favorites/count');
        if (response.ok) {
          const { count } = await response.json();
          setFavoritesCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch favorites count:', error);
      }
    };

    fetchFavoritesCount();
  }, [setFavoritesCount]);

  return null;
}