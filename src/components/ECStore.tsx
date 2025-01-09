{/* ... 上部のコードは同じ ... */}

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* カテゴリーナビ */}
        <nav className="mb-16">
          <ul className="flex gap-4 overflow-x-auto pb-4 justify-center">
            {["ALL", "Tシャツ", "パーカー", "コップ", "ステッカー"].map((category) => (
              <li key={category}>
                <button className="px-6 py-2 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-outfit tracking-wide">
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 商品グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* ... 商品カードの内容は同じ ... */}
              </div>
            </Link>
          ))}
        </div>
      </main>
{/* ... 下部のコードは同じ ... */}