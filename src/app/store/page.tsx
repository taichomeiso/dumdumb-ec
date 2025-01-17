"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { API_ENDPOINTS } from "@/constants";
import type { Product } from "@/types/product";

export default function ECStore() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [products, setProducts] = useState<Product[]>([]);
  
  const { items: cartItems } = useCartStore();
  const { favorites, setFavorites, addFavorite, removeFavorite, setFavoritesCount } = useFavoriteStore();

  // 商品データの取得
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.products);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.map((product: Product) => ({
          ...product,
          image: product.image || null,
        })));
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("商品の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // お気に入りの取得
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(API_ENDPOINTS.favorites);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
          setFavoritesCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("お気に入りの取得に失敗しました");
      }
    };

    if (session?.user?.id) {
      fetchFavorites();
    }
  }, [session?.user?.id, setFavorites, setFavoritesCount]);

  const handleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.favorites, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      const data = await response.json();
      const product = products.find(p => p.id === productId);
      
      if (product) {
        if (data.isFavorite) {
          addFavorite(product);
          toast.success("お気に入りに追加しました");
        } else {
          removeFavorite(productId);
          toast.success("お気に入りから削除しました");
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("お気に入りの更新に失敗しました");
    }
  };

  const filteredProducts = selectedCategory === "ALL"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemsCount={cartItems.length} />
      
      <main className="w-full">
        <HeroSection />
        
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onFavoriteClick={handleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}