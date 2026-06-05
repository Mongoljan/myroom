'use client';

import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingConfirmationBookingCodesProps {
  bookingCode: string;
  pinCode: string;
}

export default function BookingConfirmationBookingCodes({
  bookingCode,
  pinCode,
}: BookingConfirmationBookingCodesProps) {
  const { t } = useHydratedTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="text-sm">
        <span className="text-[#718096] dark:text-gray-400">{t('bookingExtra.bookingNumber')}: </span>
        <span className="font-semibold text-[#1a202c] dark:text-white">{bookingCode}</span>
      </div>
      {pinCode ? (
        <div className="text-sm">
          <span className="text-[#718096] dark:text-gray-400">{t('bookingExtra.pinCodeLabel')}: </span>
          <span className="font-semibold text-[#1a202c] dark:text-white">{pinCode}</span>
        </div>
      ) : null}
    </div>
  );
}
