"use client";

import React, { createContext, useContext, useState } from 'react';

type Language = 'ja' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  ja: {
    'login': 'ログイン',
    'signup': '新規登録',
    'email': 'メールアドレス',
    'password': 'パスワード',
    'loginWith': 'でログイン',
    'or': 'または',
    'dontHaveAccount': 'アカウントをお持ちでない方は',
    'logout': 'ログアウト',
    'profile': 'プロフィール',
    'orders': '注文履歴',
    // 必要に応じて追加
  },
  en: {
    'login': 'Login',
    'signup': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'loginWith': 'Login with',
    'or': 'or',
    'dontHaveAccount': "Don't have an account?",
    'logout': 'Logout',
    'profile': 'Profile',
    'orders': 'Orders',
    // 必要に応じて追加
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ja] || key;
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