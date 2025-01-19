'use client';

import React, { useEffect } from 'react';
import { Header } from "@/components/Header";
import { ShippingForm, PaymentForm, CartItems, OrderSummary } from '@/components/checkout';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import Link from 'next/link';
import * as api from '@/api/checkout';
import toast from 'react-hot-toast';
import { CartItem } from '@/types/checkout';

export default function Checkout() {
  const {
    formData,
    errors,
    isLoading,
    isSavingPaymentMethod,
    orderDetails,
    setOrderDetails,
    handleInputChange,
    handlePostalCodeLookup,
    handlePaymentMethodSelect,
    savePaymentMethod,
    handleSubmit
  } = useCheckoutForm();

  const [savedPaymentMethods, setSavedPaymentMethods] = React.useState({
    creditCards: [],
    bankAccounts: []
  });

  // カートアイテムと保存済み支払い方法の取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cartData, paymentMethodsData] = await Promise.all([
          api.fetchCartItems(),
          api.fetchPaymentMethods()
        ]);
        setOrderDetails(cartData);
        setSavedPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('データの取得に失敗しました');
      }
    };

    fetchInitialData();
  }, [setOrderDetails]);

  // カートアイテムの数量更新
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await api.updateCartItemQuantity(itemId, newQuantity);
      const updatedCart = await api.fetchCartItems();
      setOrderDetails(updatedCart);
      toast.success('数量を更新しました');
    } catch (error) {
      console.error('Error:', error);
      toast.error('数量の更新に失敗しました');
    }
  };

  // カートアイテムの削除
  const removeItem = async (itemId: string) => {
    try {
      await api.removeCartItem(itemId);
      const updatedCart = await api.fetchCartItems();
      setOrderDetails(updatedCart);
      toast.success('商品を削除しました');
    } catch (error) {
      console.error('Error:', error);
      toast.error('商品の削除に失敗しました');
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItemsCount={0} />
        <div className="flex items-center justify-center h-[calc(100vh-76px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (orderDetails.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItemsCount={0} />
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
    <div className="min-h-screen bg-white">
      <Header cartItemsCount={orderDetails.length} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左側: フォーム */}
            <div className="space-y-8">
              <ShippingForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handlePostalCodeLookup={handlePostalCodeLookup}
              />
              <PaymentForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                savedPaymentMethods={savedPaymentMethods}
                handlePaymentMethodSelect={handlePaymentMethodSelect}
                savePaymentMethod={savePaymentMethod}
                isSavingPaymentMethod={isSavingPaymentMethod}
              />
            </div>

            {/* 右側: 注文内容と合計 */}
            <div className="space-y-8">
              <CartItems
                items={orderDetails}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
              <OrderSummary
                items={orderDetails}
                isLoading={isLoading}
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}