'use client';

import React from 'react';
import { ShippingFormProps } from '@/types/checkout';
import { PREFECTURES } from '@/lib/validations/checkout';

export const ShippingForm: React.FC<ShippingFormProps> = ({
  formData,
  errors,
  handleInputChange,
  handlePostalCodeLookup
}) => {
  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-6">お届け先情報</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            姓
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="山田"
            className={`w-full px-4 py-2 border rounded-md ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="太郎"
            className={`w-full px-4 py-2 border rounded-md ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          className={`w-full px-4 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          電話番号
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="090-1234-5678"
          className={`w-full px-4 py-2 border rounded-md ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          郵便番号
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            maxLength={8}
            placeholder="123-4567"
            className={`flex-1 px-4 py-2 border rounded-md ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={handlePostalCodeLookup}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            住所検索
          </button>
        </div>
        {errors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          都道府県
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="prefecture"
          value={formData.prefecture}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md ${
            errors.prefecture ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">選択してください</option>
          {PREFECTURES.map(pref => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </select>
        {errors.prefecture && (
          <p className="text-red-500 text-sm mt-1">{errors.prefecture}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          市区町村
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="渋谷区"
          className={`w-full px-4 py-2 border rounded-md ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          番地
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleInputChange}
          placeholder="神南1-2-3"
          className={`w-full px-4 py-2 border rounded-md ${
            errors.address1 ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address1 && (
          <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          建物名・部屋番号
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
          placeholder="〇〇マンション101"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </section>
  );
};