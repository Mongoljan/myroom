'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, ChevronDown, Moon, Sun } from "lucide-react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSwitcher from "../common/LanguageSwitcher";
import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";

const Header1 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { t } = useHydratedTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="relative bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
             <div className="flex items-center space-x-2 ">
              <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-slate-900 font-bold text-lg">MR</span>
              </div>
              <span className={`${TYPOGRAPHY.heading.h2} dark:text-white`}>MyRoom</span>
            </div>
              </Link>

              <div className="hidden xl:block">
                <MainMenu style="text-gray-900" />
              </div>
            </div>

            <div className="flex items-center">
              {/* Phone Number */}
              <div className="hidden lg:flex items-center mr-6">
                <div className={`flex items-center text-gray-900 dark:text-gray-100 ${TYPOGRAPHY.nav.primary} font-medium`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9997-2626
                </div>
              </div>

              {/* Check Order Link */}
              <div className="hidden lg:flex items-center mr-6">
                <Link
                  href="/booking/manage"
                  className={`text-gray-900 dark:text-gray-100 hover:text-primary transition-colors ${TYPOGRAPHY.nav.primary} font-medium`}
                >
                  {t('navigation.manageBooking')}
                </Link>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  console.log('Theme button clicked, current theme:', theme);
                  toggleTheme();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600 mr-3"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              {/* Language Controls */}
              <div className="hidden md:flex items-center mr-6">
                <LanguageSwitcher />
                <div className="w-px h-5 bg-gray-300 ml-3"></div>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated && user ? (
                  /* Profile Dropdown */
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold">
                        {user.first_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={`${TYPOGRAPHY.button.standard} text-gray-800 dark:text-gray-100 font-medium max-w-20 truncate`}>
                        {user.first_name}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1.5 z-50"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                          </div>

                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            {t('navigation.profile')}
                          </Link>

                          <div className="border-t border-gray-100 dark:border-gray-700 mt-1.5 pt-1.5">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              {t('navigation.logout')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={`px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md ${TYPOGRAPHY.button.standard} font-medium`}
                  >
                    {t('navigation.loginRegister')}
                  </Link>
                )}
              </div>

              <div className="flex xl:hidden items-center ml-4 space-x-3 text-gray-600 dark:text-gray-400">
                {/* Mobile Language toggle */}
                <div className="md:hidden flex items-center space-x-2">
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center text-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 transform transition-transform">
            <div className="flex justify-between items-center p-6 border-b">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-32">
                  <Image src="/img/general/logo-dark.svg" alt="logo" fill sizes="(max-width: 768px) 120px, 128px" />
                </div>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MobileMenu />
          </div>
        </div>
      )}
    </>
  );
};

export default Header1;