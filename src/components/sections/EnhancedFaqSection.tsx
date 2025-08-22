"use client";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Car, Clock, CreditCard, MapPin, Shield } from 'lucide-react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';

interface FAQ {
  q: string;
  a: string;
  icon: React.ReactNode;
  category?: string;
}

export default function EnhancedFaqSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]);

  // Enhanced FAQ data with icons
  const defaultFaqs: FAQ[] = [
    {
      q: "What do I need to hire a car?",
      a: "To rent a car, you'll need a valid driver's license, a credit card in your name, and you must meet the minimum age requirements. Additional documentation may be required for international rentals.",
      icon: <CreditCard className="w-5 h-5" />,
      category: "Requirements"
    },
    {
      q: "How old do I have to be to rent a car?",
      a: "The minimum age to rent a car is typically 21 years old, though this can vary by location and car category. Drivers under 25 may be subject to additional fees.",
      icon: <Shield className="w-5 h-5" />,
      category: "Age Requirements"
    },
    {
      q: "Can I book a hire car for someone else?",
      a: "Yes, you can make a reservation for another person, but the primary driver must be present at pickup with their own valid license and credit card.",
      icon: <Car className="w-5 h-5" />,
      category: "Booking"
    },
    {
      q: "How do I find the cheapest car hire deal?",
      a: "Compare prices across multiple suppliers, book in advance, consider different pickup locations, and be flexible with your dates. Look for package deals and promotional offers.",
      icon: <Clock className="w-5 h-5" />,
      category: "Pricing"
    },
    {
      q: "What should I look for when I'm choosing a car?",
      a: "Consider your needs: number of passengers, luggage space, fuel efficiency, transmission type (manual vs automatic), and any special features you might need for your trip.",
      icon: <MapPin className="w-5 h-5" />,
      category: "Selection"
    }
  ];

  // Build FAQ array from translation or use fallback
  const faqs = [];
  for (let i = 1; i <= 9; i++) {
    const item = t(`faq.q${i}`, { returnObjects: true });
    if (item && typeof item === 'object' && 'q' in item && 'a' in item) {
      faqs.push({
        ...item as { q: string; a: string },
        icon: defaultFaqs[i - 1]?.icon || <Car className="w-5 h-5" />,
        category: defaultFaqs[i - 1]?.category || "General"
      });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-3xl mb-8 shadow-lg shadow-blue-500/25"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          
          <motion.h2 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t('faq.title') || 'Frequently Asked'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('faq.subtitle') || 'Find answers to the most common questions about our car rental service. We\'ve got you covered from booking to return.'}
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Accordion className="space-y-6">
            {finalFaqs.map((faq, idx) => {
              const isOpen = openItems.includes(idx);
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                >
                  <AccordionItem>
                    <AccordionTrigger
                      isOpen={isOpen}
                      onClick={() => toggleItem(idx)}
                      icon={
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          {isOpen ? (
                            <Minus className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </motion.div>
                      }
                    >
                      {faq.q}
                    </AccordionTrigger>
                    
                    <AccordionContent isOpen={isOpen}>
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>

        {/* Enhanced call to action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/50 rounded-3xl p-12 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <motion.h3 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Still have questions?
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-8 text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Our support team is available 24/7 to help you with any questions
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat Support
              </motion.button>
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.82 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}