'use client';

import { useRouter } from 'next/navigation';
import { Calendar, RefreshCw, Plus, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface BookingConfirmationManageActionsProps {
  bookingCode: string;
  pinCode: string;
  hotelId?: number;
  checkIn?: string;
  checkOut?: string;
  hotelName?: string;
}

type ManageAction = {
  icon: LucideIcon;
  labelKey: string;
  action: string;
  primary?: boolean;
  danger?: boolean;
  linkStyle?: boolean;
};

const MANAGEMENT_ACTIONS: ManageAction[] = [
  { icon: Calendar, labelKey: 'bookingExtra.changeDate', action: 'change-date', primary: true },
  { icon: RefreshCw, labelKey: 'bookingExtra.changeRoom', action: 'change-room', primary: false },
  { icon: Plus, labelKey: 'bookingExtra.addRoom', action: 'add-room', primary: false, linkStyle: true },
  { icon: X, labelKey: 'bookingExtra.cancelBookingAction', action: 'cancel', danger: true, primary: false },
];

export default function BookingConfirmationManageActions({
  bookingCode,
  pinCode,
  hotelId,
  checkIn,
  checkOut,
  hotelName,
}: BookingConfirmationManageActionsProps) {
  const { t } = useHydratedTranslation();
  const router = useRouter();

  const goManage = (action: string) => {
    if (action === 'add-room' && hotelId) {
      const params = new URLSearchParams({
        code: bookingCode,
        pin: pinCode,
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
      <h3 className="text-[16px] font-semibold text-[#1a202c] dark:text-white mb-3">{t('bookingExtra.manageBookingTitle')}</h3>
      <div className="grid grid-cols-2 gap-2">
        {MANAGEMENT_ACTIONS.map((a) => {
          const Icon = a.icon;
          const label = t(a.labelKey);
          if (a.linkStyle) {
            return (
              <button
                key={a.action}
                type="button"
                onClick={() => goManage(a.action)}
                className="text-sm font-medium text-primary hover:underline text-left py-2 px-2 flex items-center gap-1.5 rounded-lg border border-transparent"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            );
          }
          return (
            <Button
              key={a.action}
              variant={a.primary ? 'primary' : 'ghost'}
              size="sm"
              className={`w-full flex items-center justify-start gap-1.5 !rounded-lg !shadow-none text-sm font-medium ${
                a.danger
                  ? '!text-red-600 hover:!text-red-700 !border-red-200'
                  : a.primary
                    ? ''
                    : '!bg-[#f7fafc] dark:!bg-gray-700/50 !border-gray-200 dark:!border-gray-600 !text-[#2d3748] dark:!text-gray-200'
              }`}
              onClick={() => goManage(a.action)}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-left">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
