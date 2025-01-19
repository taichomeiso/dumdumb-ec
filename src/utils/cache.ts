type CacheItem<T> = {
  data: T;
  timestamp: number;
};

class CacheManager {
  private cache: Map<string, CacheItem<any>>;
  private maxAge: number;

  constructor(maxAge: number = 5 * 60 * 1000) { // デフォルト5分
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > this.maxAge;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp > this.maxAge;
  }
}

export const globalCache = new CacheManager();

// Query key factory
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  cart: {
    all: ['cart'] as const,
    items: () => [...queryKeys.cart.all, 'items'] as const,
  },
  user: {
    all: ['user'] as const,
    favorites: () => [...queryKeys.user.all, 'favorites'] as const,
  },
};

// Optimistic update utilities
export function optimisticUpdate<T extends { id: string }>(
  queryClient: any,
  queryKey: readonly unknown[],
  updateFn: (old: T[]) => T[]
) {
  queryClient.setQueryData(queryKey, (old: T[] = []) => {
    return updateFn(old);
  });
}

// キャッシュの永続化
export function persistCache() {
  const cacheData: Record<string, CacheItem<any>> = {};
  for (const [key, value] of globalCache['cache'].entries()) {
    cacheData[key] = value;
  }
  
  try {
    localStorage.setItem('app-cache', JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to persist cache:', error);
  }
}

// キャッシュの復元
export function restoreCache() {
  try {
    const cached = localStorage.getItem('app-cache');
    if (cached) {
      const cacheData = JSON.parse(cached);
      Object.entries(cacheData).forEach(([key, value]) => {
        globalCache.set(key, (value as CacheItem<any>).data);
      });
    }
  } catch (error) {
    console.error('Failed to restore cache:', error);
  }
}

// キャッシュのクリーンアップ
export function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of globalCache['cache'].entries()) {
    if (now - value.timestamp > globalCache['maxAge']) {
      globalCache.delete(key);
    }
  }
}

// 定期的なキャッシュのクリーンアップとペルシスト
if (typeof window !== 'undefined') {
  // キャッシュの復元
  restoreCache();

  // 5分ごとにキャッシュをクリーンアップ
  setInterval(cleanupCache, 5 * 60 * 1000);

  // 1分ごとにキャッシュを永続化
  setInterval(persistCache, 60 * 1000);

  // ページを離れる前にキャッシュを永続化
  window.addEventListener('beforeunload', persistCache);
}