"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Trash2, RefreshCw } from 'lucide-react';
import { useWishlist } from '@/hooks/useCustomer';
import { useAuth } from '@/contexts/AuthContext';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { WishlistItem } from '@/types/customer';
import { motion } from 'framer-motion';

export default function SavedPage() {
  const { t } = useHydratedTranslation();
  const { token, isAuthenticated } = useAuth();
  const { wishlist, loading, refresh, removeHotel } = useWishlist(token || undefined);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const handleRemove = async (hotelId: number) => {
    if (!token) return;

    setRemovingIds(prev => new Set(prev).add(hotelId));
    try {
      const result = await removeHotel(hotelId);
      if (!result.success) {
        console.error('Failed to remove from wishlist:', result.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(hotelId);
        return newSet;
      });
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return t('common.priceNotAvailable', 'Price not available');
    return new Intl.NumberFormat('mn-MN').format(price) + '₮';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t('saved.loading', 'Loading your saved hotels...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('saved.title', 'Saved Hotels')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {wishlist.length} {t('saved.hotelsCount', 'hotels saved')}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('saved.empty.title', 'No saved hotels yet')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('saved.empty.description', 'Start exploring and save your favorite hotels!')}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('saved.empty.browseHotels', 'Browse Hotels')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {wishlist.map((item: WishlistItem) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Hotel Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={item.hotel.profile_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format'}
                      alt={item.hotel.PropertyName}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format';
                      }}
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {item.hotel.PropertyName}
                        </h3>
                        
                        {item.hotel.CompanyName && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.hotel.CompanyName}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.hotel.location?.province_city || t('common.locationUnknown', 'Location unknown')}
                            {item.hotel.location?.soum && `, ${item.hotel.location.soum}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {item.hotel.star_rating && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: item.hotel.star_rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          )}
                          
                          {item.hotel.avg_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.hotel.avg_rating}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({item.hotel.review_count} {t('common.reviews', 'reviews')})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        {item.hotel.min_price && (
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {formatPrice(item.hotel.min_price)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {t('common.perNight', 'per night')}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleRemove(item.hotel.id)}
                          disabled={removingIds.has(item.hotel.id)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          title={t('saved.remove', 'Remove from saved')}
                        >
                          {removingIds.has(item.hotel.id) ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t('saved.addedOn', 'Added on')} {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/hotel/${item.hotel.id}?from=profile-saved`}
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t('common.viewDetails', 'View Details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
