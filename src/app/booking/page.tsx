"use client";

import { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Check, Star, MapPin, ChevronDown, Receipt, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingService } from '@/services/bookingApi';
import { ApiService } from '@/services/api';
import { CreateBookingRequest, CreateBookingResponse, PropertyPolicy } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useAuth } from '@/contexts/AuthContext';

interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
}

function BookingContent() {
  const { t } = useHydratedTranslation();
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract booking data from URL params
  const hotelId = parseInt(searchParams.get('hotelId') || '0');
  const hotelName = searchParams.get('hotelName') || '';
  const urlCheckIn = searchParams.get('checkIn') || '';
  const urlCheckOut = searchParams.get('checkOut') || '';
  const urlTotalPrice = parseInt(searchParams.get('totalPrice') || '0');
  const urlNights = parseInt(searchParams.get('nights') || '1');
  const adultsCount = parseInt(searchParams.get('adults') || '2');
  const childrenCount = parseInt(searchParams.get('children') || '0');

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
  const [customerLastName, setCustomerLastName] = useState('');

  // E-баримт (UI only, not sent to API)
  type EbarimtType = 'individual' | 'organization' | 'taxpayer' | null;
  const [ebarimtType, setEbarimtType] = useState<EbarimtType>(null);
  const [orgRegister, setOrgRegister] = useState('');
  const [orgName, setOrgName] = useState('');
  const [taxpayerRegisterPrefix1, setTaxpayerRegisterPrefix1] = useState('');
  const [taxpayerRegisterPrefix2, setTaxpayerRegisterPrefix2] = useState('');
  const [taxpayerRegisterNumber, setTaxpayerRegisterNumber] = useState('');

  // Cancellation policy + ToS state
  const [cancellationAccepted, setCancellationAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [tosModalOpen, setTosModalOpen] = useState(false);
  const [tosScrolledToEnd, setTosScrolledToEnd] = useState(false);
  const tosScrollRef = useRef<HTMLDivElement | null>(null);

  // Guest / room mismatch warning
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);

  // Promo code (UI only)
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Hotel data state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hotelDetails, setHotelDetails] = useState<any | null>(null);
  const [hotelPolicy, setHotelPolicy] = useState<PropertyPolicy | null>(null);
  const [loadingHotelData, setLoadingHotelData] = useState(true);

  // Booking state
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (roomsData) {
      try {
        const parsedRooms: BookingRoom[] = JSON.parse(decodeURIComponent(roomsData));
        setRooms(parsedRooms);

        // Check if searched guest count exceeds total room capacity
        const totalAdultCapacity = parsedRooms.reduce(
          (sum, r) => sum + (r.max_adults ?? 1) * r.room_count, 0
        );
        const totalChildCapacity = parsedRooms.reduce(
          (sum, r) => sum + (r.max_children ?? 0) * r.room_count, 0
        );
        const searchedAdults = parseInt(searchParams.get('adults') || '2');
        const searchedChildren = parseInt(searchParams.get('children') || '0');
        if (searchedAdults > totalAdultCapacity || (searchedChildren > 0 && searchedChildren > totalChildCapacity)) {
          setMismatchModalOpen(true);
        }
      } catch {
        // ignore malformed rooms data
      }
    }
  }, [roomsData]);

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      if (!hotelId) return;
      
      try {
        setLoadingHotelData(true);
        const [hotelData, policyData] = await Promise.all([
          ApiService.getHotelDetails(hotelId).catch(() => null),
          ApiService.getPropertyPolicies(hotelId).catch(() => [])
        ]);

        setHotelDetails(hotelData);
        setHotelPolicy(policyData[0] || null);
      } catch {
        // silent fail — UI already handles missing hotel data
      } finally {
        setLoadingHotelData(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  // Auto-fill guest info when user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!customerName) setCustomerName(user.first_name || '');
      if (!customerLastName) setCustomerLastName(user.last_name || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

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

  // Auto-accept ToS once user scrolls to bottom of modal content
  const handleTosScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
      setTosScrolledToEnd(true);
      setTosAccepted(true);
    }
  };

  // Reset scroll state when modal closes/opens
  useEffect(() => {
    if (tosModalOpen) {
      setTosScrolledToEnd(false);
      requestAnimationFrame(() => {
        if (tosScrollRef.current) tosScrollRef.current.scrollTop = 0;
      });
    }
  }, [tosModalOpen]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoMessage(null);
      return;
    }
    setPromoMessage('Энэ промо код хүчингүй байна.');
  };

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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto px-4 print:px-0 print:max-w-full">
          {/* Action Buttons - Hidden on print */}
          <div className="mb-4 flex justify-between items-center print:hidden">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← {t('bookingExtra.backHome', 'Буцах')}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {t('bookingExtra.print', 'Хэвлэх')}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            id="booking-confirmation"
          >
            {/* Success Header */}
            <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-900 dark:border-gray-400 px-6 py-6">
              <h1 className="text-h2 font-bold text-gray-900 dark:text-white text-center mb-1">
                {t('bookingExtra.confirmationTitle', 'Таны захиалга амжилттай баталгаажлаа. Баярлалаа.')}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {t('bookingExtra.confirmationSubtitle', 'Захиалгын мэдээллийг бид таны имэйл рүү илгээлээ. Та имэйлээ шалгаж үзнэ үү.')}
              </p>
            </div>

            {/* Main Content */}
            <div className="px-6 py-5">
              {/* Title */}
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">
                {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
              </h2>

              {/* Hotel Info */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 pb-1.5 border-b border-gray-300 dark:border-gray-600">
                  {t('bookingExtra.hotelInfo', 'Зочид буудлын мэдээлэл')}
                </h3>
                <div className="text-xs space-y-1">
                  <div>
                    <a href={`/hotel/${hotelId}`} className="text-slate-900 hover:underline font-medium">{hotelName}</a>
                  </div>
                  {hotelDetails?.location && (
                    <div className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                      <svg className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {t('bookingExtra.addressLabel', 'Хаяг')}: {hotelDetails.location.province_city}, {hotelDetails.location.soum}, {hotelDetails.location.district}
                      </span>
                    </div>
                  )}
                  {!loadingHotelData && !hotelDetails?.location && (
                    <div className="text-gray-500 dark:text-gray-400 text-xs italic">
                      {t('bookingExtra.contactHotel', 'Холбоо барих мэдээллийг зочид буудалтай шалгана уу')}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 pb-1.5 border-b border-gray-300 dark:border-gray-600">
                  {t('bookingExtra.bookingDetailsSection', 'Захиалгын дэлгэрэнгүй')}
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 w-32">{t('bookingExtra.checkInLabel', 'Орох өдөр')}</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(checkIn).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}, {hotelPolicy ? `${hotelPolicy.check_in_from.substring(0, 5)} - ${hotelPolicy.check_in_until.substring(0, 5)}` : '14:00'} цагаас
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 w-32">{t('bookingExtra.checkOutLabel', 'Гарах өдөр')}</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(checkOut).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}, {hotelPolicy ? `${hotelPolicy.check_out_from.substring(0, 5)} - ${hotelPolicy.check_out_until.substring(0, 5)}` : '12:00'} цагаас
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 w-32">{t('bookingExtra.guests', 'Зочид')}</span>
                    <span className="text-gray-900 dark:text-white">
                      <span className="font-bold text-lg">{rooms.reduce((sum, room) => sum + room.room_count, 0)}</span> том хүн, <span className="font-bold text-lg">2</span> хүүхэд
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 w-32">{t('bookingExtra.guestName', 'Захиалагч')}</span>
                    <span className="text-gray-900 dark:text-white">
                      {customerName} / {customerPhone}, {customerEmail}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 w-32">{t('bookingExtra.bookingDateLabel', 'Захиалсан огноо')}</span>
                    <span className="text-gray-900 dark:text-white">
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
              <div className="mb-5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 mb-0.5">{t('bookingExtra.bookingNumber', 'Захиалгын №')}</div>
                    <div className="font-mono font-semibold text-sm text-gray-900 dark:text-white">{bookingResult.booking_code}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 mb-0.5">{t('bookingExtra.pinCodeLabel', 'PIN код')}</div>
                    <div className="font-mono font-semibold text-sm text-gray-900 dark:text-white">{bookingResult.pin_code}</div>
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
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 font-mono text-gray-900 dark:text-white">
                          {bookingResult.booking_ids?.[index] || `${bookingResult.booking_code}`}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-gray-900 dark:text-white">
                          <div>{room.room_name} <span className="text-gray-500 dark:text-gray-400">(☾)</span></div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-right text-gray-900 dark:text-white">
                          {room.price_per_night.toLocaleString()} ₮
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center text-gray-900 dark:text-white">
                          {room.room_count}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-right font-semibold text-gray-900 dark:text-white">
                          {room.total_price.toLocaleString()} ₮
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <td colSpan={4} className="border border-gray-300 dark:border-gray-600 px-2 py-2.5 text-right font-semibold text-gray-900 dark:text-white">
                        {t('bookingExtra.totalAmount', 'Нийт үнэ')}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2.5 text-right font-bold text-base text-gray-900 dark:text-white">
                        {totalPrice.toLocaleString()} ₮
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">*{t('bookingExtra.taxNote', 'НӨАТ багтсан үнэ')}</p>
              </div>

              {/* Additional Info */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 pb-1.5 border-b border-gray-300 dark:border-gray-600">
                  {t('bookingExtra.additionalInfo', 'Нэмэлт мэдээлэл')}
                </h3>
                <div className="text-xs text-gray-700 dark:text-gray-300 space-y-0.5">
                  <p>{t('bookingExtra.infoLine1', 'Үнэгүй зогсоол')}</p>
                  <p>{t('bookingExtra.infoLine2', 'Free WiFi')}</p>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 pb-1.5 border-b border-gray-300 dark:border-gray-600">
                  {t('bookingExtra.cancellationPolicy', 'Цуцлах нөхцөл')}
                </h3>
                {hotelPolicy ? (
                  <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
                    <div className="flex justify-between">
                      <span>{t('bookingExtra.beforeCancelTime', 'Цуцлах хугацааны өмнө')}:</span>
                      <span className="font-semibold">{hotelPolicy.cancellation_fee?.single_before_time_percentage ?? '—'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('bookingExtra.afterCancelTime', 'Цуцлах хугацааны дараа')}:</span>
                      <span className="font-semibold">{hotelPolicy.cancellation_fee?.single_after_time_percentage ?? '—'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('bookingExtra.cancelDeadline', 'Цуцлах хугацаа')}:</span>
                      <span className="font-semibold">{hotelPolicy.cancellation_fee?.cancel_time.substring(0, 5) ?? '—'}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
                      {t('bookingExtra.cancellationNote', 'Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна.')}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t('bookingExtra.noPolicyInfo', 'Цуцлалтын нөхцөлийн талаар зочид буудалтай холбогдоно уу.')}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3 space-y-0.5">
                <p>{t('bookingExtra.footerNote1', 'Бидний сонгон үйлчлүүлж байгаад танд баярлалаа.')}</p>
                <p>{t('bookingExtra.footerNote2', 'Бид та бүхэнд үйлчлэх зэргээ улам бүр хялбар болгохоор зорин ажиллаж байна.')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-5 print:hidden">
              <div className="flex gap-2 pt-3 border-t border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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

  // Cheapest single image fallback
  const heroImage = (() => {
    try {
      const cover = hotelDetails?.images?.cover;
      if (typeof cover === 'string') return cover;
      if (cover?.url) return cover.url;
      const first = hotelDetails?.images?.gallery?.[0]?.url;
      return first || '';
    } catch {
      return '';
    }
  })();

  const ratingValue: number | undefined = hotelDetails?.rating_stars?.value;
  const ratingLabel: string | undefined = hotelDetails?.rating_stars?.label;

  const cf = hotelPolicy?.cancellation_fee;
  const cancelTimeShort = cf?.cancel_time?.substring(0, 5);

  const formatDateShort = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const wkMap = ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'];
    return `${date.getFullYear()} -${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${wkMap[date.getDay()]}`;
  };

  const checkInTimeRange = hotelPolicy
    ? `${hotelPolicy.check_in_from.substring(0, 5)} — ${hotelPolicy.check_in_until.substring(0, 5)}`
    : '15:00 — 23:00';
  const checkOutTimeRange = hotelPolicy
    ? `${hotelPolicy.check_out_from.substring(0, 5)} — ${hotelPolicy.check_out_until.substring(0, 5)}`
    : '01:00 — 11:00';

  const canSubmit =
    !!customerName &&
    !!customerPhone &&
    !!customerEmail &&
    tosAccepted &&
    !bookingInProgress;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Өрөө сонгох</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mx-4" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Хувийн мэдээлэл</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mx-4" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Төлбөр баталгаажуулах</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back', 'Буцах')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Захиалагчийн мэдээлэл
              </h2>

              {bookingError && (
                <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700">{bookingError}</p>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} id="booking-form" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    required
                    disabled={bookingInProgress}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                    placeholder="Таны овог"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                      placeholder="Таны нэр"
                    />
                    <span className="absolute right-3 top-3 text-red-500 text-sm leading-none">*</span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                      placeholder="И-мэйл хаяг"
                    />
                    <span className="absolute right-3 top-3 text-red-500 text-sm leading-none">*</span>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      disabled={bookingInProgress}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                      placeholder="Утасны дугаар"
                    />
                    <span className="absolute right-3 top-3 text-red-500 text-sm leading-none">*</span>
                  </div>
                </div>

                {/* E-Баримт */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-indigo-50/40 dark:bg-gray-700/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <Receipt className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">И-Баримт</span>
                  </div>

                  <div className="space-y-2">
                    {/* Individual */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        ebarimtType === 'individual'
                          ? 'bg-white border-primary'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ebarimt"
                        checked={ebarimtType === 'individual'}
                        onChange={() => setEbarimtType('individual')}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          ebarimtType === 'individual' ? 'border-emerald-500' : 'border-gray-300'
                        }`}
                      >
                        {ebarimtType === 'individual' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </span>
                      <span className="text-sm text-gray-800">Хувь хүн</span>
                    </label>

                    {/* Organization */}
                    <div
                      className={`rounded-md border transition-colors ${
                        ebarimtType === 'organization' ? 'bg-white border-primary' : 'bg-white border-gray-200'
                      }`}
                    >
                      <label className="flex items-center gap-3 p-3 cursor-pointer">
                        <input
                          type="radio"
                          name="ebarimt"
                          checked={ebarimtType === 'organization'}
                          onChange={() => setEbarimtType('organization')}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            ebarimtType === 'organization' ? 'border-emerald-500' : 'border-gray-300'
                          }`}
                        >
                          {ebarimtType === 'organization' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </span>
                        <span className="text-sm text-gray-800">Албан байгууллага</span>
                      </label>
                      {ebarimtType === 'organization' && (
                        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Регистрийн дугаар</label>
                            <input
                              value={orgRegister}
                              onChange={(e) => setOrgRegister(e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Байгууллагын нэр</label>
                            <input
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              disabled
                              className="w-full p-2.5 border border-gray-200 rounded-md text-sm bg-gray-100"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Taxpayer */}
                    <div
                      className={`rounded-md border transition-colors ${
                        ebarimtType === 'taxpayer' ? 'bg-white border-primary' : 'bg-white border-gray-200'
                      }`}
                    >
                      <label className="flex items-center gap-3 p-3 cursor-pointer">
                        <input
                          type="radio"
                          name="ebarimt"
                          checked={ebarimtType === 'taxpayer'}
                          onChange={() => setEbarimtType('taxpayer')}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            ebarimtType === 'taxpayer' ? 'border-emerald-500' : 'border-gray-300'
                          }`}
                        >
                          {ebarimtType === 'taxpayer' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </span>
                        <span className="text-sm text-gray-800">Татвар төлөгч иргэн</span>
                      </label>
                      {ebarimtType === 'taxpayer' && (
                        <div className="px-4 pb-4">
                          <label className="block text-xs text-gray-600 mb-1">Регистрийн дугаар</label>
                          <div className="flex gap-2">
                            <input
                              value={taxpayerRegisterPrefix1}
                              onChange={(e) => setTaxpayerRegisterPrefix1(e.target.value.slice(0, 1).toUpperCase())}
                              maxLength={1}
                              className="w-10 p-2.5 border border-gray-300 rounded-md text-sm text-center uppercase focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <input
                              value={taxpayerRegisterPrefix2}
                              onChange={(e) => setTaxpayerRegisterPrefix2(e.target.value.slice(0, 1).toUpperCase())}
                              maxLength={1}
                              className="w-10 p-2.5 border border-gray-300 rounded-md text-sm text-center uppercase focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <input
                              value={taxpayerRegisterNumber}
                              onChange={(e) => setTaxpayerRegisterNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                              maxLength={8}
                              className="flex-1 p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Cancellation policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <label className="flex items-start gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={cancellationAccepted}
                  onChange={(e) => setCancellationAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Би захиалга цуцлах нөхцлийг хүлээн зөвшөөрч байна.
                </span>
              </label>

              <p className="text-xs text-gray-600 dark:text-gray-400 ml-7 mb-4">
                Захиалга цуцлах тохиолдолд дараах нөхцлийн дагуу үйлчилгээний хураамжийг суутган буцаан олголт хийгдэх эсвэл цуцлах боломжгүй болохыг анхаарна уу.
              </p>

              <div className="ml-7">
                <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                  1 өрөө тутмаас тооцох цуцлалтын хураамж:
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-600 dark:text-gray-400">
                        <th className="text-left font-normal py-2"></th>
                        <th className="text-right font-normal py-2 px-3">
                          {cancelTimeShort ? `${cancelTimeShort}-ээс өмнө:` : 'Цуцлах хугацааны өмнө:'}
                        </th>
                        <th className="text-right font-normal py-2 px-3">
                          {cancelTimeShort ? `${cancelTimeShort}-ээс хойш:` : 'Цуцлах хугацааны дараа:'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed divide-gray-200 dark:divide-gray-700">
                      {rooms.length > 0 ? (
                        rooms.map((room, i) => {
                          const beforePct = cf ? parseFloat(cf.single_before_time_percentage) : null;
                          const afterPct = cf ? parseFloat(cf.single_after_time_percentage) : null;
                          const beforeFee = beforePct !== null ? Math.round((room.price_per_night * beforePct) / 100) : null;
                          const afterFee = afterPct !== null ? Math.round((room.price_per_night * afterPct) / 100) : null;
                          return (
                            <tr key={i} className="text-gray-800 dark:text-gray-200">
                              <td className="py-2">{room.room_name}</td>
                              <td className="text-right py-2 px-3">
                                {beforeFee !== null ? `${beforeFee.toLocaleString()} ₮` : '—'}
                              </td>
                              <td className="text-right py-2 px-3 text-gray-500">
                                {afterFee !== null && afterPct! > 0 ? `${afterFee.toLocaleString()} ₮` : 'Цуцлах боломжгүй'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-3 text-gray-500 text-center">
                            Өрөөний мэдээлэл алга
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                  *Тухайн буудлын дотоод бодлогоос хамааран буудал бүрийн цуцлалтын хураамж харилцан адилгүй өөр байна.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Захиалгын мэдээлэл
              </h3>

              {/* Hotel summary */}
              <div className="flex gap-3 mb-4">
                {heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt={hotelName}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {hotelName}
                  </h4>
                  {hotelDetails?.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {hotelDetails.location.district || hotelDetails.location.soum || hotelDetails.location.province_city}
                      </span>
                    </div>
                  )}
                  {ratingValue && (
                    <div className="inline-flex items-center gap-1.5 mt-1.5">
                      <span className="bg-primary text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        {ratingValue}
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{ratingLabel || ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Орох цаг</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDateShort(checkIn)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{checkInTimeRange}</div>
                  </div>
                  <div className="flex flex-col items-center px-2 pt-2">
                    <span className="text-xs text-gray-500">{nights} шөнө</span>
                    <div className="w-px h-6 bg-gray-300 mt-1" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Гарах цаг</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDateShort(checkOut)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{checkOutTimeRange}</div>
                  </div>
                </div>
              </div>

              {/* Guest count — info only */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{adultsCount} том хүн{Number(childrenCount) > 0 ? `, ${childrenCount} хүүхэд` : ''}</span>
              </div>

              {/* Selected rooms */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Таны сонгосон өрөө:</div>
                {rooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                      {room.room_name}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      x{room.room_count} өрөө
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Үндсэн үнэ</span>
                  <span className="text-gray-900 dark:text-white">{totalPrice.toLocaleString()} ₮</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Промо кодоо оруулна уу."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ашиглах
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-xs text-red-600 mt-1">{promoMessage}</p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Нийт төлөх дүн
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalPrice.toLocaleString()}₮
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right mt-0.5">*НӨАТ багтсан үнэ</div>
              </div>

              {/* Terms acceptance */}
              <label className="flex items-start gap-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tosAccepted}
                  onChange={(e) => {
                    if (!tosAccepted) {
                      // Open modal instead of allowing direct check
                      e.preventDefault();
                      setTosModalOpen(true);
                    } else {
                      setTosAccepted(false);
                    }
                  }}
                  onClick={(e) => {
                    if (!tosAccepted) {
                      e.preventDefault();
                      setTosModalOpen(true);
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Үйлчилгээний нөхцөл зөвшөөрөх
                </span>
              </label>

              <button
                type="submit"
                form="booking-form"
                disabled={!canSubmit}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {bookingInProgress ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    {t('bookingExtra.bookingInProgress', 'Уншиж байна...')}
                  </span>
                ) : (
                  'Төлбөр төлөх'
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Guest / room mismatch warning modal */}
      <Dialog open={mismatchModalOpen} onOpenChange={setMismatchModalOpen}>
        <DialogContent className="w-[92vw] max-w-md p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Зочдын тоо таарахгүй байна
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Таны хайлт:</span>
                  <span className="font-medium">
                    {adultsCount} том хүн{childrenCount > 0 ? `, ${childrenCount} хүүхэд` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Сонгосон өрөөний багтаамж:</span>
                  <span className="font-medium">
                    {rooms.reduce((s, r) => s + (r.max_adults ?? 1) * r.room_count, 0)} том хүн
                    {rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0) > 0
                      ? `, ${rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0)} хүүхэд`
                      : ''}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Таны хайлтын зочдын тоо сонгосон өрөөний нийт багтаамжаас давж байна.
                Та өрөөнд буцаж нэмэлт өрөө нэмэх эсвэл зочдын тоог дахин шалгана уу.
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Өрөө сонгох хуудас руу буцах
              </button>
              <button
                type="button"
                onClick={() => setMismatchModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={tosModalOpen} onOpenChange={setTosModalOpen}>
        <DialogContent className="w-[92vw] max-w-2xl p-0 overflow-hidden">
          <div className="flex flex-col" style={{ maxHeight: '85vh' }}>
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <DialogTitle>Үйлчилгээний нөхцөл</DialogTitle>
            <p className="text-xs text-gray-500 mt-1">
              Доош гүйлгэж бүх нөхцөлтэй танилцана уу.
            </p>
          </DialogHeader>

          <div
            ref={tosScrollRef}
            onScroll={handleTosScroll}
            className="overflow-y-auto px-6 py-4 text-sm text-gray-700 dark:text-gray-300 space-y-3 flex-1 min-h-0"
          >
            {/* ─── Section 1 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">1. Ерөнхий заалт</h4>
            <p>
              MyRoom.mn нь Монгол Улсад үйл ажиллагаа явуулж буй зочид буудлын онлайн
              захиалгын платформ бөгөөд (&ldquo;Платформ&rdquo;) энэхүү Үйлчилгээний нөхцөл нь
              платформыг ашиглах бүх хэрэглэгч, захиалагч (&ldquo;Та&rdquo;) болон MyRoom ХХК
              (&ldquo;Бид&rdquo;) хоёрын хоорондох харилцааг зохицуулна.
            </p>
            <p>
              Платформд нэвтрэх, захиалга үүсгэх, үйлчилгээг ашиглах замаар та энэхүү
              нөхцлийг бүрэн уншсан, ойлгосон, зөвшөөрсөн гэж тооцогдоно. Хэрэв та
              нөхцлийн аль нэг заалттай санал нийлэхгүй бол платформыг ашиглахаас татгалзана уу.
            </p>

            {/* ─── Section 2 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">2. Захиалга хийх</h4>
            <p>
              Захиалга нь таны хүсэлтийн дагуу MyRoom платформоор дамжуулан тухайн буудалд
              илгээгдэх ба захиалга амжилттай баталгаажсан тохиолдолд захиалгын баталгаажуулах
              и-мэйл таны бүртгэлтэй и-мэйл хаягт ирнэ.
            </p>
            <p>
              Захиалга нь дараах тохиолдолд биелэгдсэн гэж тооцогдоно:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Буудлаас захиалгыг батлагдсан эсэхийг и-мэйлээр мэдэгдсэн</li>
              <li>Системд захиалгын дугаар болон PIN код үүссэн</li>
              <li>Захиалгын хураамж амжилттай суутгагдсан эсвэл баталгаажсан</li>
            </ul>
            <p>
              MyRoom нь буудлын өрөөний боломжгүй байдал, системийн алдаа болон бусад гадны
              нөлөөллөөс шалтгаалан захиалгыг цуцлах эрхтэй бөгөөд тийм тохиолдолд
              урьдчилгаа төлбөрийг бүрэн буцаан олгоно.
            </p>

            {/* ─── Section 3 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">3. Захиалагчийн мэдээлэл</h4>
            <p>
              Захиалга хийхдээ та дараах мэдээллийг үнэн зөвөөр оруулах үүрэгтэй:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Овог нэр (паспорт, иргэний үнэмлэхтэй нийцсэн)</li>
              <li>Холбоо барих утасны дугаар</li>
              <li>Идэвхтэй и-мэйл хаяг</li>
            </ul>
            <p>
              Буруу эсвэл дутуу мэдээлэл оруулснаас үүдэлтэй аливаа хохирол, асуудлыг
              захиалагч өөрөө бүрэн хариуцна. MyRoom нь мэдээллийн зөрүүнээс болж
              баталгаажсан захиалгыг буцаах эрхгүй.
            </p>

            {/* ─── Section 4 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">4. Төлбөр ба үнэ</h4>
            <p>
              Платформд харагдах бүх үнэ нь НӨАТ-ийг багтаасан Монгол төгрөгөөр
              илэрхийлэгдэнэ. Захиалгын төлбөрийг дараах аргаар хийж болно:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Банкны апп / QR код (TDB, Khan Bank, Golomt Bank, MBank гэх мэт)</li>
              <li>Дансаар шилжүүлэх</li>
              <li>Цахим хэтэвчний үйлчилгээ</li>
              <li>Картаар төлөх</li>
            </ul>
            <p>
              Төлбөр хийхдээ гүйлгээний утгыг үнэн зөв бичнэ үү. Буруу гүйлгээний утгаас
              болж захиалга баталгаажихгүй байвал MyRoom хариуцлага хүлээхгүй. Илүү
              төлөгдсөн дүнг ажлын 3–5 өдрийн дотор буцаан олгоно.
            </p>

            {/* ─── Section 5 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">5. Цуцлалт ба буцаан олголт</h4>
            <p>
              Захиалга цуцлах нөхцөл нь тухайн буудлын бодлогоос хамаарна. Ерөнхийдөө
              дараах дүрмийг баримтална:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <strong>Үнэгүй цуцлалт:</strong> Зарим өрөөний төрлийг тодорхой хугацааны
                өмнө цуцалвал 100% буцаан олгоно.
              </li>
              <li>
                <strong>Хэсэгчилсэн буцаан олголт:</strong> Цуцлах хугацаа дууссаны дараа
                буудлын нөхцлийн дагуу хувь суутгаж үлдсэн дүнг буцаана.
              </li>
              <li>
                <strong>Буцаахгүй:</strong> Зарим тусгай үнийн санал нь огт буцаахгүй
                нөхцөлтэй байдаг тул захиалгын дэлгэрэнгүйг сайтар уншина уу.
              </li>
              <li>
                <strong>Ирэхгүй бол (No-show):</strong> Мэдэгдэлгүйгээр ирэхгүй бол
                захиалга хүчингүй болж, нийт дүн суутгагдаж болно.
              </li>
            </ul>
            <p>
              Цуцлах хүсэлтийг &ldquo;Захиалга удирдах&rdquo; хэсгээр эсвэл info@myroom.mn
              и-мэйл хаягт бичгээр илгээнэ үү. Буцаан олголт нь гүйцэтгэх банкны ажлын
              цагаас хамааран 3–7 ажлын өдөр шаардагдаж болно.
            </p>

            {/* ─── Section 6 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">6. Захиалагчийн үүрэг хариуцлага</h4>
            <p>Та платформыг ашиглахдаа дараах зүйлийг хүлээн зөвшөөрч байна:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Бүртгэлийн мэдээлэл болон нэвтрэх нууц үгийн аюулгүй байдлыг хангах</li>
              <li>Бусдын мэдээллийг зөвшөөрөлгүйгээр ашиглахгүй байх</li>
              <li>Платформыг хууль бус зорилгоор ашиглахгүй байх</li>
              <li>Захиалга хийхдээ өөрийн нэр дээр, өөрийнхөө хариуцлагаар хийх</li>
              <li>Буудлын дотоод журам, дүрэм, цагийн хуваарийг дагаж мөрдөх</li>
              <li>Бусад зочид болон ажилтнуудад хүндэтгэлтэй хандах</li>
            </ul>

            {/* ─── Section 7 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">7. MyRoom-ийн хариуцлага</h4>
            <p>
              MyRoom нь захиалагч болон буудлын хооронд зуучлагчийн үүрэг гүйцэтгэнэ.
              Дараах тохиолдлуудад MyRoom хариуцлага хүлээхгүй:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Буудлын үйлчилгээний чанар, дутагдал, гомдол</li>
              <li>Буудлаас мэдэгдэлгүйгээр хаагдах, өрөө солих</li>
              <li>Гуравдагч этгээдийн санхүүгийн үйл ажиллагаанаас үүдэлтэй хохирол</li>
              <li>Интернэт холболт, системийн доголдлоос шалтгаалан алдагдсан мэдээлэл</li>
              <li>Давагдашгүй хүчин зүйл (байгалийн гамшиг, цар тахал, дайн дажин гэх мэт)</li>
            </ul>
            <p>
              MyRoom-ийн нийт хариуцлага нь ямар ч тохиолдолд тухайн захиалгын нийт
              дүнгээс хэтрэхгүй.
            </p>

            {/* ─── Section 8 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">8. Хувийн мэдээллийн нууцлал</h4>
            <p>
              Та платформд оруулсан хувийн мэдээлэл (нэр, утас, и-мэйл, төлбөрийн
              мэдээлэл) нь Монгол Улсын Хувийн мэдээлэл хамгаалах тухай хуулийн
              дагуу хамгаалагдана.
            </p>
            <p>Бид таны мэдээллийг:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Захиалга боловсруулах, баталгаажуулахад ашиглана</li>
              <li>Буудалд захиалгын мэдээлэл дамжуулахад ашиглана</li>
              <li>Таны зөвшөөрлөөр маркетингийн зорилгоор ашиглаж болно</li>
              <li>Хуульд заасан тохиолдолоос бусад үед гуравдагч этгээдэд дамжуулахгүй</li>
            </ul>
            <p>
              Та хэдийд ч өөрийн мэдээллийг харах, засах, устгуулахыг хүсэх эрхтэй.
              Хүсэлтийг privacy@myroom.mn хаягт илгээнэ үү.
            </p>

            {/* ─── Section 9 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">9. Оюуны өмч</h4>
            <p>
              MyRoom платформын бүх агуулга, дизайн, лого, тэмдэглэгээ, программ хангамж нь
              MyRoom ХХК-ийн оюуны өмчийн объект болно. Зөвшөөрөлгүйгээр хуулбарлах,
              тарааx, арилжааны зорилгоор ашиглахыг хориглоно.
            </p>

            {/* ─── Section 10 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">10. И-Баримт ба татварын нөхцөл</h4>
            <p>
              MyRoom нь Монгол Улсын татварын хуулийн дагуу и-баримт олгоно.
              Захиалгын төлбөр бүрэн хийгдсэний дараа электрон баримт таны и-мэйл
              хаягт автоматаар илгээгдэнэ. Байгууллагын нэр дээр и-баримт авах бол
              захиалга хийхдээ байгууллагын регистрийн дугаарыг үнэн зөв оруулна уу.
            </p>

            {/* ─── Section 11 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">11. Гомдол гаргах</h4>
            <p>
              Захиалга, үйлчилгээтэй холбоотой гомдол, санал хүсэлтийг дараах
              сувгуудаар хүлээн авна:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>И-мэйл: support@myroom.mn</li>
              <li>Утас: 7777-7777 (Ажлын өдөр 09:00–18:00)</li>
              <li>Платформын &ldquo;Тусламж&rdquo; хэсэг</li>
            </ul>
            <p>
              Гомдлыг хүлээн авснаас хойш ажлын 2 өдрийн дотор хариу өгөхийг зорино.
              Шийдвэрлэхэд нарийн судалгаа шаардлагатай тохиолдолд 7 хүртэл ажлын
              өдөр зарцуулж болно.
            </p>

            {/* ─── Section 12 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">12. Маргаан шийдвэрлэх</h4>
            <p>
              Энэхүү нөхцөлтэй холбоотой аливаа маргааныг талууд эхлээд эв зүйгээр
              шийдвэрлэхийг эрмэлзэнэ. Зөвшилцөлд хүрэхгүй бол Монгол Улсын
              хууль тогтоомж, Улаанбаатар хотын шүүхийн харьяалалд захирагдана.
            </p>

            {/* ─── Section 13 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">13. Нөхцлийн өөрчлөлт</h4>
            <p>
              MyRoom нь энэхүү үйлчилгээний нөхцлийг урьдчилан мэдэгдэлгүйгээр
              шинэчлэх эрхтэй. Өөрчлөлтийг платформд нийтэлсэн өдрөөс хүчин
              төгөлдөр болно. Та платформыг үргэлжлүүлэн ашигласнаар шинэчлэгдсэн
              нөхцлийг хүлээн зөвшөөрсөн гэж тооцогдоно. Тиймээс нөхцлийг тогтмол
              шалгаж байхыг зөвлөж байна.
            </p>

            {/* ─── Section 14 ─── */}
            <h4 className="font-semibold text-gray-900 dark:text-white">14. Хүчин төгөлдөр байдал</h4>
            <p>
              Энэхүү нөхцлийн аль нэг заалт хүчингүй болсон тохиолдолд бусад заалтууд
              бүрэн хүчин төгөлдөр хэвээр үлдэнэ. Энэхүү нөхцөл нь 2024 оны 01 дүгээр
              сарын 01-ний өдрөөс хүчин төгөлдөр болсон бөгөөд хамгийн сүүлийн
              шинэчлэлт 2026 оны 01 дүгээр сарын 01-нд хийгдсэн.
            </p>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>MyRoom ХХК</strong><br />
                Улаанбаатар хот, Сүхбаатар дүүрэг, 3-р хороо, Сарора төв<br />
                Утас: 7777-7777 | И-мэйл: contact@myroom.mn | Вэбсайт: myroom.mn
              </p>
            </div>

            <p className="text-xs text-gray-400 italic pt-1">
              ↓ Доош гүйлгэж дуусгасны дараа &ldquo;Зөвшөөрөх&rdquo; товч идэвхжинэ.
            </p>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 shrink-0">
            <p className={`text-xs ${tosScrolledToEnd ? 'text-emerald-600' : 'text-gray-500'}`}>
              {tosScrolledToEnd
                ? '✓ Та нөхцөлтэй танилцлаа'
                : 'Үргэлжлүүлэхийн тулд доош гүйлгэнэ үү...'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTosAccepted(false);
                  setTosModalOpen(false);
                }}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Цуцлах
              </button>
              <button
                type="button"
                disabled={!tosScrolledToEnd}
                onClick={() => {
                  setTosAccepted(true);
                  setTosModalOpen(false);
                }}
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Зөвшөөрөх
              </button>
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap the component that uses useSearchParams in a Suspense boundary to satisfy Next.js requirements
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600 dark:bg-gray-900 dark:text-gray-400">{/* Loading */}</div>}>
      <BookingContent />
    </Suspense>
  );
}