import { useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white mt-32">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-2xl font-black mb-6">{APP_CONFIG.name}</h4>
            <p className="text-white font-medium">
              {t("footer.about.tagline1")}
              <br />
              {t("footer.about.tagline2")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t("footer.shop.title")}</h4>
            <ul className="space-y-2 text-gray-200 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.shop.new_arrivals")}
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.shop.best_sellers")}
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.shop.on_sale")}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t("footer.help.title")}</h4>
            <ul className="space-y-2 text-gray-200 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.help.contact")}
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.help.shipping")}
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                {t("footer.help.returns")}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t("footer.follow.title")}</h4>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                <span className="w-5 h-5 block"></span>
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                <span className="w-5 h-5 block"></span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="font-bold text-gray-200">{APP_CONFIG.copyright}</p>
        </div>
      </div>
    </footer>
  );
};