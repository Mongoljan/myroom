'use client';

import { useEffect, useState } from 'react';
import { Clock, XCircle, Baby, PawPrint, Coffee, Car, Loader2, AlertCircle } from 'lucide-react';
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
      <section id="house-rules" className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
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
      <section id="house-rules" className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
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

  const rules = [
    {
      icon: Clock,
      iconColor: "text-slate-900",
      title: t('houseRules.checkInOut', 'Орох цаг / Гарах цаг'),
      details: [
        { 
          label: t('houseRules.checkIn', 'Орох цаг:'), 
          value: `${formatTime(policy.check_in_from)} - ${formatTime(policy.check_in_until)}` 
        },
        { 
          label: t('houseRules.checkOut', 'Гарах цаг:'), 
          value: `${formatTime(policy.check_out_from)} - ${formatTime(policy.check_out_until)}` 
        },
      ]
    },
    {
      icon: XCircle,
      iconColor: "text-red-600",
      title: t('houseRules.cancellation', 'Цуцлах бодлого'),
      details: [
        { 
          label: t('houseRules.beforeCancelTime', 'Цуцлах хугацааны өмнө:'), 
          value: `${policy.cancellation_fee.before_fee}%` 
        },
        { 
          label: t('houseRules.afterCancelTime', 'Цуцлах хугацааны дараа:'), 
          value: `${policy.cancellation_fee.after_fee}%` 
        },
        { 
          label: t('houseRules.cancelTime', 'Цуцлах хугацаа:'), 
          value: formatTime(policy.cancellation_fee.cancel_time)
        },
      ],
      description: t('houseRules.cancellationDesc', 'Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна.'),
    },
    {
      icon: Baby,
      iconColor: policy.allow_children ? "text-green-600" : "text-red-600",
      title: t('houseRules.children', 'Хүүхэд'),
      description: policy.allow_children 
        ? t('houseRules.childrenAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаг')
        : t('houseRules.childrenNotAllowed', 'Хүүхэдтэй зочдыг хүлээн авдаггүй')
    },
    {
      icon: PawPrint,
      iconColor: policy.allow_pets ? "text-green-600" : "text-red-600",
      title: t('houseRules.pets', 'Тэжээвэр амьтан'),
      description: policy.allow_pets
        ? t('houseRules.petsAllowed', 'Тэжээвэр амьтантай зочдыг хүлээн авдаг')
        : t('houseRules.petsNotAllowed', 'Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй'),
    },
    {
      icon: Coffee,
      iconColor: policy.breakfast_policy === "no" ? "text-red-600" : "text-green-600",
      title: t('houseRules.breakfast', 'Өглөөний цай'),
      description: `${t('houseRules.breakfastPolicy', 'Өглөөний цайны бодлого')}: ${policy.breakfast_policy}`
    },
    {
      icon: Car,
      iconColor: policy.parking_situation === "free" ? "text-green-600" : "text-orange-600",
      title: t('houseRules.parking', 'Зогсоол'),
      description: `${t('houseRules.parkingSituation', 'Зогсоолын нөхцөл')}: ${policy.parking_situation}`
    }
  ];

  return (
    <section id="house-rules" className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, index) => (
          <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-50`}>
                <rule.icon className={`w-5 h-5 ${rule.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{rule.title}</h3>
                
                {rule.details && (
                  <div className="space-y-2 mb-2">
                    {rule.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex justify-between items-start gap-2">
                        <span className="text-gray-600 text-sm flex-shrink-0">{detail.label}</span>
                        <span className="font-medium text-gray-900 text-sm text-right">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {rule.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{rule.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}