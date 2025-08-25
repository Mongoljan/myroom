'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, CreditCard, Loader2 } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { RoomPrice, FinalPrice } from '@/types/api';

interface Hotel {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
}

interface BookingCardProps {
  hotel: Hotel;
}

export default function BookingCard({ hotel }: BookingCardProps) {
  const { t } = useHydratedTranslation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomPrices, setRoomPrices] = useState<RoomPrice[]>([]);
  const [finalPrice, setFinalPrice] = useState<FinalPrice | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<RoomPrice | null>(null);

  // Fetch room prices when component mounts
  useEffect(() => {
    const fetchPrices = async () => {
      if (!hotel.id) return;
      
      setLoadingPrices(true);
      try {
        const prices = await ApiService.getRoomPrices(parseInt(hotel.id));
        setRoomPrices(prices);
        
        // Select the cheapest room by default
        if (prices.length > 0) {
          const cheapest = prices.reduce((min, price) => 
            price.base_price < min.base_price ? price : min
          );
          setSelectedRoomPrice(cheapest);
          
          // Get final price for the cheapest room
          const final = await ApiService.getFinalPrice(cheapest.id);
          setFinalPrice(final);
        }
      } catch (error) {
        console.error('Error fetching room prices:', error);
        // Use fallback price from hotel prop
        setSelectedRoomPrice(null);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
  }, [hotel.id]);

  // Update final price when selected room changes
  useEffect(() => {
    const updateFinalPrice = async () => {
      if (selectedRoomPrice) {
        try {
          const final = await ApiService.getFinalPrice(selectedRoomPrice.id);
          setFinalPrice(final);
        } catch (error) {
          console.error('Error fetching final price:', error);
        }
      }
    };

    if (selectedRoomPrice) {
      updateFinalPrice();
    }
  }, [selectedRoomPrice]);

  const handleBooking = () => {
    console.log('Booking hotel:', hotel.id, 'with room price:', selectedRoomPrice);
  };

  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  
  // Use real pricing data if available, otherwise fallback to hotel.price
  const currentPrice = finalPrice?.final_price || selectedRoomPrice?.base_price || hotel.price;
  const basePrice = selectedRoomPrice?.base_price || hotel.price;
  const totalPrice = currentPrice * nights;
  const savings = basePrice > currentPrice ? (basePrice - currentPrice) * nights : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        {loadingPrices ? (
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Үнэ ачаалж байна...</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">₮{formatPrice(currentPrice)}</span>
              <span className="text-muted-foreground">/ {t('night', 'шөнө')}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground line-through">₮{formatPrice(basePrice)}</span>
                <span className="text-green-600 text-sm font-medium">
                  {t('save', 'Хэмнэх')} ₮{formatPrice(savings)}
                </span>
              </div>
            )}
            {selectedRoomPrice && finalPrice && (
              <div className="text-xs text-gray-500 mt-1">
                Үндсэн үнэ: ₮{formatPrice(selectedRoomPrice.base_price)} → Эцсийн үнэ: ₮{formatPrice(finalPrice.final_price)}
              </div>
            )}
          </>
        )}

        {/* Room Selection */}
        {roomPrices.length > 1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Өрөө сонгох</label>
            <select
              value={selectedRoomPrice?.id || ''}
              onChange={(e) => {
                const selected = roomPrices.find(price => price.id === parseInt(e.target.value));
                setSelectedRoomPrice(selected || null);
              }}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm transition-all duration-200"
            >
              {roomPrices.map((price) => (
                <option key={price.id} value={price.id}>
                  Өрөө #{price.room_type} - ₮{formatPrice(price.base_price)}/шөнө
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {/* Check-in/Check-out */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">{t('check_in', 'Check In')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('check_out', 'Check Out')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('guests', 'Guests')}</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t('guest', 'Guest') : t('guests', 'Guests')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {checkIn && checkOut && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>₮{formatPrice(currentPrice)} × {nights} {nights === 1 ? t('night', 'шөнө') : t('nights', 'шөнө')}</span>
            <span>₮{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('taxes_fees', 'Татвар ба төлбөр')}</span>
            <span>₮25,000</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t('savings', 'Хэмнэлт')}</span>
              <span>-₮{formatPrice(savings)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>{t('total', 'Нийт дүн')}</span>
            <span>₮{formatPrice(totalPrice + 25000 - savings)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Link
          href={`/hotel/${hotel.id}/rooms?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {t('view_rooms', 'View Available Rooms')}
        </Link>
        
        <button
          onClick={handleBooking}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
        >
          <CreditCard className="w-4 h-4" />
          {t('quick_book', 'Quick Book')}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        {t('free_cancellation', 'Free Cancellation')} • {t('no_prepayment', 'No Prepayment')}
      </p>
    </div>
  );
}