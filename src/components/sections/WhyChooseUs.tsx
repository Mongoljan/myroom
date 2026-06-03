'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { MdAccessTimeFilled } from 'react-icons/md';
import { RiDiscountPercentFill, RiShieldCheckFill } from 'react-icons/ri';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { text } from '@/styles/design-system';

const features = [
  {
    Icon: MdAccessTimeFilled,
    titleKey: 'features.wideSelection',
    descKey: 'features.wideSelectionDesc',
    delay: 0,
  },
  {
    Icon: RiShieldCheckFill,
    titleKey: 'features.instantConfirmation',
    descKey: 'features.instantConfirmationDesc',
    delay: 0.08,
  },
  {
    Icon: RiDiscountPercentFill,
    titleKey: 'features.fastService',
    descKey: 'features.fastServiceDesc',
    delay: 0.16,
  },
];

export default function WhyChooseUs() {
  const { t } = useHydratedTranslation();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  return (
    <section ref={containerRef} className="relative py-10 overflow-hidden">
      <motion.div
        style={{ opacity, y }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2`}>
            {t('features.title')}
          </h2>
        </motion.div>

        {/* Moving border wrapper — conic gradient spins behind 1px gap */}
        <div className="relative p-px rounded-2xl overflow-hidden bg-gray-200/50 dark:bg-gray-700/50">
          {/* Spinning beam — clipped to 1px border by parent overflow-hidden */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, #7dd3fc 15%, #0ea5e9 30%, transparent 40%)',
            }}
            className="absolute w-[200%] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          {/* Inner card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="relative z-10 rounded-2xl bg-white dark:bg-gray-800 grid grid-cols-1 md:grid-cols-3 overflow-hidden py-6"
          >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: feature.delay }}
              className="flex items-start gap-4 px-6 py-4"
            >
              {/* Icon — concentric circles: primary-50 → primary-200 → icon in primary-500 */}
              <div className="shrink-0 flex items-center justify-center w-18 h-18 rounded-full bg-primary-50 dark:bg-primary-950/30">
                <div className="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-primary-200 dark:bg-primary-800/50">
                  <feature.Icon className="w-7 h-7 text-primary-500" />
                </div>
              </div>

              {/* Text — title + description stacked */}
              <div className="min-w-0">
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  {t(feature.titleKey)}
                </h3>
                <p className={`${text.bodySm} text-gray-500 dark:text-gray-400 mt-1 leading-relaxed`}>
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
