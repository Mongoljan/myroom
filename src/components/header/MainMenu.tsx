'use client'
import Link from "next/link";
import { useState } from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ChevronDown } from 'lucide-react';

interface MainMenuProps {
  style?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ style = "" }) => {
  const { t } = useHydratedTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const articlesItems = [
    { label: t('navigation.news', 'News'), href: '/articles/news' },
    { label: t('navigation.blog', 'Blog'), href: '/articles/blog' },
    { label: t('navigation.updates', 'Updates'), href: '/articles/updates' }
  ];

  const adviceItems = [
    { label: t('navigation.travelTips', 'Travel Tips'), href: '/advice/travel-tips' },
    { label: t('navigation.hotelGuide', 'Hotel Guide'), href: '/advice/hotel-guide' },
    { label: t('navigation.bookingHelp', 'Booking Help'), href: '/advice/booking-help' }
  ];

  return (
    <nav className="hidden xl:flex items-center space-x-8">
      {/* нүүр - Home */}
      <Link
        href="/"
        className={`font-medium hover:text-blue-400 transition-colors ${style}`}
      >
        {t('navigation.home', 'Home')}
      </Link>

      {/* нийтлэл - Articles with dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveDropdown('articles')}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button className={`font-medium hover:text-blue-400 transition-colors flex items-center space-x-1 ${style}`}>
          <span>{t('navigation.articles', 'Articles')}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {activeDropdown === 'articles' && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[180px] z-50">
            {articlesItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* зөвлөгөө - Advice with dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveDropdown('advice')}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button className={`font-medium hover:text-blue-400 transition-colors flex items-center space-x-1 ${style}`}>
          <span>{t('navigation.advice', 'Advice')}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {activeDropdown === 'advice' && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[180px] z-50">
            {adviceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainMenu;