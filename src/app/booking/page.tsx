'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Bed,
  X
} from 'lucide-react';
import { BookingService } from '@/services/bookingApi';
import { CreateBookingRequest, CreateBookingResponse } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price: number;
}

export default function BookingPage() {
  const { t } = useHydratedTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract booking data from URL params
  const hotelId = parseInt(searchParams.get('hotelId') || '0');
  const hotelName = searchParams.get('hotelName') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const totalPrice = parseInt(searchParams.get('totalPrice') || '0');

  // Parse rooms data from URL
  const roomsData = searchParams.get('rooms');
  const [rooms, setRooms] = useState<BookingRoom[]>([]);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Booking state
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (roomsData) {
      try {
        const parsedRooms = JSON.parse(decodeURIComponent(roomsData));
        setRooms(parsedRooms);
      } catch (error) {
        console.error('Failed to parse rooms data:', error);
      }
    }
  }, [roomsData]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingInProgress(true);
    setBookingError(null);

    try {
      const bookingRequest: CreateBookingRequest = {
        hotel_id: hotelId,
        check_in: checkIn,
        check_out: checkOut,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        rooms: rooms.map(room => ({
          room_category_id: room.room_category_id,
          room_type_id: room.room_type_id,
          room_count: room.room_count
        }))
      };

      const result = await BookingService.createBooking(bookingRequest);
      setBookingResult(result);
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingError(error instanceof Error ? error.message : 'Захиалга үүсгэхэд алдаа гарлаа');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">
                  Захиалга амжилттай үүслээ!
                </h1>
                <p className="text-gray-600">
                  Таны захиалгыг амжилттай хүлээн авлаа. Дэлгэрэнгүй мэдээллийг и-мэйлээр илгээх болно.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Захиалгын код:</span>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      {bookingResult.booking_code}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">PIN код:</span>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      {bookingResult.pin_code}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Эдгээр кодуудыг хадгалж байгаарай. Захиалгаа шалгах, өөрчлөх, эсвэл цуцлахдаа ашиглана.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Нүүр хуудас руу буцах
                </button>
                <button
                  onClick={() => router.push('/booking/manage')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Захиалга удирдах
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Буцах
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Захиалга баталгаажуулах</h1>
          <p className="text-gray-600 mt-1">{hotelName}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Хэрэглэгчийн мэдээлэл</h2>

              {bookingError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Овог нэр *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      placeholder="Жишээ нь: Б.Болд"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Утасны дугаар *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      placeholder="99001122"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    И-мэйл хаяг *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    disabled={bookingInProgress}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    placeholder="example@email.com"
                  />
                </div>

                <div className="pt-6 border-t">
                  <button
                    type="submit"
                    disabled={bookingInProgress || !customerName || !customerPhone || !customerEmail}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingInProgress ? (
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5 animate-spin" />
                        Захиалж байна...
                      </div>
                    ) : (
                      'Захиалга баталгаажуулах'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Захиалгын дэлгэрэнгүй</h3>

              {/* Date Info */}
              {checkIn && checkOut && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Хугацаа</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    {new Date(checkIn).toLocaleDateString('mn-MN')} - {new Date(checkOut).toLocaleDateString('mn-MN')}
                  </div>
                </div>
              )}

              {/* Rooms */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900">Сонгосон өрөөнүүд:</h4>
                {rooms.map((room, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{room.room_name}</h5>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ₮{room.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          × {room.room_count} өрөө
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>2 зочин</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>1 ор</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Нийт үнэ:</span>
                  <span className="text-xl font-bold text-blue-600">₮{totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Татвар болон үйлчилгээний хөлс багтсан
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}