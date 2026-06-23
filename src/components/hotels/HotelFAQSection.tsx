'use client';

import { useMemo, useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-5 text-left flex items-center gap-2">
        {t('hotelDetails.faqTitle', 'Түгээмэл асуулт, хариултууд')}
      </h2>
      
      <section id="faq" className=" bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row gap-x-5 gap-y-2"
        >
          {[0, 1].map((colIndex) => (
            <div key={colIndex} className="flex flex-col gap-y-2 flex-1 min-w-0">
              {answeredFaqs
                .map((faq, index) => ({ faq, index }))
                .filter(({ index }) => index % 2 === colIndex)
                .map(({ faq, index }) => {
                  const isOpen = openId === faq.id;
                  const question = getLocalizedText(faq, 'question', locale);
                  const answer = getLocalizedText(faq, 'answer', locale);

                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <motion.div
                        layout
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                        whileHover={{
                          y: -2,
                          boxShadow:
                            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                        }}
                      >
                        <motion.button
                          onClick={() => handleToggle(faq.id)}
                          className={`w-full text-left px-4 py-3 md:h-20 min-h-[4.5rem] flex items-center focus:outline-none transition-colors duration-200 ${
                            isOpen ? 'bg-gray-200 dark:bg-gray-700/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white pr-3 line-clamp-2">
                                {question}
                              </h3>
                            </div>

                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </div>
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: 'auto',
                                opacity: 1,
                                transition: {
                                  height: { duration: 0.3, ease: 'easeInOut' },
                                  opacity: { duration: 0.2, delay: 0.1 },
                                },
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                                transition: {
                                  height: { duration: 0.3, ease: 'easeInOut' },
                                  opacity: { duration: 0.1 },
                                },
                              }}
                              className="overflow-hidden"
                            >
                              <motion.div
                                className="px-4 py-4 bg-white dark:bg-gray-800"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                              >
                                <div className="text-[13px] font-normal text-gray-600 dark:text-gray-400 space-y-1">
                                  {answer.split('\n').map((line, i) => {
                                    const trimmed = line.trim();
                                    if (!trimmed) return null;
                                    const isBullet =
                                      trimmed.startsWith('-') ||
                                      trimmed.startsWith('•') ||
                                      trimmed.startsWith('○');
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
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  );
                })}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
    </div>
  );
}
