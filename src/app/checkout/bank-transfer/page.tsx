'use client';

import React from 'react';
import Link from 'next/link';

export default function BankTransfer() {
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
          <h1 className="text-2xl font-bold mb-8">お振込みのご案内</h1>
          
          <div className="space-y-6">
            <p className="text-gray-700">
              以下の口座へお振込みください。ご入金確認後、商品を発送いたします。
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">振込先情報</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium text-gray-600">銀行名</dt>
                  <dd className="mt-1 text-lg font-bold">○○銀行</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">支店名</dt>
                  <dd className="mt-1 text-lg font-bold">○○支店（123）</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">口座種別</dt>
                  <dd className="mt-1 text-lg font-bold">普通</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">口座番号</dt>
                  <dd className="mt-1 text-lg font-bold">12345678</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">口座名義</dt>
                  <dd className="mt-1 text-lg font-bold">ダムダム（カ</dd>
                </div>
              </dl>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4 text-yellow-800">ご注意事項</h2>
              <ul className="list-disc list-inside space-y-2 text-yellow-800">
                <li>お振込み手数料はお客様のご負担となります。</li>
                <li>ご入金の確認まで1-2営業日程度かかる場合がございます。</li>
                <li>お振込み名義が異なる場合は、ご入金の確認が遅れる場合がございます。</li>
                <li>7日以内にお振込みが確認できない場合、注文はキャンセルとなります。</li>
              </ul>
            </div>

            <Link 
              href="/"
              className="block w-full bg-black text-white py-4 rounded-md font-bold text-center hover:bg-gray-800 transition-colors mt-8"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}