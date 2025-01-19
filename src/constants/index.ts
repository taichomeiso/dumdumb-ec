export const API_ENDPOINTS = {
  products: '/api/products',
  favorites: '/api/favorites',
  cart: '/api/cart',
  orders: '/api/orders',
  auth: '/api/auth',
  categories: '/api/categories'
} as const;

export const PRODUCT_CATEGORIES = [
  { id: 'ALL', label: 'すべて' },
  { id: 'CLOTHING', label: '衣類' },
  { id: 'ACCESSORIES', label: 'アクセサリー' },
  { id: 'SHOES', label: '靴' },
  { id: 'BAGS', label: 'バッグ' },
  { id: 'OTHER', label: 'その他' }
] as const;

export const APP_CONFIG = {
  siteName: 'DumDum EC',
  siteUrl: 'https://dumdumec.com',
  companyName: 'DumDum Inc.',
  companyAddress: '東京都渋谷区...',
  companyEmail: 'support@dumdumec.com',
  companyPhone: '03-xxxx-xxxx',
  socialLinks: {
    twitter: 'https://twitter.com/dumdumec',
    facebook: 'https://facebook.com/dumdumec',
    instagram: 'https://instagram.com/dumdumec'
  }
} as const;