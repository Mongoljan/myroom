"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, ChevronDown } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', color: 'from-blue-500 to-red-600' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳', color: 'from-red-500 to-blue-600' }
];

export default function LanguageSwitcher() {
  const { i18n, mounted } = useHydratedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target || !(event.target as Element).closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative language-switcher">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300"
      >
        {/* Animated background */}
        <motion.div
          animate={{
            background: isHovered 
              ? `linear-gradient(45deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))` 
              : `linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))`
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        />
        
        {/* Glowing orb effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 0,
            opacity: isHovered ? 0.3 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md"
        />

        <div className="relative flex items-center space-x-2 px-4 py-2.5">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Languages className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
          </motion.div>
          
          <motion.div
            className="flex items-center space-x-1.5"
            animate={{ y: isOpen ? -1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span 
              className="text-xl filter drop-shadow-sm"
              animate={{ scale: mounted ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {mounted ? currentLanguage.flag : '🌐'}
            </motion.span>
            <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors tracking-wide">
              {mounted ? currentLanguage.code.toUpperCase() : 'EN'}
            </span>
          </motion.div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:text-white/90 transition-colors" />
          </motion.div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: isHovered ? '100%' : '-100%',
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.9,
                filter: "blur(4px)"
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                y: -15, 
                scale: 0.95,
                filter: "blur(2px)"
              }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              className="absolute right-0 mt-3 w-64 z-50"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg" />
                
                <div className="relative bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-b border-gray-200/30">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {i18n.language === 'mn' ? 'Хэл сонгох' : 'Choose Language'}
                      </span>
                    </div>
                  </div>

                  {/* Language Options */}
                  <div className="p-2">
                    {languages.map((language, index) => {
                      const isActive = i18n.language === language.code;
                      
                      return (
                        <motion.button
                          key={language.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                          }}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`group relative w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
                              : 'hover:bg-gray-50/80'
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeLanguage"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full"
                            />
                          )}

                          <motion.span 
                            className="text-2xl filter drop-shadow-sm"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                          >
                            {language.flag}
                          </motion.span>
                          
                          <div className="flex-1 text-left">
                            <div className={`font-semibold transition-colors ${
                              isActive 
                                ? 'text-indigo-700' 
                                : 'text-gray-900 group-hover:text-gray-900'
                            }`}>
                              {language.name}
                            </div>
                            <div className={`text-xs transition-colors ${
                              isActive 
                                ? 'text-indigo-500' 
                                : 'text-gray-900 group-hover:text-gray-800'
                            }`}>
                              {language.code.toUpperCase()}
                            </div>
                          </div>

                          {isActive && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                damping: 15, 
                                stiffness: 300,
                                delay: 0.1
                              }}
                            >
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </motion.div>
                          )}

                          {/* Hover glow effect */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.1 }}
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r ${language.color}`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}