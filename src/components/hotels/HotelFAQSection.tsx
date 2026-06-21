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

function FaqItem({
  faq,
  isOpen,
  onToggle,
  locale,
  isLast,
}: {
  faq: PropertyFaq;
  isOpen: boolean;
  onToggle: () => void;
  locale: 'en' | 'mn';
  isLast: boolean;
}) {
  const question = getLocalizedText(faq, 'question', locale);
  const answer   = getLocalizedText(faq, 'answer',   locale);

  return (
    <div className={!isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-[18px] px-5 text-left group"
      >
        <span className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-[18px] h-[18px] text-gray-500 dark:text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          <div className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed space-y-1">
            {answer.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('○');
              return isBullet ? (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  <span>{trimmed.replace(/^[-•○]\s*/, '')}</span>
                </div>
              ) : (
                <p key={i}>{trimmed}</p>
              );
            })}
          </div>
        </div>
      )}
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

  const answeredFaqs = useMemo(() => faqs.filter(hasAnswer), [faqs]);

  const { leftFaqs, rightFaqs } = useMemo(() => {
    const mid = Math.ceil(answeredFaqs.length / 2);
    return { leftFaqs: answeredFaqs.slice(0, mid), rightFaqs: answeredFaqs.slice(mid) };
  }, [answeredFaqs]);

  if (answeredFaqs.length === 0) return null;

  const handleToggle = (id: number) =>
    setOpenId((cur) => (cur === id ? null : id));

  return (
    <div>
      <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-5">
        {t('hotelDetails.faqTitle', 'Түгээмэл асуулт, хариултууд')}
      </h2>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
        {/* Left column */}
        <div>
          {leftFaqs.map((faq, i) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
              locale={locale}
              isLast={i === leftFaqs.length - 1}
            />
          ))}
        </div>

        {/* Right column */}
        {rightFaqs.length > 0 && (
          <div>
            {rightFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
                locale={locale}
                isLast={i === rightFaqs.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
