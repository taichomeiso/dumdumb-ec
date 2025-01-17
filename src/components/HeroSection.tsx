import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-black text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.7),rgba(0,0,0,1))]"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -top-4 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl animate-float"></div>
            <h2 className="text-7xl md:text-[8rem] leading-none font-black mb-6 tracking-tight">
              BE DUMB
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                BE CUTE
              </span>
            </h2>
          </div>
          <p className="text-xl mb-10 text-white max-w-xl font-medium">
            {t("tagline.line1")}
            <br />
            {t("tagline.line2")}
          </p>
          <div className="flex gap-4">
            <button className="group bg-white text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-black hover:text-white transition-all duration-300">
              {t("shop_new")}
              <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};