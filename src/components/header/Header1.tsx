'use client'
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeSwitcher from "../common/ThemeSwitcher";
import MainMenu from "./MainMenu";
import CurrencyMegaMenu from "./CurrencyMegaMenu";
// LanguageMegaMenu removed because it's not used in this header
import MobileMenu from "./MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

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
        navbar ? "bg-gray-900 shadow-lg" : "bg-transparent"
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
              <div className="hidden xxl:flex items-center space-x-4">
                <CurrencyMegaMenu textClass="text-white" />
                <div className="w-px h-5 bg-white/20"></div>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>

              <div className="hidden md:flex items-center ml-8 space-x-4">
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  {t('navigation.becomeExpert')}
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 border border-white text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {t('navigation.signInRegister')}
                </Link>
              </div>

              <div className="flex xl:hidden items-center ml-6 space-x-4 text-white">
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