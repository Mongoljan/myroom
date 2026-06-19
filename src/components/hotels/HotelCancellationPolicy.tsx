'use client';

import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { CancellationFee, CancellationRule } from '@/types/api';

interface HotelCancellationPolicyProps {
  cancellationFee: CancellationFee | null | undefined;
}

type NormalizedRule = {
  days_before: number;
  before: number | string | null;
  after: number | string | null;
};

function toNormalized(rule: CancellationRule): NormalizedRule {
  return {
    days_before: Number(rule.days_before ?? 0),
    before:
      rule.before_time_percentage === undefined || rule.before_time_percentage === null
        ? null
        : rule.before_time_percentage,
    after:
      rule.after_time_percentage === undefined || rule.after_time_percentage === null
        ? null
        : rule.after_time_percentage,
  };
}

function buildLegacyRules(fee: CancellationFee): { single: NormalizedRule[]; multi: NormalizedRule[] } {
  const single: NormalizedRule[] = [];
  if (fee.single_before_time_percentage || fee.single_after_time_percentage) {
    single.push({
      days_before: 0,
      before: fee.single_before_time_percentage ?? null,
      after: fee.single_after_time_percentage ?? null,
    });
  }

  const multi: NormalizedRule[] = [];
  const legacyMulti: Array<[number, string | undefined]> = [
    [5, fee.multi_5days_before_percentage],
    [3, fee.multi_3days_before_percentage],
    [2, fee.multi_2days_before_percentage],
    [1, fee.multi_1day_before_percentage],
  ];
  legacyMulti.forEach(([days, pct]) => {
    if (pct) multi.push({ days_before: days, before: pct, after: null });
  });

  return { single, multi };
}

export default function HotelCancellationPolicy({ cancellationFee }: HotelCancellationPolicyProps) {
  const { t } = useHydratedTranslation();

  if (!cancellationFee) return null;

  const cancelTime = cancellationFee.cancel_time?.substring(0, 5) ?? '—';

  let single: NormalizedRule[] = [];
  let multi: NormalizedRule[] = [];

  if (Array.isArray(cancellationFee.rules) && cancellationFee.rules.length > 0) {
    const sorted = [...cancellationFee.rules].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    single = sorted.filter((r) => r.room_group === 'single').map(toNormalized);
    multi = sorted.filter((r) => r.room_group === 'multi').map(toNormalized);
  } else {
    const legacy = buildLegacyRules(cancellationFee);
    single = legacy.single;
    multi = legacy.multi;
  }

  if (single.length === 0 && multi.length === 0) return null;

  const renderAmount = (value: number | string) => {
    if (Number(value) === 0) {
      return (
        <span className="text-sm font-semibold text-emerald-600 shrink-0">
          {t('cancellationPolicy.free', 'Үнэгүй')}
        </span>
      );
    }
    return (
      <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
        {value}%
      </span>
    );
  };

  const renderRule = (rule: NormalizedRule, idx: number) => {
    const rows: React.ReactNode[] = [];

    if (rule.before !== null) {
      rows.push(
        <div key={`${idx}-before`} className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {rule.days_before > 0 ? (
              <>
                {t('cancellationPolicy.daysBeforeLabel', 'Ирэхээс')}{' '}
                <span className="font-medium text-gray-900 dark:text-white">{rule.days_before}</span>{' '}
                {t('cancellationPolicy.daysBeforeSuffix', 'хоногийн өмнө цуцалвал')}
              </>
            ) : (
              <>
                {t('cancellationPolicy.beforeCancelLabel', 'Өмнөх өдрийн')}{' '}
                <span className="font-medium text-gray-900 dark:text-white">{cancelTime}</span>{' '}
                {t('cancellationPolicy.beforeSuffix', 'цагаас өмнө цуцалвал')}
              </>
            )}
          </span>
          {renderAmount(rule.before)}
        </div>
      );
    }

    if (rule.after !== null) {
      rows.push(
        <div key={`${idx}-after`} className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('cancellationPolicy.beforeCancelLabel', 'Өмнөх өдрийн')}{' '}
            <span className="font-medium text-gray-900 dark:text-white">{cancelTime}</span>{' '}
            {t('cancellationPolicy.afterSuffix', 'цагаас хойш цуцалвал')}
          </span>
          {renderAmount(rule.after)}
        </div>
      );
    }

    return rows;
  };

  return (
    <section id="cancellation-policy" className="">
      <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-4">
        {t('cancellationPolicy.title', 'Цуцлалтын бодлого')}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">
        {/* Single room */}
        {single.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t('cancellationPolicy.singleRoomLabel', '1 өрөөний захиалгад нийт төлбөрөөс суутгах хураамжийн хувь:')}
            </p>
            <div className="space-y-2 pl-1">
              {single.map((rule, idx) => renderRule(rule, idx))}
            </div>
          </div>
        )}

        {/* Multi room */}
        {multi.length > 0 && (
          <>
            {single.length > 0 && <hr className="border-gray-100 dark:border-gray-700" />}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {t('cancellationPolicy.multiRoomLabel', '2 болон түүнээс дээш өрөөнд нийт төлбөрөөс суутгах хураамжийн хувь:')}
              </p>
              <div className="space-y-2 pl-1">
                {multi.map((rule, idx) => renderRule(rule, idx))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
