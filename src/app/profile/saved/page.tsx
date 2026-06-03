"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, RefreshCw } from 'lucide-react';
import { useWishlist } from '@/hooks/useCustomer';
import { useAuth } from '@/contexts/AuthContext';
import { WishlistItem } from '@/types/customer';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { formatHotelLocation } from '@/utils/formatHotelLocation';

export default function SavedPage() {
  const { t } = useHydratedTranslation();
  const { token } = useAuth();
  const { wishlist, loading, refresh, removeHotel } = useWishlist(token || undefined);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const [activeProvince, setActiveProvince] = useState<string>('all');

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

  // Group by province
  const provinces = Array.from(
    new Set(wishlist.map((item: WishlistItem) => item.hotel.location?.province_city).filter(Boolean))
  ) as string[];

  const filtered = activeProvince === 'all'
    ? wishlist
    : wishlist.filter((item: WishlistItem) => item.hotel.location?.province_city === activeProvince);

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
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveProvince('all')}
              className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap border transition ${
                activeProvince === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Бүгд ({wishlist.length})
            </button>
            {provinces.map(province => {
              const count = wishlist.filter((i: WishlistItem) => i.hotel.location?.province_city === province).length;
              return (
                <button
                  key={province}
                  onClick={() => setActiveProvince(province)}
                  className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap border transition ${
                    activeProvince === province
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {province}({count})
                </button>
              );
            })}
          </div>
        )}
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
                    <Link href={`/hotel/${h.id}`} className="block w-full h-full">
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
                  <Link href={`/hotel/${h.id}`} className="flex flex-col flex-1 p-4 gap-1">
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
