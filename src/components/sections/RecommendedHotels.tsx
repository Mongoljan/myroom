"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import PointerHighlight from '@/components/aceternity/PointerHighlight';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { text } from '@/styles/design-system';

// Type for API response
interface SuggestedHotel {
  hotel: {
    pk: number;
    PropertyName: string;
    location: string;
    property_type: number;
    created_at: string;
  };
  cheapest_room: {
    id: number;
    base_price: number;
    final_price: number;
    images: Array<{ id: number; image: string; description: string }>;
    adultQty: number;
    childQty: number;
  } | null;
}

type TabKey = 'popular' | 'discount' | 'top_rated' | 'cheapest' | 'new';

export default function RecommendedHotels() {
  const { t } = useHydratedTranslation();
  const [hotels, setHotels] = useState<SuggestedHotel[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [tabCounts, setTabCounts] = useState<Record<TabKey, number>>({
    popular: 0,
    discount: 0,
    top_rated: 0,
    cheapest: 0,
    new: 0
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Get hotel image with fallback - optimized for card display
  const getHotelImage = (hotel: SuggestedHotel): string => {
    if (hotel.cheapest_room?.images && hotel.cheapest_room.images.length > 0) {
      const imageUrl = hotel.cheapest_room.images[0].image;
      // Return the image URL as-is - Next.js Image component will handle sizing
      return imageUrl;
    }
    // Smart fallback based on hotel ID for variety
    const fallbacks = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format'
    ];
    return fallbacks[hotel.hotel.pk % fallbacks.length];
  };

  // Get badge color for tab
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

  // Get badge label for tab
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

  // Fetch hotels for the active tab
  useEffect(() => {
    const loadHotels = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getSuggestedHotels(activeTab);
        setHotels(response.results || []);
        
        // Update count for current tab
        setTabCounts(prev => ({
          ...prev,
          [activeTab]: response.count || 0
        }));
      } catch (error) {
        console.error('Error loading suggested hotels:', error);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [activeTab]);

  // Load counts for all tabs on initial mount
  useEffect(() => {
    const loadAllCounts = async () => {
      const tabs: TabKey[] = ['popular', 'discount', 'top_rated', 'cheapest', 'new'];
      const counts: Record<TabKey, number> = {
        popular: 0,
        discount: 0,
        top_rated: 0,
        cheapest: 0,
        new: 0
      };

      await Promise.all(
        tabs.map(async (tab) => {
          try {
            const response = await ApiService.getSuggestedHotels(tab);
            counts[tab] = response.count || 0;
          } catch {
            counts[tab] = 0;
          }
        })
      );

      setTabCounts(counts);
    };

    loadAllCounts();
  }, []);

  // Check scroll positions
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

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'popular', label: t('hotel.recommendedFilters.popular') },
    { key: 'discount', label: t('hotel.recommendedFilters.discounted') },
    { key: 'top_rated', label: t('hotel.recommendedFilters.highlyRated') },
    { key: 'cheapest', label: t('hotel.recommendedFilters.cheapest') },
    { key: 'new', label: t('hotel.recommendedFilters.newlyAdded') },
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
          <h2 className={`${text.h2} text-gray-900 mb-1`}>{t('hotel.recommended')}</h2>
          <p className={`${text.caption} text-gray-600`}>{t('features.wideSelectionDesc')}</p>
        </motion.div>

        {/* Tab filters */}
        <PointerHighlight className="mb-5" highlightColor="rgba(59, 130, 246, 0.08)">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-slate-300'
                }`}
              >
                {tab.label} {tabCounts[tab.key] > 0 && <span className="ml-0.5 opacity-70">({tabCounts[tab.key]})</span>}
              </motion.button>
            ))}
          </div>
        </PointerHighlight>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 px-4 sm:px-6 lg:px-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse w-[260px] sm:w-[280px] flex-shrink-0"
                >
                  <div className="h-36 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hotels.length > 0 ? (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
            
            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}

            <div 
              ref={scrollRef} 
              className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth"
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
              onScroll={() => {
                const element = scrollRef.current;
                if (element) {
                  setCanScrollLeft(element.scrollLeft > 0);
                  setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
                }
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            
            {hotels.slice(0, 8).map((hotel, index) => (
              <SectionHotelCard
                key={hotel.hotel.pk}
                id={hotel.hotel.pk.toString()}
                name={hotel.hotel.PropertyName}
                location={hotel.hotel.location}
                rating={0}
                ratingLabel={null}
                price={hotel.cheapest_room?.final_price || hotel.cheapest_room?.base_price || 0}
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
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{t('hotel.noCategoryResults')}</p>
          </div>
        )}
      </div>
    </section>
  );
}