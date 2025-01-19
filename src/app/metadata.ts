import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'DumDum EC',
    template: '%s | DumDum EC',
  },
  description: 'Next.js製の高パフォーマンスECサイト',
  keywords: ['ecommerce', 'shopping', 'online store', 'next.js', 'react'],
  authors: [{ name: 'DumDum Team' }],
  creator: 'DumDum Team',
  publisher: 'DumDum Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    type: 'website',
    siteName: 'DumDum EC',
    title: 'DumDum EC - Next.js製の高パフォーマンスECサイト',
    description: 'Next.js製の高パフォーマンスECサイト',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DumDum EC',
    description: 'Next.js製の高パフォーマンスECサイト',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default defaultMetadata;