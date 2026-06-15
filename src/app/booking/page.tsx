"use client";

import { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Check, Star, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { BookingService } from '@/services/bookingApi';
import { ApiService } from '@/services/api';
import { CreateBookingRequest, CreateBookingResponse, PropertyPolicy, CheckBookingResponse } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import BookingConfirmationView from '@/components/booking/BookingConfirmationView';
import { useAuth } from '@/contexts/AuthContext';
import BookingPaymentStep from '@/components/booking/BookingPaymentStep';
import BookingSidebarRoomsSection from '@/components/booking/BookingSidebarRoomsSection';
import BackButton from '@/components/common/BackButton';
import { formatHotelLocation } from '@/utils/formatHotelLocation';
import {
  saveBookingPaymentContext,
  clearPaymentSession,
  doesUrlMatchPaymentContext,
  getBookingPaymentContext,
} from '@/utils/pendingPaymentSession';
import { clearQPaySession } from '@/utils/qpaySession';
import {
  getCreateBookingTotal,
  getSelectedRoomsGuestCapacity,
  syncRoomsFromCreateResponse,
} from '@/utils/booking';
import { getCheckInTimeDisplay, getCheckOutTimeDisplay } from '@/utils/policyFormatters';
import { saveBookingPin } from '@/utils/bookingPinStorage';
import EbarimtCyrillicLetterSelect from '@/components/booking/EbarimtCyrillicLetterSelect';
import {
  createBookingGuestFormSchema,
  parseBookingGuestFormErrors,
  type BookingGuestFormField,
} from '@/utils/bookingGuestFormSchema';
import { getLocaleCode, resolveRoomDisplayNameFromAllData } from '@/utils/roomNames';
import type { AllData } from '@/types/api';

function StepLabel({ labelKey }: { labelKey: string }) {
  const { t } = useHydratedTranslation();
  const parts = t(labelKey).split('\n');
  return (
    <>
      {parts[0]}
      {parts[1] ? (
        <>
          <br />
          {parts[1]}
        </>
      ) : null}
    </>
  );
}

function BookingStepper({ activeStep }: { activeStep: 2 | 3 }) {
  const steps = [
    { id: 1, labelKey: 'bookingFlow.stepRoom' },
    { id: 2, labelKey: 'bookingFlow.stepGuest' },
    { id: 3, labelKey: 'bookingFlow.stepPayment' },
  ] as const;

  return (
    <div className="mb-8 flex items-start w-full">
      {steps.map((step, index) => {
        const isComplete = step.id < activeStep;
        const isActive = step.id === activeStep;
        const circleClass = isActive
          ? 'w-11 h-11 bg-gray-50 text-primary tracking-wider shadow-[0_0_0_2px_rgba(59,130,246,0.20)] ring-3 ring-primary/20'
          : isComplete
            ? 'w-9 h-9 bg-primary text-white'
            : 'w-9 h-9 bg-gray-200 dark:bg-gray-700 text-gray-500';
        const labelClass = isActive
          ? 'text-sm font-bold text-gray-900 dark:text-white'
          : isComplete
            ? 'text-xs font-medium text-gray-500 dark:text-white'
            : 'text-xs font-medium text-gray-500 dark:text-gray-400';
        const lineClass = index < steps.length - 1
          ? isComplete || activeStep > step.id
            ? 'flex-1 h-0.5 bg-primary mt-4 rounded-full'
            : 'flex-1 h-0.5 bg-gray-300 dark:bg-gray-700 mt-4 rounded-full'
          : '';

        return (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center min-w-0">
              <motion.div
                initial={false}
                animate={isActive ? { scale: [1, 1.08, 1], y: [-1, 0, -1] } : { scale: 1, y: 0 }}
                transition={isActive ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                className={`${circleClass} rounded-full flex items-center justify-center shrink-0 text-xl font-bold transition-all duration-300`}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className={isActive ? 'text-base' : 'text-sm'}>{step.id}</span>
                )}
              </motion.div>
              <span className={`${labelClass} mt-1.5 text-center leading-tight`}>
                <StepLabel labelKey={step.labelKey} />
              </span>
            </div>
            {lineClass ? <div className={lineClass} /> : null}
          </Fragment>
        );
      })}
    </div>
  );
}

interface BookingRoom {
  room_category_id: number;
  room_type_id: number;
  room_count: number;
  room_name: string;
  price_per_night: number;
  total_price: number;
  max_adults?: number;
  max_children?: number;
  include_breakfast?: boolean;
}

function parseHotelStarCount(ratingStars?: { value?: string } | null): number {
  const match = ratingStars?.value?.match(/(\d+)/);
  return match ? Math.min(5, Math.max(0, parseInt(match[1], 10))) : 0;
}

function getGuestRatingDisplay(ratingStars?: { value?: string; label?: string } | null): {
  score: number;
  label: string;
} | null {
  if (!ratingStars?.value || /star/i.test(ratingStars.value)) return null;
  const score = parseFloat(ratingStars.value);
  if (!Number.isFinite(score) || score <= 0 || score > 10) return null;
  const label = ratingStars.label?.replace(/\d+\.?\d*\s*stars?/i, '').trim() || '';
  return { score, label };
}

function BookingContent() {
  const { t, tAny, i18n } = useHydratedTranslation();
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
  const selectedGuestCapacity = useMemo(
    () => getSelectedRoomsGuestCapacity(rooms),
    [rooms]
  );

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
  const [formErrors, setFormErrors] = useState<Partial<Record<BookingGuestFormField, string>>>({});

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

  const [allRoomData, setAllRoomData] = useState<AllData | null>(null);

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

  // Restore step 3 only when URL matches the pending payment in session (avoids stale booking_code)
  useEffect(() => {
    let urlRooms: BookingRoom[] = [];
    try {
      if (roomsData) {
        urlRooms = JSON.parse(decodeURIComponent(roomsData));
      }
    } catch { /* ignore */ }

    const canResumeStep3 =
      sessionStorage.getItem('booking_step') === '3' &&
      doesUrlMatchPaymentContext({
        hotelId,
        checkIn: urlCheckIn,
        checkOut: urlCheckOut,
        totalPrice: urlTotalPrice,
        rooms: urlRooms,
      });

    if (!canResumeStep3) {
      if (sessionStorage.getItem('booking_step') === '3') {
        clearPaymentSession();
      }
      setHasMounted(true);
      return;
    }

    setStep(3);
    try {
      const saved = sessionStorage.getItem('booking_result');
      if (saved) {
        const parsed = JSON.parse(saved) as CreateBookingResponse;
        setBookingResult(parsed);
        if (parsed.booking_code && parsed.pin_code) {
          saveBookingPin(parsed.booking_code, parsed.pin_code);
        }
      }
    } catch { /* ignore */ }

    const savedContext = getBookingPaymentContext();
    if (savedContext) {
      if (!customerName && savedContext.customerName) setCustomerName(savedContext.customerName);
      if (!customerLastName && savedContext.customerLastName) setCustomerLastName(savedContext.customerLastName);
      if (!customerPhone && savedContext.customerPhone) setCustomerPhone(savedContext.customerPhone);
      if (!customerEmail && savedContext.customerEmail) setCustomerEmail(savedContext.customerEmail);
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
        const [hotelData, policyData, roomLookups] = await Promise.all([
          ApiService.getHotelDetails(hotelId).catch(() => null),
          ApiService.getPropertyPolicies(hotelId).catch(() => []),
          ApiService.getAllData().catch(() => null),
        ]);

        setHotelDetails(hotelData);
        setHotelPolicy(policyData[0] || null);
        setAllRoomData(roomLookups);
      } catch {
        // silent fail — UI already handles missing hotel data
      } finally {
        setLoadingHotelData(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  // Resolve full localized room names (category + type) from all-data
  useEffect(() => {
    if (!allRoomData || !roomsData) return;

    let parsedRooms: BookingRoom[] = [];
    try {
      parsedRooms = JSON.parse(decodeURIComponent(roomsData));
    } catch {
      return;
    }
    if (!parsedRooms.length) return;

    const locale = getLocaleCode(i18n.language);
    setRooms((prev) => {
      const source = prev.length === parsedRooms.length ? prev : parsedRooms;
      return source.map((room, index) => {
        const ids = parsedRooms[index] ?? room;
        return {
          ...room,
          room_name:
            resolveRoomDisplayNameFromAllData(
              {
                room_category_id: ids.room_category_id,
                room_type_id: ids.room_type_id,
              },
              allRoomData,
              locale
            ) || room.room_name,
        };
      });
    });
  }, [allRoomData, i18n.language, roomsData]);

  // After create (or session restore), use API pricing as source of truth — not URL estimates
  useEffect(() => {
    if (!bookingResult?.pricing?.length) return;
    const apiTotal = getCreateBookingTotal(bookingResult);
    if (apiTotal <= 0) return;
    setTotalPrice(apiTotal);
    setRooms((prev) => (prev.length ? syncRoomsFromCreateResponse(prev, bookingResult) : prev));
  }, [bookingResult]);

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
      clearFieldError('tosAccepted');
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

  // Auto-lookup organization name when register number is complete
  useEffect(() => {
    if (ebarimtType !== 'organization') return;
    if (orgRegister.length === 7) {
      setOrgName('');
      lookupEbarimt(orgRegister).then((name) => {
        if (name) setOrgName(name);
      });
    } else {
      setOrgName('');
      setEbarimtError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgRegister, ebarimtType]);

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
    setPromoMessage(t('bookingFlow.promoInvalid'));
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
      setEbarimtError(t('bookingFlow.ebarimtNotFound'));
      return null;
    } catch {
      setEbarimtError(t('bookingFlow.ebarimtConnectionError'));
      return null;
    } finally {
      setEbarimtLoading(false);
    }
  };

  const clearFieldError = (field: BookingGuestFormField) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const guestInputClass = (field: BookingGuestFormField) =>
    `w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:border-primary disabled:opacity-50 ${
      formErrors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
    }`;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const guestSchema = createBookingGuestFormSchema({
      nameRequired: t('bookingFlow.validation.nameRequired', 'Нэр оруулна уу'),
      emailRequired: t('bookingFlow.validation.emailRequired', 'И-мэйл хаяг оруулна уу'),
      emailInvalid: t('bookingFlow.validation.emailInvalid', 'И-мэйл хаяг буруу байна'),
      phoneRequired: t('bookingFlow.validation.phoneRequired', 'Утасны дугаар оруулна уу'),
      phoneInvalid: t('bookingFlow.validation.phoneInvalid', 'Утасны дугаар буруу байна'),
      cancellationRequired: t(
        'bookingFlow.validation.cancellationRequired',
        'Захиалга цуцлах нөхцлийг зөвшөөрнө үү'
      ),
      tosRequired: t('bookingFlow.validation.tosRequired', 'Үйлчилгээний нөхцөлийг зөвшөөрнө үү'),
    });

    const guestResult = guestSchema.safeParse({
      customerName,
      customerEmail,
      customerPhone,
      cancellationAccepted,
      tosAccepted,
    });

    if (!guestResult.success) {
      const errors = parseBookingGuestFormErrors(guestResult.error);
      setFormErrors(errors);
      const scrollTarget =
        errors.customerName || errors.customerEmail || errors.customerPhone
          ? 'booking-guest-section'
          : errors.cancellationAccepted
            ? 'booking-cancellation-section'
            : 'booking-tos-section';
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setFormErrors({});

    if (!ebarimtValid) {
      document.getElementById('booking-guest-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setBookingInProgress(true);

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
        rooms: rooms.map((room) => ({
          room_category_id: room.room_category_id,
          room_type_id: room.room_type_id,
          room_count: room.room_count,
          include_breakfast: room.include_breakfast ?? false,
        })),
      };

      const result = await BookingService.createBooking(bookingRequest);
      const apiTotal = getCreateBookingTotal(result);
      const syncedRooms = syncRoomsFromCreateResponse(rooms, result);
      const resolvedTotal = apiTotal > 0 ? apiTotal : totalPrice;
      const resolvedRooms = apiTotal > 0 ? syncedRooms : rooms;

      clearQPaySession();
      sessionStorage.setItem('booking_step', '3');
      sessionStorage.setItem('booking_result', JSON.stringify(result));
      saveBookingPin(result.booking_code, result.pin_code);
      if (apiTotal > 0) {
        setTotalPrice(resolvedTotal);
        setRooms(resolvedRooms);
      }
      saveBookingPaymentContext({
        hotelId,
        hotelName,
        checkIn,
        checkOut,
        totalPrice: resolvedTotal,
        nights,
        adults: adultsCount,
        children: childrenCount,
        searchedRooms: searchedRoomsCount,
        rooms: resolvedRooms,
        customerName,
        customerLastName,
        customerPhone,
        customerEmail,
        bookingCode: result.booking_code,
      });
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
    return (
      <BookingConfirmationView
        bookingResult={bookingResult}
        checkedBooking={checkedBooking}
        rooms={rooms}
        hotelId={hotelId}
        hotelName={hotelName}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        totalPrice={totalPrice}
        adultsCount={adultsCount}
        childrenCount={childrenCount}
        customerName={customerName}
        customerLastName={customerLastName}
        customerPhone={customerPhone}
        customerEmail={customerEmail}
        hotelDetails={hotelDetails}
        hotelPolicy={hotelPolicy}
      />
    );
  }


  // ─── Step 3: Payment ───────────────────────────────────────────
  if (step === 3 && bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stepper — Step 3 active */}
          <BookingStepper activeStep={3} />

          <BookingPaymentStep
            bookingCode={bookingResult.booking_code}
            pinCode={bookingResult.pin_code}
            totalPrice={totalPrice}
            rooms={rooms}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            hotelName={hotelName}
            hotelDetails={hotelDetails}
            hotelPolicy={hotelPolicy}
            adultsCount={adultsCount}
            childrenCount={childrenCount}
            customerName={customerName}
            customerLastName={customerLastName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            orgName={orgName}
            orgRegister={orgRegister}
            onCancelBooking={() => {
              clearPaymentSession();
              router.push(`/hotel/${hotelId}`);
            }}
            onPaymentConfirmed={() => {
              clearPaymentSession();
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

  const displayHotelName = hotelDetails?.property_name || hotelName;
  const locationText = formatHotelLocation(hotelDetails?.location);
  const hotelStarCount = parseHotelStarCount(hotelDetails?.rating_stars);
  const guestRating = getGuestRatingDisplay(hotelDetails?.rating_stars);

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
    const wkMap = tAny('bookingFlow.weekdays', { returnObjects: true }) as string[];
    return `${date.getFullYear()} -${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${wkMap[date.getDay()]}`;
  };

  const checkInTimeRange = getCheckInTimeDisplay(hotelPolicy, '15:00 — 23:00');
  const checkOutTimeRange = getCheckOutTimeDisplay(hotelPolicy, '01:00 — 11:00');

  const ebarimtValid =
    !wantEbarimt ||
    ebarimtType === 'individual' ||
    (ebarimtType === 'organization' && orgRegister.length === 7 && !!orgName) ||
    (ebarimtType === 'taxpayer' &&
      taxpayerRegisterPrefix1.length === 1 &&
      taxpayerRegisterPrefix2.length === 1 &&
      taxpayerRegisterNumber.length === 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <BackButton onClick={() => router.back()} stepperAnchor />
          {/* Stepper — Step 2 active */}
          <BookingStepper activeStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              id="booking-guest-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                {t('bookingFlow.guestInfoTitle')}
              </h2>

              {bookingError && (
                <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700">{bookingError}</p>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} id="booking-form" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">{t('bookingFlow.LastNameLabel')}</label>
                  <input
                    type="text"
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    disabled={bookingInProgress}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                    placeholder={t('bookingFlow.placeholderLastName')}
                  />
                </div>
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">{t('bookingFlow.FirstNameLabel')}</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        clearFieldError('customerName');
                      }}
                      disabled={bookingInProgress}
                      className={guestInputClass('customerName')}
                      placeholder={t('bookingFlow.placeholderFirstName')}
                    />
                    {formErrors.customerName && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.customerName}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">{t('bookingFlow.EmailLabel')}</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        clearFieldError('customerEmail');
                      }}
                      disabled={bookingInProgress}
                      className={guestInputClass('customerEmail')}
                      placeholder={t('bookingFlow.placeholderEmail')}
                    />
                    {formErrors.customerEmail && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.customerEmail}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">{t('bookingFlow.PhoneLabel')}</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        clearFieldError('customerPhone');
                      }}
                      disabled={bookingInProgress}
                      className={guestInputClass('customerPhone')}
                      placeholder={t('bookingFlow.placeholderPhone')}
                    />
                    {formErrors.customerPhone && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.customerPhone}</p>
                    )}
                  </div>
                </div>

                {/* E-Баримт */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-muted/30 dark:bg-muted/10 p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ebarimt-logo.png" alt={t('bookingFlow.ebarimtAlt')} className="w-9 h-9 object-contain" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('bookingFlow.ebarimtTitle')}</span>
                    </div>
                    {/* Toggle */}
                    <div className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-0.5 border border-gray-200 dark:border-gray-700 shrink-0">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={!wantEbarimt}
                        onClick={() => {
                          setWantEbarimt(false);
                          setEbarimtType(null);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                          !wantEbarimt
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {t('bookingFlow.ebarimtToggleDecline')}
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={wantEbarimt}
                        onClick={() => {
                          setWantEbarimt(true);
                          setEbarimtType('individual');
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                          wantEbarimt
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {t('bookingFlow.ebarimtToggleAccept')}
                      </button>
                    </div>
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
                      <span className="text-sm text-gray-800">{t('bookingFlow.ebarimtIndividual')}</span>
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
                        <span className="text-sm text-gray-800">{t('bookingFlow.ebarimtOrganization')}</span>
                      </label>
                      {ebarimtType === 'organization' && (
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">{t('bookingFlow.registerNumberLabel')}</label>
                            <div className="flex gap-2">
                              <input
                                value={orgRegister}
                                onChange={(e) => {
                                  setOrgRegister(e.target.value.replace(/\D/g, '').slice(0, 7));
                                  setOrgName('');
                                  setEbarimtError(null);
                                }}
                                placeholder="0000000"
                                maxLength={7}
                                inputMode="numeric"
                                className="flex-1 p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                            </div>
                            {ebarimtLoading && ebarimtType === 'organization' && (
                              <p className="text-xs text-gray-500 mt-1">{t('bookingFlow.searching')}</p>
                            )}
                            {ebarimtError && <p className="text-xs text-red-500 mt-1">{ebarimtError}</p>}
                          </div>
                          {orgName && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">{t('bookingFlow.orgNameLabel')}</label>
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
                        <span className="text-sm text-gray-800">{t('bookingFlow.ebarimtTaxpayerPerson')}</span>
                      </label>
                      {ebarimtType === 'taxpayer' && (
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">{t('bookingFlow.registerNumberLabel')}</label>
                            <div className="flex gap-2">
                              <EbarimtCyrillicLetterSelect
                                value={taxpayerRegisterPrefix1}
                                onChange={setTaxpayerRegisterPrefix1}
                                placeholder={t('bookingFlow.ebarimtTaxPrefix1')}
                              />
                              <EbarimtCyrillicLetterSelect
                                value={taxpayerRegisterPrefix2}
                                onChange={setTaxpayerRegisterPrefix2}
                                placeholder={t('bookingFlow.ebarimtTaxPrefix2')}
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
                              <p className="text-xs text-gray-500 mt-1">{t('bookingFlow.searching')}</p>
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
              id="booking-cancellation-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <label className="flex items-start gap-3 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={cancellationAccepted}
                  onChange={(e) => {
                    setCancellationAccepted(e.target.checked);
                    if (e.target.checked) clearFieldError('cancellationAccepted');
                  }}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('bookingFlow.cancelPolicyAccept')}
                </span>
              </label>
              {formErrors.cancellationAccepted && (
                <p className="text-xs text-red-500 mb-3 ml-7">{formErrors.cancellationAccepted}</p>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400 ml-7 mb-4">
                {t('bookingFlow.cancelPolicyIntro')}
              </p>

              <div className="ml-7">
                <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                  {t('bookingFlow.cancelFeeTitle')}
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
                        <p className="text-sm text-red-500 dark:text-red-400 font-medium py-1">{t('bookingFlow.cancelNotAllowed')}</p>
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
                                : afterPct >= 100  ? t('bookingFlow.cancelNotAllowed')
                                : afterPct === 0   ? t('bookingFlow.cancelFree')
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
                              <tr><td colSpan={3} className="py-3 text-gray-500 text-center">{t('bookingFlow.noRoomPolicyInfo')}</td></tr>
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
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium py-1">{t('bookingFlow.cancelAllowed')}</p>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                  {t('bookingFlow.cancelPerHotelNote')}
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
                {t('bookingFlow.bookingSummary')}
              </h3>

              {/* Hotel summary */}
              <div className="flex gap-3 mb-4">
                {heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt={displayHotelName}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {hotelStarCount > 0 && (
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(hotelStarCount)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {displayHotelName}
                  </h4>
                  {locationText && (
                    <div className="flex  gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                      <span className="">{locationText}</span>
                    </div>
                  )}
                  {guestRating && (
                    <div className="inline-flex items-center gap-1.5 mt-1.5">
                      <span className="bg-primary text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        {guestRating.score.toFixed(1)}
                      </span>
                      {guestRating.label ? (
                        <span className="text-xs text-gray-700 dark:text-gray-300">{guestRating.label}</span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('bookingFlow.checkInTime')}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDateShort(checkIn)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{checkInTimeRange}</div>
                  </div>
                  <div className="flex flex-col items-center px-2 pt-2">
                    <span className="text-xs text-gray-500">{t('bookingFlow.nights', { count: nights })}</span>
                    <div className="w-px h-6 bg-gray-300 mt-1" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('bookingFlow.checkOutTime')}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDateShort(checkOut)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{checkOutTimeRange}</div>
                  </div>
                </div>
              </div>

              <BookingSidebarRoomsSection
                rooms={rooms}
                selectedRoomsLabel={t('bookingFlow.selectedRooms')}
                basePriceLabel={t('bookingFlow.basePrice')}
                totalPrice={totalPrice}
                adultCapacity={selectedGuestCapacity.adults}
                childCapacity={selectedGuestCapacity.children}
                guestCapacityLabel={t('bookingFlow.guestCapacity')}
              />

              {/* Promo code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t('bookingFlow.promoPlaceholder')}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    {t('bookingFlow.applyPromo')}
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
                    {t('bookingFlow.totalDue')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalPrice.toLocaleString()}₮
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right mt-0.5">{t('bookingFlow.vatIncluded')}</div>
              </div>

              {/* Terms acceptance */}
              <div id="booking-tos-section">
              <label className="flex items-start gap-2 mb-8 cursor-pointer">
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
                  {t('bookingFlow.acceptTerms')}
                </span>
              </label>
              {formErrors.tosAccepted && (
                <p className="text-xs text-red-500 mb-3">{formErrors.tosAccepted}</p>
              )}
              </div>

              <Button
                type="submit"
                form="booking-form"
                disabled={bookingInProgress}
                className="w-full"
              >
                {bookingInProgress ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    {t('bookingExtra.bookingInProgress', 'Уншиж байна...')}
                  </span>
                ) : (
                  t('bookingFlow.confirmBooking')
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
            <DialogTitle>{t('bookingFlow.mismatchTitle')}</DialogTitle>
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
              <p className="text-base font-semibold mb-2">{t('bookingFlow.multiRoomTitle')}</p>
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
                    return <p className="text-sm font-semibold text-destructive">{t('bookingFlow.multiRoomAllExpired')}</p>;
                  }
                  return validTiers.map(tier => {
                    const pct = parseFloat(tier.pct!);
                    const feeBase = rooms.reduce((sum, r) => sum + r.total_price, 0);
                    const fee = Math.round((feeBase * pct) / 100);
                    return (
                      <div key={tier.days} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{multiCutoffDate(tier.days)}-с өмнө цуцалбал:</span>
                        <span className="font-semibold">
                          {pct >= 100 ? t('bookingFlow.cancelNotAllowed') : pct === 0 ? t('bookingFlow.cancelFree') : `${fee.toLocaleString()} ₮ (${pct}%)`}
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
                {t('bookingFlow.multiRoomNote')}
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
              {t('bookingFlow.back')}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                setMultiRoomCancelModalOpen(false);
                setCancellationAccepted(true);
              }}
            >
              {t('bookingFlow.mismatchUnderstand')}
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
                {t('bookingFlow.mismatchGuestMismatchTitle')}
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
                {t('bookingFlow.mismatchWarning')}
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('bookingFlow.mismatchBack')}
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
            <DialogTitle>{t('bookingFlow.tosTitle')}</DialogTitle>
            <p className="text-xs text-gray-500 mt-1">
              {t('bookingFlow.tosScrollHint')}
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
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 shrink-0">
            <p className={`text-xs ${tosScrolledToEnd ? 'text-emerald-600' : 'text-gray-500'}`}>
              {tosScrolledToEnd
                ? t('bookingFlow.tosScrolledOk')
                : t('bookingFlow.tosScrollContinue')}
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
                {t('bookingFlow.cancel')}
              </button>
              <button
                type="button"
                disabled={!tosScrolledToEnd}
                onClick={() => {
                  setTosAccepted(true);
                  clearFieldError('tosAccepted');
                  setTosModalOpen(false);
                }}
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {t('bookingFlow.tosAccept')}
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