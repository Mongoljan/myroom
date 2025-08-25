"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Plus, Minus, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const { t, i18n } = useHydratedTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]); // Allow multiple items to be open

  // Enhanced FAQ data with fallback
  const defaultFaqs = [
    {
      q: "What do I need to hire a car?",
      a: "To rent a car, you&apos;ll need a valid driver&apos;s license, a credit card in your name, and you must meet the minimum age requirements. Additional documentation may be required for international rentals."
    },
    {
      q: "How old do I have to be to rent a car?",
      a: "The minimum age to rent a car is typically 21 years old, though this can vary by location and car category. Drivers under 25 may be subject to additional fees."
    },
    {
      q: "Can I book a hire car for someone else?",
      a: "Yes, you can make a reservation for another person, but the primary driver must be present at pickup with their own valid license and credit card."
    },
    {
      q: "How do I find the cheapest car hire deal?",
      a: "Compare prices across multiple suppliers, book in advance, consider different pickup locations, and be flexible with your dates. Look for package deals and promotional offers."
    },
    {
      q: "What should I look for when I'm choosing a car?",
      a: "Consider your needs: number of passengers, luggage space, fuel efficiency, transmission type (manual vs automatic), and any special features you might need for your trip."
    }
  ];

  // Build FAQ array from translation resources directly
  const faqs = [];
  const currentLanguage = i18n.language || 'mn';
  
  // Access i18n resources directly for complex objects
  const resources = i18n.getResourceBundle(currentLanguage, 'translation');
  
  if (resources?.faq) {
    for (let i = 1; i <= 13; i++) {
      const faqItem = resources.faq[`q${i}`];
      if (faqItem && typeof faqItem === 'object' && 'q' in faqItem && 'a' in faqItem) {
        faqs.push(faqItem);
      }
    }
  }
  
  const finalFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-3">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl mb-4"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-900">
              {t('faq.title', 'Frequently Asked Questions')}
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-sm text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('faq.subtitle', 'Түгээмэл асуугддаг асуултууд')}
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            {finalFaqs.map((faq, idx) => {
              const isOpen = openItems.includes(idx);
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group"
                >
                  <motion.div 
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                    }}
                    layout
                  >
                    <motion.button
                      className="w-full text-left p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onClick={() => toggleItem(idx)}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <motion.div 
                            className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                              {isOpen ? (
                                <Minus className="w-3 h-3" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </motion.div>
                          </motion.div>
                          
                          <h3 className="text-sm font-medium text-gray-900 pr-3">
                            {faq.q}
                          </h3>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
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
                            className="px-4 pb-4"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <div className="pl-10 border-l border-gray-200">
                              <motion.p 
                                className="text-sm text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                {faq.a}
                              </motion.p>
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
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-600 mb-4">
            {t('faq.stillHaveQuestions', 'Асуулт байгаа юу? Бид танд туслахад бэлэн байна!')}
          </p>
          {/* <motion.button
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
{t('faq.contactSupport', 'Дэмжлэг авах')}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
}