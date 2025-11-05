"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';
import PointerHighlight from '@/components/aceternity/PointerHighlight';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { text } from '@/styles/design-system';

interface CategorizedHotel extends SearchHotelResult {
  category: 'popular' | 'discounted' | 'highly_rated' | 'cheapest' | 'newly_added';
  categoryLabel: string;
  priceCategory: 'low' | 'medium' | 'high' | 'premium';
}

export default function RecommendedHotels() {
  const { t } = useHydratedTranslation();
  const [hotels, setHotels] = useState<CategorizedHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<CategorizedHotel[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Smart hotel categorization function based on market behavior
  const categorizeHotel = (hotel: SearchHotelResult, allHotels: SearchHotelResult[]): CategorizedHotel => {
    const price = hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0;
    const stars = parseFloat(hotel.rating_stars?.value || '3') || 3;
    const facilities = hotel.general_facilities || [];
    
    // Define price ranges based on Mongolian hotel market (MNT)
    const priceRanges = {
      budget: { min: 0, max: 150000 },      // Under 150k MNT
      medium: { min: 150000, max: 300000 }, // 150k-300k MNT
      high: { min: 300000, max: 500000 },   // 300k-500k MNT
      premium: { min: 500000, max: Infinity } // Above 500k MNT
    };

    // Determine price category
    let priceCategory: 'low' | 'medium' | 'high' | 'premium' = 'medium';
    if (price <= priceRanges.budget.max) priceCategory = 'low';
    else if (price <= priceRanges.medium.max) priceCategory = 'medium';
    else if (price <= priceRanges.high.max) priceCategory = 'high';
    else priceCategory = 'premium';

    // Calculate statistics for intelligent categorization
    const allPrices = allHotels.map(h => h.cheapest_room?.price_per_night || h.min_estimated_total || 0).filter(p => p > 0);
    const allRatings = allHotels.map(h => {
      const ratingValue = h.rating_stars?.value;
      return ratingValue ? parseFloat(ratingValue) : 0;
    }).filter(r => r > 0);
    
    const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    const minPrice = Math.min(...allPrices);
    const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

    // Smart categorization logic based on market behavior
  let category: 'popular' | 'discounted' | 'highly_rated' | 'cheapest' | 'newly_added' = 'newly_added';
  let categoryLabel = '';

    // Эрэлттэй (Popular): High stars + premium facilities + good price range
    if (stars >= 4 && priceCategory !== 'premium' && 
        (facilities.some(f => f.toLowerCase().includes('wifi')) || 
         facilities.some(f => f.toLowerCase().includes('restaurant')) ||
         facilities.some(f => f.toLowerCase().includes('parking')))) {
  category = 'popular';
  categoryLabel = t('hotel.recommendedFilters.popular');
    }
    // Хямдралтай (Discounted): Good quality but lower than average price
    else if (stars >= 3.5 && price < avgPrice * 0.8 && price > minPrice * 1.2) {
  category = 'discounted';
  categoryLabel = t('hotel.recommendedFilters.discounted');
    }
    // Өндөр үнэлгээтэй (Highly Rated): Above average rating
    else if (stars >= avgRating + 0.5 && stars >= 4.2) {
  category = 'highly_rated';
  categoryLabel = t('hotel.recommendedFilters.highlyRated');
    }
    // Хамгийн хямд (Cheapest): Lowest price category with decent quality
    else if (priceCategory === 'low' && stars >= 3) {
  category = 'cheapest';
  categoryLabel = t('hotel.recommendedFilters.cheapest');
    }
    // Шинээр нэмэгдсэн (Newly Added): Default category or newer properties
    else {
  category = 'newly_added';
  categoryLabel = t('hotel.recommendedFilters.newlyAdded');
    }

    return {
      ...hotel,
      category,
      categoryLabel,
      priceCategory
    };
  };

  // Get hotel image with fallback
  const getHotelImage = (hotel: SearchHotelResult): string => {
    if (hotel.images?.cover) {
      if (typeof hotel.images.cover === 'string') {
        return hotel.images.cover;
      } else if (hotel.images.cover.url) {
        return hotel.images.cover.url;
      }
    }
    if (hotel.images?.gallery && hotel.images.gallery.length > 0) {
      return hotel.images.gallery[0].url;
    }
    // Smart fallback based on hotel ID for variety
    const fallbacks = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    ];
    return fallbacks[hotel.hotel_id % fallbacks.length];
  };

  // Get badge color for category
  const getCategoryBadgeColor = (category: string): 'orange' | 'green' | 'blue' | 'purple' | 'gray' => {
    switch (category) {
      case 'popular': return 'orange';
      case 'discounted': return 'green';
      case 'highly_rated': return 'blue';
      case 'cheapest': return 'purple';
      default: return 'gray';
    }
  };

  // Fetch and categorize hotels
  useEffect(() => {
    const loadHotels = async () => {
      setIsLoading(true);
      try {
        const searchResult = await ApiService.searchHotels({
          check_in: new Date().toISOString().split('T')[0],
          check_out: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
          adults: 2,
          children: 0,
          rooms: 1,
          acc_type: 'hotel'
        });

        if (searchResult.results) {
          const hotelResults = searchResult.results.slice(0, 12); // Take first 12 hotels
          const categorized = hotelResults
            .map(hotel => categorizeHotel(hotel, hotelResults))
            .sort((a, b) => {
              // Sort by category importance, then by rating
              const categoryOrder = { popular: 0, highly_rated: 1, discounted: 2, cheapest: 3, newly_added: 4 };
              const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
              if (catDiff !== 0) return catDiff;
              return (parseFloat(b.rating_stars?.value || '0') || 0) - (parseFloat(a.rating_stars?.value || '0') || 0);
            });

          setHotels(categorized);
          setFilteredHotels(categorized);
          console.log('Categorized hotels:', categorized.map(h => ({
            name: h.property_name,
            category: h.category,
            price: h.cheapest_room?.price_per_night,
            stars: h.rating_stars?.value
          })));
        }
      } catch (error) {
        console.error('Error loading recommended hotels:', error);
        // Set empty array on error - component will show empty state
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(hotel => hotel.category === activeFilter));
    }
  }, [activeFilter, hotels]);

  // Check scroll positions on load
  useEffect(() => {
    const element = scrollRef.current;
    if (element && filteredHotels.length > 0) {
      const checkScroll = () => {
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
      };
      
      setTimeout(checkScroll, 100); // Small delay to ensure rendering is complete
    }
  }, [filteredHotels]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

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

        {/* Smart Filter tabs with counts */}
        <PointerHighlight className="mb-5" highlightColor="rgba(59, 130, 246, 0.08)">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: t('hotel.filters.all'), count: hotels.length },
              { key: 'popular', label: t('hotel.recommendedFilters.popular'), count: hotels.filter(h => h.category === 'popular').length },
              { key: 'discounted', label: t('hotel.recommendedFilters.discounted'), count: hotels.filter(h => h.category === 'discounted').length },
              { key: 'highly_rated', label: t('hotel.recommendedFilters.highlyRated'), count: hotels.filter(h => h.category === 'highly_rated').length },
              { key: 'cheapest', label: t('hotel.recommendedFilters.cheapest'), count: hotels.filter(h => h.category === 'cheapest').length },
              { key: 'newly_added', label: t('hotel.recommendedFilters.newlyAdded'), count: hotels.filter(h => h.category === 'newly_added').length },
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {filter.label} {filter.count > 0 && <span className="ml-0.5 opacity-70">({filter.count})</span>}
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
        ) : filteredHotels.length > 0 ? (
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
            
            {filteredHotels.slice(0, 8).map((hotel, index) => (
              <SectionHotelCard
                key={hotel.hotel_id}
                id={hotel.hotel_id.toString()}
                name={hotel.property_name}
                location={hotel.location.province_city}
                rating={parseFloat(hotel.rating_stars?.value || '0') || 0}
                ratingLabel={hotel.rating_stars?.label || t('hotel.rating')}
                price={hotel.cheapest_room?.price_per_night || 0}
                image={getHotelImage(hotel)}
                badge={hotel.categoryLabel}
                badgeColor={getCategoryBadgeColor(hotel.category)}
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