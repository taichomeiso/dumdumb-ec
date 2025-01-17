"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ECStore() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(
          data.map((product) => ({
            ...product,
            image: product.image || null,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchFavorites = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchProducts();
    fetchFavorites();
  }, [session?.user?.id]);

  const handleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      const data = await response.json();
      // お気に入りリストを更新
      const updatedFavorites = data.isFavorite
        ? [...favorites, products.find(p => p.id === productId)]
        : favorites.filter(f => f.id !== productId);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert('お気に入りの更新に失敗しました');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemsCount={cartItems.length} />

      <main className="w-full">
        <section className="bg-black text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.7),rgba(0,0,0,1))]"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -top-4 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl animate-float"></div>
                <h2 className="text-7xl md:text-[8rem] leading-none font-black mb-6 tracking-tight">
                  BE DUMB
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                    BE CUTE
                  </span>
                </h2>
              </div>
              <p className="text-xl mb-10 text-white max-w-xl font-medium">
                {t("tagline.line1")}
                <br />
                {t("tagline.line2")}
              </p>
              <div className="flex gap-4">
                <button className="group bg-white text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-black hover:text-white transition-all duration-300">
                  {t("shop_new")}
                  <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <nav className="max-w-6xl mx-auto px-4 my-16">
          <ul className="flex gap-4 overflow-x-auto pb-4 justify-center">
            {[
              "ALL",
              "Tシャツ",
              "パーカー",
              "コップ",
              "ステッカー",
              "その他",
            ].map((category) => (
              <li key={category}>
                <button className="px-6 py-2 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-bold tracking-wide">
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="block group relative overflow-hidden aspect-square"
              >
                <div className="absolute inset-0 flex flex-col">
                  <div className="relative h-3/4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 
                          ${product.stock <= 0 ? "opacity-50" : ""}`}
                      />
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="bg-black text-white px-6 py-3 rounded-full text-xl font-black">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute top-6 left-6 bg-black text-white text-base px-4 py-2 rounded-full font-bold">
                        NEW
                      </span>
                    )}
                    <button
                      className="absolute top-6 right-6 p-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      onClick={(e) => handleFavorite(e, product.id)}
                    >
                      <Heart 
                        className={`w-6 h-6 transition-colors ${
                          isFavorite(product.id) ? 'text-pink-500' : 'text-gray-900 hover:text-pink-500'
                        }`}
                        fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <div className="h-1/4 p-4 bg-white flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-black">
                        {product.name}
                      </h3>
                      <span className="text-xl font-black text-black">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-black text-white mt-32">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h4 className="text-2xl font-black mb-6">dumdumb</h4>
              <p className="text-white font-medium">
                {t("footer.about.tagline1")}
                <br />
                {t("footer.about.tagline2")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">
                {t("footer.shop.title")}
              </h4>
              <ul className="space-y-2 text-gray-200 font-medium">
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.shop.new_arrivals")}
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.shop.best_sellers")}
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.shop.on_sale")}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">
                {t("footer.help.title")}
              </h4>
              <ul className="space-y-2 text-gray-200 font-medium">
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.help.contact")}
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.help.shipping")}
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.help.returns")}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">
                {t("footer.follow.title")}
              </h4>
              <div className="flex gap-4">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                  <span className="w-5 h-5 block"></span>
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                  <span className="w-5 h-5 block"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="font-bold text-gray-200">
              © 2025 dumdumb. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}