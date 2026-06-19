'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Bed, CheckCircle, XCircle, Minus, Plus, Clock } from 'lucide-react';
import Header1 from '@/components/header/Header1';
import { ApiService } from '@/services/api';
import { BookingService } from '@/services/bookingApi';
import { Room, RoomPrice, AllRoomData } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

// ── helpers ──────────────────────────────────────────────────────────────────

const MN_DAYS = ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'];

function formatInfoBarDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dow = MN_DAYS[d.getDay()];
  return `${y} - ${m} - ${day}, ${dow}`;
}

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatMNT(amount: number): string {
  return amount.toLocaleString('mn-MN') + ' ₮';
}

// ── per-room availability ──────────────────────────────────────────────────────

interface AvailState { loading: boolean; count: number }

// ── selected room entry ──────────────────────────────────────────────────────

interface SelectedRoom {
  room: Room;
  quantity: number;
  pricePerNight: number;
  includeBreakfast: boolean;
}

// ── main component ────────────────────────────────────────────────────────────

function AddRoomContent() {
  const { t } = useHydratedTranslation();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelId = Number(params.id);
  const bookingCode = searchParams.get('code') || '';
  const pinCode = searchParams.get('pin') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const hotelName = searchParams.get('hotel_name') || '';
  const nights = calcNights(checkIn, checkOut);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [prices, setPrices] = useState<RoomPrice[]>([]);
  const [roomData, setRoomData] = useState<AllRoomData | null>(null);
  const [avail, setAvail] = useState<Record<number, AvailState>>({});
  const [selected, setSelected] = useState<SelectedRoom[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState<{ booking_code: string; pin_code: string; message: string } | null>(null);

  // fetch rooms + prices + room-data labels
  useEffect(() => {
    if (!hotelId) return;
    (async () => {
      try {
        setRoomsLoading(true);
        const [roomsRes, pricesRes, rdRes] = await Promise.all([
          ApiService.getRoomsInHotel(hotelId),
          ApiService.getRoomPrices(hotelId),
          ApiService.getAllRoomData(),
        ]);
        setRooms(roomsRes);
        setPrices(pricesRes);
        setRoomData(rdRes);
      } catch {
        // silent
      } finally {
        setRoomsLoading(false);
      }
    })();
  }, [hotelId]);

  // check availability per room once rooms are loaded and dates are available
  useEffect(() => {
    if (!rooms.length || !checkIn || !checkOut) return;
    rooms.forEach((room) => {
      setAvail((prev) => ({ ...prev, [room.id]: { loading: true, count: 0 } }));
      ApiService.checkAvailability(hotelId, room.room_type, room.room_category, checkIn, checkOut)
        .then((res) => {
          setAvail((prev) => ({ ...prev, [room.id]: { loading: false, count: res.available_rooms } }));
        })
        .catch(() => {
          setAvail((prev) => ({ ...prev, [room.id]: { loading: false, count: 0 } }));
        });
    });
  }, [rooms, hotelId, checkIn, checkOut]);

  // helpers
  const getRoomTypeName = (typeId: number) => {
    const type = roomData?.room_types.find((r) => r.id === typeId);
    return type ? (type.name_mn || type.name) : `Type ${typeId}`;
  };

  const getRoomCategoryName = (catId: number) => {
    const cat = roomData?.room_rates.find((r) => r.id === catId);
    return cat ? cat.name : `Rate ${catId}`;
  };

  const getPriceForRoom = (room: Room): number => {
    const match = prices.find(
      (p) => p.room_type === room.room_type && p.room_category === room.room_category
    );
    return match?.base_price || room.final_price || room.base_price || 0;
  };

  const getAvail = (roomId: number): AvailState =>
    avail[roomId] ?? { loading: true, count: 0 };

  // selection handlers
  const getSelectedEntry = (room: Room) => selected.find((s) => s.room.id === room.id);

  const setQuantity = (room: Room, qty: number) => {
    const price = getPriceForRoom(room);
    setSelected((prev) => {
      const exists = prev.find((s) => s.room.id === room.id);
      if (qty <= 0) return prev.filter((s) => s.room.id !== room.id);
      if (exists) return prev.map((s) => (s.room.id === room.id ? { ...s, quantity: qty } : s));
      return [...prev, { room, quantity: qty, pricePerNight: price, includeBreakfast: false }];
    });
  };

  const toggleBreakfast = (roomId: number) => {
    setSelected((prev) =>
      prev.map((s) =>
        s.room.id === roomId ? { ...s, includeBreakfast: !s.includeBreakfast } : s
      )
    );
  };

  const totalPrice = selected.reduce(
    (sum, s) => sum + s.pricePerNight * s.quantity * Math.max(nights, 1),
    0
  );

  // submit
  const handleAddRooms = async () => {
    if (!selected.length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await BookingService.addRoom({
        booking_code: bookingCode,
        pin_code: pinCode,
        rooms: selected.map((s) => ({
          room_category_id: s.room.room_category,
          room_type_id: s.room.room_type,
          room_count: s.quantity,
          include_breakfast: s.includeBreakfast,
        })),
      });
      setSuccessData(result);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('addRoom.errorGeneric', 'Алдаа гарлаа, дахин оролдоно уу.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── success screen ──────────────────────────────────────────────────────────

  if (successData) {
    return (
      <>
        <Header1 />
        <div className="pt-24 min-h-screen bg-[#eef0f3] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('addRoom.successTitle', 'Өрөө амжилттай нэмэгдлээ!')}
            </h2>
            <p className="text-gray-500 text-sm">{successData.message}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 text-left">
              <p>
                <span className="font-medium text-gray-700">{t('booking.bookingCode', 'Захиалгын код')}:</span>{' '}
                <span className="font-mono font-bold">{successData.booking_code}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">{t('booking.pinCode', 'PIN код')}:</span>{' '}
                <span className="font-mono font-bold">{successData.pin_code}</span>
              </p>
            </div>
            <button
              onClick={() =>
                router.push(
                  `/booking/confirmation?code=${encodeURIComponent(successData.booking_code)}&pin=${encodeURIComponent(successData.pin_code)}`
                )
              }
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              {t('addRoom.viewBooking', 'Захиалга харах')}
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── main layout ─────────────────────────────────────────────────────────────

  return (
    <>
      <Header1 />

      {/* ── Info bar (matches Figma node 610:290) ─────────────────────────── */}
      <div className="fixed top-[72px] left-0 right-0 z-30 bg-white border-b border-[#d9d9d9]">
        <div className="max-w-[1560px] mx-auto px-6 h-[106px] flex items-center justify-between">
          {/* Left: back + hotel name */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-[#0e68dd] text-sm font-normal hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back', 'Буцах')}
            </button>
            <p className="text-[18px] font-medium text-[#464646]">{hotelName}</p>
          </div>

          {/* Right: dates */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[#464646] text-[12px]">{t('addRoom.checkInLabel', 'Орох өдөр')}</span>
              <span className="text-[14px] font-semibold text-black">{formatInfoBarDate(checkIn)}</span>
            </div>
            <span className="text-[#464646] text-[12px]">-{nights} {t('addRoom.nights', 'шөнө')}-</span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[#464646] text-[12px]">{t('addRoom.checkOutLabel', 'Гарах өдөр')}</span>
              <span className="text-[14px] font-semibold text-black">{formatInfoBarDate(checkOut)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ─────────────────────────────────────────────────────── */}
      <div className="pt-[178px] pb-12 bg-[#eef0f3] min-h-screen">
        <div className="max-w-[1560px] mx-auto px-6">
          <p className="text-[18px] text-black mb-5">{t('addRoom.availableRooms', 'Боломжит өрөөнүүд')}</p>

          <div className="flex gap-6 items-start">
            {/* ── Room list ─────────────────────────────────────────────── */}
            <div className="flex-1 bg-white border border-[#d9d9d9] rounded-[10px] overflow-hidden">
              {roomsLoading ? (
                <div className="p-8 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-[200px] h-[160px] bg-gray-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-3 py-2">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : rooms.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {t('addRoom.noRooms', 'Өрөө олдсонгүй')}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {rooms.map((room) => {
                    const av = getAvail(room.id);
                    const price = getPriceForRoom(room);
                    const entry = getSelectedEntry(room);
                    const qty = entry?.quantity ?? 0;
                    const typeName = getRoomTypeName(room.room_type);
                    const catName = getRoomCategoryName(room.room_category);
                    const image = room.images?.[0]?.image;
                    const isAvail = !av.loading && av.count > 0;
                    const maxQty = Math.min(av.count, 10);

                    return (
                      <div key={room.id} className="flex gap-5 p-5">
                        {/* Image */}
                        <div className="relative w-[190px] h-[150px] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {image ? (
                            <Image
                              src={`https://dev.kacc.mn${image}`}
                              alt={room.room_Description}
                              fill
                              className="object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Bed className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-[15px] font-medium text-gray-900">{typeName}</span>
                              <span className="text-[13px] text-gray-400">– {catName}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.room_Description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>{room.room_size} м²</span>
                              <span>· {room.adultQty + room.childQty} {t('hotel.guests', 'зочин')}</span>
                              {room.is_Bathroom && <span>· {t('room.bathroom', 'Угаалгын өрөөтэй')}</span>}
                            </div>
                          </div>

                          {/* Availability badge */}
                          <div className="mt-2">
                            {av.loading ? (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3 animate-spin" /> Шалгаж байна...
                              </span>
                            ) : isAvail ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle className="w-3 h-3" /> {av.count} {t('room.available', 'өрөө боломжтой')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                                <XCircle className="w-3 h-3" /> {t('room.unavailable', 'Боломжгүй')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price + qty */}
                        <div className="shrink-0 flex flex-col items-end justify-between w-[180px]">
                          <div className="text-right">
                            <p className="text-[18px] font-semibold text-gray-900">{formatMNT(price)}</p>
                            <p className="text-xs text-gray-400">{t('room.perNight', '1 шөнийн үнэ')}</p>
                            {nights > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {nights} {t('addRoom.nights', 'шөнө')} · {formatMNT(price * nights)}
                              </p>
                            )}
                          </div>

                          {/* Quantity control */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              disabled={qty === 0}
                              onClick={() => setQuantity(room, qty - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900">{qty}</span>
                            <button
                              type="button"
                              disabled={!isAvail || qty >= maxQty}
                              onClick={() => setQuantity(room, qty + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Breakfast toggle */}
                          {qty > 0 && (room.breakfast_include_price ?? 0) > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleBreakfast(room.id)}
                              className={`mt-2 text-xs px-2 py-1 rounded-full border transition-colors ${
                                entry?.includeBreakfast
                                  ? 'border-green-500 text-green-700 bg-green-50'
                                  : 'border-gray-300 text-gray-500'
                              }`}
                            >
                              {t('room.breakfast', 'Өглөөний цай')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Summary panel ─────────────────────────────────────────── */}
            <div className="w-[300px] shrink-0 bg-white rounded-xl border border-[#d9d9d9] p-5 space-y-4 sticky top-[190px]">
              {/* Stay dates */}
              <div>
                <p className="text-xs text-gray-500 mb-2">{t('addRoom.stayDates', 'Stay Dates')}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{checkIn ? new Date(checkIn).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '--'}</p>
                    <p className="text-xs text-gray-400">{t('houseRules.checkIn', 'Check-in')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{nights} {t('addRoom.night', 'night')}</p>
                    <div className="border-t border-gray-300 w-12 mx-auto my-1" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{checkOut ? new Date(checkOut).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '--'}</p>
                    <p className="text-xs text-gray-400">{t('houseRules.checkOut', 'Check-out')}</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Total price */}
              <div>
                <p className="text-xs text-gray-500">{t('booking.totalPrice', 'Total Price')}</p>
                <p className="text-[22px] font-bold text-gray-900 mt-1">₮{totalPrice.toLocaleString('mn-MN')}</p>
                {selected.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    ₮{totalPrice.toLocaleString('mn-MN')} × {nights} {t('addRoom.night', 'night')}
                  </p>
                )}
              </div>

              {/* Add room button */}
              <button
                type="button"
                disabled={selected.length === 0 || submitting}
                onClick={handleAddRooms}
                className="w-full bg-[#1a6de0] hover:bg-[#1559bb] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {submitting
                  ? t('addRoom.adding', 'Нэмж байна...')
                  : `${t('addRoom.addRoomBtn', 'Өрөө нэмэх')} (${selected.reduce((s, r) => s + r.quantity, 0)})`}
              </button>

              {submitError && (
                <p className="text-xs text-red-600 text-center">{submitError}</p>
              )}

              {/* Selected rooms list */}
              {selected.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">{t('addRoom.selectedRooms', 'Selected Rooms')}</p>
                  {selected.map((s) => (
                    <div key={s.room.id} className="border border-gray-200 rounded-lg p-3 relative">
                      <button
                        type="button"
                        onClick={() => setQuantity(s.room, 0)}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <p className="text-sm font-medium text-gray-800 pr-5">{getRoomTypeName(s.room.room_type)}</p>
                      <p className="text-xs text-[#1a6de0]">{getRoomCategoryName(s.room.room_category)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        ₮{s.pricePerNight.toLocaleString('mn-MN')} × {s.quantity} = ₮{(s.pricePerNight * s.quantity * Math.max(nights, 1)).toLocaleString('mn-MN')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{t('addRoom.qty', 'Тоо')}:</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(s.room, s.quantity - 1)}
                          className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-medium">{s.quantity}</span>
                        <button
                          type="button"
                          disabled={s.quantity >= Math.min(getAvail(s.room.id).count, 10)}
                          onClick={() => setQuantity(s.room, s.quantity + 1)}
                          className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AddRoomPage() {
  return (
    <Suspense fallback={
      <>
        <Header1 />
        <div className="pt-[178px] min-h-screen bg-[#eef0f3]">
          <div className="max-w-[1560px] mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="bg-white rounded-xl h-64" />
            </div>
          </div>
        </div>
      </>
    }>
      <AddRoomContent />
    </Suspense>
  );
}
