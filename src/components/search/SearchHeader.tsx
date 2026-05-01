'use client';

import { useState, useEffect, useRef } from 'react';
import HotelSearchForm from './HotelSearchForm';

export default function SearchHeader() {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFocus = () => setIsSearchActive(true);

  const handleBlur = () => {
    // Use rAF so focus can move between fields inside the header without dismissing
    requestAnimationFrame(() => {
      if (!headerRef.current?.contains(document.activeElement)) {
        setIsSearchActive(false);
      }
    });
  };

  const dismissOverlay = () => {
    setIsSearchActive(false);
    // Blur any focused element inside the header
    (document.activeElement as HTMLElement)?.blur();
  };

  return (
    <>
      {/* Dark overlay — shown whenever a search field is active */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-200"
          onClick={dismissOverlay}
        />
      )}

      <div
        ref={headerRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          ${isSticky ? 'fixed top-0 left-0 right-0 shadow-md' : 'relative'}
          z-40
          ${isSearchActive ? 'bg-transparent' : 'bg-white dark:bg-gray-900'}
          transition-all duration-300 ease-out
        `}
      >
        <div className={`max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 transition-all duration-300 ease-out ${isSticky ? 'py-1.5' : 'py-2'}`}>
          <div className={`bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 ease-out ${
            isSearchActive
              ? 'border-primary shadow-2xl ring-2 ring-primary/30'
              : 'border-primary shadow-sm'
          }`}>
            <HotelSearchForm compact={isSticky} onSearchActiveChange={setIsSearchActive} />
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump when header becomes fixed */}
      {isSticky && <div className="h-[64px]" />}
    </>
  );
}