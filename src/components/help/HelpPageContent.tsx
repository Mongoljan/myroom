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
  HelpCircle
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
  useHydratedTranslation();
  const [activeCategory, setActiveCategory] = useState(helpFaqData[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const [showAllVideos, setShowAllVideos] = useState(false);

  const allVideos = [1, 2, 3, 4, 5, 6, 7, 8];
  const visibleVideos = showAllVideos ? allVideos : allVideos.slice(0, 4);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="relative py-12 overflow-hidden bg-white dark:bg-gray-900 ">
  
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(45deg, #dbeafe, #ffffff, #e0f2fe, #f0fdf4, #ede9fe)",
              backgroundSize: "400% 400%",
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
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 60, 0],
              y: [0, 70, -40, 0],
              scale: [0.9, 1.1, 0.8, 0.9],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -40, 50, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-48 h-48 bg-violet-200/25 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
              Тусламж
            </h1>
            <p className={`mt-2 ${TYPOGRAPHY.body.small} text-gray-500 dark:text-gray-400`}>
              Танд бид юугаар туслах вэ?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10 bg">
        {/* FAQ Section */}
        <section id="faq" className="mb-3 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-1 text-left flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              Түгээмэл асуултууд
            </h2>
           
          </motion.div>

          {/* Category Tabs - horizontal scroll, single row */}
          <div className="mb-5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
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
          {/* FAQ Items - two independent columns so expanding one doesn't affect the other */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-x-5 gap-y-2 mt-2"
            >
              {[0, 1].map((colIndex) => (
                <div key={colIndex} className="flex flex-col gap-y-2 flex-1 min-w-0">
                  {activeCategoryData?.faqs
                    .map((faq, index) => ({ faq, index })) // keep original index for state/order
                    .filter(({ index }) => index % 2 === colIndex) // even -> col 0, odd -> col 1 (matches old grid order)
                    .map(({ faq, index }) => {
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
                            layout
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
                            whileHover={{
                              y: -2,
                              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                            }}
                          >
                            <motion.button
                              onClick={() => toggleFaq(index)}
                              className={`w-full text-left px-4 py-3 md:h-20 min-h-[4.5rem] flex items-center focus:outline-none transition-colors duration-200 ${
                                isOpen ? 'bg-gray-200 dark:bg-gray-700/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center flex-1 min-w-0">
                                  <h3 className={`${TYPOGRAPHY.card.subtitle} font-bold text-gray-900 dark:text-white pr-3 line-clamp-2`}>
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
                                    className="px-4 py-4 bg-white dark:bg-gray-800"
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
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-3 bg-white dark:bg-gray-800 rounded-lg py-3 border border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl"
          >

            <div className="grid sm:grid-cols-2 gap-3 w-full divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center justify-center py-3">
                <motion.a
                  href="https://www.facebook.com/profile.php?id=61579682037246"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Чат эхлүүлэх</span>
                </motion.a>
              </div>

              <div className="flex items-center justify-center py-3">
                <motion.a
                  href="tel:90234234"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 text-slate-900 dark:text-gray-100 hover:text-slate-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">90234234</span>
                </motion.a>
              </div>

            </div>
          </motion.div>
        </section>

        {/* Video Section */}
        <section id="videos" className="mb-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-white mb-1 text-left flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              Видео заавар
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleVideos.map((item, index) => (
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
                    <p className="text-white font-medium text-sm">Танилцуулга</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAllVideos(!showAllVideos)}
              className="text-blue-600 dark:text-blue-400 underline underline-offset-2 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {showAllVideos ? "Хураангуйлах" : "Бүгдийг харах"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
