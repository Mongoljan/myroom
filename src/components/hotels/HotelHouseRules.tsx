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
      <section id="house-rules" className="py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">{t('loading', 'Ачааллаж байна...')}</span>
        </div>
      </section>
    );
  }

  if (error || policies.length === 0) {
    return (
      <section id="house-rules" className="py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('houseRules.title', 'Дотоод журам')}
          </h2>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
      iconColor: "text-blue-600",
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
    <section id="house-rules" className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="space-y-6">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <rule.icon className={`w-5 h-5 ${rule.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{rule.title}</h3>
              
              {rule.details && (
                <div className="mb-3 space-y-2">
                  {rule.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex justify-between items-center py-1">
                      <span className="text-gray-700 text-sm">{detail.label}</span>
                      <span className="font-semibold text-gray-900">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {rule.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{rule.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}