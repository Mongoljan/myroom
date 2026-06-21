'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import type { AllData, PropertyPolicy } from '@/types/api';
import { ApiService } from '@/services/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import {
  getAdditionalInfoTags,
  getRoomExtraDescription,
} from '@/utils/bookingConfirmationExtras';
import GuestCountInline from '@/components/common/GuestCountInline';
import {
  formatConfirmationDate,
  cutoffDateBeforeCheckIn,
} from '@/components/booking/bookingConfirmationUtils';
import type {
  BookingConfirmationRoom,
  BookingConfirmationHotelDetails,
} from '@/components/booking/bookingConfirmationTypes';
import { resolveRoomDisplayNameFromAllData } from '@/utils/roomNames';
import { formatBookingCreatedAtMongolia } from '@/utils/bookingPendingPayment';

function getMnRoomDisplayName(
  room: BookingConfirmationRoom,
  allRoomData: AllData | null
): string {
  if (allRoomData && room.room_category_id > 0 && room.room_type_id > 0) {
    const resolved = resolveRoomDisplayNameFromAllData(
      {
        room_category_id: room.room_category_id,
        room_type_id: room.room_type_id,
      },
      allRoomData,
      'mn'
    );
    if (resolved) return resolved;
  }
  return room.room_name;
}

interface BookingConfirmationReceiptProps {
  hotelId: number;
  displayHotelName: string;
  hotelPhone?: string;
  hotelEmail?: string;
  hotelWebsite?: string;
  addressLine: string;
  displayCheckIn: string;
  displayCheckOut: string;
  displayNights: number;
  checkInTime: string;
  checkOutTime: string;
  totalGuestAdults: number;
  totalGuestChildren: number;
  displayCustomerName: string;
  displayCustomerPhone: string;
  displayCustomerEmail: string;
  bookingCreatedAt: Date;
  rooms: BookingConfirmationRoom[];
  displayTotal: number;
  totalRoomsBooked: number;
  hotelDetails: BookingConfirmationHotelDetails | null;
  hotelPolicy: PropertyPolicy | null;
  bookingIncludeBreakfast?: boolean;
}

export default function BookingConfirmationReceipt({
  hotelId,
  displayHotelName,
  hotelPhone,
  hotelEmail,
  hotelWebsite,
  addressLine,
  displayCheckIn,
  displayCheckOut,
  displayNights,
  checkInTime,
  checkOutTime,
  totalGuestAdults,
  totalGuestChildren,
  displayCustomerName,
  displayCustomerPhone,
  displayCustomerEmail,
  bookingCreatedAt,
  rooms,
  displayTotal,
  totalRoomsBooked,
  hotelDetails,
  hotelPolicy,
  bookingIncludeBreakfast,
}: BookingConfirmationReceiptProps) {
  const { t } = useHydratedTranslation();
  const tableHeadClass = 'bg-[#4a5568] text-white';
  const [allRoomData, setAllRoomData] = useState<AllData | null>(null);

  useEffect(() => {
    ApiService.getAllData()
      .then(setAllRoomData)
      .catch(() => setAllRoomData(null));
  }, []);

  const cfConfirm = hotelPolicy?.cancellation_fee;
  const cancelTimeShortConfirm = cfConfirm?.cancel_time?.substring(0, 5);
  const cancelTiers: { label: string; days: number; pct: number | null }[] = cfConfirm
    ? [
        {
          label: `${cutoffDateBeforeCheckIn(displayCheckIn, 5)}-ээс өмнө`,
          days: 5,
          pct: cfConfirm.multi_5days_before_percentage
            ? parseFloat(cfConfirm.multi_5days_before_percentage)
            : null,
        },
        {
          label: `${cutoffDateBeforeCheckIn(displayCheckIn, 3)}-ээс өмнө`,
          days: 3,
          pct: cfConfirm.multi_3days_before_percentage
            ? parseFloat(cfConfirm.multi_3days_before_percentage)
            : null,
        },
        {
          label: `${cutoffDateBeforeCheckIn(displayCheckIn, 1)}-ээс хойш`,
          days: 1,
          pct: cfConfirm.multi_1day_before_percentage
            ? parseFloat(cfConfirm.multi_1day_before_percentage)
            : null,
        },
      ].filter((tier) => tier.pct !== null)
    : [];

  const additionalInfoTags = getAdditionalInfoTags(hotelPolicy);
  const originalRooms = rooms.filter((room) => !room.is_added_room);
  const addedRooms = rooms.filter((room) => room.is_added_room);
  const hasAddedRooms = addedRooms.length > 0;

  const renderRoomRow = (room: BookingConfirmationRoom, key: string | number) => {
    const breakfastDesc = getRoomExtraDescription(room, bookingIncludeBreakfast);
    const bookingTypeLabel = room.is_added_room
      ? t('bookingExtra.addedRoom', 'Нэмсэн өрөө')
      : t('bookingExtra.originalRoom', 'Анхны захиалга');
    const bookedAtLabel = room.booked_at
      ? formatBookingCreatedAtMongolia(room.booked_at)
      : '';

    return (
      <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-3 py-2.5 text-[#2d3748] dark:text-gray-200 align-top leading-snug">
          {getMnRoomDisplayName(room, allRoomData)}
        </td>
        <td className="px-2 py-2.5 text-xs text-[#718096] dark:text-gray-400 align-top leading-snug">
          <span
            className={`inline-block mb-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
              room.is_added_room
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {bookingTypeLabel}
          </span>
          {bookedAtLabel && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{bookedAtLabel}</p>
          )}
          {breakfastDesc && <p className="mt-0.5">{breakfastDesc}</p>}
        </td>
        <td className="px-3 py-2.5 text-right text-[#2d3748] dark:text-gray-200">
          {room.price_per_night.toLocaleString()} ₮
        </td>
        <td className="px-3 py-2.5 text-center text-[#2d3748] dark:text-gray-200">{room.room_count}</td>
        <td className="px-3 py-2.5 text-right font-semibold text-[#2d3748] dark:text-gray-200">
          {room.total_price.toLocaleString()} ₮
        </td>
      </tr>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden print:border-0 print:shadow-none"
      id="booking-confirmation"
    >
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 print:p-0">
        <h2 className="text-[18px] font-semibold text-center mb-6 text-[#1a202c] dark:text-white tracking-tight">
          {t('bookingExtra.bookingConfirmation', 'Захиалгын хуудас')}
        </h2>

        <div className="flex items-start justify-between gap-6 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0">
            <a
              href={`/hotel/${hotelId}`}
              className="text-primary hover:underline text-[18px] font-semibold block mb-2"
            >
              {displayHotelName}
            </a>
            <div className="space-y-1 text-sm text-[#718096] dark:text-gray-400">
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
            <div className="font-semibold text-[#1a202c] dark:text-white">MyRoom.mn</div>
            {hotelEmail && (
              <div className="flex items-center justify-end gap-1.5 text-[#718096] dark:text-gray-400 mt-1">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[180px]">{hotelEmail}</span>
              </div>
            )}
            {hotelWebsite && (
              <div className="flex items-center justify-end gap-1.5 text-[#718096] dark:text-gray-400 mt-1">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[180px]">{hotelWebsite}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-3">
            {t('bookingExtra.bookingDetailsSection', 'Захиалгын дэлгэрэнгүй')}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                {t('bookingExtra.checkInLabel', 'Орох өдөр')}
              </span>
              <span className="text-[#2d3748] dark:text-gray-200">
                {formatConfirmationDate(displayCheckIn)}, {checkInTime} цагаас
              </span>
            </div>
            <div className="flex">
              <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                {t('bookingExtra.checkOutLabel', 'Гарах өдөр')}
              </span>
              <span className="text-[#2d3748] dark:text-gray-200">
                {formatConfirmationDate(displayCheckOut)}, {checkOutTime} цагаас
              </span>
            </div>
            {displayNights > 0 && (
              <div className="flex">
                <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                  {t('bookingExtra.nightsLabel', 'Хоног')}
                </span>
                <span className="text-[#2d3748] dark:text-gray-200">{displayNights}</span>
              </div>
            )}
            <div className="flex items-start">
              <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                {t('bookingExtra.enteringGuests', 'Орох хүний тоо')}
              </span>
              <GuestCountInline
                adults={totalGuestAdults}
                childCount={totalGuestChildren}
                className="text-[#2d3748] dark:text-gray-200"
              />
            </div>
            {(displayCustomerName || displayCustomerPhone || displayCustomerEmail) && (
              <div className="flex">
                <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                  {t('bookingExtra.guestName', 'Захиалагч')}
                </span>
                <span className="text-[#2d3748] dark:text-gray-200">
                  {displayCustomerName}
                  {displayCustomerPhone ? ` / ${displayCustomerPhone}` : ''}
                  {displayCustomerEmail ? `, ${displayCustomerEmail}` : ''}
                </span>
              </div>
            )}
            <div className="flex">
              <span className="text-[#718096] dark:text-gray-400 w-36 shrink-0">
                {t('bookingExtra.bookingDateLabel', 'Захиалсан огноо')}
              </span>
              <span className="text-[#2d3748] dark:text-gray-200">
                {bookingCreatedAt.toLocaleDateString('en-CA').replace(/-/g, '.')}{' '}
                {bookingCreatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full text-sm border-collapse table-fixed">
            <colgroup>
              <col className="w-[36%]" />
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className={tableHeadClass}>
                <th className="text-left font-semibold px-3 py-2.5">
                  {t('bookingExtra.roomTypeCol', 'Өрөөний нэр')}
                </th>
                <th className="text-left font-semibold px-2 py-2.5 text-xs">
                  {t('bookingExtra.extraDescCol', 'Нэмэлт тайлбар')}
                </th>
                <th className="text-right font-semibold px-3 py-2.5">
                  {t('bookingExtra.priceCol', '1 өдрийн үнэ')}
                </th>
                <th className="text-center font-semibold px-3 py-2.5">
                  {t('bookingExtra.quantityCol', 'Тоо ш')}
                </th>
                <th className="text-right font-semibold px-3 py-2.5">{t('bookingExtra.totalCol', 'Үнэ')}</th>
              </tr>
            </thead>
            <tbody>
              {originalRooms.map((room, index) => renderRoomRow(room, `original-${index}`))}
              {hasAddedRooms && (
                <tr className="bg-blue-50/60 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                  <td
                    colSpan={5}
                    className="px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300"
                  >
                    {t('bookingExtra.addedRoomsSection', 'Нэмсэн өрөөнүүд')}
                  </td>
                </tr>
              )}
              {addedRooms.map((room, index) => renderRoomRow(room, `added-${index}`))}
            </tbody>
            <tfoot>
              <tr className="bg-[#edf2f7] dark:bg-gray-700/50 text-[#1a202c] dark:text-white border-t border-gray-200 dark:border-gray-600">
                <td colSpan={4} className="px-3 py-3 font-semibold">
                  {t('bookingExtra.totalPaidAmount', 'Нийт төлсөн дүн')}
                </td>
                <td className="px-3 py-3 text-right font-bold">{displayTotal.toLocaleString()} ₮</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-[#718096] dark:text-gray-400 mt-1.5 text-right">
            *{t('bookingExtra.taxNote', 'НӨАТ багтсан үнэ')}
          </p>
        </div>

        {additionalInfoTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-2">
              {t('bookingExtra.additionalInfo', 'Нэмэлт мэдээлэл')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {additionalInfoTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center px-2 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-sm text-gray-400 dark:text-gray-300 bg-white dark:bg-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {cfConfirm && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-2">
              {t('bookingExtra.cancellationPolicy', 'Цуцлах нөхцөл')}
            </h3>
            <p className="text-sm text-[#718096] dark:text-gray-400 mb-3">1 өрөө тутамд цуцлалтаас авах хураамж:</p>
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
                        const beforePct = cfConfirm.single_before_time_percentage != null ? parseFloat(cfConfirm.single_before_time_percentage) : 0;
                        const afterPct = cfConfirm.single_after_time_percentage != null ? parseFloat(cfConfirm.single_after_time_percentage) : 0;
                        const beforeFee = Math.round((feeBase * beforePct) / 100);
                        const afterFee = Math.round((feeBase * afterPct) / 100);
                        const afterDisplay =
                          afterPct >= 100
                            ? 'Цуцлах боломжгүй'
                            : afterPct === 0
                              ? 'Үнэгүй'
                              : `${afterFee.toLocaleString()} ₮`;
                        return (
                          <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-2 py-2 text-[#2d3748] dark:text-gray-200">
                              {getMnRoomDisplayName(room, allRoomData)}
                              {room.room_count > 1 ? ` (×${room.room_count})` : ''}
                            </td>
                            <td className="px-2 py-2 text-right text-[#2d3748] dark:text-gray-200">
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
                      <th key={tier.days} className="text-right font-semibold px-2 py-2">
                        {tier.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-2 py-2 text-[#2d3748] dark:text-gray-200">
                        {getMnRoomDisplayName(room, allRoomData)}
                        {room.room_count > 1 ? ` (×${room.room_count})` : ''}
                      </td>
                      {cancelTiers.map((tier) => {
                        const fee = Math.round((room.total_price * (tier.pct ?? 0)) / 100);
                        return (
                          <td key={tier.days} className="px-2 py-2 text-right text-[#2d3748] dark:text-gray-200">
                            {tier.pct! >= 100 ? (
                              <span className="text-red-600">Цуцлах боломжгүй</span>
                            ) : tier.pct === 0 ? (
                              'Үнэгүй'
                            ) : (
                              `${fee.toLocaleString()} ₮`
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-[#718096] dark:text-gray-400 italic">
                {t('bookingExtra.noPolicyInfo', 'Цуцлалтын нөхцөлийн талаар зочид буудалтай холбогдоно уу.')}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#1a202c] dark:text-white mb-2">Санамж</h3>
          <ul className="text-sm text-[#718096] dark:text-gray-400 space-y-1 list-disc pl-5">
            <li>
              Захиалга баталгаажсан тохиолдолд, MyRoom-ийн Үйлчилгээний нөхцөл, Нууцлалын бодлого болон
              Захиалга цуцлах нөхцлийг танилцаж, бүрэн зөвшөөрсөн гэж үзнэ.
            </li>
            <li>
              Захиалгад өдөр болон цагийн хойрвүй өчил бол захиалгыг цуцлахаас сэргийлэх буудалтайгаа
              холбоо барих хүсэлтэй мэдэгдэхийг зөвлөнө.
            </li>
          </ul>
        </div>

        <p className="text-center text-sm text-[#718096] dark:text-gray-400">
          Бидний сонгон үйлчлүүлж байгаад танд баярлалаа.
        </p>
      </div>
    </motion.div>
  );
}
