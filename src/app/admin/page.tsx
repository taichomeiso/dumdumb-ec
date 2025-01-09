'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const router = useRouter();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    isNew: false,
    isFeatured: false,
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      alert('画像のアップロードに失敗しました');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 画像をアップロード
      const imagePath = await handleUpload();
      if (!imagePath && selectedFile) {
        setIsLoading(false);
        return;
      }

      // 商品を登録
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price),
          image: imagePath || newProduct.image,
        }),
      });

      if (!response.ok) {
        throw new Error('商品の登録に失敗しました');
      }

      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        isNew: false,
        isFeatured: false,
      });
      setSelectedFile(null);
      setPreview('');
      
      // 商品リストを更新
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">商品登録</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                商品名
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                価格
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                商品画像
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md"
              />
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                  className="mr-2"
                />
                新着商品
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.isFeatured}
                  onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                  className="mr-2"
                />
                おすすめ商品
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? '登録中...' : '商品を登録'}
            </button>
          </form>
        </div>

        {/* 商品一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">登録済み商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-md p-4">
                <img
                  src={product.image.startsWith('/') ? product.image : `/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-600">¥{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}