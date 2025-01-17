'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // 商品を削除後、リストを更新
        setFavorites(favorites.filter(product => product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8">お気に入り商品</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-6">お気に入りの商品がありません</p>
            <Link 
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-lg font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              商品を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="border-2 border-black rounded-xl overflow-hidden">
                <Link href={`/products/${product.id}`} className="block relative aspect-square">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
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
                    <span className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded-full font-bold">
                      NEW
                    </span>
                  )}
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xl font-black text-black">
                        ¥{product.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="お気に入りから削除"
                    >
                      <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                    </button>
                  </div>
                  
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-medium">
                      在庫あり
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      在庫なし
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}