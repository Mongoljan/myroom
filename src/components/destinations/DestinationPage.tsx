'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Filter, SlidersHorizontal, Search } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { SearchHotelResult, getRoomSellingPrice } from '@/types/api';
import SectionHotelCard from '@/components/common/SectionHotelCard';
import { text } from '@/styles/design-system';
import { DestinationHotelsGridSkeleton } from '@/components/skeletons';

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

type SortOption = 'price_low' | 'price_high' | 'rating';

export default function DestinationPage({ destination }: DestinationPageProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const [hotels, setHotels] = useState<SearchHotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<SearchHotelResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Search & sort states
  const [nameSearch, setNameSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price_low');

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
      } catch {
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [destination, destinationInfo.province]);

  // Apply filters + name search + sort
  useEffect(() => {
    let filtered = [...hotels];

    // Name search filter
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      filtered = filtered.filter(hotel =>
        hotel.property_name.toLowerCase().includes(q)
      );
    }

    // Price filter
    filtered = filtered.filter(hotel => {
      const price = hotel.cheapest_room ? getRoomSellingPrice(hotel.cheapest_room) : (hotel.min_estimated_total || 0);
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
      filtered = filtered.filter(hotel => {
        const pt = hotel.property_type;
        const ptStr = typeof pt === 'object' && pt ? pt.name_en.toLowerCase() : (pt || 'hotel').toLowerCase();
        return selectedPropertyTypes.has(ptStr);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const priceA = a.cheapest_room ? getRoomSellingPrice(a.cheapest_room) : (a.min_estimated_total || 0);
      const priceB = b.cheapest_room ? getRoomSellingPrice(b.cheapest_room) : (b.min_estimated_total || 0);
      const ratingA = parseFloat(a.rating_stars?.value || '0');
      const ratingB = parseFloat(b.rating_stars?.value || '0');

      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0;
    });

    setFilteredHotels(filtered);
  }, [hotels, nameSearch, priceRange, selectedRating, selectedPropertyTypes, sortBy]);

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
    setNameSearch('');
  };

  const hasActiveFilters = selectedRating !== null || selectedPropertyTypes.size > 0 ||
    priceRange[0] !== 0 || priceRange[1] !== 1000000 || nameSearch.trim().length > 0;

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'price_low',  label: t('sort.priceLow',  'Үнэ: багаас их') },
    { value: 'price_high', label: t('sort.priceHigh', 'Үнэ: ихээс бага') },
    { value: 'rating',     label: t('sort.rating',    'Үнэлгээ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
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
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-500/20 to-violet-500/20 rounded-full blur-3xl"
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
              <span className="text-white">{t('search.popularDestination', 'Алдартай байршлууд')}</span>
            </div>

            {/* Title */}
            <h1 className={`${text.displayMd} text-white mb-2`}>
              {destinationInfo.name}
            </h1>
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
              className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-4">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <h3 className={text.h4}>{t('filters.title', 'Шүүлтүүр')}</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-slate-900 hover:text-slate-800"
                    >
                      {t('filters.clear', 'Цэвэрлэх')}
                    </button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>0₮</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {priceRange[1].toLocaleString()}₮
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('filters.rating', 'Үнэлгээ')}
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRating === rating
                            ? 'bg-slate-50 text-slate-800 border border-slate-200'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                        }`}
                      >
                        <span>{rating}+ ⭐</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('filters.propertyType', 'Буудлын төрөл')}
                  </label>
                  <div className="space-y-2">
                    {['hotel', 'apartment', 'guesthouse'].map(type => (
                      <button
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPropertyTypes.has(type)
                            ? 'bg-slate-50 text-slate-800 border border-slate-200'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
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
            <div className="flex-1 min-w-0">
              {/* Top controls: Name Search + Filter Toggle + Sort */}
              <div className="mb-6">
                {/* Search Info & Name Input */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('hotel.title', 'Нийт илэрц')}:
                    <span className="ml-1 text-gray-600 dark:text-gray-300 text-lg font-semibold">{filteredHotels.length}</span>
                  </h2>
                  <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <input
                      type="text"
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      placeholder={t('search.searchByNamePlaceholder', 'Буудлын нэрээр хайх')}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary focus:border-primary hover:border-gray-300 dark:hover:border-gray-600 transition-colors w-full h-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Filter chips / Mobile toggle / Sort */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden shrink-0 inline-flex items-center gap-1.5 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {t('filters.show', 'Шүүлтүүр')}
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                    )}
                  </button>

                  <div className="relative shrink-0 inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 overflow-hidden">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as SortOption)}
                      className="w-40 appearance-none pl-3 pr-7 py-1 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              {isLoading ? (
                <DestinationHotelsGridSkeleton />
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
                      price={hotel.cheapest_room ? getRoomSellingPrice(hotel.cheapest_room) : (hotel.min_estimated_total || 0)}
                      image={
                        typeof hotel.images?.cover === 'string'
                          ? hotel.images.cover
                          : hotel.images?.cover?.url || hotel.images?.gallery?.[0]?.url || ''
                      }
                      index={index}
                      className="w-full"
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className={text.h3 + " mb-2"}>{t('destination.noResults', 'Илэрц олдсонгүй')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('destination.tryDifferentFilters', 'Өөр шүүлтүүр ашиглана уу')}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-slate-900 hover:text-slate-800 font-medium"
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
