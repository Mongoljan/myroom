'use client'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SearchForm from "./SearchForm";

const Hero1 = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('hotels');

  const tabs = [
    { key: 'hotels', label: t('tabs.hotels'), icon: '🏨' },
    { key: 'tour', label: t('tabs.tour'), icon: '🗺️' },
    { key: 'activity', label: t('tabs.activity'), icon: '🎯' },
    { key: 'holidayRentals', label: t('tabs.holidayRentals'), icon: '🏠' },
    { key: 'car', label: t('tabs.car'), icon: '🚗' },
    { key: 'cruise', label: t('tabs.cruise'), icon: '🚢' },
    { key: 'flights', label: t('tabs.flights'), icon: '✈️' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const xPercent = (i * 17 + 23) % 100; // Pseudo-random but deterministic
            const yPercent = (i * 31 + 47) % 100;
            const duration = 3 + (i % 4); // 3-6 seconds
            const delay = (i % 5) * 0.4; // 0-2 seconds
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('hero.findNextPlace')}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('hero.discoverAmazing')}
            </motion.p>
          </motion.div>

          {/* Search Tabs */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-xl border-white/20'
                      : 'text-white hover:bg-white/10 border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <SearchForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;