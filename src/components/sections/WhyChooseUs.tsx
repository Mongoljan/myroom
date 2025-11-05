'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { text } from '@/styles/design-system';

// Modern minimalist icons
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PriceTagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M10.5 2.5L3 10v9a2 2 0 002 2h14a2 2 0 002-2v-9l-7.5-7.5a2 2 0 00-3 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 21v-7a2 2 0 012-2h6a2 2 0 012 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function WhyChooseUs() {
  const { t } = useHydratedTranslation();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  const features = [
    {
      icon: CheckCircleIcon,
      title: t('features.instantConfirmation', 'Шууд баталгаажилт'),
      description: t('features.instantConfirmationDesc', 'Захиалга бүр шууд баталгаажна. Санаа амар, эрсдэлгүй аялаарай.'),
      gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-500/10',
      iconColor: 'text-blue-600',
      delay: 0
    },
    {
      icon: PriceTagIcon,
      title: t('features.fastService', 'Өрсөлдөхүйц үнэ'),
      description: t('features.fastServiceDesc', 'Нэмэлт төлбөргүй, хамгийн хөнгөлөлттэй үнэ.'),
      gradient: 'from-violet-500/10 via-purple-500/10 to-violet-500/10',
      iconColor: 'text-violet-600',
      delay: 0.1
    },
    {
      icon: ServiceIcon,
      title: t('features.wideSelection', 'Мэргэжлийн үйлчилгээ'),
      description: t('features.wideSelectionDesc', 'Хурдан, найдвартай үйлчилгээ. Монголын томоохон буудлуудаас сонгоорой.'),
      gradient: 'from-pink-500/10 via-rose-500/10 to-pink-500/10',
      iconColor: 'text-pink-600',
      delay: 0.2
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-6 overflow-hidden"
    > 
      {/* Background gradient blur effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h2 className={`${text.h2} text-gray-900 mb-1`}>
            {t('features.title', 'Таны аялалыг тав тухтай болгох')}
          </h2>
          <p className={`${text.caption} text-gray-600`}>{t('features.whyChooseUs', 'Яагаад бид вэ?')}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: feature.delay,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/50">

                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                {/* Icon container */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative inline-flex mb-3"
                >
                  <div className={`w-10 h-10 ${feature.iconColor} transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon />
                  </div>

                  {/* Animated ring on hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${feature.iconColor} opacity-0 group-hover:opacity-20`}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Content */}
                <h3 className={`${text.h4} text-gray-900 mb-2 transition-colors`}>
                  {feature.title}
                </h3>

                <p className={`${text.bodySm} text-gray-600 leading-relaxed`}>
                  {feature.description}
                </p>

                {/* Decorative element */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}