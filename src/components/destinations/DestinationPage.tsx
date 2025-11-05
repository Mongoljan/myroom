'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { SearchHotelResult } from '@/types/api';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { text } from '@/styles/design-system';

interface DestinationPageProps {
  destination: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

// Map destination slugs to proper names and provinces
const DESTINATION_MAP: Record<string, { name: string; province?: string; nameEn: string }> = {
  'ulaanbaatar': { name: 'Улаанбаатар', nameEn: 'Ulaanbaatar', province: 'ulaanbaatar' },
  'darkhan': { name: 'Дархан', nameEn: 'Darkhan', province: 'darkhan' },
  'erdenet': { name: 'Эрдэнэт', nameEn: 'Erdenet', province: 'orkhon' },
  'khuvsgul': { name: 'Хөвсгөл', nameEn: 'Khuvsgul', province: 'khuvsgul' },
  'arkhangai': { name: 'Архангай', nameEn: 'Arkhangai', province: 'arkhangai' },
  'khovd': { name: 'Ховд', nameEn: 'Khovd', province: 'khovd' },
};

export default function DestinationPage({ destination, searchParams }: DestinationPageProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [hotels, setHotels] = useState<SearchHotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<SearchHotelResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<Set<string>>(new Set());

  const destinationInfo = DESTINATION_MAP[destination] || {
    name: destination.charAt(0).toUpperCase() + destination.slice(1),
    nameEn: destination
  };

  // Fetch hotels for destination
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
          acc_type: 'hotel',
          ...(destinationInfo.province && { province_name: destinationInfo.province }),
        });

        if (searchResult.results) {
          setHotels(searchResult.results);
          setFilteredHotels(searchResult.results);
        }
      } catch (error) {
        console.error('Error loading hotels:', error);
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [destination, destinationInfo.province]);

  // Apply filters
  useEffect(() => {
    let filtered = [...hotels];

    // Price filter
    filtered = filtered.filter(hotel => {
      const price = hotel.cheapest_room?.price_per_night || hotel.min_estimated_total || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (selectedRating !== null) {
      filtered = filtered.filter(hotel => {
        const rating = parseFloat(hotel.rating_stars?.value || '0');
        return rating >= selectedRating;
      });
    }

    // Property type filter
    if (selectedPropertyTypes.size > 0) {
      filtered = filtered.filter(hotel =>
        selectedPropertyTypes.has(hotel.property_type?.toLowerCase() || 'hotel')
      );
    }

    setFilteredHotels(filtered);
  }, [hotels, priceRange, selectedRating, selectedPropertyTypes]);

  const togglePropertyType = (type: string) => {
    const newTypes = new Set(selectedPropertyTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedPropertyTypes(newTypes);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedRating(null);
    setSelectedPropertyTypes(new Set());
  };

  const hasActiveFilters = selectedRating !== null || selectedPropertyTypes.size > 0 ||
    priceRange[0] !== 0 || priceRange[1] !== 1000000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden">
        {/* Animated background orb */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-4">
              <button onClick={() => router.push('/')} className="hover:text-white transition-colors">
                {t('breadcrumb.home', 'Нүүр')}
              </button>
              <span>/</span>
              <span className="text-white">{destinationInfo.name}</span>
            </div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4"
            >
              <MapPin className="w-8 h-8 text-blue-300" />
            </motion.div>

            {/* Title */}
            <h1 className={`${text.displayMd} text-white mb-3`}>
              {destinationInfo.name}
            </h1>

            {/* Description */}
            <p className="text-gray-300 max-w-2xl mx-auto mb-4">
              {t('destination.subtitle', {
                destination: destinationInfo.name,
                count: filteredHotels.length
              }, `${filteredHotels.length} зочид буудал олдлоо`)}
            </p>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-300">{filteredHotels.length} {t('destination.available', 'боломжтой')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                    <h3 className={text.h4}>{t('filters.title', 'Шүүлтүүр')}</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {t('filters.clear', 'Цэвэрлэх')}
                    </button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('filters.priceRange', 'Үнийн хязгаар')}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>0₮</span>
                      <span className="font-medium text-gray-900">
                        {priceRange[1].toLocaleString()}₮
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('filters.rating', 'Үнэлгээ')}
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRating === rating
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span>{rating}+ ⭐</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('filters.propertyType', 'Буудлын төрөл')}
                  </label>
                  <div className="space-y-2">
                    {['hotel', 'apartment', 'guesthouse'].map(type => (
                      <button
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPropertyTypes.has(type)
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <span className="capitalize">{t(`propertyType.${type}`, type)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hotels Grid */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  {t('filters.show', 'Шүүлтүүр')}
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              </div>

              {/* Results */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredHotels.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filteredHotels.map((hotel, index) => (
                    <SectionHotelCard
                      key={hotel.hotel_id}
                      id={hotel.hotel_id.toString()}
                      name={hotel.property_name}
                      location={hotel.location.province_city}
                      rating={parseFloat(hotel.rating_stars?.value || '0') || 0}
                      ratingLabel={hotel.rating_stars?.label || ''}
                      price={hotel.cheapest_room?.price_per_night || 0}
                      image={hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || ''}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className={text.h3 + " mb-2"}>{t('destination.noResults', 'Илэрц олдсонгүй')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('destination.tryDifferentFilters', 'Өөр шүүлтүүр ашиглана уу')}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('filters.clear', 'Шүүлтүүрийг цэвэрлэх')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
