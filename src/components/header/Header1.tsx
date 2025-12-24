'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import LanguageSwitcher from "../common/LanguageSwitcher";
import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";

const Header1 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useHydratedTranslation();

  return (
    <>
      <header className="relative bg-white shadow-lg border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
             <div className="flex items-center space-x-2 ">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">MR</span>
              </div>
              <span className={TYPOGRAPHY.heading.h2}>MyRoom</span>
            </div>
              </Link>

              <div className="hidden xl:block">
                <MainMenu style="text-gray-900" />
              </div>
            </div>

            <div className="flex items-center">
              {/* Phone Number */}
              <div className="hidden lg:flex items-center mr-6">
                <div className={`flex items-center text-gray-900 ${TYPOGRAPHY.nav.primary} font-medium`}>
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
                  className={`text-gray-900 hover:text-primary transition-colors ${TYPOGRAPHY.nav.primary} font-medium`}
                >
                  {t('navigation.manageBooking')}
                </Link>
              </div>

              {/* Language Controls */}
              <div className="hidden md:flex items-center mr-6">
                <LanguageSwitcher />
                <div className="w-px h-5 bg-gray-300 ml-3"></div>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/hotel-login"
                  className={`px-4 py-2.5 bg-slate-900 hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${TYPOGRAPHY.button.standard} font-medium`}
                >
                  {t('navigation.hotelLogin')}
                </Link>
                <Link
                  href="/login"
                  className={`px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md ${TYPOGRAPHY.button.standard} font-medium`}
                >
                  {t('navigation.loginRegister')}
                </Link>
              </div>

              <div className="flex xl:hidden items-center ml-4 space-x-3 text-gray-600">
                {/* Mobile Language toggle */}
                <div className="md:hidden flex items-center space-x-2">
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/login"
                  className="flex items-center text-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
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
          <div className="fixed left-0 top-0 h-full w-80 bg-white transform transition-transform">
            <div className="flex justify-between items-center p-6 border-b">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-32">
                  <Image src="/img/general/logo-dark.svg" alt="logo" fill sizes="(max-width: 768px) 120px, 128px" />
                </div>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
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