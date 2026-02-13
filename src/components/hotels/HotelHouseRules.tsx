'use client';

import { useEffect, useState } from 'react';
import { Calendar, Info, Loader2, AlertCircle, Car, Coffee, PawPrint, Baby } from 'lucide-react';
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
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-900 mr-2" />
          <span className="text-gray-600">{t('loading', 'Ачааллаж байна...')}</span>
        </div>
      </section>
    );
  }

  if (error || policies.length === 0) {
    return (
      <section id="house-rules" className="">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('houseRules.noData', 'Одоогоор мэдээлэл байхгүй байна')}</p>
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
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {/* Check-in / Check-out */}
        <div className="px-6 py-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                {t('houseRules.checkInOut', 'Орох цаг / Гарах цаг')}
              </h3>
              <div className="space-y-1.5">
                <div className="text-[15px] text-gray-700">
                  <span>{t('houseRules.checkIn', 'Орох цаг:')}</span>{' '}
                  <span className="text-gray-900">{formatTime(policy.check_in_from)}</span>
                </div>
                <div className="text-[15px] text-gray-700">
                  <span>{t('houseRules.checkOut', 'Гарах цаг:')}</span>{' '}
                  <span className="text-gray-900">{formatTime(policy.check_out_from)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parking/Deposit */}
        {policy.parking_situation && (
          <div className="px-6 py-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <Car className="w-5 h-5 text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                  {t('houseRules.parking', 'Зогсоол')}
                </h3>
                <div className="text-[15px] text-gray-700">
                  {policy.parking_situation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="px-6 py-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                {t('houseRules.cancellation', 'Цуцлалтын нөхцөл')}
              </h3>
              <div className="space-y-2">
                <div className="text-[15px] text-gray-700">
                  <span className="font-medium">{t('houseRules.cancelTime', 'Цуцлах хугацаа:')}</span>{' '}
                  {formatTime(policy.cancellation_fee.cancel_time)}
                </div>
                <div className="text-[15px] text-gray-700">
                  <span className="font-medium">{t('houseRules.beforeCancelTime', 'Цуцлах хугацааны өмнө:')}</span>{' '}
                  {policy.cancellation_fee.before_fee}%
                </div>
                <div className="text-[15px] text-gray-700">
                  <span className="font-medium">{t('houseRules.afterCancelTime', 'Цуцлах хугацааны дараа:')}</span>{' '}
                  {policy.cancellation_fee.after_fee}%
                </div>
                {policy.cancellation_fee.beforeManyRoom_fee && (
                  <div className="text-[15px] text-gray-700">
                    <span className="font-medium">{t('houseRules.beforeManyRooms', 'Олон өрөө цуцлах (өмнө):')}</span>{' '}
                    {policy.cancellation_fee.beforeManyRoom_fee}%
                  </div>
                )}
                {policy.cancellation_fee.afterManyRoom_fee && (
                  <div className="text-[15px] text-gray-700">
                    <span className="font-medium">{t('houseRules.afterManyRooms', 'Олон өрөө цуцлах (дараа):')}</span>{' '}
                    {policy.cancellation_fee.afterManyRoom_fee}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children Policy */}
        <div className="px-6 py-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Baby className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                {t('houseRules.children', 'Хүүхэд')}
              </h3>
              <div className="text-[15px] text-gray-700">
                {policy.allow_children
                  ? t('houseRules.childrenAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаг')
                  : t('houseRules.childrenNotAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаггүй')
                }
              </div>
            </div>
          </div>
        </div>

        {/* Pets Policy */}
        <div className="px-6 py-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <PawPrint className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                {t('houseRules.pets', 'Тэжээвэр амьтан')}
              </h3>
              <div className="text-[15px] text-gray-700">
                {policy.allow_pets
                  ? t('houseRules.petsAllowed', 'Тэжээвэр амьтантай зочдыг хүлээн авдаг')
                  : t('houseRules.petsNotAllowed', 'Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй')
                }
              </div>
            </div>
          </div>
        </div>

        {/* Breakfast Policy */}
        {policy.breakfast_policy && (
          <div className="px-6 py-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <Coffee className="w-5 h-5 text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
                  {t('houseRules.breakfast', 'Өглөөний цай')}
                </h3>
                <div className="text-[15px] text-gray-700">
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