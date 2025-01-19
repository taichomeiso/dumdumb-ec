'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
        <Toaster position="bottom-right" />
      </LanguageProvider>
    </SessionProvider>
  );
}