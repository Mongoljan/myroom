'use client';

import { ShieldAlert } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CancellationFee } from '@/types/api';

interface HotelCancellationPolicyProps {
  cancellationFee: CancellationFee | null | undefined;
}

export default function HotelCancellationPolicy({ cancellationFee }: HotelCancellationPolicyProps) {
  const { t } = useHydratedTranslation();

  if (!cancellationFee) return null;

  const cancelTime = cancellationFee.cancel_time?.substring(0, 5) ?? '—';

  const hasMulti =
    cancellationFee.multi_5days_before_percentage ||
    cancellationFee.multi_3days_before_percentage ||
    cancellationFee.multi_2days_before_percentage ||
    cancellationFee.multi_1day_before_percentage;

  return (
    <section id="cancellation-policy" className="">
      <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
        {t('cancellationPolicy.title', 'Цуцлалтын бодлого')}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">
        {/* Cancel time */}
        <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
          <ShieldAlert className="w-4 h-4 shrink-0 text-gray-400" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {t('cancellationPolicy.cancelTime', 'Цуцлах боломжтой цаг')}:
          </span>
          <span className="text-gray-900 dark:text-white font-semibold">{cancelTime}</span>
        </div>

        <hr className="border-gray-100 dark:border-gray-700" />

        {/* Single room */}
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
            {t('cancellationPolicy.singleRoomLabel', '1 өрөөний захиалгад нийт төлбөрөөс суутгах хураамжийн хувь:')}
          </p>
          <div className="space-y-2 pl-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] text-gray-600 dark:text-gray-400">
                {t('cancellationPolicy.beforeCancelLabel', 'Өмнөх өдрийн')} <span className="font-medium text-gray-900 dark:text-white">{cancelTime}</span> {t('cancellationPolicy.beforeSuffix', 'цагаас өмнө цуцалвал')}
              </span>
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                {cancellationFee.single_before_time_percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] text-gray-600 dark:text-gray-400">
                {t('cancellationPolicy.beforeCancelLabel', 'Өмнөх өдрийн')} <span className="font-medium text-gray-900 dark:text-white">{cancelTime}</span> {t('cancellationPolicy.afterSuffix', 'цагаас хойш цуцалвал')}
              </span>
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                {cancellationFee.single_after_time_percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Multi room */}
        {hasMulti && (
          <>
            <hr className="border-gray-100 dark:border-gray-700" />
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                {t('cancellationPolicy.multiRoomLabel', '2 болон түүнээс дээш өрөөнд нийт төлбөрөөс суутгах хураамжийн хувь:')}
              </p>
              <div className="space-y-2 pl-1">
                {cancellationFee.multi_5days_before_percentage && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-gray-600 dark:text-gray-400">
                      {t('cancellationPolicy.fiveDaysBefore', 'Ирэх өдрөөсөө 5 хоногийн өмнөх хувь')}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                      {cancellationFee.multi_5days_before_percentage}%
                    </span>
                  </div>
                )}
                {cancellationFee.multi_3days_before_percentage && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-gray-600 dark:text-gray-400">
                      {t('cancellationPolicy.threeDaysBefore', 'Ирэх өдрөөсөө 3 хоногийн өмнөх хувь')}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                      {cancellationFee.multi_3days_before_percentage}%
                    </span>
                  </div>
                )}
                {cancellationFee.multi_2days_before_percentage && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-gray-600 dark:text-gray-400">
                      {t('cancellationPolicy.twoDaysBefore', 'Ирэх өдрөөсөө 2 хоногийн өмнөх хувь')}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                      {cancellationFee.multi_2days_before_percentage}%
                    </span>
                  </div>
                )}
                {cancellationFee.multi_1day_before_percentage && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-gray-600 dark:text-gray-400">
                      {t('cancellationPolicy.oneDayBefore', 'Ирэх өдрөөсөө 1 хоногийн өмнөх хувь')}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-900 dark:text-white shrink-0">
                      {cancellationFee.multi_1day_before_percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
