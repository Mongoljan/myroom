'use client';

import { useEffect, useState } from 'react';
import { Calendar, Info, Loader2, AlertCircle, Car, Coffee, Baby, PawPrint, CreditCard, UserCheck } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { PropertyPolicy } from '@/types/api';

interface HotelHouseRulesProps {
  hotelId: number;
  hotelName: string;
  initialPolicies?: PropertyPolicy[];
}

export default function HotelHouseRules({ hotelId, initialPolicies }: HotelHouseRulesProps) {
  const { t } = useHydratedTranslation();
  const [policies, setPolicies] = useState<PropertyPolicy[]>(initialPolicies ?? []);
  const [loading, setLoading] = useState(!initialPolicies);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetch if policies were passed in from the server component
    if (initialPolicies) return;

    const fetchPolicies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getPropertyPolicies(hotelId);
        setPolicies(data);
      } catch {
        setError('Failed to load property policies');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [hotelId, initialPolicies]);

  if (loading) {
    return (
      <section id="house-rules" className="">
        <div className="mb-6">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-900 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">{t('loading', 'Ачааллаж байна...')}</span>
        </div>
      </section>
    );
  }

  if (error || policies.length === 0) {
    return (
      <section id="house-rules" className="">
        <div className="mb-6">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{t('houseRules.noData', 'Одоогоор мэдээлэл байхгүй байна')}</p>
        </div>
      </section>
    );
  }

  const policy = policies[0]; // Assuming we get one policy per property

  // Format time from API (e.g., "09:02:53" -> "09:02")
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <section id="house-rules" className="">
      <div className="mb-6">
        <h2 className="text-h2 font-semibold text-gray-900 dark:text-white">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">

        {/* Row helper */}
        {(() => {
          const Row = ({
            icon,
            title,
            children,
          }: {
            icon: React.ReactNode;
            title: string;
            children: React.ReactNode;
          }) => (
            <div className="flex items-start gap-6 px-5 py-4">
              <div className="flex items-center gap-2 w-48 shrink-0 pt-0.5">
                <span className="text-gray-500 dark:text-gray-400 shrink-0">{icon}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{title}</span>
              </div>
              <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 space-y-1 leading-relaxed">
                {children}
              </div>
            </div>
          );

          const feeType = (type: 'hour' | 'day' | null) =>
            type === 'hour' ? 'цагийн' : type === 'day' ? 'өдрийн' : '';

          const bp = typeof policy.breakfast_policy === 'object' && policy.breakfast_policy !== null && 'status' in policy.breakfast_policy
            ? policy.breakfast_policy
            : null;

          return (
            <>
              {/* 1. Check-in / Check-out */}
              <Row icon={<Calendar className="w-4 h-4" />} title="Орох цаг / Гарах цаг">
                <div>Орох цаг: <span className="font-medium text-gray-900 dark:text-white">{formatTime(policy.check_in_from)}</span></div>
                <div>Гарах цаг: <span className="font-medium text-gray-900 dark:text-white">{formatTime(policy.check_out_from)}</span></div>
              </Row>

              {/* 2. Parking */}
              {policy.parking_policy && (
                <Row icon={<Car className="w-4 h-4" />} title="Зогсоол">
                  {policy.parking_policy.outdoor_parking === 'no' && policy.parking_policy.indoor_parking === 'no' ? (
                    <div>Зогсоол байхгүй</div>
                  ) : (
                    <>
                      {policy.parking_policy.outdoor_parking !== 'no' && (
                        <div>
                          Гадна зогсоол:{' '}
                          {policy.parking_policy.outdoor_parking === 'free'
                            ? <span className="text-green-600 dark:text-green-400 font-medium">Үнэгүй</span>
                            : <span>Төлбөртэй{policy.parking_policy.outdoor_price ? ` / ${feeType(policy.parking_policy.outdoor_fee_type)}: ₮${Number(policy.parking_policy.outdoor_price).toLocaleString()}` : ''}</span>
                          }
                        </div>
                      )}
                      {policy.parking_policy.indoor_parking !== 'no' && (
                        <div>
                          Дотоод зогсоол:{' '}
                          {policy.parking_policy.indoor_parking === 'free'
                            ? <span className="text-green-600 dark:text-green-400 font-medium">Үнэгүй</span>
                            : <span>Төлбөртэй{policy.parking_policy.indoor_price ? ` / ${feeType(policy.parking_policy.indoor_fee_type)}: ₮${Number(policy.parking_policy.indoor_price).toLocaleString()}` : ''}</span>
                          }
                        </div>
                      )}
                    </>
                  )}
                </Row>
              )}

              {/* 3. Cancellation */}
              {policy.cancellation_fee && (
                <Row icon={<Info className="w-4 h-4" />} title="Цуцалтын нөхцөл">
                  {(() => {
                    const cf = policy.cancellation_fee!;
                    const beforePct = parseFloat(cf.single_before_time_percentage);
                    const afterPct = parseFloat(cf.single_after_time_percentage);
                    const time = formatTime(cf.cancel_time);
                    const noRefund = beforePct >= 100;
                    if (noRefund) {
                      return <div className="text-red-500 font-medium">Цуцалгаа хийгдэхгүй (100% торгууль)</div>;
                    }
                    return (
                      <>
                        <div>Орох өдрөөс <span className="font-medium">{time}</span>-с өмнө цуцалбал:{' '}
                          <span className="text-green-600 dark:text-green-400 font-medium">{beforePct === 0 ? 'Үнэгүй' : `${beforePct}% торгууль`}</span>
                        </div>
                        <div>
                          {time}-с хойш цуцалбал:{' '}
                          <span className="text-red-500 font-medium">{afterPct}% торгууль</span>
                        </div>
                        {cf.multi_5days_before_percentage && (
                          <div>Олон өрөө — 5 хоногийн өмнө: {cf.multi_5days_before_percentage}%</div>
                        )}
                        {cf.multi_3days_before_percentage && (
                          <div>Олон өрөө — 3 хоногийн өмнө: {cf.multi_3days_before_percentage}%</div>
                        )}
                        {cf.multi_1day_before_percentage && (
                          <div>Олон өрөө — 1 хоногийн өмнө: {cf.multi_1day_before_percentage}%</div>
                        )}
                      </>
                    );
                  })()}
                </Row>
              )}

              {/* 4. Children & extra bed */}
              {policy.child_policy && (
                <Row icon={<Baby className="w-4 h-4" />} title="Хүүхэд болон нэмэлт ор">
                  {policy.child_policy.allow_children ? (
                    <>
                      <div>Хүүхэдтэй зочдыг хүлээн авдаг.</div>
                      {policy.child_policy.max_child_age && (
                        <div>{policy.child_policy.max_child_age} нас хүртэлх хүүхэд насанд хүрэгчийн үнээр тооцогдоно.</div>
                      )}
                      {policy.child_policy.child_bed_available === 'yes' && (
                        <div className="mt-1 font-medium text-gray-800 dark:text-gray-200">Хүүхдийн ор болон нэмэлт ор:</div>
                      )}
                      {policy.child_policy.allow_extra_bed && (
                        <div className="flex  border-t border-gray-100 dark:border-gray-700 pt-1 mt-1">
                          <span>Нэмэлт ор : </span>
                          <span className="font-medium">
                            {policy.child_policy.extra_bed_price && Number(policy.child_policy.extra_bed_price) > 0
                              ? `₮${Number(policy.child_policy.extra_bed_price).toLocaleString()}`
                              : <span className="text-green-600 dark:text-green-400">Үнэгүй</span>
                            }
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>Хүүхэдтэй зочдыг хүлээн авдаггүй.</div>
                  )}
                </Row>
              )}

              {/* 5. Breakfast */}
              {bp && bp.status && (
                <Row icon={<Coffee className="w-4 h-4" />} title="Өглөөний цай">
                  {bp.start_time && bp.end_time && (
                    <div>Цаг: <span className="font-medium">{formatTime(bp.start_time)} – {formatTime(bp.end_time)}</span></div>
                  )}
                  {bp.price && Number(bp.price) > 0 && (
                    <div>Үнэ: <span className="font-medium">₮{Number(bp.price).toLocaleString()}</span></div>
                  )}
                </Row>
              )}

              {/* 6. Age requirement — static default */}
              <Row icon={<UserCheck className="w-4 h-4" />} title="Насны шаардлага">
                <div>Бүртгэлд насны шаардлага байхгүй.</div>
              </Row>

              {/* 7. Pets — static default */}
              <Row icon={<PawPrint className="w-4 h-4" />} title="Тэжээвэр амьтан">
                <div>Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй.</div>
              </Row>

              {/* 8. Payment methods — static */}
              <Row icon={<CreditCard className="w-4 h-4" />} title="Зөвшөөрөх төлбөрийн хэрэгсэл">
                <div className="flex flex-wrap gap-2 items-center">
                  {['Visa', 'Mastercard', 'JCB', 'UnionPay', 'Cash'].map((m) => (
                    <span key={m} className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                      {m}
                    </span>
                  ))}
                </div>
              </Row>
            </>
          );
        })()}
      </div>
    </section>
  );
}