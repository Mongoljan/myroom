'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface HotelFAQProps {
  hotelName: string;
}

export default function HotelFAQ({ hotelName }: HotelFAQProps) {
  const { t } = useHydratedTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: t('faq.breakfast', `${hotelName}-д ямар цайны хоол өгдөг вэ?`),
      answer: t('faq.breakfastAnswer', `${hotelName}-д амттай цайны хоол (зочдын үнэлгээ 8.5) өгдөг. Цайны хоолны сонголтод: Буфет орно.`),
    },
    {
      question: t('faq.pool', `${hotelName}-д усан сан байдаг уу?`),
      answer: t('faq.poolAnswer', 'Тийм, энэ зочид буудалд усан сантай.'),
    },
    {
      question: t('faq.rooms', `${hotelName}-д ямар өрөө захиалж болох вэ?`),
      answer: t('faq.roomsAnswer', 'Та дараах өрөөнүүдийг захиалж болно: Стандарт хос хүний өрөө, Люкс өрөө, Гэр бүлийн өрөө.'),
    },
    {
      question: t('faq.checkin', `${hotelName}-д хэзээ ирж, хэзээ явах вэ?`),
      answer: t('faq.checkinAnswer', 'Бүртгэл: 14:00-оос эхлэн. Буцах: 12:00 хүртэл.'),
    },
    {
      question: t('faq.cost', `${hotelName}-д хэдээр амрах вэ?`),
      answer: t('faq.costAnswer', 'Үнэ нь сонгосон өрөө, огноо зэргээс хамаарч өөр байна. Та үнийг харахын тулд хайлтынхаа огноог оруулна уу.'),
    },
    {
      question: t('faq.restaurant', `${hotelName}-д ресторан байдаг уу?`),
      answer: t('faq.restaurantAnswer', 'Тийм, энэ зочид буудалд ресторан байдаг.'),
    },
    {
      question: t('faq.activities', `${hotelName}-д юу хийх боломжтой вэ?`),
      answer: t('faq.activitiesAnswer', 'Зочид буудлын эргэн тойронд янз бүрийн үйл ажиллагаа хийх боломжтой.'),
    },
    {
      question: t('faq.distance', `${hotelName} хотын төвөөс хэр хол байдаг вэ?`),
      answer: t('faq.distanceAnswer', 'Энэ зочид буудал хотын төвөөс ойролцоогоор 2 км зайд байрладаг.'),
    },
    {
      question: t('faq.hottub', `${hotelName}-д халуун ванн байдаг уу?`),
      answer: t('faq.hottubAnswer', 'Тийм, энэ зочид буудалд халуун ванн байдаг.'),
    },
    {
      question: t('faq.families', `${hotelName} гэр бүлтнүүдэд алдартай юу?`),
      answer: t('faq.familiesAnswer', 'Тийм, энэ зочид буудал гэр бүлтнүүдэд маш алдартай.'),
    },
  ];

  return (
    <section id="faq" className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('faq.title', 'Тугээмал асуулт, хариулт')}
        </h2>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}