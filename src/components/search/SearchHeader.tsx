'use client';

import { useState, useEffect } from 'react';
import HotelSearchForm from './HotelSearchForm';

export default function SearchHeader() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after scrolling 80px (after the main header)
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`
        ${isSticky
          ? 'fixed top-0 left-0 right-0 z-40 bg-white shadow-md'
          : 'relative bg-white'
        }
        transition-all duration-300
      `}>
        {/* Content */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isSticky ? 'py-2' : 'py-3'}`}>
          <HotelSearchForm compact={isSticky} />
        </div>
      </div>

      {/* Spacer to prevent content jump when header becomes fixed */}
      {isSticky && <div className="h-[80px]"></div>}
    </>
  );
}