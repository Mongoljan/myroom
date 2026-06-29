'use client';

import { useRouter } from 'next/navigation';
import { Plus, ChevronRight, Download, Printer } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { getBookingPin } from '@/utils/bookingPinStorage';

interface BookingConfirmationManageActionsProps {
  bookingCode: string;
  pinCode: string;
  hotelId?: number;
  checkIn?: string;
  checkOut?: string;
  hotelName?: string;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function BookingConfirmationManageActions({
  bookingCode,
  pinCode,
  hotelId,
  checkIn,
  checkOut,
  hotelName,
  onDownload,
  onPrint,
}: BookingConfirmationManageActionsProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const goManage = (action: string) => {
    if (action === 'add-room' && hotelId) {
      const resolvedPin = pinCode || getBookingPin(bookingCode) || '';
      const params = new URLSearchParams({
        code: bookingCode,
        pin: resolvedPin,
        ...(checkIn ? { check_in: checkIn } : {}),
        ...(checkOut ? { check_out: checkOut } : {}),
        ...(hotelName ? { hotel_name: hotelName } : {}),
      });
      router.push(`/hotel/${hotelId}/add-room?${params.toString()}`);
      return;
    }
    router.push(`/booking/manage?code=${bookingCode}&pin=${pinCode}&action=${action}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 shadow-sm print:hidden">
      <h3 className="text-[16px] font-semibold text-[#1a202c] dark:text-white mb-4">
        {t('bookingExtra.manageBookingTitle', 'Захиалга удирдах')}
      </h3>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={onDownload}
          className="flex items-center justify-between w-full h-[46px] px-4 rounded-[10px] bg-[#64bc14] hover:bg-[#58a612] text-white text-[15px] font-medium transition-colors"
        >
          <span>{t('bookingExtra.downloadBookingPage', 'Download booking page')}</span>
          <Download className="w-[18px] h-[18px]" strokeWidth={2} />
        </button>

        <button
          onClick={onPrint}
          className="flex items-center justify-between w-full h-[46px] px-4 rounded-[10px] bg-[#f99400] hover:bg-[#e08500] text-white text-[15px] font-medium transition-colors"
        >
          <span>{t('bookingExtra.printBookingPage', 'Print booking page')}</span>
          <Printer className="w-[18px] h-[18px]" strokeWidth={2} />
        </button>

        <button
          onClick={() => goManage('add-room')}
          className="flex items-center justify-between w-full h-[46px] px-4 rounded-[10px] bg-[#717680] hover:bg-[#60646d] text-white text-[15px] font-medium transition-colors"
        >
          <span>{t('bookingExtra.addRoom', 'Өрөө нэмэх')}</span>
          <Plus className="w-[18px] h-[18px]" strokeWidth={2} />
        </button>

        <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-1 border-none" />

        <button
          onClick={() => goManage('cancel')}
          className="flex items-center justify-between w-full h-[46px] px-4 rounded-[10px] bg-[#feeceb] hover:bg-[#fcd9d7] dark:bg-red-950/30 dark:hover:bg-red-900/40 text-[#e24a41] text-[15px] font-medium transition-colors"
        >
          <span>{t('bookingExtra.cancelBookingAction', 'Захиалга цуцлах')}</span>
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

