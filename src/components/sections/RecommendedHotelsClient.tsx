"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { SearchHotelResult } from '@/types/api';

type TabKey = 'popular' | 'discount' | 'top_rated' | 'cheapest' | 'new';

interface Props {
  /** Pre-fetched hotels for the 'popular' tab from the server. */
  initialHotels: SearchHotelResult[];
}

const FALLBACKS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format',
];

function getHotelImage(hotel: SearchHotelResult): string {
  // Gallery profile image
  const profileImg = hotel.images?.gallery?.find(g => g.is_profile);
  if (profileImg?.url) return profileImg.url;
  // Cover (can be string or object)
  const cover = hotel.images?.cover;
  if (cover) return typeof cover === 'string' ? cover : cover.url;
  // Fallback by id
  return FALLBACKS[hotel.hotel_id % FALLBACKS.length];
}

function getLocation(hotel: SearchHotelResult): string {
  const loc = hotel.location;
  return loc?.province_city || loc?.soum || loc?.district || '';
}

function getPrice(hotel: SearchHotelResult): number {
  const r = hotel.cheapest_room;
  if (!r) return 0;
  return r.price_per_night_final ?? r.estimated_total_final ?? 0;
}

export default function RecommendedHotelsClient({ initialHotels }: Props) {
  const { t } = useHydratedTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('popular');
  const [isLoading, setIsLoading] = useState(initialHotels.length === 0);
  // undefined = not yet fetched → triggers fetch
  // []        = fetched but empty → shows empty state
  const [tabCache, setTabCache] = useState<Partial<Record<TabKey, SearchHotelResult[]>>>({
    popular: initialHotels.length > 0 ? initialHotels : undefined,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hotels = tabCache[activeTab] ?? [];

  const getTabBadgeColor = (tab: TabKey): 'orange' | 'green' | 'blue' | 'purple' | 'gray' => {
    switch (tab) {
      case 'popular': return 'orange';
      case 'discount': return 'green';
      case 'top_rated': return 'blue';
      case 'cheapest': return 'purple';
      case 'new': return 'gray';
      default: return 'gray';
    }
  };

  const getTabBadgeLabel = (tab: TabKey): string => {
    switch (tab) {
      case 'popular': return t('hotel.recommendedFilters.popular');
      case 'discount': return t('hotel.recommendedFilters.discounted');
      case 'top_rated': return t('hotel.recommendedFilters.highlyRated');
      case 'cheapest': return t('hotel.recommendedFilters.cheapest');
      case 'new': return t('hotel.recommendedFilters.newlyAdded');
      default: return '';
    }
  };

  // Fetch only when switching to a tab not yet in cache.
  // popular is pre-loaded from the server (or falls back to this on failure).
  useEffect(() => {
    if (tabCache[activeTab] !== undefined) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getSuggestedHotels(activeTab);
        setTabCache(prev => ({ ...prev, [activeTab]: response.results || [] }));
      } catch {
        setTabCache(prev => ({ ...prev, [activeTab]: [] }));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [activeTab]); // tabCache excluded intentionally

  useEffect(() => {
    const element = scrollRef.current;
    if (element && hotels.length > 0) {
      const checkScroll = () => {
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
      };
      setTimeout(checkScroll, 100);
    }
  }, [hotels]);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'popular', label: t('hotel.recommendedFilters.popular') },
    { key: 'discount', label: t('hotel.recommendedFilters.discounted') },
    { key: 'top_rated', label: t('hotel.recommendedFilters.highlyRated') },
    { key: 'cheapest', label: t('hotel.recommendedFilters.cheapest') },
    { key: 'new', label: t('hotel.recommendedFilters.newlyAdded') },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('hotel.recommended')}
          </h2>
        </motion.div>

        {/* Tab filters */}
        <div className="mb-5 overflow-x-auto scrollbar-hide">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden w-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 px-2 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200
                  ${activeTab === tab.key
                    ? 'text-primary dark:text-primary bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-900'
                  }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div
            className="flex items-start gap-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...Array(8)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse w-70 shrink-0"
              >
                <div className="h-45 bg-gray-200 dark:bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <div
              ref={scrollRef}
              className="flex items-start gap-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={() => {
                const element = scrollRef.current;
                if (element) {
                  setCanScrollLeft(element.scrollLeft > 0);
                  setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
                }
              }}
            >
              {hotels.slice(0, 8).map((hotel, index) => (
                <SectionHotelCard
                  key={hotel.hotel_id}
                  id={hotel.hotel_id.toString()}
                  name={hotel.property_name}
                  location={getLocation(hotel) || t('common.locationUnknown', 'Location unknown')}
                  rating={0}
                  ratingLabel={null}
                  price={getPrice(hotel)}
                  image={getHotelImage(hotel)}
                  badge={getTabBadgeLabel(activeTab)}
                  badgeColor={getTabBadgeColor(activeTab)}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('hotel.noCategoryResults')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
