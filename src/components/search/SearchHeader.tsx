'use client';

import { useState, useEffect } from 'react';
import HotelSearchForm from './HotelSearchForm';

export default function SearchHeader() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after scrolling 80px
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={`
          ${isSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-md' : 'relative'}
          bg-white
          transition-all duration-300 ease-out
        `}
      >
        <div className={`max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 transition-all duration-300 ease-out ${isSticky ? 'py-1.5' : 'py-2'}`}>
          <div className="bg-white border border-primary rounded-xl overflow-hidden transition-all duration-300 ease-out">
            <HotelSearchForm compact={isSticky} />
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump when header becomes fixed */}
      {isSticky && <div className="h-[64px]" />}
    </>
  );
}