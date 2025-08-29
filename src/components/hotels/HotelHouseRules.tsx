'use client';

import { Clock, CreditCard, Users, AlertCircle, Bed, DollarSign } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelHouseRulesProps {
  hotelName: string;
}

export default function HotelHouseRules({ hotelName }: HotelHouseRulesProps) {
  const { t } = useHydratedTranslation();

  const rules = [
    {
      icon: Clock,
      title: t('houseRules.checkInOut', 'Орох цаг / Гарах цаг'),
      details: [
        { label: t('houseRules.checkIn', 'Орох цаг:'), value: '16:00' },
        { label: t('houseRules.checkOut', 'Гарах цаг:'), value: '12:00' },
      ]
    },
    {
      icon: CreditCard,
      title: t('houseRules.deposit', 'Зөвшөөрөл'),
      details: [
        { label: t('houseRules.dailyDeposit', 'Төлбөртөй / Өдрийн:'), value: '20,000₮' },
      ],
      description: t('houseRules.depositDesc', 'Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна. Та сонголтоо хийхдээ ямар нөхцөл хамаарахыг шалгана уу.'),
    },
    {
      icon: Users,
      title: t('houseRules.children', 'Хүүхэд болон нэмэлт ор'),
      subsections: [
        {
          title: t('houseRules.childrenPolicy', 'Хүүхэд'),
          items: [
            t('houseRules.childrenWelcome', 'Бүх насны хүүхдийг хүлээн авна.'),
            t('houseRules.childrenCharge', '6-аас дээш насны хүүхдийг энэ зочид буудалд том хүн гэж тооцдог.'),
            t('houseRules.childrenRate', '6-аас доош насны хүүхэдтэй аялж байгаа бол зөв үнийг авахын тулд хүүхдийн тоотой тариф сонгоно уу.')
          ]
        },
        {
          title: t('houseRules.bedPolicy', 'Хүүхдийн ор болон нэмэлт ор'),
          items: [
            t('houseRules.babyCot', '0 - 2 нас: Хүүхдийн ор хүсэлтээр'),
            t('houseRules.babyCotFree', 'Үнэгүй'),
            t('houseRules.extraBed', '5+ нас: Нэмэлт ор хүсэлтээр'),
            t('houseRules.extraBedPrice', 'Хүний тоо, шөнийн тоогоор US$60'),
            t('houseRules.bedNote', 'Нэмэлт ор болон хүүхдийн орны үнэ нийт үнэд орохгүй бөгөөд хүрэлцэн ирэхдээ тусдаа төлөх шаардлагатай.'),
            t('houseRules.bedAvailability', 'Нэмэлт ор болон хүүхдийн орны тоо нь таны сонгосон сонголтоос хамаарна. Дэлгэрэнгүй мэдээлэл авахын тулд сонгосон сонголтоо шалгана уу.'),
            t('houseRules.bedSubject', 'Бүх нэмэлт ор болон хүүхдийн ор нь боломжийн дагуу өгөгдөнө.')
          ]
        }
      ]
    },
    {
      icon: AlertCircle,
      title: t('houseRules.ageRestriction', 'Насны шаардлага'),
      description: t('houseRules.ageRestrictionDesc', 'Бүртгүүлэхэд насны шаардлага байхгүй'),
    },
    {
      icon: AlertCircle,
      title: t('houseRules.pets', 'Тэжээвэр амьтан'),
      description: t('houseRules.petsDesc', 'Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй.'),
    },
    {
      icon: CreditCard,
      title: t('houseRules.payment', 'Зөвшөөрөх төлбөрийн хэрэгслүүд'),
      paymentMethods: ['american-express', 'visa', 'mastercard', 'jcb', 'unionpay', 'cash']
    }
  ];

  const PaymentMethodIcon = ({ method }: { method: string }) => {
    const iconClass = "h-6 object-contain";
    switch (method) {
      case 'american-express':
        return <div className={`bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>AMEX</div>;
      case 'visa':
        return <div className={`bg-blue-800 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>VISA</div>;
      case 'mastercard':
        return <div className={`bg-red-600 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>MC</div>;
      case 'jcb':
        return <div className={`bg-green-600 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>JCB</div>;
      case 'unionpay':
        return <div className={`bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>UP</div>;
      case 'cash':
        return <div className={`bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold ${iconClass}`}>CASH</div>;
      default:
        return null;
    }
  };

  return (
    <section id="house-rules" className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('houseRules.title', 'Дотоод журам')}
        </h2>
      </div>

      <div className="space-y-8">
        {rules.map((rule, index) => (
          <div key={index} className="bg-white">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <rule.icon className="w-5 h-5 text-gray-800" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{rule.title}</h3>
                
                {rule.details && (
                  <div className="mb-3">
                    {rule.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex justify-between py-1">
                        <span className="text-gray-900">{detail.label}</span>
                        <span className="font-medium text-gray-900">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {rule.description && (
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">{rule.description}</p>
                )}

                {rule.subsections && (
                  <div className="space-y-4">
                    {rule.subsections.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex}>
                        <h4 className="font-semibold text-gray-800 mb-2">{subsection.title}</h4>
                        <ul className="text-sm text-gray-800 space-y-1">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {rule.paymentMethods && (
                  <div className="flex flex-wrap gap-2">
                    {rule.paymentMethods.map((method, methodIndex) => (
                      <PaymentMethodIcon key={methodIndex} method={method} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}