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
    <section className="relative py-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Floating geometric shapes */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-blue-100/20 blur-xl"
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
          className="text-center mb-6"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl font-bold text-gray-900 mb-2 relative"
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
            className="text-gray-600 max-w-3xl mx-auto text-sm"
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                {/* Clean Professional Card */}
                <motion.div
                  className="bg-white border border-gray-200 rounded-lg p-4 h-full transition-all duration-300 relative"
                  whileHover={{ 
                    y: -4,
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Subtle background accent */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-lg`}
                  />
                  
                  <div className="relative z-10 text-center">
                    {/* Clean Professional Icon */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg relative"
                    >
                      {/* Clean Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} rounded-lg`} />
                      
                      {/* Icon */}
                      <feature.icon className="w-5 h-5 text-white relative z-10" />
                    </motion.div>

                    {/* Enhanced Content */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="text-base font-bold text-gray-900 mb-3"
                      style={{
                        background: "linear-gradient(135deg, #1f2937 0%, #3b82f6 50%, #1f2937 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundSize: "200% 200%"
                      }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {feature.description}
                    </motion.p>
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