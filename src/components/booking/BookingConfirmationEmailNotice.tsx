'use client';

import { Check } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

export default function BookingConfirmationEmailNotice() {
  const { t } = useHydratedTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>
      <p className="text-xs lg:text-[13px] font-medium text-[#2d3748] dark:text-gray-200 ">
        {t(
          'bookingExtra.emailSentNotice',
          'Захиалгын мэдээллийг бид таны мэйл рүү илгээлээ. Та и-мэйлээ шалгаж үзнэ үү.'
        )}
      </p>
    </div>
  );
}
