"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function PopularDestinations() {
  useHydratedTranslation();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  const destinations = [
    { 
      name: 'Улаанбаатар', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_20_58 PM.png'),
      nameEn: 'Ulaanbaatar'
    },
    { 
      name: 'Дархан', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_37_52 PM.png'),
      nameEn: 'Darkhan'
    },
    { 
      name: 'Эрдэнэт', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_35_20 PM.png'),
      nameEn: 'Erdenet'
    },
    { 
      name: 'Хөвсгөл', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_21_04 PM.png'),
      nameEn: 'Khuvsgul'
    },
    { 
      name: 'Архангай', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_21_06 PM.png'),
      nameEn: 'Arkhangai'
    },
    { 
      name: 'Ховд', 
      image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_22_15 PM.png'),
      nameEn: 'Khovd'
    },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`${TYPOGRAPHY.heading.h2} text-gray-900 mb-1`}>Алдартай газрууд</h2>
            <p className={`${TYPOGRAPHY.body.standard} text-gray-600`}>Монгол орны хамгийн алдартай аялалын газрууд</p>
          </div>
          <Link 
            href="/destinations" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Бүгдийг харах
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((destination, index) => {
            const isLoaded = loadedImages.has(index);
            const hasError = errorImages.has(index);
            
            return (
              <Link
                key={index}
                href={`/destinations/${destination.nameEn.toLowerCase().replace(' ', '-')}`}
                className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <h3 className="text-white font-medium text-sm">{destination.name}</h3>
                </div>
                
                {!hasError && (
                  <Image
                    src={destination.image} 
                    alt={destination.name}
                    fill
                    className={`object-cover group-hover:scale-110 transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => {
                      setLoadedImages(prev => new Set(prev).add(index));
                    }}
                    onError={() => {
                      setErrorImages(prev => new Set(prev).add(index));
                    }}
                    unoptimized
                  />
                )}
                
                {!isLoaded && !hasError && (
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center animate-pulse">
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                )}
                
                {hasError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-lg">
                          {destination.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs">{destination.name}</span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}