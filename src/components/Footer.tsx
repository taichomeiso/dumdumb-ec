'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { APP_CONFIG } from '@/constants';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white mt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{APP_CONFIG.siteName}</h3>
            <p className="text-gray-400">
              {t('footer.description', 'スタイリッシュなショッピング体験をお届けします')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.contact', 'お問い合わせ')}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>{APP_CONFIG.companyAddress}</li>
              <li>{APP_CONFIG.companyEmail}</li>
              <li>{APP_CONFIG.companyPhone}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('footer.followUs', 'フォローする')}
            </h3>
            <div className="flex space-x-4">
              {Object.entries(APP_CONFIG.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {APP_CONFIG.companyName}</p>
        </div>
      </div>
    </footer>
  );
};