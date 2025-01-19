'use client';

import { useState } from 'react';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/types/product';

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { products, isLoading } = useProducts();
  const { favorites, handleFavorite } = useFavorites();

  const filteredProducts = selectedCategory === "ALL"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={isFavorite(product.id)}
              onFavoriteClick={handleFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
}