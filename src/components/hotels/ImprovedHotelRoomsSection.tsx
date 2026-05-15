'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bed, Calendar } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { ApiService } from '@/services/api';
import { CancellationFee } from '@/types/api';
import { RoomPriceOptions, BookingItem } from './RoomCard';
import TripComStyleRoomCard from './TripComStyleRoomCard';
import BookingSummary from './BookingSummary';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import DateRangePicker from '@/components/common/DateRangePicker';

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

  // Guest state — no router.push on every keystroke (fixes lag bug)
  const [adultsCount, setAdultsCount] = useState(Math.max(1, parseInt(searchParams.get('adults') || '2', 10)));
  const [childrenCountLocal, setChildrenCountLocal] = useState(Math.max(0, parseInt(searchParams.get('children') || '0', 10)));

  // State
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [roomPrices, setRoomPrices] = useState<Record<string, RoomPriceOptions>>({});
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellationFee, setCancellationFee] = useState<CancellationFee | null>(null);

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

  // Unified search — only pushes to URL when user explicitly clicks Search
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('check_in', selectedCheckIn);
    params.set('check_out', selectedCheckOut);
    params.set('adults', adultsCount.toString());
    params.set('children', childrenCountLocal.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setBookingItems([]);
  };

  // Load rooms and prices
  useEffect(() => {
    const loadRoomsAndPrices = async () => {
      try {
        setLoading(true);

        // Load enriched room data and property policy in parallel
        const [roomsData, policies] = await Promise.all([
          hotelRoomsService.getEnrichedHotelRooms(hotelId, effectiveCheckIn, effectiveCheckOut),
          ApiService.getPropertyPolicies(hotelId).catch(() => []),
        ]);
        setRooms(roomsData);
        if (policies.length > 0 && policies[0].cancellation_fee) {
          setCancellationFee(policies[0].cancellation_fee);
        }

        // Build price data from room's own price_breakdown (new API structure)
        const pricesData: Record<string, RoomPriceOptions> = {};

        roomsData.forEach(room => {
          const key = `${room.room_type}-${room.room_category}`;
          
          // Use price_breakdown from the room API response
          if (room.price_breakdown && room.price_breakdown.final_customer_price > 0) {
            const { base_price, final_customer_price, hotel_discount_amount } = room.price_breakdown;
            
            // Price structure:
            // - base_price: Base room price (strikethrough price)
            // - hotel_discount_amount: The discount amount from our contract with hotel
            // - final_customer_price: What customer actually pays (main displayed price)
            
            // Calculate discount percentage: (base_price - final_customer_price) / base_price * 100
            const discountPercent = base_price > 0 
              ? Math.round(((base_price - final_customer_price) / base_price) * 100)
              : 0;
            
            pricesData[key] = {
              basePrice: final_customer_price, // Customer-facing price (what they pay)
              basePriceRaw: base_price, // Original price for strikethrough display
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
      } finally {
        setLoading(false);
      }
    };

    loadRoomsAndPrices();
  }, [hotelId, effectiveCheckIn, effectiveCheckOut]);

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
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="flex gap-4">
                <div className="w-48 h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter available rooms with pricing - use rooms_possible (date-specific) when available, else number_of_rooms_to_sell
  const availableRooms = rooms.filter(room => {
    // rooms_possible is populated when dates are passed to the API; it reflects actual date availability.
    // Fall back to number_of_rooms_to_sell (total inventory) when rooms_possible is 0/absent.
    const effectiveAvailability = room.rooms_possible > 0 ? room.rooms_possible : room.number_of_rooms_to_sell;
    const hasInventory = effectiveAvailability > 0;
    
    // Use the new hasValidPricing flag from enriched room data
    // This checks if room.price_breakdown.final_customer_price > 0
    const hasValidPricing = room.hasValidPricing;

    // MUST have BOTH inventory AND valid pricing from price_breakdown
    return hasInventory && hasValidPricing;
  });

  if (availableRooms.length === 0) {
    return (
      <div className="flex items-center justify-between min-h-100">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <Bed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{t('hotelRooms.noRoomsAvailable', 'No rooms available')}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {t('hotelRooms.loaded', 'Loaded')} {rooms.length} {t('hotelRooms.roomsLoaded', 'room(s), but none meet availability criteria.')}
            </p>
            <p className="text-gray-500 dark:text-gray-400">{t('hotelRooms.tryDifferentDates', 'Please try different dates or contact the hotel directly.')}</p>
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
      {/* Room Search Bar — matches SearchHeader style */}
      <div className="mb-6 bg-white dark:bg-gray-800 border border-primary rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
          {/* Date Range */}
          <div className="flex-1 p-2.5">
            <div className="flex items-center">
              <Calendar className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 mr-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  {t('search.dateLabel', 'Орох - Гарах')}
                </div>
                <DateRangePicker
                  checkIn={selectedCheckIn}
                  checkOut={selectedCheckOut}
                  onDateChange={(ci, co) => {
                    setSelectedCheckIn(ci);
                    setSelectedCheckOut(co);
                    updateURLWithDates(ci, co);
                    setBookingItems([]);
                  }}
                  minimal={true}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="p-2.5 lg:shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('hotelRooms.adults', 'Том хүн')}</div>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                  <button type="button" onClick={() => setAdultsCount(c => Math.max(1, c - 1))} className="px-2.5 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium text-base leading-none select-none">−</button>
                  <span className="min-w-8 text-center text-sm font-semibold text-gray-900 dark:text-white select-none">{adultsCount}</span>
                  <button type="button" onClick={() => setAdultsCount(c => Math.min(10, c + 1))} className="px-2.5 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium text-base leading-none select-none">+</button>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('hotelRooms.children', 'Хүүхэд')}</div>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                  <button type="button" onClick={() => setChildrenCountLocal(c => Math.max(0, c - 1))} className="px-2.5 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium text-base leading-none select-none">−</button>
                  <span className="min-w-8 text-center text-sm font-semibold text-gray-900 dark:text-white select-none">{childrenCountLocal}</span>
                  <button type="button" onClick={() => setChildrenCountLocal(c => Math.min(10, c + 1))} className="px-2.5 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium text-base leading-none select-none">+</button>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  {t('search.title', 'Хайх')}
                </button>
              </div>
            </div>
          </div>
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
                cancellationFee={cancellationFee}
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