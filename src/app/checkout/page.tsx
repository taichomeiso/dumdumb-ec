'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error('更新に失敗しました');
      
      await fetchCartItems();
    } catch (error) {
      console.error('Error:', error);
      alert('数量の更新に失敗しました');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('この商品を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('削除に失敗しました');
      
      await fetchCartItems();
    } catch (error) {
      console.error('Error:', error);
      alert('商品の削除に失敗しました');
    }
  };

  const handlePayment = async () => {
    if (!orderDetails || orderDetails.length === 0) {
      alert('カートが空です');
      return;
    }

    setIsLoading(true);
    try {
      if (paymentMethod === 'credit') {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderDetails,
            paymentMethod: 'credit',
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderDetails,
            paymentMethod: 'bank',
          }),
        });
        if (response.ok) {
          router.push('/checkout/bank-transfer');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('決済処理中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (orderDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/" className="text-3xl font-black text-black">
              dumdumb
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-xl mb-6">カートが空です</p>
            <Link 
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              ショッピングを続ける
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-3xl font-black text-black">
            dumdumb
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-8">購入確認</h1>

          {/* 注文内容 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">注文内容</h2>
            <div className="space-y-4">
              {orderDetails.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600">
                        {item.size && `サイズ: ${item.size}`}
                      </p>
                      <p className="font-bold mt-1">
                        ¥{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* お届け先情報 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">お届け先情報</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="お名前"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                placeholder="メールアドレス"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="お届け先住所"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="tel"
                placeholder="電話番号"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </section>

          {/* 支払い方法選択 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">支払い方法</h2>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                クレジットカード
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                銀行振込
              </label>
            </div>
          </section>

          {/* 合計金額 */}
          <section className="mb-8">
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xl font-bold">合計</span>
              <span className="text-xl font-bold">
                ¥{orderDetails.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString()}
              </span>
            </div>
          </section>

          {/* 注文ボタン */}
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-md font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? '処理中...' : '注文を確定する'}
          </button>
        </div>
      </main>
    </div>
  );
}