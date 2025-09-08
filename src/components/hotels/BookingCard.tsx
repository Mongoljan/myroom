'use client';

import { useState, useEffect } from 'react';
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
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-6">
        {loadingPrices ? (
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-900">Үнэ ачаалж байна...</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">₮{formatPrice(currentPrice)}</span>
              <span className="text-gray-800">/ {t('night', 'шөнө')}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-900 line-through">₮{formatPrice(basePrice)}</span>
                <span className="text-green-600 text-sm font-medium">
                  {t('save', 'Хэмнэх')} ₮{formatPrice(savings)}
                </span>
              </div>
            )}
            {selectedRoomPrice && finalPrice && (
              <div className="text-xs text-gray-800 mt-1">
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
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm transition-all duration-200"
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
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('check_out', 'Check Out')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('guests', 'Guests')}</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white transition-all duration-200"
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
        <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
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

      <div>
        <button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {t('quick_book', 'Reserve Now')}
        </button>
      </div>

      <p className="text-xs text-gray-900 text-center mt-3">
        {t('free_cancellation', 'Free Cancellation')} • {t('no_prepayment', 'No Prepayment')}
      </p>
    </div>
  );
}