/**
 * Wishlist Heart Button Component
 * Provides wishlist functionality with heart icon and tooltips
 */

'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist, useAuthenticatedUser } from '@/hooks/useCustomer';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useIsInWishlist } from '@/hooks/useCustomer';

interface WishlistHeartProps {
  hotelId: number;
  size?: number;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  showTooltip?: boolean;
  onWishlistChange?: (isInWishlist: boolean) => void;
}

export default function WishlistHeart({
  hotelId,
  size = 20,
  className = '',
  tooltipPosition = 'top',
  showTooltip = true,
  onWishlistChange
}: WishlistHeartProps) {
  const { t } = useHydratedTranslation();
  const { token, isAuthenticated } = useAuthenticatedUser();
  const { isInWishlist, loading: checkingWishlist, refresh: refreshWishlistStatus } = useIsInWishlist(hotelId, token || undefined);
  const { toggleHotel, loading: wishlistLoading } = useWishlist(token || undefined);
  const [showTooltipState, setShowTooltipState] = useState(false);
  
  // Local state for immediate UI feedback
  const [localIsInWishlist, setLocalIsInWishlist] = useState(isInWishlist);

  // Sync local state with hook state
  useEffect(() => {
    setLocalIsInWishlist(isInWishlist);
  }, [isInWishlist]);

  const loading = checkingWishlist || wishlistLoading;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    try {
      // Optimistic update for immediate UI feedback
      const newState = !localIsInWishlist;
      setLocalIsInWishlist(newState);
      onWishlistChange?.(newState);

      const result = await toggleHotel(hotelId);
      if (result.success) {
        // API call succeeded, refresh the actual state
        await refreshWishlistStatus();
        onWishlistChange?.(result.isInWishlist);
      } else {
        // API call failed, revert optimistic update
        setLocalIsInWishlist(!newState);
        onWishlistChange?.(!newState);
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsInWishlist(!localIsInWishlist);
      onWishlistChange?.(!localIsInWishlist);
    }
  };

  const tooltipText = !isAuthenticated 
    ? t('wishlist.loginRequired', 'Нэвтэрч орох') 
    : localIsInWishlist 
      ? t('wishlist.removeFromWishlist', 'Буудал хасах')
      : t('wishlist.addToWishlist', 'Буудал хадгалах');

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-40 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg whitespace-nowrap pointer-events-none";
    
    switch (tooltipPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`group relative p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        aria-label={tooltipText}
      >
        {loading ? (
          <div 
            className="animate-spin rounded-full border-2 border-gray-300 border-t-red-500"
            style={{ width: size, height: size }}
          />
        ) : (
          <Heart
            size={size}
            className={`transition-all duration-200 ${
              localIsInWishlist
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 group-hover:text-red-500'
            }`}
          />
        )}
        
        {/* Tooltip */}
        {showTooltip && showTooltipState && (
          <div className={getTooltipClasses()}>
            {tooltipText}
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 ${
                tooltipPosition === 'top' 
                  ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'
                  : tooltipPosition === 'bottom'
                  ? 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800'
                  : tooltipPosition === 'left'
                  ? 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800'
                  : 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800'
              }`}
            />
          </div>
        )}
      </button>
    </div>
  );
}

// Simplified version for use in tight spaces
export function WishlistHeartMini({ 
  hotelId, 
  className = '',
  onWishlistChange 
}: Pick<WishlistHeartProps, 'hotelId' | 'className' | 'onWishlistChange'>) {
  return (
    <WishlistHeart
      hotelId={hotelId}
      size={16}
      className={className}
      showTooltip={false}
      onWishlistChange={onWishlistChange}
    />
  );
}

// Version for card overlays
export function WishlistHeartOverlay({ 
  hotelId, 
  className = '',
  onWishlistChange 
}: Pick<WishlistHeartProps, 'hotelId' | 'className' | 'onWishlistChange'>) {
  return (
    <div className={`absolute top-2 right-2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full shadow-md transition-colors ${className}`}>
      <WishlistHeart
        hotelId={hotelId}
        size={18}
        tooltipPosition="left"
        onWishlistChange={onWishlistChange}
      />
    </div>
  );
}