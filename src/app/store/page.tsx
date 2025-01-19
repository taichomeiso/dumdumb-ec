import { Suspense } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="w-full">
        <HeroSection />
        <Suspense 
          fallback={
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}