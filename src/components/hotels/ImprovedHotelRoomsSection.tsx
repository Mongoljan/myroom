'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bed } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { ApiService } from '@/services/api';
import { RoomPrice } from '@/types/api';
import RoomCard, { RoomPriceOptions, BookingItem } from './RoomCard';
import BookingSummary from './BookingSummary';

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
  const router = useRouter();

  // Provide fallback dates if not provided
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const effectiveCheckIn = checkIn || today.toISOString().split('T')[0];
  const effectiveCheckOut = checkOut || tomorrow.toISOString().split('T')[0];

  // State
  const [rooms, setRooms] = useState<EnrichedHotelRoom[]>([]);
  const [roomPrices, setRoomPrices] = useState<Record<string, RoomPriceOptions>>({});
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load rooms and prices
  useEffect(() => {
    const loadRoomsAndPrices = async () => {
      try {
        setLoading(true);

        // Load enriched room data
        const roomsData = await hotelRoomsService.getEnrichedHotelRooms(hotelId);
        console.log(`Loaded ${roomsData.length} rooms for hotel ${hotelId}:`, roomsData);
        setRooms(roomsData);

        // Load price data by hotel (not individual room)
        const pricesData: Record<string, RoomPriceOptions> = {};

        try {
          console.log(`Fetching prices for hotel ${hotelId}...`);
          // Use hotel-level API instead of room-level
          const prices: RoomPrice[] = await ApiService.getRoomPrices(hotelId);
          console.log(`Hotel ${hotelId} prices:`, prices);

          // Map prices by room_type + room_category
          prices.forEach(price => {
            const key = `${price.room_type}-${price.room_category}`;
            pricesData[key] = {
              basePrice: price.base_price,
              halfDayPrice: price.half_day_price && price.half_day_price > 0 ? price.half_day_price : undefined,
              singlePersonPrice: price.single_person_price && price.single_person_price > 0 ? price.single_person_price : undefined
            };
            console.log(`Mapped price for room_type ${price.room_type}, room_category ${price.room_category}:`, pricesData[key]);
          });
        } catch (error) {
          console.error(`Failed to fetch prices for hotel ${hotelId}:`, error);
        }

        console.log('Final price data:', pricesData);

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
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
        </div>
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

  // Filter available rooms with pricing - BOTH inventory AND price required
  const availableRooms = rooms.filter(room => {
    const hasInventory = room.number_of_rooms_to_sell > 0;
    const priceKey = `${room.room_type}-${room.room_category}`;
    const hasPrice = roomPrices[priceKey]?.basePrice && roomPrices[priceKey].basePrice > 0;

    // Debug logging
    console.log(`Room ${room.id} (${room.roomTypeName}) [type:${room.room_type}, cat:${room.room_category}]: inventory=${room.number_of_rooms_to_sell}, hasPrice=${!!hasPrice}, priceKey=${priceKey}, price=${roomPrices[priceKey]?.basePrice}`);

    // MUST have BOTH inventory AND valid pricing
    return hasInventory && hasPrice;
  });

  if (availableRooms.length === 0) {
    return (
      <div className="flex items-center justify-between min-h-[400px]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <Bed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">No rooms available</p>
            <p className="text-gray-500">
              Loaded {rooms.length} room{rooms.length !== 1 ? 's' : ''}, but none meet availability criteria.
            </p>
            <p className="text-gray-500">Please try different dates or contact the hotel directly.</p>
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
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
        <div className="text-sm text-gray-600">
          {new Date(effectiveCheckIn).toLocaleDateString()} - {new Date(effectiveCheckOut).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Rooms List */}
        <div className="flex-1">
          <div className="space-y-6">
            {availableRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                priceOptions={roomPrices[`${room.room_type}-${room.room_category}`]}
                bookingItems={bookingItems.filter(item => item.room.id === room.id)}
                onQuantityChange={(priceType, quantity) => updateRoomQuantity(room, priceType, quantity)}
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