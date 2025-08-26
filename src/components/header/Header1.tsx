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
        navbar ? "bg-gray-900 shadow-lg" : "bg-gray-900 shadow-lg"
      }`}>
        <div className="container mx-auto px-6 sm:px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
                <div className="relative h-8 w-32">
                  <Image src="/img/general/logo-light.svg" alt="logo icon" fill sizes="(max-width: 768px) 120px, 128px" />
                </div>
              </Link>
              
              <div className="hidden xl:block">
                <MainMenu style="text-white" />
              </div>
            </div>

            <div className="flex items-center">
              {/* Phone Number */}
              <div className="hidden lg:flex items-center mr-6">
                <div className="flex items-center text-white text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  7777-7777
                </div>
              </div>

              {/* Check Order Link */}
              <div className="hidden lg:flex items-center mr-6">
                <Link
                  href="/booking/manage"
                  className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
                >
                  {t('navigation.checkOrder', 'захиалга шалгах')}
                </Link>
              </div>

              {/* Language Controls */}
              <div className="hidden md:flex items-center mr-6">
                <LanguageSwitcher />
                <div className="w-px h-5 bg-white/20 ml-3"></div>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/hotel-login"
                  className="px-5 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  {t('navigation.hotelLogin', 'буудлаар нэвтрэх')}
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 bg-transparent border border-white text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {t('navigation.loginRegister', 'нэвтрэх/бүртгүүлэх')}
                </Link>
              </div>

              <div className="flex xl:hidden items-center ml-4 space-x-3 text-white">
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