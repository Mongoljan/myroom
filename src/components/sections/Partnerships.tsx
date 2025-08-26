"use client";

import Image from 'next/image';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const partners = [
  { name: "Microsoft", logo: "/img/partners/microsoft.svg" },
  { name: "Google", logo: "/img/partners/google.svg" },
  { name: "Amazon", logo: "/img/partners/amazon.svg" },
  { name: "Booking.com", logo: "/img/partners/booking.svg" },
  { name: "Expedia", logo: "/img/partners/expedia.svg" },
  { name: "Airbnb", logo: "/img/partners/airbnb.svg" },
  { name: "TripAdvisor", logo: "/img/partners/tripadvisor.svg" },
  { name: "Agoda", logo: "/img/partners/agoda.svg" },
];

export default function Partnerships() {
  const { t } = useHydratedTranslation();

  return (
    <>
      <section className="py-10 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-3">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {t('partnerships.title', 'Хамтрагч байгууллагууд')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('partnerships.subtitle', 'Дэлхийн тэргүүлэгч компаниудын итгэлийг хүлээн авсан')}
            </p>
          </div>

          {/* Moving Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex partnership-scroll whitespace-nowrap">
              {/* First set of logos */}
              {partners.map((partner, idx) => (
                <div key={`first-${idx}`} className="flex-shrink-0 mx-6 flex items-center justify-center h-12 w-32">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={140}
                    height={60}
                    className="max-h-8 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Second set for seamless loop */}
              {partners.map((partner, idx) => (
                <div key={`second-${idx}`} className="flex-shrink-0 mx-6 flex items-center justify-center h-12 w-32">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={140}
                    height={60}
                    className="max-h-8 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
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