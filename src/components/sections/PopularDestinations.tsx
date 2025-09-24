"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function PopularDestinations() {
  const { t } = useHydratedTranslation();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  const destinations = [
    { key: 'ulaanbaatar', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_20_58 PM.png'), nameEn: 'Ulaanbaatar' },
    { key: 'darkhan', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_37_52 PM.png'), nameEn: 'Darkhan' },
    { key: 'erdenet', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_35_20 PM.png'), nameEn: 'Erdenet' },
    { key: 'khuvsgul', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_21_04 PM.png'), nameEn: 'Khuvsgul' },
    { key: 'arkhangai', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_21_06 PM.png'), nameEn: 'Arkhangai' },
    { key: 'khovd', image: encodeURI('/img/destinations/6/ChatGPT Image Aug 29, 2025, 03_22_15 PM.png'), nameEn: 'Khovd' },
  ];

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t('home.popularDestinationsTitle')}</h2>
            <p className="text-sm text-gray-600">{t('home.popularDestinationsSubtitle')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((destination, index) => {
            const isLoaded = loadedImages.has(index);
            const hasError = errorImages.has(index);
            
            return (
              <Link
                key={index}
                href={`/destinations/${destination.nameEn.toLowerCase().replace(' ', '-')}`}
                className="group relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300"
                style={{ aspectRatio: '280/200' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-2 left-2 right-2 z-20">
                  <h3 className="text-white font-semibold text-base">{t(`destinations.${destination.key}`, destination.nameEn)}</h3>
                </div>
                
                {!hasError && (
                  <Image
                    src={destination.image} 
                    alt={t(`destinations.${destination.key}`, destination.nameEn)}
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
                          {destination.nameEn.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs">{t(`destinations.${destination.key}`, destination.nameEn)}</span>
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