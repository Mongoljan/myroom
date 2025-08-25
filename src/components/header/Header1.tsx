'use client'
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import LanguageSwitcher from "../common/LanguageSwitcher";
import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useHydratedTranslation();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navbar ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
      }`}>
        <div className="container mx-auto px-4 sm:px-3">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <div className="relative h-6 w-28">
                  <Image src="/img/general/logo-dark.svg" alt="logo icon" fill sizes="(max-width: 768px) 120px, 128px" />
                </div>
              </Link>
              
              <div className="hidden xl:block">
                <MainMenu style="text-gray-900" />
              </div>
            </div>

            <div className="flex items-center">
              {/* Phone Number */}
              <div className="hidden lg:flex items-center mr-4">
                <div className="flex items-center text-gray-900 text-xs font-medium">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  7777-7777
                </div>
              </div>

              {/* Check Order Link */}
              <div className="hidden lg:flex items-center mr-4">
                <Link
                  href="/booking/manage"
                  className="text-gray-900 hover:text-blue-600 transition-colors text-xs font-medium"
                >
                  {t('navigation.checkOrder', 'захиалга шалгах')}
                </Link>
              </div>

              {/* Language Controls */}
              <div className="hidden md:flex items-center mr-4">
                <LanguageSwitcher />
                <div className="w-px h-4 bg-gray-300 ml-2"></div>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/hotel-login"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('navigation.hotelLogin', 'буудлаар нэвтрэх')}
                </Link>
                <Link
                  href="/login"
                  className="px-3 py-1.5 bg-transparent border border-gray-900 text-gray-900 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  {t('navigation.loginRegister', 'нэвтрэх/бүртгүүлэх')}
                </Link>
              </div>

              <div className="flex xl:hidden items-center ml-3 space-x-2 text-gray-900">
                {/* Mobile Language toggle */}
                <div className="md:hidden flex items-center space-x-1">
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/login"
                  className="flex items-center text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="fixed left-0 top-0 h-full w-72 bg-white transform transition-transform">
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex items-center">
                <div className="relative h-6 w-28">
                  <Image src="/img/general/logo-dark.svg" alt="logo" fill sizes="(max-width: 768px) 112px, 112px" />
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