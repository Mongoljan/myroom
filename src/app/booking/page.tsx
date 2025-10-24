"use client";

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Phone } from 'lucide-react';
import { BookingService } from '@/services/bookingApi';
import { CreateBookingRequest, CreateBookingResponse } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
}

function BookingContent() {
  const { t } = useHydratedTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract booking data from URL params
  const hotelId = parseInt(searchParams.get('hotelId') || '0');
  const hotelName = searchParams.get('hotelName') || '';
  const urlCheckIn = searchParams.get('checkIn') || '';
  const urlCheckOut = searchParams.get('checkOut') || '';
  const urlTotalPrice = parseInt(searchParams.get('totalPrice') || '0');
  const urlNights = parseInt(searchParams.get('nights') || '1');

  // Parse rooms data from URL
  const roomsData = searchParams.get('rooms');
  const [rooms, setRooms] = useState<BookingRoom[]>([]);

  // Date state (read-only for display)
  const [checkIn] = useState(urlCheckIn);
  const [checkOut] = useState(urlCheckOut);
  const [nights, setNights] = useState(urlNights);
  const [totalPrice, setTotalPrice] = useState(urlTotalPrice);

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

  // Recalculate total when dates change
  useEffect(() => {
    const calculateNewTotal = () => {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const newNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      setNights(newNights);
      
      // Recalculate room totals and overall total
      const updatedRooms = rooms.map(room => ({
        ...room,
        total_price: room.price_per_night * room.room_count * newNights
      }));
      
      setRooms(updatedRooms);
      
      const newTotal = updatedRooms.reduce((sum, room) => {
        return sum + room.total_price;
      }, 0);
      
      setTotalPrice(newTotal);
    };

    if (checkIn && checkOut && rooms.length > 0) {
      calculateNewTotal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

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
      
      // Extract and format error message
      let errorMessage = t('errors.booking');
      
      if (error instanceof Error) {
        const apiError = error.message;
        
        // Check for specific error types and provide user-friendly messages
        if (apiError.includes('Duplicate entry') && apiError.includes('email')) {
          errorMessage = t('errors.duplicateEmail', 'Энэ имэйл хаягаар аль хэдийн захиалга үүсгэсэн байна. Өөр имэйл хаяг ашиглана уу.');
        } else if (apiError.includes('Duplicate entry')) {
          errorMessage = t('errors.duplicateBooking', 'Давхардсан захиалга. Та өөр мэдээлэл ашиглана уу.');
        } else if (apiError.includes('availability') || apiError.includes('available')) {
          errorMessage = t('errors.notAvailable', 'Сонгосон өрөө боломжгүй байна. Өөр өрөө сонгоно уу.');
        } else {
          // Show the actual API error message
          errorMessage = apiError;
        }
      }
      
      setBookingError(errorMessage);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (bookingResult) {
    const handlePrint = () => {
      window.print();
    };

    const handleDownloadPDF = () => {
      window.print();
    };

    return (
      <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto px-4 print:px-0 print:max-w-full">
          {/* Action Buttons - Hidden on print */}
          <div className="mb-4 flex justify-between items-center print:hidden">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← {t('bookingExtra.backHome', 'Буцах')}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {t('bookingExtra.print', 'Хэвлэх')}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('bookingExtra.downloadPDF', 'Татах')}
              </button>
            </div>
          </div>

          {/* Booking Confirmation Document */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-300"
            id="booking-confirmation"
          >
            {/* Success Header */}
            <div className="bg-white border-b-2 border-gray-900 px-6 py-6">
              <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
                {t('bookingExtra.confirmationTitle', 'Таны захиалга амжилттай баталгаажлаа. Баярлалаа.')}
              </h1>
              <p className="text-xs text-gray-600 text-center">
                {t('bookingExtra.confirmationSubtitle', 'Захиалгын мэдээллийг бид таны имэйл рүү илгээлээ. Та имэйлээ шалгаж үзнэ үү.')}
              </p>
            </div>

            {/* Main Content */}
            <div className="px-6 py-5">
              {/* Title */}
              <h2 className="text-sm font-semibold text-gray-900 mb-5">
                {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
              </h2>

              {/* Hotel Info */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">
                  {t('bookingExtra.hotelInfo', 'Захиалгын хуудас')}
                </h3>
                <div className="text-xs space-y-1">
                  <div>
                    <a href="#" className="text-blue-600 hover:underline font-medium">{hotelName}</a>
                  </div>
                  <div className="text-gray-700 flex items-start gap-1">
                    <svg className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Хаяг: Ўвс аймаг, Улаангом сум, 3-р хороо, 6-р баг</span>
                  </div>
                  <div className="text-gray-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span>+976 9995 4644</span>
                  </div>
                  <div className="text-gray-700 flex items-center gap-1">
                    <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>www.shangrilahotel.mn</span>
                  </div>
                  <div className="text-gray-700 flex items-center gap-1">
                    <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>szzoe1105@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">
                  {t('bookingExtra.bookingDetailsSection', 'Захиалгын дэлгэрэнгүй')}
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="text-gray-600 w-32">{t('bookingExtra.checkInLabel', 'Орох өдөр')}</span>
                    <span className="text-gray-900">
                      {new Date(checkIn).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}, Нам, 14:00 цагаас
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">{t('bookingExtra.checkOutLabel', 'Гарах өдөр')}</span>
                    <span className="text-gray-900">
                      {new Date(checkOut).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}, Нам, 14:00 цагаас
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">{t('bookingExtra.guests', 'Зочид')}</span>
                    <span className="text-gray-900">
                      {rooms.reduce((sum, room) => sum + room.room_count, 0)} том хүн, 2 хүүхэд
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">{t('bookingExtra.guestName', 'Захиалагч')}</span>
                    <span className="text-gray-900">
                      {customerName} / {customerPhone}, {customerEmail}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-32">{t('bookingExtra.bookingDateLabel', 'Захиалсан огноо')}</span>
                    <span className="text-gray-900">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Numbers */}
              <div className="mb-5 bg-gray-100 border border-gray-300 p-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600 mb-0.5">{t('bookingExtra.bookingNumber', 'Захиалгын №')}</div>
                    <div className="font-mono font-semibold text-sm text-gray-900">{bookingResult.booking_code}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-0.5">{t('bookingExtra.pinCodeLabel', 'PIN код')}</div>
                    <div className="font-mono font-semibold text-sm text-gray-900">{bookingResult.pin_code}</div>
                  </div>
                </div>
              </div>

              {/* Rooms Table */}
              <div className="mb-5">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="border border-gray-400 px-2 py-2 text-left font-medium">
                        {t('bookingExtra.bookingNumberCol', 'Захиалгын №')}
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-left font-medium">
                        {t('bookingExtra.roomTypeCol', 'Өрөө')}
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-right font-medium">
                        {t('bookingExtra.priceCol', '1 өрөөний үнэ')}
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center font-medium">
                        {t('bookingExtra.quantityCol', 'Тоо ш')}
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-right font-medium">
                        {t('bookingExtra.totalCol', 'Үнэ')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-2 font-mono text-gray-900">
                          {bookingResult.booking_ids?.[index] || `${bookingResult.booking_code}`}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-gray-900">
                          <div>{room.room_name} <span className="text-gray-500">(☾)</span></div>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right text-gray-900">
                          {room.price_per_night.toLocaleString()} ₮
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-gray-900">
                          {room.room_count}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right font-semibold text-gray-900">
                          {room.total_price.toLocaleString()} ₮
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan={4} className="border border-gray-300 px-2 py-2.5 text-right font-semibold text-gray-900">
                        {t('bookingExtra.totalAmount', 'Нийт үнэ')}
                      </td>
                      <td className="border border-gray-300 px-2 py-2.5 text-right font-bold text-base text-gray-900">
                        {totalPrice.toLocaleString()} ₮
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-gray-500 mt-1">*{t('bookingExtra.taxNote', 'НӨАТ багтсан үнэ')}</p>
              </div>

              {/* Additional Info */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">
                  {t('bookingExtra.additionalInfo', 'Нэмэлт мэдээлэл')}
                </h3>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p>{t('bookingExtra.infoLine1', 'Үнэгүй зогсоол')}</p>
                  <p>{t('bookingExtra.infoLine2', 'Free WiFi')}</p>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1.5 border-b border-gray-300">
                  {t('bookingExtra.cancellationPolicy', 'Цуцлах нөхцөл')}
                </h3>
                <div className="text-xs text-gray-700">
                  <p className="mb-1.5">{t('bookingExtra.policyLine1', '1 өрөө түтмын цуцлалтаас авах хураамж:')}</p>
                  <table className="border-collapse w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-2 py-1.5 text-left font-normal text-gray-700">
                          2/24-нээс өмнө
                        </th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left font-normal text-gray-700">
                          2/25-2/28-ны хооронд
                        </th>
                        <th className="border border-gray-300 px-2 py-1.5 text-left font-normal text-gray-700">
                          2/28-наас хойш
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-2 py-1.5 text-gray-700">75,000 ₮</td>
                        <td className="border border-gray-300 px-2 py-1.5 text-gray-700">375,000 ₮</td>
                        <td className="border border-gray-300 px-2 py-1.5 text-gray-700">
                          {t('bookingExtra.noCancellation', 'Цуцлах боломжгүй')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-600 border-t border-gray-300 pt-3 space-y-0.5">
                <p>{t('bookingExtra.footerNote1', 'Бидний сонгон үйлчлүүлж байгаад танд баярлалаа.')}</p>
                <p>{t('bookingExtra.footerNote2', 'Бид та бүхэнд үйлчлэх зэргээ улам бүр хялбар болгохоор зорин ажиллаж байна.')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-5 print:hidden">
              <div className="flex gap-2 pt-3 border-t border-gray-300">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 text-xs hover:bg-gray-50 transition-colors"
                >
                  {t('bookingExtra.goHome', 'Нүүр хуудас руу буцах')}
                </button>
                <button
                  onClick={() => router.push(`/booking/manage?code=${bookingResult.booking_code}&pin=${bookingResult.pin_code}`)}
                  className="flex-1 bg-gray-900 text-white py-2 px-4 text-xs hover:bg-gray-800 transition-colors"
                >
                  {t('bookingExtra.manageBooking', 'Захиалга удирдах')}
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
            {t('common.back')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('booking.confirmBooking')}</h1>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('booking.guestDetails')}</h2>

              {bookingError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        {t('errors.bookingFailed', 'Захиалга үүсгэх явцад алдаа гарлаа')}
                      </h3>
                      <p className="text-sm text-red-700">{bookingError}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('booking.firstName')} *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('booking.phone')} *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('booking.email')} *</label>
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
                        {t('bookingExtra.bookingInProgress')}
                      </div>
                    ) : (
                      t('bookingExtra.confirmCTA')
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('bookingExtra.detailsTitle')}</h3>

              {/* Date Info - Display Only */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">{t('bookingExtra.stayDates')}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-800">Check-in</span>
                    <span className="text-sm font-medium text-blue-900">
                      {new Date(checkIn).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-800">Check-out</span>
                    <span className="text-sm font-medium text-blue-900">
                      {new Date(checkOut).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                    <span className="text-xs text-blue-800">{t('bookingExtra.duration', 'Duration')}</span>
                    <span className="text-sm font-semibold text-blue-900">
                      {nights} {nights !== 1 ? t('bookingExtra.nights', 'nights') : t('bookingExtra.night', 'night')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900">{t('bookingExtra.selectedRooms')}</h4>
                {rooms.map((room, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">{room.room_name}</h5>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ₮{room.price_per_night.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">per night × {room.room_count}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{nights} night{nights !== 1 ? 's' : ''}</span>
                      <span className="font-medium text-gray-900">
                        ₮{room.total_price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">{t('bookingExtra.totalPrice')}</span>
                  <span className="text-xl font-bold text-blue-600">₮{totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{t('bookingExtra.taxesIncluded')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component that uses useSearchParams in a Suspense boundary to satisfy Next.js requirements
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Loading booking details...</div>}>
      <BookingContent />
    </Suspense>
  );
}