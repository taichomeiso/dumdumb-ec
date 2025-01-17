import type { Metadata } from "next";
import { Inter, Outfit, M_PLUS_1, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });
const mplus1 = M_PLUS_1({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
});
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "dumdumb",
  description: "Your favorite online shopping destination",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} ${notoSansJP.variable}`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}