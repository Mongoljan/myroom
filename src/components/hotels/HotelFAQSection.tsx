'use client';

import { useMemo, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PropertyFaq } from '@/types/api';
import { ApiService } from '@/services/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

interface HotelFAQSectionProps {
  faqs?: PropertyFaq[];
  hotelId?: number;
}

function getLocalizedText(
  faq: PropertyFaq,
  field: 'question' | 'answer',
  locale: 'en' | 'mn'
): string {
  const mn = (field === 'question' ? faq.question_mn : faq.answer_mn)?.trim() || '';
  const en = (field === 'question' ? faq.question_en : faq.answer_en)?.trim() || '';
  if (locale === 'en') return en || mn;
  return mn || en;
}

function hasAnswer(faq: PropertyFaq): boolean {
  return !!(faq.answer_mn?.trim() || faq.answer_en?.trim());
}

function FaqColumn({
  items,
  openId,
  onToggle,
  locale,
}: {
  items: PropertyFaq[];
  openId: number | null;
  onToggle: (id: number) => void;
  locale: 'en' | 'mn';
}) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((faq) => {
        const question = getLocalizedText(faq, 'question', locale);
        const answer = getLocalizedText(faq, 'answer', locale);
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => onToggle(faq.id)}
              className="w-full flex items-start justify-between gap-4 py-4 text-left hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                {question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HotelFAQSection({ faqs: faqsProp, hotelId }: HotelFAQSectionProps) {
  const { t, i18n } = useHydratedTranslation();
  const locale: 'en' | 'mn' = i18n.language === 'en' ? 'en' : 'mn';
  const [openId, setOpenId] = useState<number | null>(null);
  const [fetchedFaqs, setFetchedFaqs] = useState<PropertyFaq[]>([]);

  useEffect(() => {
    if (faqsProp !== undefined || !hotelId) return;
    ApiService.getPropertyFaqs(hotelId)
      .then((res) => setFetchedFaqs(res.faqs || []))
      .catch(() => {});
  }, [hotelId, faqsProp]);

  const faqs = faqsProp ?? fetchedFaqs;

  const answeredFaqs = useMemo(
    () => faqs.filter(hasAnswer),
    [faqs]
  );

  const { leftFaqs, rightFaqs } = useMemo(() => {
    const midpoint = Math.ceil(answeredFaqs.length / 2);
    return {
      leftFaqs: answeredFaqs.slice(0, midpoint),
      rightFaqs: answeredFaqs.slice(midpoint),
    };
  }, [answeredFaqs]);

  if (answeredFaqs.length === 0) return null;

  const handleToggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div>
      <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-6">
        {t('hotelDetails.faqTitle', 'Түгээмэл асуулт, хариултууд')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 xl:gap-x-16">
        <FaqColumn
          items={leftFaqs}
          openId={openId}
          onToggle={handleToggle}
          locale={locale}
        />
        {rightFaqs.length > 0 && (
          <FaqColumn
            items={rightFaqs}
            openId={openId}
            onToggle={handleToggle}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
