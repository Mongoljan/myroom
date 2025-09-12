"use client";
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Plus, Minus, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const { t, i18n } = useHydratedTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]); // Allow multiple items to be open
  const [showAll, setShowAll] = useState(false); // Show more/less functionality

  // Enhanced FAQ data with fallback - hotel booking focused
  const defaultFaqs = [
    {
      q: "How do I make a hotel reservation?",
      a: "Simply enter your destination, check-in and check-out dates, select number of guests, and browse available hotels. Click 'Book Now' on your preferred hotel."
    },
    {
      q: "Can I cancel my booking?",
      a: "Most bookings can be cancelled. Cancellation policies vary by hotel and rate type. Check your booking confirmation for specific terms."
    },
    {
      q: "How do I pay for my reservation?",
      a: "We accept major credit cards, debit cards, and other secure payment methods. Payment is processed securely through our booking system."
    },
    {
      q: "What if I need to modify my booking?",
      a: "You can modify your booking through our manage booking section or contact customer support. Changes may be subject to availability and hotel policies."
    },
    {
      q: "How do I contact customer support?",
      a: "Our customer support team is available 24/7 via phone, email, or live chat to assist you with any questions or concerns about your booking."
    },
    {
      q: "What is your check-in and check-out time?",
      a: "Standard check-in time is 3:00 PM and check-out is 11:00 AM. Some hotels may offer early check-in or late check-out based on availability."
    },
    {
      q: "Do you offer free WiFi?",
      a: "Most of our partner hotels offer complimentary WiFi. You can check the amenities section of each hotel for specific details."
    },
    {
      q: "Can I book for a group or multiple rooms?",
      a: "Yes, you can book multiple rooms by adjusting the room count in your search. For large groups (10+ rooms), contact our group booking specialists."
    },
    {
      q: "What if the hotel price changes after I book?",
      a: "Once your booking is confirmed and paid, the price is locked in. You won't be charged more even if prices increase later."
    },
    {
      q: "How do I add special requests to my booking?",
      a: "During the booking process, you can add special requests such as late check-in, room preferences, or dietary requirements in the special requests section."
    }
  ];

  // Build FAQ array from translation resources directly
  const faqs = [];
  const currentLanguage = i18n.language || 'mn';
  
  // Access i18n resources directly for complex objects
  const resources = i18n.getResourceBundle(currentLanguage, 'translation');
  
  if (resources?.faq) {
    // Load all available FAQs, not just first 5
    for (let i = 1; i <= 20; i++) {
      const faqItem = resources.faq[`q${i}`];
      if (faqItem && typeof faqItem === 'object' && 'q' in faqItem && 'a' in faqItem) {
        faqs.push(faqItem);
      }
    }
  }
  
  const allFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const firstFiveFaqs = allFaqs.slice(0, 5);
  const remainingFaqs = allFaqs.slice(5);
  
  // Debug logging
  console.log('FAQ Debug:', {
    showAll,
    allFaqsCount: allFaqs.length,
    firstFiveCount: firstFiveFaqs.length,
    remainingCount: remainingFaqs.length
  });

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
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          
          <motion.h2 
            className={`${TYPOGRAPHY.heading.h1} mb-4`}
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
            className={`${TYPOGRAPHY.body.standard} text-gray-600 max-w-3xl mx-auto`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
          </motion.p>
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
              
              // Debug: Check if FAQ has content
              if (!faq || !faq.q || !faq.a) {
                console.warn(`FAQ at index ${idx} missing content:`, faq);
                return null;
              }
              
              return (
                <motion.div
                  key={`faq-${idx}`}
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
                          
                          <h3 className={`${TYPOGRAPHY.card.subtitle} text-gray-900 pr-3`}>
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
                            className="px-4 pb-4 bg-white"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <div className="pl-10 border-l border-gray-200">
                              <motion.p 
                                className={`${TYPOGRAPHY.body.standard} text-gray-600`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                {faq.a || 'Энэ асуултын хариу одоогоор бэлэн байхгүй байна.'}
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
            
            {/* Remaining FAQs - Only show when showAll is true */}
            {showAll && remainingFaqs.map((faq, idx) => {
              const actualIndex = idx + 5; // Adjust index to continue from where first 5 ended
              const isOpen = openItems.includes(actualIndex);
              
              // Debug: Check if FAQ has content
              if (!faq || !faq.q || !faq.a) {
                console.warn(`Additional FAQ at index ${actualIndex} missing content:`, faq);
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
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                    }}
                    layout
                  >
                    <motion.button
                      className="w-full text-left p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onClick={() => toggleItem(actualIndex)}
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
                          
                          <h3 className={`${TYPOGRAPHY.card.subtitle} text-gray-900 pr-3`}>
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
                            className="px-4 pb-4 bg-white"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <div className="pl-10 border-l border-gray-200">
                              <motion.p 
                                className={`${TYPOGRAPHY.body.standard} text-gray-600`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                {faq.a || 'Энэ асуултын хариу одоогоор бэлэн байхгүй байна.'}
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
                className="inline-flex items-center px-6 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-200 font-medium"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showAll ? (
                  <>
                    <Minus className="w-4 h-4 mr-2" />
                    {t('faq.showLess', 'Хураангуйлах')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('faq.showMore', `Дэлгэрэнгүй харах (+${remainingFaqs.length})`)}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}