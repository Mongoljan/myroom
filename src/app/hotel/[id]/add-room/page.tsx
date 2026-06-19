'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { hotelRoomsService, EnrichedHotelRoom } from '@/services/hotelRoomsApi';
import { BookingService } from '@/services/bookingApi';
import { BookingDetails } from '@/types/api';
import TripComStyleRoomCard from '@/components/hotels/TripComStyleRoomCard';
import BookingSummary from '@/components/hotels/BookingSummary';
import { RoomPriceOptions, BookingItem } from '@/components/hotels/RoomCard';
import BookingPaymentStep from '@/components/booking/BookingPaymentStep';
import { HotelRoomsSectionSkeleton } from '@/components/skeletons';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { getLocalizedFullRoomName, getLocaleCode } from '@/utils/roomNames';
import { getBookingPin } from '@/utils/bookingPinStorage';
import { splitCustomerName, flattenBookingDetails } from '@/utils/bookingConfirmationLoader';

// ── date helpers ──────────────────────────────────────────────────────────────

const MN_DAYS = ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'];

function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return `${d.getFullYear()} - ${String(d.getMonth() + 1).padStart(2, '0')} - ${String(d.getDate()).padStart(2, '0')}, ${MN_DAYS[d.getDay()]}`;
}

function calcNights(a: string, b: string): number {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
}

// BookingRoom shape expected by BookingPaymentStep
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

// ── page ──────────────────────────────────────────────────────────────────────

function AddRoomContent() {
  const { t, i18n } = useHydratedTranslation();
  const locale = getLocaleCode(i18n.language);
  const params  = useParams();
  const sp      = useSearchParams();
  const router  = useRouter();

  const hotelId     = Number(params.id);
  const bookingCode = sp.get('code')       || '';
  const rawPin      = sp.get('pin')        || '';
  const pinCode     = rawPin || (typeof window !== 'undefined' ? (getBookingPin(bookingCode) || '') : '');
  const checkIn     = sp.get('check_in')   || '';
  const checkOut    = sp.get('check_out')  || '';
  const hotelName   = sp.get('hotel_name') || '';
  const nights      = calcNights(checkIn, checkOut);

  const [rooms,         setRooms]         = useState<EnrichedHotelRoom[]>([]);
  const [roomPrices,    setRoomPrices]    = useState<Record<string, RoomPriceOptions>>({});
  const [bookingItems,  setBookingItems]  = useState<BookingItem[]>([]);
  const [existingRooms, setExistingRooms] = useState<BookingDetails[]>([]);
  const [loading,       setLoading]       = useState(true);

  // Customer info from the existing booking
  const [customerName,     setCustomerName]     = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone,    setCustomerPhone]    = useState('');
  const [customerEmail,    setCustomerEmail]    = useState('');

  // Payment step state
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentData, setPaymentData] = useState<{
    bookingCode: string;
    pinCode: string;
    bookingRooms: BookingRoom[];
    totalPrice: number;
  } | null>(null);

  // ── fetch rooms + existing booking ───────────────────────────────────────
  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;
    (async () => {
      try {
        setLoading(true);
        const [roomsData, bookingData] = await Promise.all([
          hotelRoomsService.getEnrichedHotelRooms(hotelId, checkIn, checkOut),
          bookingCode && pinCode
            ? BookingService.checkBooking(bookingCode, pinCode).catch(() => null)
            : Promise.resolve(null),
        ]);
        setRooms(roomsData);
        if (bookingData?.bookings) {
          const allRooms = flattenBookingDetails(bookingData.bookings);
          setExistingRooms(allRooms);
          const first = allRooms[0];
          if (first) {
            const { firstName, lastName } = splitCustomerName(first.customer_name || '');
            setCustomerName(firstName);
            setCustomerLastName(lastName);
            setCustomerPhone(first.customer_phone || '');
            setCustomerEmail(first.customer_email || '');
          }
        }

        const pricesData: Record<string, RoomPriceOptions> = {};
        roomsData.forEach(room => {
          const key      = `${room.room_type}-${room.room_category}`;
          const selling  = room.pricing?.per_night?.without_breakfast?.selling_price  ?? room.price_breakdown?.final_customer_price ?? 0;
          const original = room.pricing?.per_night?.without_breakfast?.original_price ?? room.price_breakdown?.base_price ?? selling;
          const discPct  = room.pricing?.per_night?.without_breakfast?.discount_percent ?? 0;
          const withBf   = room.pricing?.per_night?.with_breakfast?.selling_price ?? 0;
          const bfAddon  = room.pricing?.breakfast_price ?? 0;

          if (selling > 0) {
            pricesData[key] = {
              basePrice:        selling,
              basePriceRaw:     original,
              halfDayPrice:     room.half_day_price    && room.half_day_price    > 0 ? room.half_day_price    : undefined,
              singlePersonPrice: room.single_person_price && room.single_person_price > 0 ? room.single_person_price : undefined,
              breakfastPrice:   withBf > 0 ? withBf : bfAddon > 0 ? selling + bfAddon : undefined,
              breakfastPriceRaw: room.pricing?.per_night?.with_breakfast?.original_price ?? undefined,
              discount:         discPct > 0 ? { type: 'PERCENT' as const, value: Math.round(discPct) } : undefined,
              priceBreakdown:   room.price_breakdown,
            };
          }
        });
        setRoomPrices(pricesData);
      } finally {
        setLoading(false);
      }
    })();
  }, [hotelId, checkIn, checkOut]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── room selection logic ──────────────────────────────────────────────────
  const updateQty = (
    room: EnrichedHotelRoom,
    priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast',
    quantity: number
  ) => {
    if (quantity === 0) {
      setBookingItems(prev => prev.filter(i => !(i.room.id === room.id && i.priceType === priceType)));
      return;
    }
    const key          = `${room.room_type}-${room.room_category}`;
    const priceOptions = roomPrices[key];
    if (!priceOptions) return;

    const maxQty = room.rooms_possible > 0 ? room.rooms_possible : room.number_of_rooms_to_sell;
    let price    = priceOptions.basePrice;
    if (priceType === 'halfDay'       && priceOptions.halfDayPrice)      price = priceOptions.halfDayPrice;
    if (priceType === 'singlePerson'  && priceOptions.singlePersonPrice) price = priceOptions.singlePersonPrice;
    if (priceType === 'withBreakfast' && priceOptions.breakfastPrice)    price = priceOptions.breakfastPrice;

    setBookingItems(prev => {
      const otherQty  = prev.filter(i => i.room.id === room.id && i.priceType !== priceType).reduce((s, i) => s + i.quantity, 0);
      const cappedQty = Math.min(quantity, maxQty - otherQty);
      if (cappedQty <= 0) return prev.filter(i => !(i.room.id === room.id && i.priceType === priceType));

      const newItem: BookingItem = { room, priceType, quantity: cappedQty, price, maxQuantity: maxQty };
      const idx = prev.findIndex(i => i.room.id === room.id && i.priceType === priceType);
      if (idx >= 0) { const u = [...prev]; u[idx] = newItem; return u; }
      return [...prev, newItem];
    });
  };

  const handleQuantityChange = (
    roomId: number,
    priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast',
    quantity: number
  ) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) updateQty(room, priceType, quantity);
  };

  const handleRemoveRoom = (
    roomId: number,
    priceType: 'base' | 'halfDay' | 'singlePerson' | 'withBreakfast'
  ) => handleQuantityChange(roomId, priceType, 0);

  const totalRooms = bookingItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = bookingItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // ── step 1 → call addRoom API then show payment ───────────────────────────
  const handleBookNow = async () => {
    if (!bookingItems.length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await BookingService.addRoom({
        booking_code: bookingCode,
        pin_code:     pinCode,
        rooms: bookingItems.map(item => ({
          room_category_id:  item.room.room_category,
          room_type_id:      item.room.room_type,
          room_count:        item.quantity,
          include_breakfast: item.priceType === 'withBreakfast',
        })),
      });

      // Build BookingRoom[] for BookingPaymentStep
      const bookingRooms: BookingRoom[] = bookingItems.map(item => ({
        room_category_id:  item.room.room_category,
        room_type_id:      item.room.room_type,
        room_count:        item.quantity,
        room_name:         getLocalizedFullRoomName(item.room, locale),
        price_per_night:   item.price,
        total_price:       item.price * item.quantity * nights,
        max_adults:        item.room.adultQty,
        max_children:      item.room.childQty,
        include_breakfast: item.priceType === 'withBreakfast',
      }));

      setPaymentData({
        bookingCode: res.booking_code,
        pinCode:     res.pin_code,
        bookingRooms,
        totalPrice:  totalPrice * nights,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('addRoom.errorGeneric', 'Алдаа гарлаа'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── step 2: payment screen (reuses BookingPaymentStep) ───────────────────
  if (paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BookingPaymentStep
            bookingCode={paymentData.bookingCode}
            pinCode={paymentData.pinCode}
            totalPrice={paymentData.totalPrice}
            rooms={paymentData.bookingRooms}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            hotelName={hotelName}
            hotelDetails={null}
            hotelPolicy={null}
            adultsCount={1}
            childrenCount={0}
            customerName={customerName}
            customerLastName={customerLastName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            onCancelBooking={() => setPaymentData(null)}
            onPaymentConfirmed={() => {
              router.push(
                `/booking/confirmation?code=${encodeURIComponent(paymentData.bookingCode)}&pin=${encodeURIComponent(paymentData.pinCode)}`
              );
            }}
          />
        </div>
      </div>
    );
  }

  // ── step 1: room selection ────────────────────────────────────────────────
  return (
    <>
      {/* ── Info bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 h-[90px] flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 text-[#0e68dd] text-sm hover:underline w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('common.back', 'Буцах')}
            </button>
            <p className="text-[18px] font-medium text-[#464646]">{hotelName}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[11px] text-[#464646] mb-0.5">{t('addRoom.checkInLabel', 'Орох өдөр')}</p>
              <p className="text-[13px] font-semibold text-black">{fmtDate(checkIn)}</p>
            </div>
            <p className="text-[12px] text-[#464646]">-{nights} {t('addRoom.nights', 'шөнө')}-</p>
            <div className="text-center">
              <p className="text-[11px] text-[#464646] mb-0.5">{t('addRoom.checkOutLabel', 'Гарах өдөр')}</p>
              <p className="text-[13px] font-semibold text-black">{fmtDate(checkOut)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#f4f5f7] min-h-screen py-6">
        <div className="max-w-[1400px] mx-auto px-6">

          <p className="text-[18px] text-black font-normal mb-4">{t('addRoom.availableRooms', 'Боломжит өрөөнүүд')}</p>

          {loading ? (
            <HotelRoomsSectionSkeleton />
          ) : (
            <div className="flex gap-5 items-start">

              {/* ── Room cards ──────────────────────────────────────────── */}
              <div className="flex-1 min-w-0 space-y-3">
                {rooms.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                    {t('addRoom.noRooms', 'Өрөө олдсонгүй')}
                  </div>
                ) : rooms.map(room => {
                  const key          = `${room.room_type}-${room.room_category}`;
                  const priceOptions = roomPrices[key];
                  const roomItems    = bookingItems.filter(i => i.room.id === room.id);
                  return (
                    <TripComStyleRoomCard
                      key={room.id}
                      room={room}
                      priceOptions={priceOptions}
                      bookingItems={roomItems}
                      onQuantityChange={(priceType, qty) => updateQty(room, priceType, qty)}
                      nights={nights}
                      checkIn={checkIn}
                      totalSelectedRooms={totalRooms}
                    />
                  );
                })}
              </div>

              {/* ── Right panel ──────────────────────────────────────────── */}
              <div className="w-[300px] shrink-0 space-y-3 sticky top-[90px]">

                {/* Existing booked rooms */}
                {existingRooms.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">
                      {t('addRoom.currentlyBooked', 'Одоо захиалсан өрөөнүүд')}
                    </h3>
                    <div className="space-y-2">
                      {existingRooms.map((b) => {
                        const matchedRoom = rooms.find(r => r.id === b.room);
                        const label = matchedRoom
                          ? getLocalizedFullRoomName(matchedRoom, locale)
                          : `${t('addRoom.room', 'Өрөө')} #${b.room}`;
                        const isAdded = Boolean(b.parent_booking);
                        return (
                          <div key={b.id} className="flex items-start justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{label}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {isAdded
                                  ? t('bookingExtra.addedRoom', 'Нэмсэн өрөө')
                                  : t('bookingExtra.originalRoom', 'Анхны захиалга')}
                                {' · '}
                                {b.status === 'confirmed' ? t('addRoom.statusConfirmed', 'Баталгаажсан')
                                  : b.status === 'finished' ? t('addRoom.statusFinished', 'Дууссан')
                                  : b.status === 'canceled' ? t('addRoom.statusCanceled', 'Цуцлагдсан')
                                  : b.status}
                              </p>
                            </div>
                            <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                              ₮{Number(b.total_price).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{t('addRoom.totalBooked', 'Нийт захиалга')}:</span>
                      <span className="text-xs font-bold text-gray-800">
                        ₮{existingRooms.reduce((s, b) => s + Number(b.total_price), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* New rooms selection summary */}
                <BookingSummary
                  items={bookingItems}
                  totalRooms={totalRooms}
                  totalPrice={totalPrice}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  onQuantityChange={handleQuantityChange}
                  onRemoveRoom={handleRemoveRoom}
                  onBookNow={handleBookNow}
                />
                {submitting && (
                  <p className="text-center text-sm text-gray-500 mt-2">{t('addRoom.adding', 'Уншиж байна...')}</p>
                )}
                {submitError && (
                  <p className="text-center text-sm text-red-500 mt-2">{submitError}</p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AddRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f5f7]">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 h-[90px]" />
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <HotelRoomsSectionSkeleton />
        </div>
      </div>
    }>
      <AddRoomContent />
    </Suspense>
  );
}
