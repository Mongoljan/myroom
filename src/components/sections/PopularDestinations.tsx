"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { text } from '@/styles/design-system';

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
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2 className={`${text.h2} text-gray-900 mb-1`}>{t('home.popularDestinationsTitle')}</h2>
          <p className={`${text.caption} text-gray-600`}>{t('home.popularDestinationsSubtitle')}</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {destinations.map((destination, index) => {
            const isLoaded = loadedImages.has(index);
            const hasError = errorImages.has(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/destinations/${destination.nameEn.toLowerCase().replace(' ', '-')}`}
                  className="group relative overflow-hidden rounded-xl bg-gray-200 transition-all duration-300 block hover:shadow-lg"
                  style={{ aspectRatio: '4/3' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 group-hover:from-black/80 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <h3 className={`${text.h4} text-white`}>{t(`destinations.${destination.key}`, destination.nameEn)}</h3>
                  </div>
                
                {!hasError && (
                  <Image
                    src={destination.image}
                    alt={t(`destinations.${destination.key}`, destination.nameEn)}
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-500 ${
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
                    <span className="text-gray-500 text-xs">Loading...</span>
                  </div>
                )}

                {hasError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-1">
                        <span className="text-white font-bold text-base">
                          {destination.nameEn.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-600 text-[10px]">{t(`destinations.${destination.key}`, destination.nameEn)}</span>
                    </div>
                  </div>
                )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}