"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const partners = [
  { name: "Partner 1", logo: "/img/clients/1.svg" },
  { name: "Partner 2", logo: "/img/clients/2.svg" },
  { name: "Partner 3", logo: "/img/clients/3.svg" },
  { name: "Partner 4", logo: "/img/clients/4.svg" },
  { name: "Partner 5", logo: "/img/clients/5.svg" },
  { name: "Partner 6", logo: "/img/clients/6.svg" },
];

export default function Partnerships() {
  const { t } = useHydratedTranslation();

  return (
    <>
      <section className="py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {t('partnerships.title', 'Хамтрагч байгууллагууд')}
            </h2>
          </motion.div>

          {/* Moving Carousel with enhanced height */}
          <div className="relative overflow-hidden py-2">
            <div className="flex partnership-scroll whitespace-nowrap">
              {/* First set of logos */}
              {partners.map((partner, idx) => (
                <div key={`first-${idx}`} className="flex-shrink-0 mx-6 flex items-center justify-center h-16 w-32 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={128}
                    height={64}
                    className="max-h-10 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Second set for seamless loop */}
              {partners.map((partner, idx) => (
                <div key={`second-${idx}`} className="flex-shrink-0 mx-6 flex items-center justify-center h-16 w-32 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={128}
                    height={64}
                    className="max-h-10 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Enhanced gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Trust badge */}
          {/* <div className="text-center mt-4">
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className={`${TYPOGRAPHY.body.standard} text-gray-700 font-medium`}>
                {t('partnerships.trust', '50,000+ хэрэглэгчдийн итгэлийг хүлээн авсан')}
              </span>
            </div>
          </div> */}
        </div>
      </section>

      <style jsx global>{`
        @keyframes partnership-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .partnership-scroll {
          animation: partnership-scroll 30s linear infinite;
        }
        
        .partnership-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}