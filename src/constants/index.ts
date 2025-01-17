export const PRODUCT_CATEGORIES = ["ALL", "Tシャツ", "パーカー", "コップ", "ステッカー", "その他"] as const;

export const API_ENDPOINTS = {
  products: '/api/products',
  favorites: '/api/favorites',
  cart: '/api/cart',
} as const;

export const APP_CONFIG = {
  name: 'dumdumb',
  copyright: '© 2025 dumdumb. All rights reserved.',
} as const;