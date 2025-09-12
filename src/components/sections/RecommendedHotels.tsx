"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';
import TextHoverEffect from '@/components/aceternity/TextHoverEffect';
import PointerHighlight from '@/components/aceternity/PointerHighlight';

interface CategorizedHotel extends SearchHotelResult {
  category: 'popular' | 'discounted' | 'highly_rated' | 'cheapest' | 'newly_added';
  categoryLabel: string;
  priceCategory: 'low' | 'medium' | 'high' | 'premium';
}

export default function RecommendedHotels() {
  const { } = useHydratedTranslation();
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
    const stars = parseFloat(hotel.rating_stars.value) || 3;
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
    const allRatings = allHotels.map(h => parseFloat(h.rating_stars.value) || 0).filter(r => r > 0);
    
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
      categoryLabel = 'Эрэлттэй';
    }
    // Хямдралтай (Discounted): Good quality but lower than average price
    else if (stars >= 3.5 && price < avgPrice * 0.8 && price > minPrice * 1.2) {
      category = 'discounted';
      categoryLabel = 'Хямдралтай';
    }
    // Өндөр үнэлгээтэй (Highly Rated): Above average rating
    else if (stars >= avgRating + 0.5 && stars >= 4.2) {
      category = 'highly_rated';
      categoryLabel = 'Өндөр үнэлгээтэй';
    }
    // Хамгийн хямд (Cheapest): Lowest price category with decent quality
    else if (priceCategory === 'low' && stars >= 3) {
      category = 'cheapest';
      categoryLabel = 'Хамгийн хямд';
    }
    // Шинээр нэмэгдсэн (Newly Added): Default category or newer properties
    else {
      category = 'newly_added';
      categoryLabel = 'Шинээр нэмэгдсэн';
    }

    return {
      ...hotel,
      category,
      categoryLabel,
      priceCategory
    };
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
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
              return parseFloat(b.rating_stars.value) - parseFloat(a.rating_stars.value);
            });

          setHotels(categorized);
          setFilteredHotels(categorized);
          console.log('Categorized hotels:', categorized.map(h => ({
            name: h.property_name,
            category: h.category,
            price: h.cheapest_room?.price_per_night,
            stars: h.rating_stars.value
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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Санал болгох</h2>
            <p className="text-sm text-gray-600">Монголын орны томоохон хот, аялал жуулчлалын бүсүүд дэхь хамгийн хямдаас эхлээд тансаг зэрэглэлийн буудлуудаас та өөрийн хайж байгаа өрөөгөө хялбар олох боломжтой.</p>
          </div>
          <Link 
            href="/search" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Бүгдийг харах
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Smart Filter tabs with counts */}
        <PointerHighlight className="mb-6" highlightColor="rgba(59, 130, 246, 0.08)">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'Бүгд', count: hotels.length },
              { key: 'popular', label: 'Эрэлттэй', count: hotels.filter(h => h.category === 'popular').length },
              { key: 'discounted', label: 'Хямдралтай', count: hotels.filter(h => h.category === 'discounted').length },
              { key: 'highly_rated', label: 'Өндөр үнэлгээтэй', count: hotels.filter(h => h.category === 'highly_rated').length },
              { key: 'cheapest', label: 'Хамгийн хямд', count: hotels.filter(h => h.category === 'cheapest').length },
              { key: 'newly_added', label: 'Шинээр нэмэгдсэн', count: hotels.filter(h => h.category === 'newly_added').length },
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                  activeFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {filter.label} {filter.count > 0 && <span className="ml-1 opacity-70">({filter.count})</span>}
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
              <motion.div
                key={hotel.hotel_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[280px] flex-shrink-0"
              >
                <Link 
                  href={`/hotel/${hotel.hotel_id}`}
                  className="group bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-lg block"
                >
                {/* Hotel Image */}
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={getHotelImage(hotel)}
                    alt={`${hotel.property_name} - Hotel image`}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                    }}
                  />
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-md text-white ${
                      hotel.category === 'popular' ? 'bg-orange-500' :
                      hotel.category === 'discounted' ? 'bg-green-500' :
                      hotel.category === 'highly_rated' ? 'bg-blue-500' :
                      hotel.category === 'cheapest' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {hotel.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {hotel.property_name}
                  </h3>
                  
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-xs line-clamp-1">{hotel.location.province_city}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium mr-1">
                        {hotel.rating_stars.value}
                      </div>
                      <span className="text-xs text-gray-500">
                        {hotel.rating_stars.label?.replace(/\d+\s*stars?/i, '').trim() || 'үнэлгээ'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2 mt-2">
                    {hotel.cheapest_room && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">эхлэх үнэ</div>
                        <div className="text-sm font-bold text-gray-900">
                          ₮{formatPrice(hotel.cheapest_room.price_per_night)}-с
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </Link>
              </motion.div>
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
            <p className="text-sm text-gray-600">Энэ ангиллд зочид буудал байхгүй байна</p>
          </div>
        )}
      </div>
    </section>
  );
}