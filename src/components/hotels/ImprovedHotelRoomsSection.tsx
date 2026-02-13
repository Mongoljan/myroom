'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bed } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { RoomPriceOptions, BookingItem } from './RoomCard';
import TripComStyleRoomCard from './TripComStyleRoomCard';
import BookingSummary from './BookingSummary';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface ImprovedHotelRoomsSectionProps {
  hotelId: number;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function ImprovedHotelRoomsSection({
  hotelId,
  hotelName = 'Hotel',
  checkIn,
  checkOut
}: ImprovedHotelRoomsSectionProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Provide fallback dates if not provided
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Date state (editable)
  const [selectedCheckIn, setSelectedCheckIn] = useState(checkIn || today.toISOString().split('T')[0]);
  const [selectedCheckOut, setSelectedCheckOut] = useState(checkOut || tomorrow.toISOString().split('T')[0]);

  const effectiveCheckIn = selectedCheckIn;
  const effectiveCheckOut = selectedCheckOut;

  // State
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [roomPrices, setRoomPrices] = useState<Record<string, RoomPriceOptions>>({});
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Update URL when dates change
  const updateURLWithDates = (newCheckIn: string, newCheckOut: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('check_in', newCheckIn);
    params.set('check_out', newCheckOut);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle date changes
  const handleCheckInChange = (date: string) => {
    setSelectedCheckIn(date);
    // If check-out is before new check-in, update it
    if (new Date(date) >= new Date(selectedCheckOut)) {
      const newCheckOut = new Date(date);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      const newCheckOutStr = newCheckOut.toISOString().split('T')[0];
      setSelectedCheckOut(newCheckOutStr);
      updateURLWithDates(date, newCheckOutStr);
    } else {
      updateURLWithDates(date, selectedCheckOut);
    }
    // Clear booking items when dates change
    setBookingItems([]);
  };

  const handleCheckOutChange = (date: string) => {
    setSelectedCheckOut(date);
    updateURLWithDates(selectedCheckIn, date);
    // Clear booking items when dates change
    setBookingItems([]);
  };

  // Load rooms and prices
  useEffect(() => {
    const loadRoomsAndPrices = async () => {
      try {
        setLoading(true);

        // Load enriched room data (now includes price_breakdown directly from API)
        const roomsData = await hotelRoomsService.getEnrichedHotelRooms(hotelId);
        setRooms(roomsData);

        // Build price data from room's own price_breakdown (new API structure)
        const pricesData: Record<string, RoomPriceOptions> = {};

        roomsData.forEach(room => {
          const key = `${room.room_type}-${room.room_category}`;
          
          // Use price_breakdown from the room API response
          if (room.price_breakdown && room.price_breakdown.final_customer_price > 0) {
            const { price_after_price_setting, final_customer_price, hotel_discount_amount } = room.price_breakdown;
            
            // Price structure:
            // - price_after_price_setting: Price after hotel's internal adjustments (strikethrough price)
            // - hotel_discount_amount: The discount amount from our contract with hotel
            // - final_customer_price: What customer actually pays (main displayed price)
            
            // Calculate discount percentage: (price_after_price_setting - final_customer_price) / price_after_price_setting * 100
            const discountPercent = price_after_price_setting > 0 
              ? Math.round(((price_after_price_setting - final_customer_price) / price_after_price_setting) * 100)
              : 0;
            
            pricesData[key] = {
              basePrice: final_customer_price, // Customer-facing price (what they pay)
              basePriceRaw: price_after_price_setting, // Original price for strikethrough display
              halfDayPrice: room.half_day_price && room.half_day_price > 0 ? room.half_day_price : undefined,
              singlePersonPrice: room.single_person_price && room.single_person_price > 0 ? room.single_person_price : undefined,
              discount: hotel_discount_amount > 0 ? {
                type: 'PERCENT' as const,
                value: discountPercent
              } : undefined,
              priceBreakdown: room.price_breakdown // Include full breakdown for detailed display
            };
          }
        });

        setRoomPrices(pricesData);
      } catch (error) {
        console.error('Failed to load rooms and prices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoomsAndPrices();
  }, [hotelId]);

  // Booking management
  const updateRoomQuantity = (room: EnrichedHotelRoom, priceType: 'base' | 'halfDay' | 'singlePerson', quantity: number) => {
    if (quantity === 0) {
      // Remove item
      setBookingItems(prev =>
        prev.filter(item => !(item.room.id === room.id && item.priceType === priceType))
      );
    } else {
      // Add or update item
      const priceKey = `${room.room_type}-${room.room_category}`;
      const priceOptions = roomPrices[priceKey];
      if (!priceOptions) return;

      let price = priceOptions.basePrice;
      if (priceType === 'halfDay' && priceOptions.halfDayPrice) {
        price = priceOptions.halfDayPrice;
      } else if (priceType === 'singlePerson' && priceOptions.singlePersonPrice) {
        price = priceOptions.singlePersonPrice;
      }

      const newItem: BookingItem = {
        room,
        priceType,
        quantity,
        price,
        maxQuantity: room.number_of_rooms_to_sell
      };

      setBookingItems(prev => {
        const existingIndex = prev.findIndex(item =>
          item.room.id === room.id && item.priceType === priceType
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newItem;
          return updated;
        } else {
          return [...prev, newItem];
        }
      });
    }
  };

  const handleQuantityChange = (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson', quantity: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoomQuantity(room, priceType, quantity);
    }
  };

  const handleRemoveRoom = (roomId: number, priceType: 'base' | 'halfDay' | 'singlePerson') => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoomQuantity(room, priceType, 0);
    }
  };


  // Calculate totals
  const getTotalRooms = () => bookingItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => bookingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get number of nights for display
  const getNumberOfNights = () => {
    const checkInDate = new Date(effectiveCheckIn);
    const checkOutDate = new Date(effectiveCheckOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Calculate number of nights
  const calculateNights = () => {
    const checkInDate = new Date(effectiveCheckIn);
    const checkOutDate = new Date(effectiveCheckOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // At least 1 night
  };

  // Handle booking
  const handleBookNow = () => {
    if (bookingItems.length === 0) return;

    const nights = calculateNights();

    // Prepare rooms data for booking page
    const roomsData = bookingItems.map(item => ({
      room_category_id: item.room.room_category,
      room_type_id: item.room.room_type,
      room_count: item.quantity,
      room_name: item.room.roomTypeName,
      price_per_night: item.price,
      total_price: item.price * item.quantity * nights
    }));

    // Calculate total price including nights
    const totalPriceWithNights = getTotalPrice() * nights;

    // Create URL params
    const params = new URLSearchParams({
      hotelId: hotelId.toString(),
      hotelName: hotelName,
      checkIn: effectiveCheckIn,
      checkOut: effectiveCheckOut,
      rooms: JSON.stringify(roomsData),
      totalPrice: totalPriceWithNights.toString(),
      totalRooms: getTotalRooms().toString(),
      nights: nights.toString()
    });

    router.push(`/booking?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="flex gap-4">
                <div className="w-48 h-32 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter available rooms with pricing - BOTH inventory AND valid price_breakdown required
  const availableRooms = rooms.filter(room => {
    const hasInventory = room.number_of_rooms_to_sell > 0;
    
    // Use the new hasValidPricing flag from enriched room data
    // This checks if room.price_breakdown.final_customer_price > 0
    const hasValidPricing = room.hasValidPricing;

    // MUST have BOTH inventory AND valid pricing from price_breakdown
    return hasInventory && hasValidPricing;
  });

  if (availableRooms.length === 0) {
    return (
      <div className="flex items-center justify-between min-h-[400px]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <Bed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">{t('hotelRooms.noRoomsAvailable', 'No rooms available')}</p>
            <p className="text-gray-500">
              {t('hotelRooms.loaded', 'Loaded')} {rooms.length} {t('hotelRooms.roomsLoaded', 'room(s), but none meet availability criteria.')}
            </p>
            <p className="text-gray-500">{t('hotelRooms.tryDifferentDates', 'Please try different dates or contact the hotel directly.')}</p>
          </div>
        </div>
        <div className="w-80">
          <BookingSummary
            items={bookingItems}
            totalRooms={getTotalRooms()}
            totalPrice={getTotalPrice()}
            checkIn={effectiveCheckIn}
            checkOut={effectiveCheckOut}
            nights={getNumberOfNights()}
            onQuantityChange={handleQuantityChange}
            onRemoveRoom={handleRemoveRoom}
            onBookNow={handleBookNow}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mini Search Form - Matches main search style */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Check-in Date */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              {t('hotelRooms.checkInDate', 'Нэвтрэх огноо')}
            </label>
            <input
              type="date"
              value={selectedCheckIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border-0 focus:outline-none text-gray-900"
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-200"></div>

          {/* Check-out Date */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              {t('hotelRooms.checkOutDate', 'Гарах огноо')}
            </label>
            <input
              type="date"
              value={selectedCheckOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              min={selectedCheckIn}
              className="w-full px-3 py-2 border-0 focus:outline-none text-gray-900"
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-200"></div>

          {/* Guests */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              {t('hotelRooms.guests', 'Зочид')}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('hotelRooms.adults', 'Том хүн')}:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={searchParams.get('adults') || 2}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('adults', e.target.value);
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('hotelRooms.children', 'Хүүхэд')}:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={searchParams.get('children') || 0}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('children', e.target.value);
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nights Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
          <span className="font-medium">{getNumberOfNights()} {getNumberOfNights() !== 1 ? t('roomCard.nights', 'шөнө') : t('roomCard.night', 'шөнө')}</span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Rooms List */}
        <div className="flex-1">
          <div className="space-y-4">
            {availableRooms.map((room) => (
              <TripComStyleRoomCard
                key={room.id}
                room={room}
                priceOptions={roomPrices[`${room.room_type}-${room.room_category}`]}
                bookingItems={bookingItems.filter(item => item.room.id === room.id)}
                onQuantityChange={(priceType, quantity) => updateRoomQuantity(room, priceType, quantity)}
                nights={getNumberOfNights()}
              />
            ))}
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="w-80">
          <BookingSummary
            items={bookingItems}
            totalRooms={getTotalRooms()}
            totalPrice={getTotalPrice()}
            checkIn={effectiveCheckIn}
            checkOut={effectiveCheckOut}
            nights={getNumberOfNights()}
            onQuantityChange={handleQuantityChange}
            onRemoveRoom={handleRemoveRoom}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

    </div>
  );
}