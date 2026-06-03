'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  CreditCard,
  Package,
  RotateCcw,
  DollarSign,
  BedDouble,
  BookOpen,
  Sparkles,
  ChevronDown,
  Phone,
  MessageCircle,
  PlayCircle,
} from 'lucide-react';
import { helpFaqData } from '@/data/helpFaqData';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  CreditCard,
  Package,
  RotateCcw,
  DollarSign,
  BedDouble,
  BookOpen,
  Sparkles
};

export default function HelpPageContent() {
  const { t } = useHydratedTranslation();
  const [activeCategory, setActiveCategory] = useState(helpFaqData[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeCategoryData = helpFaqData.find(cat => cat.id === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - Blue gradient like main search */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(45deg, #38bdf8, #0ea5e9, #0284c7, #0369a1, #38bdf8)",
              backgroundSize: "400% 400%"
            }}
          />
        </div>

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -60, 80, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 60, 0],
              y: [0, 70, -40, 0],
              scale: [0.9, 1.1, 0.8, 0.9],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Тусламж
            </h1>
           
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* FAQ Section */}
        <section id="faq" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-h2  flex justify-start font-semibold text-gray-900 dark:text-white mb-1">
              Түгээмэл асуултууд
            </h2>
           
          </motion.div>

          {/* Category Tabs - horizontal scroll, single row */}
          <div className="mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-1">
              {helpFaqData.map((category, index) => {
                const Icon = iconMap[category.icon];
                const isActive = activeCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenFaqIndex(null);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span>{category.title}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items - matching existing FAQ style */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activeCategoryData?.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                        onClick={() => toggleFaq(index)}
                        className={`w-full text-left p-4 focus:outline-none ${isOpen ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <h3 className={`${TYPOGRAPHY.card.subtitle} font-bold text-gray-900 dark:text-white pr-3`}>
                              {faq.question}
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
                                {faq.answer}
                              </motion.p>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Video Section */}
        <section id="videos" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-1 text-left">
              Видео заавар
            </h2>
            <p className={`${TYPOGRAPHY.body.small} text-gray-600 dark:text-gray-400`}>
              Системийн ашиглалтын заавар
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center shadow-md group-hover:bg-slate-900 transition-colors">
                      <PlayCircle className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-medium text-sm">
                      Танилцуулга
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
        <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-1 text-left">
                Холбоо барих
              </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
          >
            {/* Subtle gradient background */}
           
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-teal-500/5 to-slate-500/5 -z-10" />
          
            <div className="text-center mb-6">
        
            
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Chat Button - Facebook */}
              <motion.a
                href="https://www.facebook.com/profile.php?id=61579682037246"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 rounded-lg px-4 py-3 transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Чат эхлүүлэх
                </span>
              </motion.a>

              {/* Phone Button */}
              <motion.a
                href="tel:90234234"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-3 transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                <span>90234234</span>
              </motion.a>
            </div>

            {/* Working Hours */}
            <div className="text-center mt-4">
              <p className={`${TYPOGRAPHY.body.small} text-gray-600 dark:text-gray-400`}>
                24/7 үйлчилгээ үзүүлнэ
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
