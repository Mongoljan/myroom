'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useToast } from './ToastContainer';

interface WishlistButtonProps {
  hotelId: string;
  className?: string;
}

export default function WishlistButton({ hotelId, className = '' }: WishlistButtonProps) {
  const { t } = useHydratedTranslation();
  const { addToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if hotel is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(hotelId));
  }, [hotelId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      let newWishlist;
      
      if (isWishlisted) {
        newWishlist = wishlist.filter((id: string) => id !== hotelId);
      } else {
        newWishlist = [...wishlist, hotelId];
      }
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(!isWishlisted);
      
      // Show toast notification
      addToast({
        type: 'success',
        title: isWishlisted ? t('common.removeFromWishlist', 'Remove from Wishlist') : t('common.addToWishlist', 'Add to Wishlist'),
        message: isWishlisted ? 'Hotel removed from your wishlist' : 'Hotel added to your wishlist',
        duration: 3000
      });
      
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`
        p-2 rounded-full transition-all duration-200 
        ${isWishlisted 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-gray-800 hover:bg-white hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        ${className}
      `}
      title={isWishlisted ? t('common.removeFromWishlist', 'Remove from Wishlist') : t('common.addToWishlist', 'Add to Wishlist')}
    >
      <Heart 
        className={`w-5 h-5 transition-all ${
          isWishlisted ? 'fill-current' : ''
        }`} 
      />
    </button>
  );
}