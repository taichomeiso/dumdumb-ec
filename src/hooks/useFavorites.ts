import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';
import { API_ENDPOINTS } from '@/constants';

export function useFavorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.favorites);
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('お気に入りの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.id]);

  const handleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      toast.error('お気に入り機能を使用するにはログインが必要です');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.favorites, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Failed to update favorite');
      
      const data = await response.json();
      if (data.isFavorite) {
        const product = data.product;
        setFavorites(prev => [...prev, product]);
        toast.success('お気に入りに追加しました');
      } else {
        setFavorites(prev => prev.filter(item => item.id !== productId));
        toast.success('お気に入りから削除しました');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('お気に入りの更新に失敗しました');
    }
  };

  return {
    favorites,
    isLoading,
    handleFavorite
  };
}