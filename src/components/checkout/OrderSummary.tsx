'use client';

import React from 'react';
import { OrderSummaryProps } from '@/types/checkout';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  isLoading,
}) => {
  // 小計の計算
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  // 合計金額の計算（この例では送料無料）
  const total = subtotal;

  // 商品の総数を計算
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-4">注文サマリー</h2>
      
      {/* 商品点数 */}
      <div className="text-sm text-gray-600 mb-4">
        商品点数: {totalItems}点
      </div>

      {/* 価格詳細 */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>小計</span>
          <span>¥{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>送料</span>
          <span>無料</span>
        </div>
        {/* 必要に応じて他の費用を追加 */}
      </div>

      {/* 合計金額 */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between font-bold text-lg">
          <span>合計</span>
          <span>¥{total.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          (税込)
        </p>
      </div>

      {/* 注文ボタン */}
      <button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full bg-black text-white py-4 rounded-md font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            処理中...
          </div>
        ) : (
          '注文を確定する'
        )}
      </button>

      {/* 注意書き */}
      <div className="mt-4 text-sm text-gray-500">
        <p className="text-center">
          ※ 注文を確定すると、お支払いが発生します
        </p>
        {items.length === 0 && (
          <p className="text-center text-red-500 mt-2">
            ※ カートに商品がありません
          </p>
        )}
      </div>
    </section>
  );
};