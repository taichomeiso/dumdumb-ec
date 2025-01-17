'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
  size?: string;
};

export function AddToCart({ product, size }: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size,
        }),
      });

      if (!response.ok) throw new Error('カートへの追加に失敗しました');

      alert('カートに追加しました');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-black mb-2">数量</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-bold text-black">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
            ${product.stock <= 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
        >
          {product.stock <= 0 ? 'SOLD OUT' : 'カートに入れる'}
        </button>
        <button 
          className="p-3 rounded-full border-2 border-gray-900 hover:-translate-y-0.5 hover:shadow-md transition-transform"
        >
          <Heart className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
}