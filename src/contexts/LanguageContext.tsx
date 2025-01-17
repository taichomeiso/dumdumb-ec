'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ja' | 'en';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  ja: {
    "tagline.line1": "ダサかわいいを着こなそう",
    "tagline.line2": "あなたらしさを表現しよう",
    "shop_new": "新着アイテムを見る",
    "footer.about.tagline1": "ダサかわいいアイテムで",
    "footer.about.tagline2": "あなたらしさを表現しよう",
    "footer.shop.title": "ショップ",
    "footer.shop.new_arrivals": "新着アイテム",
    "footer.shop.best_sellers": "人気アイテム",
    "footer.shop.on_sale": "セール",
    "footer.help.title": "ヘルプ",
    "footer.help.contact": "お問い合わせ",
    "footer.help.shipping": "配送について",
    "footer.help.returns": "返品・交換について",
    "footer.follow.title": "フォロー"
  },
  en: {
    "tagline.line1": "Be Dumb, Be Cute",
    "tagline.line2": "Express yourself with our items",
    "shop_new": "Shop New Arrivals",
    "footer.about.tagline1": "Express yourself",
    "footer.about.tagline2": "with our dumb cute items",
    "footer.shop.title": "Shop",
    "footer.shop.new_arrivals": "New Arrivals",
    "footer.shop.best_sellers": "Best Sellers",
    "footer.shop.on_sale": "On Sale",
    "footer.help.title": "Help",
    "footer.help.contact": "Contact Us",
    "footer.help.shipping": "Shipping Info",
    "footer.help.returns": "Returns & Exchanges",
    "footer.follow.title": "Follow Us"
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}