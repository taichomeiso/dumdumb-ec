'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const id = React.use(params).id;

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const cart = await response.json();
          setCartItemsCount(cart.length);
        }
      } catch (error) {
        console.error('カート数の取得エラー:', error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || '商品の取得に失敗しました');
        }
        const data = await response.json();
        setProduct(data);

        // お気に入りの状態を確認
        if (session?.user?.id) {
          const favResponse = await fetch('/api/favorites');
          if (favResponse.ok) {
            const favorites = await favResponse.json();
            setIsFavorite(favorites.some(fav => fav.id === id));
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        router.push('/');
      }
    };

    if (id) {
      fetchProduct();
      fetchCartCount();
    }
  }, [id, router, session?.user?.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if ((product.category === 'tshirt' || product.category === 'hoodie') && !selectedSize) {
      alert('サイズを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          size: selectedSize || null,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'カートへの追加に失敗しました');
      }

      // カート数を更新
      setCartItemsCount(prev => prev + quantity);
      alert('カートに追加しました');
    } catch (error) {
      console.error('Cart error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if ((product.category === 'tshirt' || product.category === 'hoodie') && !selectedSize) {
      alert('サイズを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          size: selectedSize || null,
        }),
      });

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました');
      }

      // カート数を更新
      setCartItemsCount(prev => prev + quantity);
      router.push('/checkout');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
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
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      setIsFavorite(data.isFavorite);
      alert(data.message);
    } catch (error) {
      console.error('Favorite error:', error);
      alert('お気に入りの更新に失敗しました');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  const sizes = product.category === 'tshirt' 
    ? ['S', 'M', 'L', 'XL'] 
    : product.category === 'hoodie'
    ? ['M', 'L', 'XL', 'XXL']
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemsCount={cartItemsCount} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="bg-black text-white px-6 py-3 rounded-full text-lg font-black">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black">{product.name}</h1>
            <p className="text-2xl font-bold text-black">¥{product.price.toLocaleString()}</p>
            <p className="text-gray-900 font-medium">{product.description}</p>

            {(product.category === 'tshirt' || product.category === 'hoodie') && (
              <div>
                <h3 className="text-base font-bold text-black mb-2">サイズ</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors font-medium
                        ${selectedSize === size 
                          ? 'bg-black text-white border-black' 
                          : 'border-gray-900 hover:bg-black hover:text-white'}`}
                      disabled={product.stock <= 0}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-black mb-2">数量</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0 || isLoading}
                className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
                  ${product.stock <= 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
              >
                {product.stock <= 0 ? 'SOLD OUT' : isLoading ? '処理中...' : '今すぐ購入'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isLoading}
                className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
                  ${product.stock <= 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black border-2 border-black hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
              >
                {product.stock <= 0 ? 'SOLD OUT' : isLoading ? '処理中...' : 'カートに追加'}
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full border-2 border-gray-900 hover:-translate-y-0.5 hover:shadow-md transition-transform ${
                  isFavorite ? 'bg-black' : ''
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-white' : 'text-black'}`} fill={isFavorite ? 'white' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}