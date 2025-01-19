'use client';

import React from 'react';
import { CreditCard, Building2 } from 'lucide-react';
import { PaymentFormProps } from '@/types/checkout';

export const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  errors,
  handleInputChange,
  savedPaymentMethods,
  handlePaymentMethodSelect,
  savePaymentMethod,
  isSavingPaymentMethod,
}) => {
  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-6">お支払い方法</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={formData.paymentMethod === 'credit'}
              onChange={handleInputChange}
              className="mr-2"
            />
            クレジットカード
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={formData.paymentMethod === 'bank'}
              onChange={handleInputChange}
              className="mr-2"
            />
            銀行振込
          </label>
        </div>

        {formData.paymentMethod === 'credit' && (
          <div className="mt-4 space-y-4">
            {savedPaymentMethods.creditCards.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">保存済みのカード</h3>
                <div className="space-y-2">
                  {savedPaymentMethods.creditCards.map(card => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handlePaymentMethodSelect('credit', card.id)}
                      className="flex items-center gap-2 w-full p-3 text-left border rounded-md hover:bg-gray-100"
                    >
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-medium">**** **** **** {card.lastFour}</div>
                        <div className="text-sm text-gray-500">有効期限: {card.expiry}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カード番号
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  有効期限
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  セキュリティコード
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="cardCvc"
                  value={formData.cardCvc}
                  onChange={handleInputChange}
                  maxLength={4}
                  placeholder="123"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.cardCvc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardCvc && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardCvc}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  カード裏面の末尾3-4桁の数字
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カード名義
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="TARO YAMADA"
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.cardName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={savePaymentMethod}
                disabled={isSavingPaymentMethod}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isSavingPaymentMethod ? '保存中...' : 'このカード情報を保存する'}
              </button>
            </div>
          </div>
        )}

        {formData.paymentMethod === 'bank' && (
          <div className="mt-4 space-y-4">
            {savedPaymentMethods.bankAccounts.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">保存済みの口座</h3>
                <div className="space-y-2">
                  {savedPaymentMethods.bankAccounts.map(account => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => handlePaymentMethodSelect('bank', account.id)}
                      className="flex items-center gap-2 w-full p-3 text-left border rounded-md hover:bg-gray-100"
                    >
                      <Building2 className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{account.bankName} {account.branchName}支店</div>
                        <div className="text-sm text-gray-500">
                          {account.accountType === 'ordinary' ? '普通' : '当座'} {account.accountNumber}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                銀行名
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="〇〇銀行"
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                支店名
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                placeholder="〇〇支店"
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.branchName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                口座種別
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.accountType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="ordinary">普通</option>
                <option value="current">当座</option>
              </select>
              {errors.accountType && (
                <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                口座番号
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="1234567"
                maxLength={7}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                口座名義
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="ヤマダ タロウ"
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.accountName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountName && (
                <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={savePaymentMethod}
                disabled={isSavingPaymentMethod}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isSavingPaymentMethod ? '保存中...' : 'この口座情報を保存する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};