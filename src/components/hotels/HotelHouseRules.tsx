'use client';

import { useEffect, useState } from 'react';
import { Calendar, Info, Loader2, AlertCircle, Car, Coffee, Baby } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { ApiService } from '@/services/api';
import { PropertyPolicy } from '@/types/api';

interface HotelHouseRulesProps {
  hotelId: number;
  hotelName: string;
}

export default function HotelHouseRules({ hotelId }: HotelHouseRulesProps) {
  const { t } = useHydratedTranslation();
  const [policies, setPolicies] = useState<PropertyPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getPropertyPolicies(hotelId);
        setPolicies(data);
      } catch (err) {
        console.error('Failed to fetch property policies:', err);
        setError('Failed to load property policies');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [hotelId]);

  if (loading) {
    return (
      <section id="house-rules" className="">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check-in / Check-out */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-gray-900 dark:text-gray-200" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-2">
                {t('houseRules.checkInOut', 'Орох цаг / Гарах цаг')}
              </h3>
              <div className="space-y-1">
                <div className="text-[13px] text-gray-700 dark:text-gray-300">
                  <span>{t('houseRules.checkIn', 'Орох цаг:')}</span>{' '}
                  <span className="text-gray-900 dark:text-white">{formatTime(policy.check_in_from)}</span>
                </div>
                <div className="text-[13px] text-gray-700 dark:text-gray-300">
                  <span>{t('houseRules.checkOut', 'Гарах цаг:')}</span>{' '}
                  <span className="text-gray-900 dark:text-white">{formatTime(policy.check_out_from)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parking Policy */}
        {policy.parking_policy && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Car className="w-4 h-4 text-gray-900 dark:text-gray-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-2">
                  {t('houseRules.parking', 'Зогсоол')}
                </h3>
                <div className="space-y-1">
                  {policy.parking_policy.outdoor_parking !== 'no' && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.outdoorParking', 'Гадна зогсоол:')}</span>{' '}
                      {policy.parking_policy.outdoor_parking === 'free'
                        ? t('houseRules.free', 'Үнэгүй')
                        : `${t('houseRules.paid', 'Төлбөртэй')}${policy.parking_policy.outdoor_price ? ` — ₮${Number(policy.parking_policy.outdoor_price).toLocaleString()}` : ''}`
                      }
                    </div>
                  )}
                  {policy.parking_policy.indoor_parking !== 'no' && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.indoorParking', 'Дотоод зогсоол:')}</span>{' '}
                      {policy.parking_policy.indoor_parking === 'free'
                        ? t('houseRules.free', 'Үнэгүй')
                        : `${t('houseRules.paid', 'Төлбөртэй')}${policy.parking_policy.indoor_price ? ` — ₮${Number(policy.parking_policy.indoor_price).toLocaleString()}` : ''}`
                      }
                    </div>
                  )}
                  {policy.parking_policy.outdoor_parking === 'no' && policy.parking_policy.indoor_parking === 'no' && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      {t('houseRules.noParking', 'Зогсоол байхгүй')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        {policy.cancellation_fee && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-gray-900 dark:text-gray-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-2">
                  {t('houseRules.cancellation', 'Цуцлалтын нөхцөл')}
                </h3>
                <div className="space-y-1">
                  <div className="text-[13px] text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{t('houseRules.cancelTime', 'Цуцлах хугацаа:')}</span>{' '}
                    {formatTime(policy.cancellation_fee.cancel_time)}
                  </div>
                  <div className="text-[13px] text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{t('houseRules.beforeCancelTime', 'Цуцлах хугацааны өмнө:')}</span>{' '}
                    {policy.cancellation_fee.single_before_time_percentage}%
                  </div>
                  <div className="text-[13px] text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{t('houseRules.afterCancelTime', 'Цуцлах хугацааны дараа:')}</span>{' '}
                    {policy.cancellation_fee.single_after_time_percentage}%
                  </div>
                  {policy.cancellation_fee.multi_5days_before_percentage && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.multi5days', '5 хоногийн өмнө (олон өрөө):')}</span>{' '}
                      {policy.cancellation_fee.multi_5days_before_percentage}%
                    </div>
                  )}
                  {policy.cancellation_fee.multi_3days_before_percentage && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.multi3days', '3 хоногийн өмнө (олон өрөө):')}</span>{' '}
                      {policy.cancellation_fee.multi_3days_before_percentage}%
                    </div>
                  )}
                  {policy.cancellation_fee.multi_1day_before_percentage && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.multi1day', '1 хоногийн өмнө (олон өрөө):')}</span>{' '}
                      {policy.cancellation_fee.multi_1day_before_percentage}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Children Policy */}
        {policy.child_policy && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Baby className="w-4 h-4 text-gray-900 dark:text-gray-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-2">
                  {t('houseRules.children', 'Хүүхэд')}
                </h3>
                <div className="space-y-1">
                  <div className="text-[13px] text-gray-700 dark:text-gray-300">
                    {policy.child_policy.allow_children
                      ? t('houseRules.childrenAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаг')
                      : t('houseRules.childrenNotAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаггүй')
                    }
                  </div>
                  {policy.child_policy.allow_children && policy.child_policy.max_child_age && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{t('houseRules.maxChildAge', 'Хүүхдийн дээд нас:')}</span>{' '}
                      {policy.child_policy.max_child_age} {t('houseRules.years', 'нас')}
                    </div>
                  )}
                  {policy.child_policy.allow_extra_bed && (
                    <div className="text-[13px] text-gray-700 dark:text-gray-300">
                      {t('houseRules.extraBedAvailable', 'Нэмэлт ор байна')}
                      {policy.child_policy.extra_bed_price && Number(policy.child_policy.extra_bed_price) > 0 && (
                        <span> — ₮{Number(policy.child_policy.extra_bed_price).toLocaleString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Breakfast Policy */}
        {policy.breakfast_policy && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Coffee className="w-4 h-4 text-gray-900 dark:text-gray-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-2">
                  {t('houseRules.breakfast', 'Өглөөний цай')}
                </h3>
                <div className="text-[13px] text-gray-700 dark:text-gray-300">
                  {typeof policy.breakfast_policy === 'string' 
                    ? policy.breakfast_policy 
                    : policy.breakfast_policy.status 
                      ? (
                        <div className="space-y-1">
                          <div>{t('houseRules.breakfastAvailable', 'Өглөөний цай байна')}</div>
                          {policy.breakfast_policy.start_time && policy.breakfast_policy.end_time && (
                            <div>
                              {t('houseRules.breakfastTime', 'Цаг:')} {formatTime(policy.breakfast_policy.start_time)} - {formatTime(policy.breakfast_policy.end_time)}
                            </div>
                          )}
                          {policy.breakfast_policy.price && Number(policy.breakfast_policy.price) > 0 && (
                            <div>
                              {t('houseRules.breakfastPrice', 'Үнэ:')} {Number(policy.breakfast_policy.price).toLocaleString()}₮
                            </div>
                          )}
                        </div>
                      )
                      : t('houseRules.noBreakfast', 'Өглөөний цай байхгүй')
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}