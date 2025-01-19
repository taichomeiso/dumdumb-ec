'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItemsProps } from '@/types/checkout';

export const CartItems: React.FC<CartItemsProps> = ({
  items,
  updateQuantity,
  removeItem,
}) => {
  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-6">注文内容</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white">
            <Link href={`/products/${item.product.id}`}>
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.id}`} className="hover:text-gray-600">
                <h3 className="font-bold text-lg truncate">{item.product.name}</h3>
              </Link>
              {item.size && (
                <p className="text-gray-600">
                  サイズ: {item.size}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                    aria-label="数量を減らす"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-medium" aria-label={`数量: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                    disabled={item.quantity >= item.product.stock}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                    aria-label="数量を増やす"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="font-bold" aria-label={`価格: ${(item.product.price * item.quantity).toLocaleString()}円`}>
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('この商品を削除してもよろしいですか？')) {
                  removeItem(item.id);
                }
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label="商品を削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};