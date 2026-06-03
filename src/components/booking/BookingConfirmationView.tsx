'use client';

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
  const displayTotal = checkedBooking?.total_sum ?? totalPrice;
  const displayNights = bookingResult.nights ?? nights;
  const displayCustomerName =
    apiBooking?.customer_name || [customerLastName, customerName].filter(Boolean).join(' ').trim();
  const displayCustomerPhone = apiBooking?.customer_phone || customerPhone;
  const displayCustomerEmail = apiBooking?.customer_email || customerEmail;
  const displayCheckIn = apiBooking?.check_in || checkIn;
  const displayCheckOut = apiBooking?.check_out || checkOut;
  const bookingCreatedAt = apiBooking?.created_at ? new Date(apiBooking.created_at) : new Date();

  const displayHotelName = hotelDetails?.property_name || hotelName;
  const hotelPhone: string | undefined = hotelDetails?.contact_phone || hotelDetails?.phone;
  const hotelEmail: string | undefined =
    hotelDetails?.contact_email || hotelDetails?.email || hotelDetails?.mail;
  const hotelWebsite: string | undefined = hotelDetails?.website;
  const googleMapUrl: string | undefined = hotelDetails?.google_map;

  const addressLine = hotelDetails?.location
    ? [hotelDetails.location.province_city, hotelDetails.location.soum, hotelDetails.location.district]
        .filter(Boolean)
        .join(', ')
    : '';

  const checkInTime = hotelPolicy ? hotelPolicy.check_in_from.substring(0, 5) : '14:00';
  const checkOutTime = hotelPolicy ? hotelPolicy.check_out_until.substring(0, 5) : '12:00';
  const totalRoomsBooked = rooms.reduce((sum, r) => sum + r.room_count, 0) || bookingResult.total_rooms;

  return (
    <div className="min-h-screen bg-[#eef0f3] dark:bg-gray-900 py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 print:px-0 print:max-w-full">
        <div className="mb-6 flex items-center gap-2 print:hidden">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <p className="text-lg font-semibold text-[#1a202c] dark:text-white">
            {t('bookingExtra.confirmationTitle', 'Таны захиалга амжилттай баталгаажлаа. Баярлалаа.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex justify-end">
              <BookingConfirmationActionButtons
                onDownload={handleDownloadPDF}
                onPrint={handlePrint}
              />
            </div>
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
              rooms={rooms}
              displayTotal={displayTotal}
              totalRoomsBooked={totalRoomsBooked}
              hotelDetails={hotelDetails}
              hotelPolicy={hotelPolicy}
            />
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-1 flex flex-col gap-4"
          >
            <BookingConfirmationEmailNotice />
            <BookingConfirmationBookingCodes
              bookingCode={bookingResult.booking_code}
              pinCode={bookingResult.pin_code}
            />
            <BookingConfirmationManageActions
              bookingCode={bookingResult.booking_code}
              pinCode={bookingResult.pin_code}
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
