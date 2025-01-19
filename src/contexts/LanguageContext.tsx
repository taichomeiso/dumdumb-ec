'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'ja' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, defaultValue: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  // 実際のアプリケーションでは、ここで翻訳データを読み込むなどの処理を行います
  const t = (key: string, defaultValue: string): string => {
    // 簡易的な実装として、デフォルト値をそのまま返します
    return defaultValue;
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