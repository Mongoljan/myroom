"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Heart, Star, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { useWishlist } from '@/hooks/useCustomer';
import { useAuth } from '@/contexts/AuthContext';
import { WishlistItem } from '@/types/customer';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { formatHotelLocation } from '@/utils/formatHotelLocation';
import DateRangePicker from '@/components/common/DateRangePicker';
import CustomGuestSelector from '@/components/search/CustomGuestSelector';

export default function SavedPage() {
  const { t } = useHydratedTranslation();
  const { token } = useAuth();
  const { wishlist, loading, refresh, removeHotel } = useWishlist(token || undefined);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read filter parameters from URL
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const rooms = parseInt(searchParams.get('rooms') || '1');
  const selectedCategory = searchParams.get('property_type') || 'all';

  const [activeProvince, setActiveProvince] = useState<string>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const dateContainerRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemove = async (hotelId: number) => {
    if (!token) return;
    setRemovingIds(prev => new Set(prev).add(hotelId));
    try {
      await removeHotel(hotelId);
    } finally {
      setRemovingIds(prev => {
        const s = new Set(prev);
        s.delete(hotelId);
        return s;
      });
    }
  };

  // Update URL Search Parameters
  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === 'all' || val === '' || val === undefined) {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleGuestChange = (newAdults: number, newChildren: number, newRooms: number) => {
    updateUrlParams({
      adults: newAdults,
      children: newChildren,
      rooms: newRooms,
    });
  };

  // Helper to match property type IDs or names robustly
  const matchesPropertyType = (itemPropertyType: string | null | undefined, selectedId: string) => {
    if (selectedId === 'all') return true;
    if (!itemPropertyType) return false;

    if (String(itemPropertyType) === String(selectedId)) return true;

    // Fallback dictionary for string property type values
    const typeMap: Record<string, string[]> = {
      '1': ['hotel', 'zochid buudal', 'буудал'],
      '8': ['resort', 'amraltyn gazar', 'амралт'],
      '7': ['camp', 'tourist camp', 'juulchny baaz', 'бааз'],
    };

    const searchTerms = typeMap[selectedId] || [];
    const typeLower = itemPropertyType.toLowerCase();
    return searchTerms.some(term => typeLower.includes(term));
  };

  // Categories mapping
  const PROPERTY_CATEGORIES = [
    { id: 'all', name: t('reviews.categoryAll', 'Бүгд') },
    { id: '1', name: t('reviews.propertyTypes.hotel', 'Зочид буудал') },
    { id: '8', name: t('reviews.propertyTypes.resort', 'Амралтын газар') },
    { id: '7', name: t('reviews.propertyTypes.camp', 'Жуулчны бааз') },
  ];

  // Helper to generate hotel link containing search parameters
  const getHotelLink = (hotelId: number) => {
    const params = new URLSearchParams();
    if (checkIn) params.set('check_in', checkIn);
    if (checkOut) params.set('check_out', checkOut);
    if (adults) params.set('adults', adults.toString());
    if (children) params.set('children', children.toString());
    if (rooms) params.set('rooms', rooms.toString());

    const queryString = params.toString();
    return `/hotel/${hotelId}${queryString ? `?${queryString}` : ''}`;
  };

  // Filter wishlist items matching chosen category first, then province
  const itemsMatchingCategory = wishlist.filter((item: WishlistItem) =>
    matchesPropertyType(item.hotel.property_type, selectedCategory)
  );

  const provinces = Array.from(
    new Set(itemsMatchingCategory.map((item: WishlistItem) => item.hotel.location?.province_city).filter(Boolean))
  ) as string[];

  const filtered = itemsMatchingCategory.filter((item: WishlistItem) =>
    activeProvince === 'all' || item.hotel.location?.province_city === activeProvince
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-center py-16">
          <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profileSaved.title')}</h1>
          <button onClick={refresh} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Province tabs */}
        {provinces.length > 0 && (
          <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700 overflow-x-auto pb-px">
            {/* 'All' Button */}
            <button
              onClick={() => setActiveProvince('all')}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap ${
                activeProvince === 'all'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent'
              }`}
            >
              Бүгд
              {itemsMatchingCategory.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-600 text-white leading-none">
                  {itemsMatchingCategory.length > 99 ? '99+' : itemsMatchingCategory.length}
                </span>
              )}
            </button>

            {/* Dynamic Province Buttons */}
            {provinces.map(province => {
              const count = itemsMatchingCategory.filter((i: WishlistItem) => i.hotel.location?.province_city === province).length;
              return (
                <button
                  key={province}
                  onClick={() => setActiveProvince(province)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap ${
                    activeProvince === province
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent'
                  }`}
                >
                  {province}
                  {count > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-600 text-white leading-none">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
     {/* Filter Bar */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-2 items-center m-6" style={{ overflow: 'visible' }}>

        {/* Date Picker */}
        <div ref={dateContainerRef} className="w-full md:w-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-4 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition relative h-11">
          <Calendar className="w-4 h-4 shrink-0" />
          <div className="text-sm font-medium whitespace-nowrap">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onDateChange={(newCheckIn, newCheckOut) => {
                updateUrlParams({ check_in: newCheckIn, check_out: newCheckOut });
              }}
              placeholder={t('search.selectDates', 'Орох - Гарах')}
              minimal={true}
              anchorRef={dateContainerRef}
            />
          </div>
        </div>

        {/* Guest Selector */}
        <div className="w-full md:w-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl flex items-center hover:border-gray-300 dark:hover:border-gray-600 transition relative z-[10] px-4 py-2 h-11">
          <CustomGuestSelector
            adults={adults}
            childrenCount={children}
            rooms={rooms}
            onGuestChange={handleGuestChange}
            className="w-auto whitespace-nowrap relative z-[10]"
            compact={true}
            hideLabel={true}
            textSizeClass="text-sm font-medium"
          />
        </div>

        {/* Property Type Dropdown */}
        <div ref={categoryRef} className="relative z-[1] w-full md:w-auto md:ml-auto">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full md:w-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 hover:border-gray-300 dark:hover:border-gray-600 transition focus:outline-none h-11"
          >
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-sm text-gray-400 dark:text-gray-500 leading-tight">
                {t('search.propertyTypeLabel', 'Төрлөөр ангилах')}:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {PROPERTY_CATEGORIES.find(c => c.id === selectedCategory)?.name || t('reviews.categoryAll', 'Бүгд')}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isCategoryOpen && (
            <div className="absolute right-0 mt-1.5 min-w-full w-max bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 py-1">
              {PROPERTY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    updateUrlParams({ property_type: cat.id });
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm whitespace-nowrap transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selectedCategory === cat.id
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/10'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Card grid */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Heart className="w-14 h-14 text-gray-200 dark:text-gray-600" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t('profileSaved.empty')}</p>
            <Link href="/search" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
              {t('profileSaved.searchHotels')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item: WishlistItem) => {
              const h = item.hotel;
              const isRemoving = removingIds.has(h.id);
              return (
                <div key={item.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700 shrink-0">
                    <Link href={getHotelLink(h.id)} className="block w-full h-full">
                      {/* Gradient placeholder always behind */}
                      <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700" />
                      {/* Image overlays placeholder; hidden on error */}
                      {h.profile_image && (
                        <img
                          src={h.profile_image.startsWith('/') ? `https://dev.kacc.mn${h.profile_image}` : h.profile_image}
                          alt={h.PropertyName}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                    </Link>
                    {/* Heart remove button */}
                    <button
                      onClick={() => handleRemove(h.id)}
                      disabled={isRemoving}
                      className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition disabled:opacity-60"
                      aria-label={t('profileSaved.remove')}
                    >
                      {isRemoving
                        ? <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                        : <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                    </button>
                  </div>

                  {/* Body */}
                  <Link href={getHotelLink(h.id)} className="flex flex-col flex-1 p-4 gap-1">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug line-clamp-1">{h.PropertyName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {formatHotelLocation(h.location)}
                    </p>

                    {/* Stars + rating */}
                    <div className="flex items-center gap-2 mt-1">
                      {h.star_rating != null && h.star_rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: h.star_rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      )}
                      {h.avg_rating != null && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {h.avg_rating}/5
                          <span className="font-normal ml-1">{h.review_count} сэтгэгдэл</span>
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    {h.min_price != null && (
                      <div className="mt-auto pt-3">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-lg font-bold text-primary">
                            {new Intl.NumberFormat('mn-MN').format(h.min_price)}₮
                          </span>
                        </div>
                        <p className="text-right text-xs text-gray-400 dark:text-gray-500">1 шөнийн үнэ (НӨАТ багтсан)</p>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
