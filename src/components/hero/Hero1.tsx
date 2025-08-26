'use client'
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { motion } from "framer-motion";
import SearchForm from "./SearchForm";

const Hero1 = () => {
  const { t } = useHydratedTranslation();

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('hero.findNextPlace', 'Find Your Perfect')}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('hero.hotelStay', 'Hotel Stay')}
            </motion.h2>
            
            <motion.p 
              className="text-sm text-white/80 mb-6 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('hero.discoverAmazing', 'Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences.')}
            </motion.p>
          </motion.div>


          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <SearchForm />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
          >
            <div className="text-white">
              <div className="text-xl md:text-2xl font-bold mb-1">10,000+</div>
              <div className="text-white/80 text-sm">Hotels Worldwide</div>
            </div>
            <div className="text-white">
              <div className="text-xl md:text-2xl font-bold mb-1">50,000+</div>
              <div className="text-white/80 text-sm">Happy Customers</div>
            </div>
            <div className="text-white">
              <div className="text-xl md:text-2xl font-bold mb-1">24/7</div>
              <div className="text-white/80 text-sm">Customer Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;