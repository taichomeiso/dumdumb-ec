'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!selectedSize && product.category !== 'コップ' && product.category !== 'ステッカー') {
      alert('サイズを選択してください');
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました');
      }

      alert('カートに追加しました');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const showSizeSelector = product.category === 'Tシャツ' || product.category === 'パーカー';
  const sizes = product.category === 'Tシャツ' 
    ? ['S', 'M', 'L', 'XL'] 
    : product.category === 'パーカー'
    ? ['M', 'L', 'XL', 'XXL']
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-3xl font-outfit font-black tracking-tight">
            dumdumb
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 商品画像 */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 商品情報 */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-outfit">{product.name}</h1>
            <p className="text-2xl font-bold">¥{product.price.toLocaleString()}</p>
            <p className="text-gray-600">{product.description}</p>

            {showSizeSelector && (
              <div>
                <h3 className="text-sm font-medium mb-2">サイズ</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 hover:border-black'
                      } transition-all`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">数量</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border rounded-md"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-black text-white px-8 py-3 rounded-full font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isAddingToCart ? '追加中...' : 'カートに入れる'}
              </button>
              <button className="p-3 rounded-full border border-gray-200 hover:border-black transition-all">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 関連商品などの追加セクションをここに配置可能 */}
    </div>
  );
}