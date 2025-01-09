'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '処理中',
      confirmed: '確認済み',
      shipped: '発送済み',
      delivered: '配達完了',
      cancelled: 'キャンセル'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-3xl font-outfit font-black tracking-tight">
            dumdumb
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 font-outfit">注文履歴</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">注文履歴がありません</p>
            <Link 
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-full hover:-translate-y-0.5 transition-transform"
            >
              買い物を始める
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">注文番号</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 mb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          数量: {item.quantity}
                          {item.size && ` / サイズ: ${item.size}`}
                        </p>
                        <p className="text-sm font-medium">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      注文日: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-lg font-bold">
                      合計: ¥{order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}