'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Filter, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { Room } from '@/types/api';
import { ApiService } from '@/services/api';
import RoomCard from '@/components/rooms/RoomCard';
import Header1 from '@/components/header/Header1';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

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
  const { t } = useHydratedTranslation();
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
            <h3 className="text-2xl font-bold text-gray-900">{t('booking.confirmed', 'Захиалга баталгаажлаа!')}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">{t('booking.bookingCode', 'Захиалгын код')}:</span> {bookingResult.booking_code}</p>
              <p><span className="font-medium">{t('booking.pinCode', 'PIN код')}:</span> {bookingResult.pin_code}</p>
              <p className="text-gray-600">{bookingResult.message}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/booking/manage?code=${bookingResult.booking_code}&pin=${bookingResult.pin_code}`}
                className="flex-1 bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                {t('booking.manageBooking', 'Захиалга удирдах')}
              </Link>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {t('common.close', 'Хаах')}
              </button>
            </div>
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
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">{room.room_Description}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-600">Check-in:</span>
              <div className="font-medium">{new Date(checkIn).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Check-out:</span>
              <div className="font-medium">{new Date(checkOut).toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Rooms
            </label>
            <select
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              {Array.from({ length: Math.min(available, 5) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {t('hotel.rooms', 'өрөө')} ({available} {t('hotelRooms.available', 'боломжтой')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.fullName', 'Бүтэн нэр')} *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder={t('booking.namePlaceholder', 'Нэрээ оруулна уу')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.phone', 'Утасны дугаар')} *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder={t('booking.phonePlaceholder', 'Утасны дугаараа оруулна уу')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.email', 'Имэйл хаяг')} *
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder={t('booking.emailPlaceholder', 'email@example.com')}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel', 'Цуцлах')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? t('common.loading', 'Ачаалж байна...') : t('booking.confirmBooking', 'Захиалга баталгаажуулах')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function HotelRoomsContent() {
  const { t } = useHydratedTranslation();
  const params = useParams();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'size' | 'capacity'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'bathroom'>('all');

  const hotelId = Number(params.id);
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await ApiService.getRoomsInHotel(hotelId);
        setRooms(roomsData);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
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
          return (a.room_number ?? 0) - (b.room_number ?? 0); // Sort by room number as proxy for price
      }
    });

  if (loading) {
    return (
      <>
        <Header1 />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header1 />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/hotel/${hotelId}`}
              className="inline-flex items-center gap-2 text-slate-900 hover:text-slate-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('hotelRooms.backToHotel', 'Буцах')}
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('hotelRooms.availableRooms', 'Боломжтой өрөөнүүд')}
                </h1>
                {checkIn && checkOut && (
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Filters and Sorting */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'available' | 'bathroom')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="all">{t('hotelRooms.allRooms', 'Бүх өрөө')}</option>
                    <option value="available">{t('hotelRooms.availableOnly', 'Зөвхөн боломжтой')}</option>
                    <option value="bathroom">{t('hotelRooms.withBathroom', 'Угаалгын өрөөтэй')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price' | 'size' | 'capacity')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="price">{t('hotelRooms.sortByPrice', 'Үнээр эрэмбэлэх')}</option>
                    <option value="size">{t('hotelRooms.sortBySize', 'Хэмжээгээр')}</option>
                    <option value="capacity">{t('hotelRooms.sortByCapacity', 'Багтаамжаар')}</option>
                  </select>
                </div>
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
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{t('hotelRooms.noRoomsFound', 'Өрөө олдсонгүй')}</h3>
              <p className="text-gray-600">{t('hotelRooms.tryAdjustingFilters', 'Шүүлтүүр эсвэл огноог өөрчилж үзнэ үү.')}</p>
            </div>
          )}
        </div>
      </div>

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

export default function HotelRoomsPage() {
  return (
    <Suspense fallback={
      <>
        <Header1 />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    }>
      <HotelRoomsContent />
    </Suspense>
  );
}