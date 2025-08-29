'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { ApiService, CreateBookingRequest } from '@/services/api';
import { EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: EnrichedHotelRoom;
  hotelName: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface BookingForm {
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_address: string;
  special_requests: string;
  adults: number;
  children: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  room,
  hotelName,
  checkIn,
  checkOut,
  guests = 2
}: BookingModalProps) {
  const { t } = useHydratedTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const [form, setForm] = useState<BookingForm>({
    guest_first_name: '',
    guest_last_name: '',
    guest_email: '',
    guest_phone: '',
    guest_address: '',
    special_requests: '',
    adults: Math.max(1, guests - 1),
    children: Math.max(0, guests - Math.max(1, guests - 1))
  });

  // Calculate dates and pricing
  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date(Date.now() + 24*60*60*1000);
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const basePrice = 150000; // Default room price per night
  const totalPrice = basePrice * nights;

  const handleInputChange = (field: keyof BookingForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.guest_first_name.trim()) {
      setError('Нэрээ оруулна уу');
      return false;
    }
    if (!form.guest_last_name.trim()) {
      setError('Овгоо оруулна уу');
      return false;
    }
    if (!form.guest_email.trim() || !form.guest_email.includes('@')) {
      setError('Зөв имэйл хаяг оруулна уу');
      return false;
    }
    if (!form.guest_phone.trim()) {
      setError('Утасны дугаар оруулна уу');
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const bookingData: CreateBookingRequest = {
        hotel_id: room.hotel,
        room_type_id: room.room_type,
        room_category_id: room.room_category,
        check_in: checkIn || new Date().toISOString().split('T')[0],
        check_out: checkOut || new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
        adults: form.adults,
        children: form.children,
        guest_first_name: form.guest_first_name,
        guest_last_name: form.guest_last_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        guest_address: form.guest_address,
        special_requests: form.special_requests
      };

      const result = await ApiService.createBooking(bookingData);
      setBookingResult(result);
      setStep(3); // Success step
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setError(null);
    setBookingResult(null);
    setForm({
      guest_first_name: '',
      guest_last_name: '',
      guest_email: '',
      guest_phone: '',
      guest_address: '',
      special_requests: '',
      adults: Math.max(1, guests - 1),
      children: Math.max(0, guests - Math.max(1, guests - 1))
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 1 ? 'Захиалгын мэдээлэл' : 
                 step === 2 ? 'Зочны мэдээлэл' : 
                 'Захиалга амжилттай'}
              </h2>
              <p className="text-gray-800 text-sm mt-1">
                {hotelName} - {room.roomCategoryName}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {step === 1 && (
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Захиалгын дэлгэрэнгүй</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Өрөө:</span>
                      <span>{room.roomCategoryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Орох өдөр:</span>
                      <span>{checkInDate.toLocaleDateString('mn-MN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Гарах өдөр:</span>
                      <span>{checkOutDate.toLocaleDateString('mn-MN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Хоног:</span>
                      <span>{nights} хоног</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Зочдын тоо:</span>
                      <span>{form.adults} насанд хүрсэн, {form.children} хүүхэд</span>
                    </div>
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Нийт дүн:</span>
                        <span>{totalPrice.toLocaleString()}₮</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Count Adjustment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Зочдын тоо</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Насанд хүрсэн
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('adults', Math.max(1, form.adults - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{form.adults}</span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('adults', Math.min(room.adultQty, form.adults + 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Хүүхэд
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('children', Math.max(0, form.children - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{form.children}</span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('children', Math.min(room.childQty, form.children + 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Нэр *
                    </label>
                    <input
                      type="text"
                      value={form.guest_first_name}
                      onChange={(e) => handleInputChange('guest_first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                      placeholder="Таны нэр"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Овог *
                    </label>
                    <input
                      type="text"
                      value={form.guest_last_name}
                      onChange={(e) => handleInputChange('guest_last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                      placeholder="Таны овог"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Имэйл хаяг *
                  </label>
                  <input
                    type="email"
                    value={form.guest_email}
                    onChange={(e) => handleInputChange('guest_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    value={form.guest_phone}
                    onChange={(e) => handleInputChange('guest_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                    placeholder="99112233"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Гэрийн хаяг
                  </label>
                  <input
                    type="text"
                    value={form.guest_address}
                    onChange={(e) => handleInputChange('guest_address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                    placeholder="Гэрийн хаяг"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Тусгай хүсэлт
                  </label>
                  <textarea
                    value={form.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                    placeholder="Та тусгай хүсэлт байвал энд бичнэ үү..."
                  />
                </div>
              </div>
            )}

            {step === 3 && bookingResult && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Захиалга амжилттай!</h3>
                <div className="bg-green-100 border border-green-300 rounded-xl p-4">
                  <p className="text-green-800 mb-2">
                    <strong>Захиалгын код:</strong> {bookingResult.booking_code}
                  </p>
                  <p className="text-green-800">
                    <strong>PIN код:</strong> {bookingResult.pin_code}
                  </p>
                </div>
                <p className="text-gray-800 text-sm">
                  Захиалгын баталгаа таны имэйл хаяг руу илгээгдлээ. Захиалгын мэдээллийг шалгахын тулд дээрх кодыг хадгалж аваарай.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-100">
            <div className="flex items-center justify-between">
              {step < 3 && (
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>
              )}
              
              <div className="flex space-x-3 ml-auto">
                {step === 1 && (
                  <>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-800 hover:text-gray-800 transition-colors"
                    >
                      Цуцлах
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Үргэлжлүүлэх
                    </button>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-gray-800 hover:text-gray-800 transition-colors"
                    >
                      Буцах
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Захиалж байна...
                        </>
                      ) : (
                        'Захиалга өгөх'
                      )}
                    </button>
                  </>
                )}
                
                {step === 3 && (
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Дуусгах
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}