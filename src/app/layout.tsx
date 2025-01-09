import { Outfit, M_PLUS_1, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const mPlus = M_PLUS_1({
  subsets: ['latin'],
  variable: '--font-mplus',
});

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-notosans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${outfit.variable} ${mPlus.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}