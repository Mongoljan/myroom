"use client";

import { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Check, Star, MapPin, ChevronDown, Users, Printer, Download, Phone, Mail, Globe, Pencil, RefreshCw, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { BookingService } from '@/services/bookingApi';
import { ApiService } from '@/services/api';
import { CreateBookingRequest, CreateBookingResponse, PropertyPolicy, CheckBookingResponse } from '@/types/api';
import { getFacilityName } from '@/utils/facilities';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import BookingPaymentStep from '@/components/booking/BookingPaymentStep';
import GuestCountInline from '@/components/common/GuestCountInline';
import BackButton from '@/components/common/BackButton';

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
  const urlTotalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  const urlNights = parseInt(searchParams.get('nights') || '1');
  const adultsCount = parseInt(searchParams.get('adults') || '2');
  const childrenCount = parseInt(searchParams.get('children') || '0');
  const searchedRoomsCount = parseInt(searchParams.get('searchedRooms') || '1');

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

  // E-баримт
  type EbarimtType = 'individual' | 'organization' | 'taxpayer' | null;
  const [ebarimtType, setEbarimtType] = useState<EbarimtType>(null);
  const [wantEbarimt, setWantEbarimt] = useState(false);
  const [orgRegister, setOrgRegister] = useState('');
  const [orgName, setOrgName] = useState('');
  const [taxpayerRegisterPrefix1, setTaxpayerRegisterPrefix1] = useState('');
  const [taxpayerRegisterPrefix2, setTaxpayerRegisterPrefix2] = useState('');
  const [taxpayerRegisterNumber, setTaxpayerRegisterNumber] = useState('');
  const [taxpayerName, setTaxpayerName] = useState('');
  const [ebarimtLoading, setEbarimtLoading] = useState(false);
  const [ebarimtError, setEbarimtError] = useState<string | null>(null);

  // Cancellation policy + ToS state
  const [cancellationAccepted, setCancellationAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [tosModalOpen, setTosModalOpen] = useState(false);
  const [tosScrolledToEnd, setTosScrolledToEnd] = useState(false);
  const tosScrollRef = useRef<HTMLDivElement | null>(null);
  // Ensure multi-room cancellation modal is only shown once (after hotel data loads)
  const multiRoomModalShownRef = useRef(false);

  // Guest / room mismatch warning
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);

  // Multi-room cancellation info modal
  const [multiRoomCancelModalOpen, setMultiRoomCancelModalOpen] = useState(false);
  // When both mismatch + multi-room conditions fire, queue the cancel modal after mismatch is confirmed
  const [pendingMultiRoomModal, setPendingMultiRoomModal] = useState(false);

  // Promo code (UI only)
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Hotel data state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hotelDetails, setHotelDetails] = useState<any | null>(null);
  const [hotelPolicy, setHotelPolicy] = useState<PropertyPolicy | null>(null);
  const [loadingHotelData, setLoadingHotelData] = useState(true);

  // Hydration-safe: always start at step 2 (matches SSR), restore from sessionStorage after mount
  const [hasMounted, setHasMounted] = useState(false);
  const [step, setStep] = useState<2 | 3>(2);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Booking state
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [checkedBooking, setCheckedBooking] = useState<CheckBookingResponse | null>(null);

  // Restore step + bookingResult from sessionStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    if (sessionStorage.getItem('booking_step') === '3') {
      setStep(3);
      try {
        const saved = sessionStorage.getItem('booking_result');
        if (saved) setBookingResult(JSON.parse(saved) as CreateBookingResponse);
      } catch { /* ignore */ }
    }
    setHasMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        const guestMismatch = searchedAdults > totalAdultCapacity || (searchedChildren > 0 && searchedChildren > totalChildCapacity);
        const totalRoomCount = parsedRooms.reduce((sum, r) => sum + r.room_count, 0);
        const isMultiRoom = totalRoomCount >= 2;
        const hasRoomMismatch = searchedRoomsCount > 1 && totalRoomCount < searchedRoomsCount;
        const hasMismatch = guestMismatch || hasRoomMismatch;
        if (hasMismatch && isMultiRoom) {
          setMismatchModalOpen(true);
          setPendingMultiRoomModal(true);
        } else if (hasMismatch) {
          setMismatchModalOpen(true);
        } else if (isMultiRoom) {
          setMultiRoomCancelModalOpen(true);
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

  // Load full booking from API after payment (dates, totals, customer from server)
  useEffect(() => {
    if (!paymentConfirmed || !bookingResult) return;
    let cancelled = false;
    BookingService.checkBooking(bookingResult.booking_code, bookingResult.pin_code)
      .then((data) => {
        if (!cancelled) setCheckedBooking(data);
      })
      .catch(() => {
        if (!cancelled) setCheckedBooking(null);
      });
    return () => {
      cancelled = true;
    };
  }, [paymentConfirmed, bookingResult?.booking_code, bookingResult?.pin_code]);

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

  // Auto-lookup taxpayer name when all parts are filled
  useEffect(() => {
    const fullRegno = taxpayerRegisterPrefix1 + taxpayerRegisterPrefix2 + taxpayerRegisterNumber;
    if (taxpayerRegisterPrefix1.length === 1 && taxpayerRegisterPrefix2.length === 1 && taxpayerRegisterNumber.length === 8) {
      setTaxpayerName('');
      lookupEbarimt(fullRegno).then(name => {
        if (name) setTaxpayerName(name);
      });
    } else {
      setTaxpayerName('');
      setEbarimtError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxpayerRegisterPrefix1, taxpayerRegisterPrefix2, taxpayerRegisterNumber]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoMessage(null);
      return;
    }
    setPromoMessage('Энэ промо код хүчингүй байна.');
  };

  const lookupEbarimt = async (regno: string): Promise<string | null> => {
    setEbarimtLoading(true);
    setEbarimtError(null);
    try {
      const res = await fetch(`/api/ebarimt?regno=${encodeURIComponent(regno)}`);
      const data = await res.json();
      if (data.found && data.name) {
        return data.name as string;
      }
      setEbarimtError('Бүртгэл олдсонгүй');
      return null;
    } catch {
      setEbarimtError('Холболтын алдаа гарлаа');
      return null;
    } finally {
      setEbarimtLoading(false);
    }
  };

  const handleOrgSearch = async () => {
    const trimmed = orgRegister.trim();
    if (!trimmed) return;
    const name = await lookupEbarimt(trimmed);
    if (name) setOrgName(name);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingInProgress(true);
    setBookingError(null);

    try {
      // Map frontend ebarimtType to API value
      const apiEbarimtType: 'person' | 'organization' | 'taxpayer' =
        ebarimtType === 'organization' ? 'organization'
        : ebarimtType === 'taxpayer' ? 'taxpayer'
        : 'person';

      const bookingRequest: CreateBookingRequest = {
        hotel_id: hotelId,
        check_in: checkIn,
        check_out: checkOut,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        ebarimt_type: apiEbarimtType,
        ...(ebarimtType === 'organization' && {
          org_register: orgRegister,
          org_name: orgName,
        }),
        ...(ebarimtType === 'taxpayer' && {
          taxpayer_register_prefix: taxpayerRegisterPrefix1 + taxpayerRegisterPrefix2,
          taxpayer_register_number: taxpayerRegisterNumber,
        }),
        rooms: rooms.map(room => ({
          room_category_id: room.room_category_id,
          room_type_id: room.room_type_id,
          room_count: room.room_count
        }))
      };

      const result = await BookingService.createBooking(bookingRequest);
      sessionStorage.setItem('booking_step', '3');
      sessionStorage.setItem('booking_result', JSON.stringify(result));
      // Store QPay timer expiry so the countdown persists across refresh
      sessionStorage.setItem('qpay_expiry', String(Date.now() + 10 * 60 * 1000));
      setBookingResult(result);
      setStep(3);
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

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (paymentConfirmed && bookingResult) {
    const handlePrint = () => window.print();
    const handleDownloadPDF = () => window.print();

    const formatDateDisplay = (d: string) => {
      if (!d) return '';
      const date = new Date(d + 'T12:00:00');
      const wk = ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'][date.getDay()];
      const ymd = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      return `${ymd}, ${wk}`;
    };
    const checkInTime = hotelPolicy ? hotelPolicy.check_in_from.substring(0, 5) : '14:00';
    const checkOutTime = hotelPolicy ? hotelPolicy.check_out_until.substring(0, 5) : '12:00';

    const apiBooking = checkedBooking?.bookings?.[0];
    const displayTotal = checkedBooking?.total_sum ?? totalPrice;
    const displayNights = bookingResult.nights ?? nights;
    const displayCustomerName = apiBooking?.customer_name || [customerLastName, customerName].filter(Boolean).join(' ').trim();
    const displayCustomerPhone = apiBooking?.customer_phone || customerPhone;
    const displayCustomerEmail = apiBooking?.customer_email || customerEmail;
    const displayCheckIn = apiBooking?.check_in || checkIn;
    const displayCheckOut = apiBooking?.check_out || checkOut;
    const bookingCreatedAt = apiBooking?.created_at
      ? new Date(apiBooking.created_at)
      : new Date();

    const totalGuestAdults = adultsCount;
    const totalGuestChildren = childrenCount;

    const displayHotelName = hotelDetails?.property_name || hotelName;

    const hotelPhone: string | undefined = hotelDetails?.contact_phone || hotelDetails?.phone;
    const hotelEmail: string | undefined = hotelDetails?.contact_email || hotelDetails?.email || hotelDetails?.mail;
    const hotelWebsite: string | undefined = hotelDetails?.website;
    const googleMapUrl: string | undefined = hotelDetails?.google_map;

    const addressLine = hotelDetails?.location
      ? [hotelDetails.location.province_city, hotelDetails.location.soum, hotelDetails.location.district].filter(Boolean).join(', ')
      : '';

    const cfConfirm = hotelPolicy?.cancellation_fee;
    const cancelTimeShortConfirm = cfConfirm?.cancel_time?.substring(0, 5);
    const cutoffDateConfirm = (daysBefore: number): string => {
      if (!displayCheckIn) return `${daysBefore} хоногийн өмнө`;
      const d = new Date(displayCheckIn + 'T12:00:00');
      d.setDate(d.getDate() - daysBefore);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };
    const cancelTiers: { label: string; days: number; pct: number | null }[] = cfConfirm ? [
      { label: `${cutoffDateConfirm(5)}-ээс өмнө`, days: 5, pct: cfConfirm.multi_5days_before_percentage ? parseFloat(cfConfirm.multi_5days_before_percentage) : null },
      { label: `${cutoffDateConfirm(3)}-ээс өмнө`, days: 3, pct: cfConfirm.multi_3days_before_percentage ? parseFloat(cfConfirm.multi_3days_before_percentage) : null },
      { label: `${cutoffDateConfirm(1)}-ээс хойш`, days: 1, pct: cfConfirm.multi_1day_before_percentage ? parseFloat(cfConfirm.multi_1day_before_percentage) : null },
    ].filter((tier) => tier.pct !== null) : [];

    const totalRoomsBooked = rooms.reduce((sum, r) => sum + r.room_count, 0) || bookingResult.total_rooms;

    const facilityLines = [
      ...(hotelDetails?.general_facilities ?? []),
      ...(hotelDetails?.additional_facilities ?? []),
    ]
      .map((f) => getFacilityName(f, 'mn'))
      .filter(Boolean);

    const parkingPolicy = hotelPolicy?.parking_policy;
    if (parkingPolicy?.outdoor_parking === 'free') facilityLines.push('Үнэгүй гадна зогсоол');
    else if (parkingPolicy?.indoor_parking === 'free') facilityLines.push('Үнэгүй дотор зогсоол');

    const managementActions = [
      { icon: Calendar, label: 'Өдөр өөрчлөх', action: 'change-date', primary: true },
      { icon: RefreshCw, label: 'Өрөө солих', action: 'change-room', primary: false },
      { icon: Plus, label: 'Өрөө нэмэх', action: 'add-room', primary: false },
      { icon: X, label: 'Захиалга цуцлах', action: 'cancel', danger: true, primary: false },
    ];

    const tableHeadClass = 'bg-gray-700 text-white';

    return (
      <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 py-8 print:bg-white print:py-0">
        <div className="max-w-7xl mx-auto px-4 print:px-0 print:max-w-full">
          {/* Top action row */}
          <div className="mb-4 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('bookingExtra.confirmationTitle', 'Таны захиалга амжилттай баталгаажлаа. Баярлалаа.')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleDownloadPDF} className="text-gray-700">
                <Download className="w-4 h-4" />
                {t('bookingExtra.downloadPDF', 'Татах')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrint} className="text-gray-700">
                <Printer className="w-4 h-4" />
                {t('bookingExtra.print', 'Хэвлэх')}
              </Button>
            </div>
          </div>

          {/* Single frame: voucher + sidebar */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden print:border-0 print:shadow-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 print:block">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 p-6 sm:p-8 print:p-0"
              id="booking-confirmation"
            >
              <h2 className="text-base font-semibold text-center mb-6 text-foreground tracking-tight">
                {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
              </h2>

              {/* Hotel header */}
              <div className="flex items-start justify-between gap-6 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="min-w-0">
                  <a href={`/hotel/${hotelId}`} className="text-primary hover:underline text-sm font-semibold block mb-2">
                    {displayHotelName}
                  </a>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {hotelPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{hotelPhone}</span>
                      </div>
                    )}
                    {addressLine && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{addressLine}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 text-sm">
                  <div className="font-semibold text-foreground">MyRoom.mn</div>
                  {hotelEmail && (
                    <div className="flex items-center justify-end gap-1.5 text-muted-foreground mt-1">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">{hotelEmail}</span>
                    </div>
                  )}
                  {hotelWebsite && (
                    <div className="flex items-center justify-end gap-1.5 text-muted-foreground mt-1">
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">{hotelWebsite}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {t('bookingExtra.bookingDetailsSection', 'Захиалгын дэлгэрэнгүй')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.checkInLabel', 'Орох өдөр')}</span>
                    <span className="text-foreground">{formatDateDisplay(displayCheckIn)}, {checkInTime} цагаас</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.checkOutLabel', 'Гарах өдөр')}</span>
                    <span className="text-foreground">{formatDateDisplay(displayCheckOut)}, {checkOutTime} цагаас</span>
                  </div>
                  {displayNights > 0 && (
                    <div className="flex">
                      <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.nightsLabel', 'Хоног')}</span>
                      <span className="text-foreground">{displayNights}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.enteringGuests', 'Орох хүний тоо')}</span>
                    <GuestCountInline
                      adults={totalGuestAdults}
                      children={totalGuestChildren}
                      className="text-foreground"
                    />
                  </div>
                  {(displayCustomerName || displayCustomerPhone || displayCustomerEmail) && (
                    <div className="flex">
                      <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.guestName', 'Захиалагч')}</span>
                      <span className="text-foreground">
                        {displayCustomerName}
                        {displayCustomerPhone ? ` / ${displayCustomerPhone}` : ''}
                        {displayCustomerEmail ? `, ${displayCustomerEmail}` : ''}
                      </span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="text-muted-foreground w-36 shrink-0">{t('bookingExtra.bookingDateLabel', 'Захиалсан огноо')}</span>
                    <span className="text-foreground">
                      {bookingCreatedAt.toLocaleDateString('en-CA').replace(/-/g, '.')}{' '}
                      {bookingCreatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rooms table */}
              <div className="mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className={tableHeadClass}>
                      <th className="text-left font-semibold px-3 py-2.5">{t('bookingExtra.roomTypeCol', 'Өрөө')}</th>
                      <th className="text-left font-semibold px-3 py-2.5">{t('bookingExtra.extraDescCol', 'Нэмэлт тайлбар')}</th>
                      <th className="text-right font-semibold px-3 py-2.5">{t('bookingExtra.priceCol', '1 өдрийн үнэ')}</th>
                      <th className="text-center font-semibold px-3 py-2.5">{t('bookingExtra.quantityCol', 'Тоо ш')}</th>
                      <th className="text-right font-semibold px-3 py-2.5">{t('bookingExtra.totalCol', 'Үнэ')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2.5 text-foreground">{room.room_name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">—</td>
                        <td className="px-3 py-2.5 text-right text-foreground">{room.price_per_night.toLocaleString()} ₮</td>
                        <td className="px-3 py-2.5 text-center text-foreground">{room.room_count}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-foreground">{room.total_price.toLocaleString()} ₮</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-700/50 text-foreground border-t border-gray-200 dark:border-gray-600">
                      <td colSpan={4} className="px-3 py-3 font-semibold">{t('bookingExtra.totalPaidAmount', 'Нийт төлөх дүн')}</td>
                      <td className="px-3 py-3 text-right font-bold">{displayTotal.toLocaleString()} ₮</td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-muted-foreground mt-1.5 text-right">*{t('bookingExtra.taxNote', 'НӨАТ багтсан үнэ')}</p>
              </div>

              {/* Additional info — API facilities only */}
              {facilityLines.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {t('bookingExtra.additionalInfo', 'Нэмэлт мэдээлэл')}
                </h3>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  {facilityLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              )}

              {/* Cancellation policy — from hotel policy API */}
              {cfConfirm && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {t('bookingExtra.cancellationPolicy', 'Цуцлах нөхцөл')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  1 өрөө тутамд цуцлалтаас авах хураамж:
                </p>
                {totalRoomsBooked <= 1 ? (
                  (() => {
                    let deadlineLabel = cancelTimeShortConfirm ?? '11:00';
                    if (displayCheckIn) {
                      const deadline = new Date(displayCheckIn + 'T00:00:00');
                      deadline.setDate(deadline.getDate() - 1);
                      if (cfConfirm.cancel_time) {
                        const [h, m] = cfConfirm.cancel_time.split(':').map(Number);
                        deadline.setHours(h, m, 0, 0);
                        deadlineLabel = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                      } else {
                        deadline.setHours(11, 0, 0, 0);
                      }
                    }
                    return (
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className={tableHeadClass}>
                            <th className="text-left font-semibold px-2 py-2"></th>
                            <th className="text-right font-semibold px-2 py-2">
                              Өмнөх өдрийн {deadlineLabel}-ээс өмнө
                            </th>
                            <th className="text-right font-semibold px-2 py-2">
                              Өмнөх өдрийн {deadlineLabel}-ээс хойш
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rooms.map((room, i) => {
                            const feeBase = room.price_per_night * room.room_count;
                            const beforePct = parseFloat(cfConfirm.single_before_time_percentage);
                            const afterPct = parseFloat(cfConfirm.single_after_time_percentage);
                            const beforeFee = Math.round((feeBase * beforePct) / 100);
                            const afterFee = Math.round((feeBase * afterPct) / 100);
                            const afterDisplay =
                              afterPct >= 100 ? 'Цуцлах боломжгүй'
                              : afterPct === 0 ? 'Үнэгүй'
                              : `${afterFee.toLocaleString()} ₮`;
                            return (
                              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-2 py-2 text-foreground">{room.room_name}{room.room_count > 1 ? ` (×${room.room_count})` : ''}</td>
                                <td className="px-2 py-2 text-right text-foreground">
                                  {beforePct === 0 ? 'Үнэгүй' : `${beforeFee.toLocaleString()} ₮`}
                                </td>
                                <td className={`px-2 py-2 text-right ${afterPct >= 100 ? 'text-red-600' : ''}`}>
                                  {afterDisplay}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                  })()
                ) : cancelTiers.length > 0 ? (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className={tableHeadClass}>
                        <th className="text-left font-semibold px-2 py-2"></th>
                        {cancelTiers.map((tier) => (
                          <th key={tier.days} className="text-right font-semibold px-2 py-2">{tier.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room, i) => (
                        <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-2 py-2 text-foreground">{room.room_name}{room.room_count > 1 ? ` (×${room.room_count})` : ''}</td>
                          {cancelTiers.map((tier) => {
                            const fee = Math.round((room.total_price * (tier.pct ?? 0)) / 100);
                            return (
                              <td key={tier.days} className="px-2 py-2 text-right text-foreground">
                                {tier.pct! >= 100 ? <span className="text-red-600">Цуцлах боломжгүй</span>
                                  : tier.pct === 0 ? 'Үнэгүй'
                                  : `${fee.toLocaleString()} ₮`}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t('bookingExtra.noPolicyInfo', 'Цуцлалтын нөхцөлийн талаар зочид буудалтай холбогдоно уу.')}
                  </p>
                )}
              </div>
              )}

              {/* Reminders */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Санамж</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Захиалга баталгаажсан тохиолдолд, MyRoom-ийн Үйлчилгээний нөхцөл, Нууцлалын бодлого болон Захиалга цуцлах нөхцлийг танилцаж, бүрэн зөвшөөрсөн гэж үзнэ.</li>
                  <li>Захиалгад өдөр болон цагийн хойрвүй өчил бол захиалгыг цуцлахаас сэргийлэх буудалтайгаа холбоо барих хүсэлтэй мэдэгдэхийг зөвлөнө.</li>
                </ul>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Бидний сонгон үйлчлүүлж байгаад танд баярлалаа.
              </p>
            </motion.div>

            {/* RIGHT — sidebar inside same frame */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 p-4 sm:p-5 space-y-3 print:hidden"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground block mb-0.5">Захиалгын дугаар</span>
                  <span className="font-mono font-semibold text-foreground text-base">{bookingResult.booking_code}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground block mb-0.5">PIN код</span>
                  <span className="font-mono font-semibold text-foreground text-base">{bookingResult.pin_code}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Захиалга удирдах</h3>
                <div className="grid grid-cols-2 gap-2">
                  {managementActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Button
                        key={a.action}
                        variant={a.primary ? 'primary' : 'ghost'}
                        size="sm"
                        className={`w-full flex items-center justify-start gap-1.5 !rounded-lg !shadow-none ${
                          a.danger
                            ? '!text-red-600 hover:!text-red-700 !border-red-200'
                            : a.primary
                              ? ''
                              : '!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-600'
                        }`}
                        onClick={() => router.push(`/booking/manage?code=${bookingResult.booking_code}&pin=${bookingResult.pin_code}&action=${a.action}`)}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-left">{a.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {(addressLine || hotelPhone || hotelEmail) && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Буудалтай холбогдох</h3>
                <div className="space-y-2 text-sm">
                  {addressLine && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{addressLine}</span>
                    </div>
                  )}
                  {hotelPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a href={`tel:${hotelPhone}`} className="text-foreground hover:underline">{hotelPhone}</a>
                    </div>
                  )}
                  {hotelEmail && hotelEmail !== hotelPhone && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a href={`mailto:${hotelEmail}`} className="text-foreground hover:underline truncate">{hotelEmail}</a>
                    </div>
                  )}
                </div>
              </div>
              )}

              {googleMapUrl && (() => {
                const coordMatch = googleMapUrl.match(/q=([-\d.]+),([-\d.]+)/);
                const embedSrc = coordMatch
                  ? `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&zoom=15`
                  : null;
                return embedSrc ? (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-foreground">Газрын зураг дээр харах</h3>
                      <a
                        href={googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        Google Maps
                      </a>
                    </div>
                    <iframe
                      src={embedSrc}
                      className="w-full h-40 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Буудлын байршил"
                    />
                  </div>
                ) : null;
              })()}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="!justify-start text-muted-foreground hover:text-foreground !px-0"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('bookingExtra.goHome', 'Нүүр хуудас руу буцах')}
              </Button>
            </motion.aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 3: Payment ───────────────────────────────────────────
  if (step === 3 && bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stepper — Step 3 active */}
          <div className="mb-8 flex items-start w-full">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white mt-1.5 text-center leading-tight">Өрөө<br/>сонгох</span>
            </div>
            <div className="flex-1 h-px bg-primary mt-4" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white mt-1.5 text-center leading-tight">Хувийн<br/>мэдээлэл</span>
            </div>
            <div className="flex-1 h-px bg-primary mt-4" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-sm font-semibold">
                3
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white mt-1.5 text-center leading-tight">Төлбөр<br/>баталгаажуулах</span>
            </div>
          </div>

          <BookingPaymentStep
            bookingCode={bookingResult.booking_code}
            totalPrice={totalPrice}
            rooms={rooms}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            hotelName={hotelName}
            hotelDetails={hotelDetails}
            adultsCount={adultsCount}
            childrenCount={childrenCount}
            customerName={customerName}
            customerLastName={customerLastName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            orgName={orgName}
            orgRegister={orgRegister}
            onCancelBooking={() => {
              sessionStorage.removeItem('booking_step');
              sessionStorage.removeItem('booking_result');
              sessionStorage.removeItem('qpay_expiry');
              sessionStorage.removeItem('qpay_invoice_id');
              sessionStorage.removeItem('qpay_qr');
              router.push(`/hotel/${hotelId}`);
            }}
            onPaymentConfirmed={() => {
              sessionStorage.removeItem('booking_step');
              sessionStorage.removeItem('booking_result');
              sessionStorage.removeItem('qpay_expiry');
              sessionStorage.removeItem('qpay_invoice_id');
              sessionStorage.removeItem('qpay_qr');
              setPaymentConfirmed(true);
            }}
          />
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

  // Compute actual cutoff dates for multi-night cancellation tiers
  const multiCutoffDate = (daysBeforeCheckIn: number): string => {
    if (!checkIn) return `${daysBeforeCheckIn} хоногийн өмнө`;
    const d = new Date(checkIn);
    d.setDate(d.getDate() - daysBeforeCheckIn);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

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

  const ebarimtValid =
    !wantEbarimt ||
    ebarimtType === 'individual' ||
    (ebarimtType === 'organization' && !!orgRegister.trim() && !!orgName) ||
    (ebarimtType === 'taxpayer' &&
      taxpayerRegisterPrefix1.length === 1 &&
      taxpayerRegisterPrefix2.length === 1 &&
      taxpayerRegisterNumber.length === 8);

  const canSubmit =
    !!customerName &&
    !!customerPhone &&
    !!customerEmail &&
    ebarimtValid &&
    tosAccepted &&
    !bookingInProgress;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <BackButton onClick={() => router.back()} stepperAnchor />
          {/* Stepper — Step 2 active */}
          <div className="flex items-start w-full">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white mt-1.5 text-center leading-tight">Өрөө<br/>сонгох</span>
          </div>
          <div className="flex-1 h-px bg-primary mt-4" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-sm font-semibold">
              2
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white mt-1.5 text-center leading-tight">Хувийн<br/>мэдээлэл</span>
          </div>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mt-4" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center shrink-0 text-sm font-semibold">
              3
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1.5 text-center leading-tight">Төлбөр<br/>баталгаажуулах</span>
          </div>
          </div>
        </div>

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
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-muted/30 dark:bg-muted/10 p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ebarimt-logo.png" alt="И-Баримт" className="w-9 h-9 object-contain" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">И-Баримт</span>
                    </div>
                    {/* Toggle */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={wantEbarimt}
                      onClick={() => {
                        setWantEbarimt((v) => !v);
                        if (wantEbarimt) setEbarimtType(null);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        wantEbarimt ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                          wantEbarimt ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {wantEbarimt && (
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
                          ebarimtType === 'individual' ? 'border-primary' : 'border-gray-300'
                        }`}
                      >
                        {ebarimtType === 'individual' && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
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
                          onChange={() => { setEbarimtType('organization'); setOrgName(''); setEbarimtError(null); }}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            ebarimtType === 'organization' ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          {ebarimtType === 'organization' && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="text-sm text-gray-800">Албан байгууллага</span>
                      </label>
                      {ebarimtType === 'organization' && (
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Регистрийн дугаар</label>
                            <div className="flex gap-2">
                              <input
                                value={orgRegister}
                                onChange={(e) => { setOrgRegister(e.target.value); setOrgName(''); setEbarimtError(null); }}
                                placeholder="0000000"
                                className="flex-1 p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                              <button
                                type="button"
                                onClick={handleOrgSearch}
                                disabled={ebarimtLoading || !orgRegister.trim()}
                                className="px-3 py-2 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                              >
                                {ebarimtLoading ? '...' : 'Хайх'}
                              </button>
                            </div>
                            {ebarimtError && <p className="text-xs text-red-500 mt-1">{ebarimtError}</p>}
                          </div>
                          {orgName && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Байгууллагын нэр</label>
                              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-800">
                                {orgName}
                              </div>
                            </div>
                          )}
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
                          onChange={() => { setEbarimtType('taxpayer'); setTaxpayerName(''); setEbarimtError(null); }}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            ebarimtType === 'taxpayer' ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          {ebarimtType === 'taxpayer' && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="text-sm text-gray-800">Татвар төлөгч иргэн</span>
                      </label>
                      {ebarimtType === 'taxpayer' && (
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Регистрийн дугаар</label>
                            <div className="flex gap-2">
                              <input
                                value={taxpayerRegisterPrefix1}
                                onChange={(e) => setTaxpayerRegisterPrefix1(e.target.value.slice(0, 1).toUpperCase())}
                                maxLength={1}
                                placeholder="Э"
                                className="w-10 p-2.5 border border-gray-300 rounded-md text-sm text-center uppercase focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                              <input
                                value={taxpayerRegisterPrefix2}
                                onChange={(e) => setTaxpayerRegisterPrefix2(e.target.value.slice(0, 1).toUpperCase())}
                                maxLength={1}
                                placeholder="Н"
                                className="w-10 p-2.5 border border-gray-300 rounded-md text-sm text-center uppercase focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                              <input
                                value={taxpayerRegisterNumber}
                                onChange={(e) => setTaxpayerRegisterNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                maxLength={8}
                                placeholder="00000000"
                                className="flex-1 p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                            </div>
                            {ebarimtLoading && (
                              <p className="text-xs text-gray-500 mt-1">Хайж байна...</p>
                            )}
                            {ebarimtError && (
                              <p className="text-xs text-red-500 mt-1">{ebarimtError}</p>
                            )}
                          </div>
                          {taxpayerName && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-800">
                              {taxpayerName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  )}
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
                  Цуцлалтын хураамж:
                </div>
                <div className="overflow-x-auto">
                  {(() => {
                    const now = new Date();
                    const totalRooms = rooms.reduce((sum, r) => sum + r.room_count, 0);

                    if (totalRooms <= 1) {
                      /* ── Single room: deadline = day-before-checkIn at cancel_time ── */
                      let windowClosed = false;
                      let deadlineLabel = cancelTimeShort ?? '11:00';
                      if (checkIn) {
                        const deadline = new Date(checkIn + 'T00:00:00');
                        deadline.setDate(deadline.getDate() - 1); // day before check-in
                        if (cf?.cancel_time) {
                          const [h, m] = cf.cancel_time.split(':').map(Number);
                          deadline.setHours(h, m, 0, 0);
                          deadlineLabel = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                        } else {
                          deadline.setHours(11, 0, 0, 0);
                        }
                        windowClosed = now >= deadline;
                      }

                      if (windowClosed) return (
                        <p className="text-sm text-red-500 dark:text-red-400 font-medium py-1">Цуцлах боломжгүй</p>
                      );
                      return (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-600 dark:text-gray-400">
                              <th className="text-left font-normal py-2"></th>
                              <th className="text-right font-normal py-2 px-3">
                                Өмнөх өдрийн {deadlineLabel}-ээс өмнө:
                              </th>
                              <th className="text-right font-normal py-2 px-3">
                                Өмнөх өдрийн {deadlineLabel}-ээс хойш:
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-dashed divide-gray-200 dark:divide-gray-700">
                            {rooms.length > 0 ? rooms.map((room, i) => {
                              const feeBase = room.price_per_night * room.room_count;
                              const beforePct = cf ? parseFloat(cf.single_before_time_percentage) : null;
                              const afterPct  = cf ? parseFloat(cf.single_after_time_percentage)  : null;
                              const beforeFee = beforePct !== null ? Math.round((feeBase * beforePct) / 100) : null;
                              const afterFee  = afterPct  !== null ? Math.round((feeBase * afterPct)  / 100) : null;
                              const afterDisplay =
                                afterPct === null  ? '—'
                                : afterPct >= 100  ? 'Цуцлах боломжгүй'
                                : afterPct === 0   ? 'Үнэгүй'
                                : `${afterFee!.toLocaleString()} ₮`;
                              return (
                                <tr key={i} className="text-gray-800 dark:text-gray-200">
                                  <td className="py-2">{room.room_name}{room.room_count > 1 ? ` ×${room.room_count}` : ''}</td>
                                  <td className="text-right py-2 px-3">
                                    {beforeFee !== null ? `${beforeFee.toLocaleString()} ₮` : '—'}
                                  </td>
                                  <td className={`text-right py-2 px-3 ${afterPct !== null && afterPct >= 100 ? 'text-red-500 dark:text-red-400 font-medium' : afterPct === 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                                    {afterDisplay}
                                  </td>
                                </tr>
                              );
                            }) : (
                              <tr><td colSpan={3} className="py-3 text-gray-500 text-center">Өрөөний мэдээлэл алга</td></tr>
                            )}
                          </tbody>
                        </table>
                      );
                    }

                    /* ── Multiple rooms (2+): just show can / cannot cancel ── */
                    let canCancel = true;
                    if (checkIn) {
                      // Past "1 day before check-in" → cannot cancel
                      const deadline = new Date(checkIn + 'T00:00:00');
                      deadline.setDate(deadline.getDate() - 1);
                      deadline.setHours(0, 0, 0, 0);
                      canCancel = now < deadline;
                    }

                    if (!canCancel) return (
                      <p className="text-sm text-red-500 dark:text-red-400 font-medium py-1">Цуцлах боломжгүй</p>
                    );
                    return (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium py-1">Цуцлах боломжтой</p>
                    );
                  })()}
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

              {/* Room capacity */}
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Орох боломжтой хүний тоо:</div>
                <GuestCountInline
                  adults={rooms.reduce((s, r) => s + (r.max_adults ?? 1) * r.room_count, 0)}
                  children={rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0)}
                />
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    Ашиглах
                  </Button>
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

              <Button
                type="submit"
                form="booking-form"
                disabled={!canSubmit}
                className="w-full"
              >
                {bookingInProgress ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    {t('bookingExtra.bookingInProgress', 'Уншиж байна...')}
                  </span>
                ) : (
                  'Захиалга баталгаажуулах'
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Multi-room cancellation info modal */}
      <Dialog open={multiRoomCancelModalOpen} onOpenChange={setMultiRoomCancelModalOpen}>
        <DialogContent
          className="w-[92vw] max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Таны захиалгын мэдээлэл</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Searched vs selected summary */}
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Таны хайлт</span>
                <span className="font-semibold">
                  {searchedRoomsCount} өрөө, {adultsCount} том хүн{childrenCount > 0 ? `, ${childrenCount} хүүхэд` : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сонгосон өрөө</span>
                <span className="font-semibold">
                  {rooms.reduce((s, r) => s + r.room_count, 0)} өрөө
                  {' · '}
                  {rooms.reduce((s, r) => s + (r.max_adults ?? 1) * r.room_count, 0)} том хүн
                  {rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0) > 0
                    ? `, ${rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0)} хүүхэд`
                    : ''} багтаамж
                </span>
              </div>
            </div>

            {/* Cancellation fee schedule */}
            <div>
              <p className="text-base font-semibold mb-2">2+ өрөөний цуцлалтын нөхцөл</p>
              <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4 space-y-3">
                {cf ? (() => {
                  const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
                  const validTiers = ([
                    { days: 5, pct: cf.multi_5days_before_percentage },
                    { days: 3, pct: cf.multi_3days_before_percentage },
                    { days: 2, pct: cf.multi_2days_before_percentage },
                    { days: 1, pct: cf.multi_1day_before_percentage },
                  ] as { days: number; pct: string | null | undefined }[]).filter(t => {
                    if (t.pct == null) return false;
                    if (!checkIn) return true;
                    const cutoff = new Date(checkIn + 'T00:00:00');
                    cutoff.setDate(cutoff.getDate() - t.days);
                    return cutoff >= todayMidnight;
                  });
                  if (validTiers.length === 0) {
                    return <p className="text-sm font-semibold text-destructive">Цуцлах боломжгүй — бүх хугацаа өнгөрсөн байна.</p>;
                  }
                  return validTiers.map(tier => {
                    const pct = parseFloat(tier.pct!);
                    const feeBase = rooms.reduce((sum, r) => sum + r.total_price, 0);
                    const fee = Math.round((feeBase * pct) / 100);
                    return (
                      <div key={tier.days} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{multiCutoffDate(tier.days)}-с өмнө цуцалбал:</span>
                        <span className="font-semibold">
                          {pct >= 100 ? 'Цуцлах боломжгүй' : pct === 0 ? 'Үнэгүй' : `${fee.toLocaleString()} ₮ (${pct}%)`}
                        </span>
                      </div>
                    );
                  });
                })() : (
                  [1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between animate-pulse">
                      <div className="h-4 bg-muted rounded w-36" />
                      <div className="h-4 bg-muted rounded w-20" />
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground italic mt-2">
                *Тухайн буудлын бодлогоос хамааран цуцлалтын хураамж өөр байж болно.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const backUrl = `/hotel/${hotelId}?checkIn=${urlCheckIn}&checkOut=${urlCheckOut}&adults=${adultsCount}&children=${childrenCount}`;
                router.push(backUrl);
              }}
            >
              Буцах
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                setMultiRoomCancelModalOpen(false);
                setCancellationAccepted(true);
              }}
            >
              Ойлголоо, үргэлжлүүлэх
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    {searchedRoomsCount} өрөө,{' '}
                    {adultsCount} том хүн{childrenCount > 0 ? `, ${childrenCount} хүүхэд` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Сонгосон өрөөний тоо:</span>
                  <span className={`font-medium ${rooms.reduce((s,r)=>s+r.room_count,0) < searchedRoomsCount ? 'text-red-500' : ''}`}>
                    {rooms.reduce((s, r) => s + r.room_count, 0)} өрөө
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Сонгосон өрөөний багтаамж:</span>
                  <span className={`font-medium ${adultsCount > rooms.reduce((s,r)=>s+(r.max_adults??1)*r.room_count,0) ? 'text-red-500' : ''}`}>
                    {rooms.reduce((s, r) => s + (r.max_adults ?? 1) * r.room_count, 0)} том хүн
                    {rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0) > 0
                      ? `, ${rooms.reduce((s, r) => s + (r.max_children ?? 0) * r.room_count, 0)} хүүхэд`
                      : ''}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Таны хайлтын мэдээлэл сонгосон өрөөтэй таарахгүй байна.
                Өрөө сонгох хуудас руу буцаж өрөө эсвэл зочдын тоогоо дахин шалгана уу.
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
                onClick={() => {
                  setMismatchModalOpen(false);
                  if (pendingMultiRoomModal) {
                    setPendingMultiRoomModal(false);
                    setMultiRoomCancelModalOpen(true);
                  }
                }}
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
              Цуцлах хүсэлтийг &ldquo;Захиалга шалгах&rdquo; хэсгээр эсвэл info@myroom.mn
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