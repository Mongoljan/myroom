'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelSubNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hotelName: string;
  price: number;
}

export default function HotelSubNav({ activeSection, onSectionChange, hotelName, price }: HotelSubNavProps) {
  const { t } = useHydratedTranslation();
  const [isSticky, setIsSticky] = useState(false);

  const sections = useMemo(() => [
    { id: 'overview', label: t('hotel.overview', 'Ерөнхий') },
    { id: 'rooms', label: t('hotel.rooms', 'Өрөөнүүд') },
    { id: 'house-rules', label: t('hotel.houseRules', 'Дотоод журам') },
    { id: 'reviews', label: t('hotel.reviews', 'Шүүмж, үнэлгээ') },
    { id: 'facilities', label: t('hotel.facilities', 'Үйлчилгээ') },
    { id: 'faq', label: t('hotel.faq', 'Түгээмэл асуулт') },
  ], [t]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hotel-hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const shouldBeSticky = heroBottom <= 100;
        setIsSticky(shouldBeSticky);
        
        // Hide/show main header
        const mainHeader = document.querySelector('header');
        if (mainHeader) {
          if (shouldBeSticky) {
            mainHeader.style.transform = 'translateY(-100%)';
            mainHeader.style.opacity = '0';
          } else {
            mainHeader.style.transform = 'translateY(0)';
            mainHeader.style.opacity = '1';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset main header visibility when component unmounts
      const mainHeader = document.querySelector('header');
      if (mainHeader) {
        mainHeader.style.transform = 'translateY(0)';
        mainHeader.style.opacity = '1';
      }
    };
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    onSectionChange(sectionId);
  }, [onSectionChange]);

  useEffect(() => {
    // Handle section scrolling with intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            handleSectionChange(entry.target.id);
          }
        });
      },
      {
        threshold: [0.3, 0.7],
        rootMargin: '-100px 0px -50% 0px',
      }
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [handleSectionChange, sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for sticky nav height
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`
      ${isSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-md bg-white/95 backdrop-blur-sm' : 'relative bg-white'} 
      transition-all duration-300
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSticky && (
          <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="font-medium text-gray-900 mr-3 text-sm">{hotelName}</h1>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-3">
                <div className="text-xs text-gray-800">{t('hotel.priceFrom', 'Эхлэх үнэ')}</div>
                <div className="font-bold text-blue-600 text-sm">{price.toLocaleString()}₮</div>
              </div>
              <button
                onClick={() => scrollToSection('rooms')}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                {t('hotel.bookNow', 'Өрөө сонгох')}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                py-3 px-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors duration-200
                ${activeSection === section.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}