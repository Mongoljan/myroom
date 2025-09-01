'use client';

import { motion, Variants } from 'framer-motion';
import { Shield, Zap, ShoppingBag } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { TYPOGRAPHY } from '@/styles/containers';
import { useMemo } from 'react';

export default function WhyChooseUs() {
  const { t } = useHydratedTranslation();
  
  const features = [
    {
      icon: Shield,
      title: t('features.instantConfirmation', 'Шууд баталгаажуулалт'),
      description: t('features.instantConfirmationDesc', 'Хурдан бөгөөд найдвартай захиалгын систем, таны мэдээлэл аюулгүй хамгаалагдана.'),
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconGradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: t('features.fastService', 'Хурдан үйлчилгээ'),
      description: t('features.fastServiceDesc', 'Хялбар захиалга, хурдан баталгаажуулалт, мэргэжлийн дэмжлэг үйлчилгээ.'),
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconGradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShoppingBag,
      title: t('features.wideSelection', 'Өргөн сонголт'),
      description: t('features.wideSelectionDesc', 'Монгол орны хамгийн сайн зочид буудлууд, төрөл бүрийн үнийн санал, олон сонголт.'),
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconGradient: 'from-purple-500 to-pink-500'
    }
  ];

  // Create deterministic floating elements for background
  const floatingElements = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.round(seededRandom(i * 147.258) * 100 * 100) / 100,
      top: Math.round(seededRandom(i * 963.741) * 100 * 100) / 100,
      size: Math.round((20 + seededRandom(i * 456.123) * 40) * 100) / 100,
      duration: Math.round((15 + seededRandom(i * 789.456) * 10) * 100) / 100,
      delay: Math.round(seededRandom(i * 321.789) * 5 * 100) / 100,
    }));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Floating geometric shapes */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-xl"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5 -z-20">
          <motion.div 
            animate={{
              backgroundPosition: ["0px 0px", "40px 40px", "0px 0px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>
      </div>

      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${TYPOGRAPHY.heading.h1} text-gray-900 mb-4 relative`}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              {t('features.whyChooseUs', 'Яагаад биднийг сонгох хэрэгтэй вэ?')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${TYPOGRAPHY.body.large} text-gray-600 max-w-2xl mx-auto`}
          >
            {t('features.whyChooseUsDesc', 'Манай үйлчилгээний давуу талууд таны аялалыг илүү тав тухтай, найдвартай болгоно')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group"
            >
              <div className="relative h-full">
                {/* Enhanced Glass card with premium effects */}
                <motion.div
                  className="backdrop-blur-md bg-white/70 border border-white/50 rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden ring-1 ring-white/20"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.18)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    scale: 1.02
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated background glow */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                    }}
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                  
                  <div className="relative z-10 text-center">
                    {/* Enhanced Icon with More Visual Appeal */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.15, 
                        rotateY: 180,
                        transition: { duration: 0.6 }
                      }}
                      className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl relative shadow-xl"
                    >
                      {/* Pulsing Background Effect */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r ${feature.iconGradient} rounded-3xl opacity-20`}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.2, 0.3, 0.2]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Static Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.iconGradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`} />
                      
                      {/* Sparkle Effects */}
                      <motion.div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-60"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                      />
                      
                      <motion.div 
                        className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full opacity-50"
                        animate={{
                          scale: [0.6, 1, 0.6],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      />
                      
                      {/* Icon */}
                      <feature.icon className="w-10 h-10 text-white relative z-10 drop-shadow-sm" />
                    </motion.div>

                    {/* Enhanced Content */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className={`${TYPOGRAPHY.heading.h3} text-gray-900 mb-4 group-hover:text-gray-800 transition-all duration-300 font-bold`}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className={`${TYPOGRAPHY.body.standard} text-gray-600 leading-relaxed group-hover:text-gray-700 transition-all duration-300`}
                    >
                      {feature.description}
                    </motion.p>
                    
                    {/* Additional Visual Element - Feature Badge */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="mt-6 flex justify-center"
                    >
                      <motion.div 
                        className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${feature.iconGradient} rounded-full text-white text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <feature.icon className="w-4 h-4 mr-2" />
                        Premium Feature
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}