import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '@/constants';
import type { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINTS.products, {
          signal: abortController.signal,
          next: { revalidate: 60 }
        });

        if (!response.ok) {
          throw new Error("商品の取得に失敗しました");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error("Error fetching products:", error);
        setError(error instanceof Error ? error : new Error('商品の取得に失敗しました'));
        toast.error("商品の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, []);

  return {
    products,
    isLoading,
    error,
    refreshProducts: () => setProducts([])
  };
}