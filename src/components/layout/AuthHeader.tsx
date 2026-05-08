'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { TYPOGRAPHY } from '@/styles/containers';

export default function AuthHeader() {
  const { t } = useHydratedTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-lg">MR</span>
            </div>
            <span className={`${TYPOGRAPHY.heading.h2} dark:text-white`}>MyRoom</span>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Hotel login link */}
            <Link
              href="/hotel/login"
              className={`hidden sm:inline-flex items-center px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${TYPOGRAPHY.button.standard} font-medium`}
            >
              {t('navigation.hotelLogin', 'Буудлаар нэвтрэх')}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <span className="w-5 h-5" />
              ) : theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {/* Language switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
