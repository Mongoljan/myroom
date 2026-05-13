"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const { t, i18n } = useHydratedTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]); // Allow multiple items to be open
  const [showAll, setShowAll] = useState(false); // Show more/less functionality

  // Build FAQ array from translation resources only (no hardcoded fallback)
  const faqs: { q: string; a: string }[] = [];
  const currentLanguage = i18n.language || 'mn';

  // Access i18n resources directly for complex objects
  const resources = i18n.getResourceBundle(currentLanguage, 'translation');

  if (resources?.faq) {
    for (let i = 1; i <= 20; i++) {
      const faqItem = resources.faq[`q${i}`];
      if (faqItem && typeof faqItem === 'object' && 'q' in faqItem && 'a' in faqItem) {
        faqs.push(faqItem as { q: string; a: string });
      }
    }
  }

  const allFaqs = faqs;
  const firstFiveFaqs = allFaqs.slice(0, 5);
  const remainingFaqs = allFaqs.slice(5);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleShowMoreToggle = () => {
    setShowAll(!showAll);
    // Don't reset open items - preserve the state of existing FAQs
    // Users should be able to keep their current FAQs open/closed
  };


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl flex justify-start md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            {/* Always render first 5 FAQs */}
            {firstFiveFaqs.map((faq, idx) => {
              const isOpen = openItems.includes(idx);
              
              // Skip items with missing content
              if (!faq || !faq.q || !faq.a) return null;
              
              return (
                <motion.div
                  key={`faq-${idx}`}
                  variants={itemVariants}
                  className="group"
                >
                  <motion.div 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                    }}
                    layout
                  >
                    <motion.button
                      className={`w-full text-left p-4 focus:outline-none ${isOpen ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                      onClick={() => toggleItem(idx)}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <h3 className={`${TYPOGRAPHY.card.subtitle} font-bold text-gray-900 dark:text-white pr-3`}>
                            {faq.q}
                          </h3>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
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
                            height: "auto", 
                            opacity: 1,
                            transition: {
                              height: { duration: 0.3, ease: "easeInOut" },
                              opacity: { duration: 0.2, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: { duration: 0.3, ease: "easeInOut" },
                              opacity: { duration: 0.1 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div 
                            className="px-4 pb-4 bg-white dark:bg-gray-800"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <motion.p 
                              className={`${TYPOGRAPHY.body.standard} font-normal text-gray-600 dark:text-gray-400`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {faq.a || 'Энэ асуултын хариу одоогоор бэлэн байхгүй байна.'}
                            </motion.p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
            
            {/* Remaining FAQs - Only show when showAll is true */}
            {showAll && remainingFaqs.map((faq, idx) => {
              const actualIndex = idx + 5; // Adjust index to continue from where first 5 ended
              const isOpen = openItems.includes(actualIndex);
              
              // Debug: Check if FAQ has content
              if (!faq || !faq.q || !faq.a) {
                return null;
              }
              
              return (
                <motion.div
                  key={`faq-additional-${actualIndex}`}
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group"
                >
                  <motion.div 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                    }}
                    layout
                  >
                    <motion.button
                      className={`w-full text-left p-4 focus:outline-none ${isOpen ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                      onClick={() => toggleItem(actualIndex)}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <h3 className={`${TYPOGRAPHY.card.subtitle} font-bold text-gray-900 dark:text-white pr-3`}>
                            {faq.q}
                          </h3>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                            height: "auto", 
                            opacity: 1,
                            transition: {
                              height: { duration: 0.3, ease: "easeInOut" },
                              opacity: { duration: 0.2, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: { duration: 0.3, ease: "easeInOut" },
                              opacity: { duration: 0.1 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div 
                            className="px-4 pb-4 bg-white dark:bg-gray-800"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <motion.p 
                              className={`${TYPOGRAPHY.body.standard} font-normal text-gray-600 dark:text-gray-400`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {faq.a || 'Энэ асуултын хариу одоогоор бэлэн байхгүй байна.'}
                            </motion.p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Show More/Less Button */}
          {allFaqs.length > 5 && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={handleShowMoreToggle}
                className="inline-flex items-center px-6 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-slate-200 text-gray-700 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all duration-200 font-medium"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showAll ? (
                  t('faq.showLess', 'Хураангуйлах')
                ) : (
                  t('faq.showMore', 'Дэлгэрэнгүй харах')
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}