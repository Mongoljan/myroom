'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { Button } from '@/components/ui/Button';
import BookingConfirmationActionButtons from '@/components/booking/BookingConfirmationActionButtons';
import BookingConfirmationReceipt from '@/components/booking/BookingConfirmationReceipt';
import BookingConfirmationEmailNotice from '@/components/booking/BookingConfirmationEmailNotice';
import BookingConfirmationBookingCodes from '@/components/booking/BookingConfirmationBookingCodes';
import BookingConfirmationManageActions from '@/components/booking/BookingConfirmationManageActions';
import BookingConfirmationContactMap from '@/components/booking/BookingConfirmationContactMap';
import type { BookingConfirmationViewProps } from '@/components/booking/bookingConfirmationTypes';
import { formatHotelLocation } from '@/utils/formatHotelLocation';
import {
  getCreateBookingTotal,
  syncRoomsFromCreateResponse,
} from '@/utils/booking';
import { formatHotelPhoneDisplay } from '@/utils/bookingConfirmationExtras';
import { getCheckInTimeDisplay, getCheckOutTimeDisplay } from '@/utils/policyFormatters';
import { HotelService } from '@/services/hotelApi';

export default function BookingConfirmationView(props: BookingConfirmationViewProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const {
    bookingResult,
    checkedBooking,
    rooms,
    hotelId,
    hotelName,
    checkIn,
    checkOut,
    nights,
    totalPrice,
    adultsCount,
    childrenCount,
    customerName,
    customerLastName,
    customerPhone,
    customerEmail,
    hotelDetails,
    hotelPolicy,
  } = props;

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => window.print();

  const apiBooking = checkedBooking?.bookings?.[0];
  const displayRooms = bookingResult.pricing?.length
    ? syncRoomsFromCreateResponse(rooms, bookingResult)
    : rooms;
  const displayTotal =
    checkedBooking?.total_sum ??
    getCreateBookingTotal(bookingResult) ??
    totalPrice;
  const displayNights = bookingResult.nights ?? nights;
  const displayCustomerName =
    apiBooking?.customer_name || [customerLastName, customerName].filter(Boolean).join(' ').trim();
  const displayCustomerPhone = apiBooking?.customer_phone || customerPhone;
  const displayCustomerEmail = apiBooking?.customer_email || customerEmail;
  const displayCheckIn = apiBooking?.check_in || checkIn;
  const displayCheckOut = apiBooking?.check_out || checkOut;
  const bookingCreatedAt = apiBooking?.created_at ? new Date(apiBooking.created_at) : new Date();

  const [propertyContact, setPropertyContact] = useState<{ phone?: string; mail?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    HotelService.getHotelById(hotelId)
      .then((property) => {
        if (!cancelled && property) {
          setPropertyContact({ phone: property.phone, mail: property.mail });
        }
      })
      .catch(() => {
        if (!cancelled) setPropertyContact(null);
      });
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const displayHotelName = hotelDetails?.property_name || hotelName;
  const hotelPhone = formatHotelPhoneDisplay(
    propertyContact?.phone || hotelDetails?.contact_phone || hotelDetails?.phone
  );
  const hotelEmail =
    propertyContact?.mail ||
    hotelDetails?.contact_email ||
    hotelDetails?.email ||
    hotelDetails?.mail;
  const hotelWebsite: string | undefined = hotelDetails?.website;
  const googleMapUrl: string | undefined = hotelDetails?.google_map;

  const addressLine = formatHotelLocation(hotelDetails?.location);

  const checkInTime = getCheckInTimeDisplay(hotelPolicy, '14:00');
  const checkOutTime = getCheckOutTimeDisplay(hotelPolicy, '12:00');
  const totalRoomsBooked = rooms.reduce((sum, r) => sum + r.room_count, 0) || bookingResult.total_rooms;

  return (
    <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 print:px-0 print:max-w-full">
        <div className="mb-4 flex items-center gap-2 print:hidden">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <p className="text-lg font-semibold text-[#1a202c] dark:text-white">
            {t('bookingExtra.confirmationTitle', 'Таны захиалга амжилттай баталгаажлаа. Баярлалаа.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-3 lg:gap-y-6 items-start">
          <div className="lg:col-span-2 flex justify-end items-center min-h-[28px] print:hidden">
            <BookingConfirmationActionButtons
              onDownload={handleDownloadPDF}
              onPrint={handlePrint}
            />
          </div>
          <div className="lg:col-span-1 flex items-center min-h-[28px] print:hidden">
            <BookingConfirmationEmailNotice />
          </div>

          <div className="lg:col-span-2">
            <BookingConfirmationReceipt
              hotelId={hotelId}
              displayHotelName={displayHotelName}
              hotelPhone={hotelPhone}
              hotelEmail={hotelEmail}
              hotelWebsite={hotelWebsite}
              addressLine={addressLine}
              displayCheckIn={displayCheckIn}
              displayCheckOut={displayCheckOut}
              displayNights={displayNights}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              totalGuestAdults={adultsCount}
              totalGuestChildren={childrenCount}
              displayCustomerName={displayCustomerName}
              displayCustomerPhone={displayCustomerPhone}
              displayCustomerEmail={displayCustomerEmail}
              bookingCreatedAt={bookingCreatedAt}
              rooms={displayRooms}
              displayTotal={displayTotal}
              totalRoomsBooked={totalRoomsBooked}
              hotelDetails={hotelDetails}
              hotelPolicy={hotelPolicy}
              bookingIncludeBreakfast={bookingResult.include_breakfast}
            />
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-1 flex flex-col gap-4 mb-4"
          >
            <BookingConfirmationBookingCodes
              bookingCode={bookingResult.booking_code}
              pinCode={bookingResult.pin_code}
            />
            <BookingConfirmationManageActions
              bookingCode={bookingResult.booking_code}
              pinCode={bookingResult.pin_code}
              hotelId={hotelId}
              checkIn={displayCheckIn}
              checkOut={displayCheckOut}
              hotelName={displayHotelName}
            />
            <BookingConfirmationContactMap
              addressLine={addressLine}
              hotelPhone={hotelPhone}
              hotelEmail={hotelEmail}
              googleMapUrl={googleMapUrl}
            />
           
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
