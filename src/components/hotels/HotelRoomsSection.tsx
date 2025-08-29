'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, Users } from 'lucide-react';
import { Room } from '@/types/api';
import { ApiService } from '@/services/api';
import RoomCard from '@/components/rooms/RoomCard';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelRoomsSectionProps {
  hotelId: number;
  checkIn?: string;
  checkOut?: string;
}

interface BookingModalProps {
  room: Room | null;
  available: number;
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  hotelId: number;
}

function BookingModal({ room, available, isOpen, onClose, checkIn, checkOut, hotelId }: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    message: string;
    booking_code: string;
    pin_code: string;
  } | null>(null);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    setLoading(true);
    try {
      const result = await ApiService.createBooking({
        hotel_id: hotelId,
        check_in: checkIn,
        check_out: checkOut,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        rooms: [{
          room_category_id: room.room_category,
          room_type_id: room.room_type,
          room_count: roomCount,
        }]
      });
      
      setBookingResult(result);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Booking Code:</span> {bookingResult.booking_code}</p>
              <p><span className="font-medium">PIN Code:</span> {bookingResult.pin_code}</p>
              <p className="text-gray-800">{bookingResult.message}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Book Room {room.room_number}</h2>
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-800 mt-1">{room.room_Description}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-800">Check-in:</span>
              <div className="font-medium">{new Date(checkIn).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-800">Check-out:</span>
              <div className="font-medium">{new Date(checkOut).toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Number of Rooms
            </label>
            <select
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: Math.min(available, 5) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} room{num > 1 ? 's' : ''} (of {available} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function HotelRoomsSection({ hotelId, checkIn = '', checkOut = '' }: HotelRoomsSectionProps) {
  const { t } = useHydratedTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'size' | 'capacity'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'bathroom'>('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await ApiService.getRoomsInHotel(hotelId);
        setRooms(roomsData);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        // Set empty rooms array on error
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const handleBookRoom = (room: Room, available: number) => {
    setSelectedRoom(room);
    setAvailableCount(available);
    setShowBookingModal(true);
  };

  const filteredAndSortedRooms = rooms
    .filter(room => {
      if (filterBy === 'bathroom') return room.is_Bathroom;
      return true; // 'all' and 'available' filtering handled by RoomCard
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'size':
          return parseFloat(b.room_size) - parseFloat(a.room_size);
        case 'capacity':
          return (b.adultQty + b.childQty) - (a.adultQty + a.childQty);
        case 'price':
        default:
          return a.room_number - b.room_number; // Sort by room number as proxy for price
      }
    });

  if (loading) {
    return (
      <section className="py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('hotel.roomsAndRates', 'Rooms & Rates')}
          </h2>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('hotel.roomsAndRates', 'Rooms & Rates')}
            </h2>
            {checkIn && checkOut && (
              <div className="flex items-center gap-4 text-gray-800">
                <span>{new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}</span>
              </div>
            )}
            <p className="text-gray-800 mt-1">
              {filteredAndSortedRooms.length} rooms available
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-900" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'available' | 'bathroom')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Rooms</option>
                <option value="available">Available Only</option>
                <option value="bathroom">With Bathroom</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-900" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'size' | 'capacity')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Sort by Price</option>
                <option value="size">Sort by Size</option>
                <option value="capacity">Sort by Capacity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredAndSortedRooms.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredAndSortedRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RoomCard
                  room={room}
                  hotelId={hotelId}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onBook={handleBookRoom}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-900 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-800">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoom}
        available={availableCount}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedRoom(null);
        }}
        checkIn={checkIn}
        checkOut={checkOut}
        hotelId={hotelId}
      />
    </>
  );
}